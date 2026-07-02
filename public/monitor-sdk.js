(function() {
  // ─── Resolve SDK Configuration ─────────────────────────────────────────────
  let currentScript = document.currentScript;
  if (!currentScript) {
    currentScript = document.querySelector('script[src*="monitor-sdk.js"]') || 
                    document.getElementById('promonitor-telemetry-sdk') ||
                    document.getElementById('promonitor-monitor-sdk');
  }
  if (!currentScript) {
    console.error('PROmonitor: Could not resolve telemetry script element.');
    return;
  }

  const apiKey = currentScript.getAttribute('data-key');
  if (!apiKey) {
    console.error('PROmonitor: Missing data-key attribute on script tag.');
    return;
  }

  // Dynamically resolve target server from script source url
  let serverOrigin;
  try {
    const scriptUrl = new URL(currentScript.src);
    serverOrigin = scriptUrl.origin;
  } catch (e) {
    serverOrigin = window.location.origin;
  }
  const logEndpoint = `${serverOrigin}/api/monitor/log`;

  // ─── Visitor & Session Identifier Persistence ──────────────────────────────
  let visitorId = null;
  try {
    visitorId = localStorage.getItem('promonitor_visitor_id');
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('promonitor_visitor_id', visitorId);
    }
  } catch (e) {
    visitorId = 'vis_anon';
  }

  let sessionId = null;
  try {
    sessionId = sessionStorage.getItem('promonitor_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('promonitor_session_id', sessionId);
    }
  } catch (e) {
    sessionId = 'sess_anon';
  }

  // ─── Browser & OS Detection Helper ────────────────────────────────────────
  function getBrowserOS() {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // OS detection
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Mac/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/CrOS/i.test(ua)) os = 'ChromeOS';

    // Browser detection
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua) && !/OPR/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Edge|Edg/i.test(ua)) browser = 'Edge';
    else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
    else if (/MSIE|Trident/i.test(ua)) browser = 'Internet Explorer';

    return { browser: browser, os: os };
  }
  const clientInfo = getBrowserOS();

  // ─── Geo-Location Async Fetcher ───────────────────────────────────────────
  let locationData = null;
  fetch('https://ipapi.co/json/')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      locationData = {
        ip: data.ip || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country: data.country_name || 'Unknown',
        org: data.org || 'Unknown'
      };
    })
    .catch(function() {
      // Fallback: will be augmented by Vercel IP location headers on backend
    });

  // ─── Log Reporter Utility ──────────────────────────────────────────────────
  function reportLog(level, message, stack, extraMeta = {}) {
    const isError = level === 'error' || level === 'fatal';
    const payload = {
      level: level,
      message: message,
      stack: stack || null,
      metadata: {
        visitorId: visitorId,
        sessionId: sessionId,
        url: window.location.href,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        browser: clientInfo.browser,
        os: clientInfo.os,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct',
        location: locationData,
        replayEvents: isError ? (window.rrwebEvents || null) : null,
        ...extraMeta
      }
    };

    fetch(logEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Key': apiKey
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      keepalive: true // Guarantees log is sent even on page close/navigate
    }).catch(function() {
      // Fail silently
    });
  }

  // ─── Page Stay Duration (Dwell Time) & View Tracking ──────────────────────
  let pageEnterTime = Date.now();
  let currentPath = window.location.pathname;

  function trackPageExit() {
    const timeSpent = Math.round((Date.now() - pageEnterTime) / 1000); // in seconds
    if (timeSpent > 0) {
      reportLog('info', `User stayed ${timeSpent}s on ${currentPath}`, null, {
        type: 'dwell_time',
        durationSeconds: timeSpent,
        path: currentPath
      });
    }
  }

  function trackPageView(isSPA = false) {
    if (isSPA) {
      trackPageExit();
      pageEnterTime = Date.now();
      currentPath = window.location.pathname;
    }
    const label = isSPA ? 'Page View (SPA): ' : 'Page View: ';
    reportLog('info', label + window.location.pathname, null, {
      type: 'pageview',
      spa: isSPA
    });
  }

  // Initial page view load
  if (document.readyState === 'complete') {
    trackPageView(false);
    loadReplay();
  } else {
    window.addEventListener('load', function() {
      trackPageView(false);
      loadReplay();
    });
  }

  // Handle SPA transitions via History API monkey-patching
  try {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setTimeout(function() { trackPageView(true); }, 100);
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      setTimeout(function() { trackPageView(true); }, 100);
    };

    window.addEventListener('popstate', function() {
      setTimeout(function() { trackPageView(true); }, 100);
    });
  } catch (e) {
    // Fail silently
  }

  // Handle tab closures, browser navigations, or app suspensions
  window.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      trackPageExit();
    } else {
      pageEnterTime = Date.now(); // reset enter time on returning
    }
  });

  // ─── Intercept Click Actions (Breadcrumbs) ──────────────────────────────────
  window.addEventListener('click', function(event) {
    let target = event.target;
    if (!target) return;

    // Traverse upwards to inspect elements clicked
    while (target && target !== document.body) {
      const tagName = target.tagName ? target.tagName.toLowerCase() : '';
      const isClickable = 
        tagName === 'button' || 
        tagName === 'a' || 
        target.getAttribute('role') === 'button' || 
        target.onclick;

      if (isClickable) {
        const text = target.innerText ? target.innerText.trim().substring(0, 80) : '';
        const id = target.id ? '#' + target.id : '';
        const className = target.className && typeof target.className === 'string'
          ? '.' + target.className.split(' ')[0] 
          : '';
        const nameAttr = target.getAttribute('name') || null;
        const hrefAttr = target.getAttribute('href') || null;
        
        reportLog('info', `Clicked ${tagName.toUpperCase()}${id}${className} "${text}"`, null, {
          type: 'interaction',
          element: tagName,
          elementId: target.id || null,
          elementName: nameAttr,
          elementHref: hrefAttr,
          textContent: text || null
        });
        break;
      }
      target = target.parentNode;
    }
  }, { passive: true });

  // ─── Catch Uncaught Errors ─────────────────────────────────────────────────
  window.addEventListener('error', function(event) {
    if (event.message === 'Script error.' && !event.filename) return;

    const message = event.message || 'Uncaught Error';
    const filename = event.filename ? ` in ${event.filename}:${event.lineno}:${event.colno}` : '';
    const stack = event.error ? event.error.stack : null;

    reportLog('error', message + filename, stack, {
      type: 'error',
      line: event.lineno,
      column: event.colno,
      file: event.filename
    });
  });

  // ─── Catch Unhandled Promise Rejections ──────────────────────────────────
  window.addEventListener('unhandledrejection', function(event) {
    let message = 'Unhandled Promise Rejection';
    let stack = null;

    if (event.reason) {
      if (event.reason instanceof Error) {
        message = event.reason.message || message;
        stack = event.reason.stack;
      } else if (typeof event.reason === 'string') {
        message = event.reason;
      } else {
        try {
          message = JSON.stringify(event.reason);
        } catch (e) {}
      }
    }

    reportLog('error', 'UnhandledPromiseRejection: ' + message, stack, {
      type: 'unhandled_rejection'
    });
  });

  // ─── Intercept Developer Console Warnings & Errors ────────────────────────
  try {
    const originalWarn = console.warn;
    console.warn = function(...args) {
      originalWarn.apply(console, args);
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
      if (msg.includes('PROmonitor')) return;
      reportLog('warn', 'Console Warning: ' + msg, null, { type: 'console_warn' });
    };

    const originalError = console.error;
    console.error = function(...args) {
      originalError.apply(console, args);
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
      if (msg.includes('PROmonitor')) return;
      reportLog('error', 'Console Error: ' + msg, null, { type: 'console_error' });
    };
  } catch (e) {}

  // Expose manual trigger API
  window.PROmonitorLogger = {
    info: function(msg, meta) { reportLog('info', msg, null, meta); },
    warn: function(msg, meta) { reportLog('warn', msg, null, meta); },
    error: function(msg, err, meta) { reportLog('error', msg, err ? err.stack : null, meta); },
    fatal: function(msg, err, meta) { reportLog('fatal', msg, err ? err.stack : null, meta); }
  };

  // ─── rrweb Dynamic Replay Recorder Loader ────────────────────────────────
  function loadReplay() {
    if (window.rrweb) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js';
    script.async = true;
    script.onload = function() {
      if (typeof rrweb !== 'undefined') {
        window.rrwebEvents = [];
        rrweb.record({
          emit(event) {
            window.rrwebEvents.push(event);
            if (window.rrwebEvents.length > 50) {
              window.rrwebEvents.shift();
            }
          }
        });
      }
    };
    document.head.appendChild(script);
  }

  // ─── Core Web Vitals Observability ─────────────────────────────────────────
  try {
    // 1. Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver(function(entryList) {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportMetric('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. First Input Delay (FID)
    const fidObserver = new PerformanceObserver(function(entryList) {
      const entries = entryList.getEntries();
      const firstEntry = entries[0];
      const delay = firstEntry.processingStart - firstEntry.startTime;
      reportMetric('FID', delay);
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // 3. Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver(function(entryList) {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      reportMetric('CLS', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Browser doesn't support PerformanceObserver or specific metrics
  }

  function reportMetric(name, value) {
    reportLog('info', 'Performance Metric — ' + name + ': ' + value.toFixed(3), null, {
      type: 'vitals',
      metricName: name,
      metricValue: value
    });
  }

  console.log('🛡️ PROmonitor Client Monitor SDK Initialized.');
})();
