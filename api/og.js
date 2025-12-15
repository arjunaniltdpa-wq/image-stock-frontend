export default async function handler(req) {
  try {
    const pageUrl = new URL(req.url).searchParams.get("url");
    if (!pageUrl) throw new Error("Missing url");

    const pathname = new URL(pageUrl).pathname;

    if (!pathname.startsWith("/photo/")) {
      throw new Error("Invalid path");
    }

    const slug = pathname.replace("/photo/", "").trim();

    const apiRes = await fetch(
      `https://api.pixeora.com/api/images/slug/${slug}`,
      { cache: "no-store" }
    );

    if (!apiRes.ok) throw new Error("API failed");

    const data = await apiRes.json();
    const img = data.image || data;

    if (!img || !img.fileName) throw new Error("Invalid image");

    const title = img.title || "Pixeora Photo";
    const desc =
      img.description ||
      "Download high-quality HD wallpapers, 4K backgrounds and royalty-free stock images.";

    const imageUrl = `https://cdn.pixeora.com/${encodeURIComponent(img.fileName)}`;

    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>${escape(title)}</title>

<meta property="og:type" content="article">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(desc)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:secure_url" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Pixeora">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(desc)}">
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
<meta property="og:image" content="https://cdn.pixeora.com/preview.jpg">
<meta property="og:title" content="Pixeora – Free HD Images">
<meta property="og:description" content="Download free HD wallpapers and royalty-free stock images.">
<meta property="og:url" content="https://pixeora.com">
</head>
<body></body>
</html>`, {
      status: 200,
      headers: { "content-type": "text/html; charset=UTF-8" }
    });
  }
}

function escape(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
