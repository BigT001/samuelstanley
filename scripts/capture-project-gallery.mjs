import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "project-captures.json");
const MANIFEST_PATH = path.join(ROOT, "app", "project-gallery.generated.json");
const OUTPUT_ROOT = path.join(ROOT, "public", "project-gallery");
const VIEWPORT = { width: 1440, height: 1000 };

const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));

function safeSegment(value) {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Unsafe gallery identifier: ${value}`);
  }
  return value;
}

async function discoverVisibleProjects() {
  if (!config.portfolioApi) return [];

  try {
    const response = await fetch(config.portfolioApi);
    if (!response.ok) return [];
    const payload = await response.json();
    return (payload.projects || [])
      .filter((project) => project.repoName && project.homepage)
      .map((project) => ({
        slug: project.repoName,
        baseUrl: project.homepage,
        routes: [{ id: "home", label: "Product homepage", path: "/" }],
      }));
  } catch {
    return [];
  }
}

function mergeProjects(discovered) {
  const configured = new Map(config.projects.map((project) => [project.slug, project]));
  for (const project of discovered) {
    if (!configured.has(project.slug)) configured.set(project.slug, project);
  }
  return [...configured.values()];
}

async function signIn(page, project) {
  const auth = project.auth;
  if (!auth) return false;

  const email = process.env[auth.emailEnv];
  const password = process.env[auth.passwordEnv];
  if (!email || !password) return false;

  await page.goto(new URL(auth.loginPath, project.baseUrl).toString(), { waitUntil: "networkidle" });
  await page.locator(auth.emailSelector).fill(email);
  await page.locator(auth.passwordSelector).fill(password);
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.locator(auth.submitSelector).click(),
  ]);
  return true;
}

async function captureRoute(page, project, route) {
  const slug = safeSegment(project.slug);
  const id = safeSegment(route.id);
  const destination = path.join(OUTPUT_ROOT, slug);
  const filename = `${id}.jpg`;
  const filePath = path.join(destination, filename);
  const target = new URL(route.path, project.baseUrl).toString();

  await mkdir(destination, { recursive: true });
  await page.goto(target, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.querySelectorAll("[data-rht-toaster], [role='dialog']").forEach((element) => {
      if (element.textContent?.toLowerCase().includes("cookie")) element.remove();
    });
  });
  await page.screenshot({ path: filePath, type: "jpeg", quality: 86, animations: "disabled" });

  const previous = manifest[slug] || [];
  const item = {
    id,
    label: route.label,
    description: route.description || `A captured view from ${project.slug}.`,
    src: `/project-gallery/${slug}/${filename}`,
    width: VIEWPORT.width,
    height: VIEWPORT.height,
    capturedAt: new Date().toISOString(),
  };
  manifest[slug] = [...previous.filter((entry) => entry.id !== id), item];
  process.stdout.write(`Captured ${slug}/${id} from ${target}\n`);
}

const browser = await chromium.launch({ headless: true });

try {
  const projects = mergeProjects(await discoverVisibleProjects());
  for (const project of projects) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      colorScheme: "dark",
    });
    const page = await context.newPage();

    for (const route of project.routes || []) {
      try {
        await captureRoute(page, project, route);
      } catch (error) {
        console.error(`Capture failed for ${project.slug}/${route.id}:`, error.message);
      }
    }

    const signedIn = await signIn(page, project);
    if (signedIn) {
      for (const route of project.authenticatedRoutes || []) {
        try {
          await captureRoute(page, project, route);
        } catch (error) {
          console.error(`Authenticated capture failed for ${project.slug}/${route.id}:`, error.message);
        }
      }
    } else if (project.authenticatedRoutes?.length) {
      process.stdout.write(`Skipped protected routes for ${project.slug}; demo credentials are not configured.\n`);
    }

    await context.close();
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
} finally {
  await browser.close();
}
