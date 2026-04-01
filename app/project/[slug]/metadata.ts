import type { Metadata } from "next";
import { projects } from "../../components/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Samuel Stanley",
    };
  }

  const title = `${project.title} Case Study | Samuel Stanley — Full Stack Developer`;
  const description = `${project.desc} A case study by Samuel Stanley, Full Stack Developer based in Lagos, Nigeria.`;

  return {
    metadataBase: new URL("https://samuelstanley.com"),
    title,
    description,
    alternates: {
      canonical: `/project/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_NG",
      url: `https://samuelstanley.com/project/${slug}`,
      siteName: "Samuel Stanley Portfolio",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${project.title} — Case Study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@samuelstanley",
    },
    keywords: [
      project.title,
      "Samuel Stanley",
      "Full Stack Developer Lagos",
      "Case Study",
      project.tag,
      ...project.tech,
      "Nigeria Developer",
      "Software Engineer",
    ],
  };
}
