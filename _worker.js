export default {
  async fetch(request, env, ctx) {
    // Try to serve the static asset first
    let response = await env.ASSETS.fetch(request);

    // If not found (404), rewrite to SPA index.html
    if (response && response.status === 404) {
      const url = new URL(request.url);
      const indexUrl = new URL("/index.html", url.origin);
      response = await env.ASSETS.fetch(new Request(indexUrl, request));
    }

    // Security headers
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Frame-Options", "DENY");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
