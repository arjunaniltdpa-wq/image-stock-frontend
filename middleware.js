export const config = {
  matcher: ["/photo/:path*"],
};

export default async function middleware(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Only handle photo pages
  if (!path.startsWith("/photo/")) {
    return fetch(req);
  }

  // Extract Mongo ID from slug
  const match = path.match(/([a-f0-9]{24})$/i);
  if (!match) {
    return fetch(req);
  }

  const imageId = match[1];

  try {
    // Fetch image data from API
    const apiRes = await fetch(
      `https://api.pixeora.com/api/images/slug/${imageId}`,
      { headers: { "User-Agent": "facebookexternalhit/1.1" } }
    );

    if (!apiRes.ok) {
      return fetch(req);
    }

    const data = await apiRes.json();
    const img = data.image || data.data || data;

    if (!img || !img.fileName) {
      return fetch(req);
    }

    const title = img.title || "Free HD Image | Pixeora";
    const desc =
      img.description ||
      "Download free HD wallpapers & royalty-free stock images.";
    const imageUrl = `https://cdn.pixeora.com/${encodeURIComponent(
      img.fileName
    )}`;

    // Return OG HTML for bots
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>

<meta property="og:type" content="article">
<meta property="og:site_name" content="Pixeora">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:url" content="${url.href}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${imageUrl}">

<meta http-equiv="refresh" content="0;url=${url.href}">
</head>
<body></body>
</html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=600",
        },
      }
    );
  } catch (err) {
    return fetch(req);
  }
}
