(function() {
  // ─── Resolve SDK Configuration ─────────────────────────────────────────────
  const currentScript = document.currentScript;
  if (!currentScript) return;

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

  // ─── Log Reporter Utility ──────────────────────────────────────────────────
  function reportLog(level, message, stack, extraMeta = {}) {
    const payload = {
      level: level,
      message: message,
      stack: stack || null,
      metadata: {
        url: window.location.href,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct',
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
      // Fail silently to avoid polluting console on connection loss
    });
  }

  // ─── Track Page Views & SPA Navigation ────────────────────────────────────
  function trackPageView(isSPA = false) {
    const label = isSPA ? 'Page View (SPA): ' : 'Page View: ';
    reportLog('info', label + window.location.pathname, null, {
      type: 'pageview',
      spa: isSPA
    });
  }

  // Initial page view load
  if (document.readyState === 'complete') {
    trackPageView(false);
  } else {
    window.addEventListener('load', function() {
      trackPageView(false);
    });
  }

  // SPA navigation hook via History API monkey-patching
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
    // Fail silently if History API is not writable
  }

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
        const text = target.innerText ? target.innerText.trim().substring(0, 50) : '';
        const id = target.id ? '#' + target.id : '';
        const className = target.className && typeof target.className === 'string'
          ? '.' + target.className.split(' ')[0] 
          : '';
        
        reportLog('info', `Clicked ${tagName.toUpperCase()}${id}${className} "${text}"`, null, {
          type: 'interaction',
          element: tagName,
          elementId: target.id || null,
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

    reportLog('error', 'UnhandledPromiseRejection: ' + message, stack);
  });

  // ─── Intercept Developer Console Warnings & Errors ────────────────────────
  try {
    const originalWarn = console.warn;
    console.warn = function(...args) {
      originalWarn.apply(console, args);
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
      if (msg.includes('PROmonitor')) return;
      reportLog('warn', 'Console Warning: ' + msg);
    };

    const originalError = console.error;
    console.error = function(...args) {
      originalError.apply(console, args);
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
      if (msg.includes('PROmonitor')) return;
      reportLog('error', 'Console Error: ' + msg);
    };
  } catch (e) {}

  // Expose manual trigger API
  window.PROmonitorLogger = {
    info: function(msg, meta) { reportLog('info', msg, null, meta); },
    warn: function(msg, meta) { reportLog('warn', msg, null, meta); },
    error: function(msg, err, meta) { reportLog('error', msg, err ? err.stack : null, meta); },
    fatal: function(msg, err, meta) { reportLog('fatal', msg, err ? err.stack : null, meta); }
  };

  console.log('🛡️ PROmonitor Client Monitor SDK Initialized.');
})();
