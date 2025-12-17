export const config = {
  matcher: ["/photo/:path*"],
};

export default async function middleware(req) {
  try {
    const ua = req.headers.get("user-agent") || "";
    const isBot =
      /facebookexternalhit|facebookcatalog|Facebot|MetaInspector|Twitterbot|Pinterestbot|Pinterest|Slackbot|WhatsApp|LinkedInBot|TelegramBot/i.test(
        ua
      );

    const url = new URL(req.url);
    const slug = url.pathname.replace("/photo/", "").trim();

    // ===== BOTS → OG HTML =====
    if (isBot && slug) {
      const ogRes = await fetch(
        `https://api.pixeora.com/api/og-meta?slug=${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );

      if (ogRes.ok) {
        const og = await ogRes.json();

        const title = escapeHtml(og.title);
        const desc = escapeHtml(og.description);
        const image = og.image;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<link rel="canonical" href="${og.url}" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Pixeora" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${og.url}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />

<meta http-equiv="refresh" content="0; url=${og.url}" />
</head>
<body></body>
</html>`;

        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }
    }

    // ===== HUMANS → SPA ENTRY FILE =====
    const spaUrl = new URL(req.url);
    spaUrl.pathname = "/download.html";

    const spaReq = new Request(spaUrl.toString(), {
      method: req.method,
      headers: req.headers,
      redirect: "manual",
    });

    return fetch(spaReq);
  } catch (err) {
    // Fallback: never break site
    return fetch(req);
  }
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
