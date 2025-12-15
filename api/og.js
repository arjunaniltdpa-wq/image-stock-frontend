export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageUrl = searchParams.get("url");

    if (!pageUrl) throw new Error("No page URL");

    const pathname = new URL(pageUrl).pathname;

    if (!pathname.startsWith("/photo/")) {
      throw new Error("Invalid path");
    }

    const slug = pathname.replace("/photo/", "");

    const apiRes = await fetch(
      `https://api.pixeora.com/api/images/slug/${slug}`,
      { cache: "no-store" }
    );

    if (!apiRes.ok) throw new Error("Image API failed");

    const data = await apiRes.json();
    const img = data.image || data;

    if (!img || !img.fileName) throw new Error("Invalid image");

    const title = img.title || img.slug || "Free HD Image";
    const description =
      img.description ||
      "Download free HD wallpapers, 4K backgrounds and royalty-free stock images.";

    const imageUrl = `https://cdn.pixeora.com/${encodeURIComponent(img.fileName)}`;

    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">

<title>${escapeHtml(title)}</title>

<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:secure_url" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="Pixeora">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${imageUrl}">

<link rel="canonical" href="${pageUrl}">
</head>
<body></body>
</html>`, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300"
      }
    });

  } catch (e) {
    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta property="og:type" content="website">
<meta property="og:title" content="Pixeora – Free HD Images">
<meta property="og:description" content="Download free HD wallpapers and royalty-free stock images.">
<meta property="og:image" content="https://cdn.pixeora.com/preview.jpg">
<meta property="og:url" content="https://pixeora.com">
</head>
<body></body>
</html>`, {
      status: 200,
      headers: { "content-type": "text/html; charset=UTF-8" }
    });
  }
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
