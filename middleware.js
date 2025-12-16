export const config = {
  matcher: ["/photo/:path*"],
};

export default async function middleware(req) {
  const ua = req.headers.get("user-agent") || "";

  const isBot =
    /facebookexternalhit|Twitterbot|Pinterest|Slackbot|WhatsApp|LinkedInBot|TelegramBot/i.test(
      ua
    );

  if (!isBot) {
    return fetch(req.url);
  }

  const url = new URL(req.url);
  const slug = url.pathname.replace("/photo/", "");

  if (!slug) return fetch(req.url);

  try {
    const metaRes = await fetch(
      `https://api.pixeora.com/api/og-meta?slug=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!metaRes.ok) return fetch(req.url);

    const og = await metaRes.json();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escape(og.title)}</title>
<link rel="canonical" href="${og.url}" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="Pixeora" />
<meta property="og:title" content="${escape(og.title)}" />
<meta property="og:description" content="${escape(og.description)}" />
<meta property="og:url" content="${og.url}" />
<meta property="og:image" content="${og.image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(og.title)}" />
<meta name="twitter:description" content="${escape(og.description)}" />
<meta name="twitter:image" content="${og.image}" />
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return fetch(req.url);
  }
}

function escape(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
