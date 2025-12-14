export default async function middleware(req) {
  const ua = req.headers.get("user-agent") || "";

  const isBot =
    ua.includes("facebookexternalhit") ||
    ua.includes("Facebot") ||
    ua.includes("Twitterbot") ||
    ua.includes("Pinterest") ||
    ua.includes("Slackbot") ||
    ua.includes("LinkedInBot") ||
    ua.includes("WhatsApp") ||
    ua.includes("TelegramBot");

  const url = new URL(req.url);

  // ✅ ONLY handle /photo/ pages
  if (!url.pathname.startsWith("/photo/")) {
    return fetch(req);
  }

  // ✅ REAL USERS → LOAD NORMAL SITE
  if (!isBot) {
    return fetch(req);
  }

  // ✅ BOT REQUEST → SERVE OG HTML
  const slug = url.pathname.split("/photo/")[1] || "image";

  const ogImage = `https://cdn.pixeora.com/${slug}.jpg`;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pixeora – Free HD Image</title>

  <meta property="og:type" content="article">
  <meta property="og:title" content="Free HD Image – Pixeora">
  <meta property="og:description" content="Download high-quality free HD images from Pixeora.">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${url.href}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${ogImage}">
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html",
      "cache-control": "public, max-age=600"
    }
  });
}
