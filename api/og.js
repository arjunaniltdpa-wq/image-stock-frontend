export default async function handler(req) {
  try {
    const pageUrl =
      new URL(req.url).searchParams.get("url") || "https://pixeora.com";

    const pathname = new URL(pageUrl).pathname;

    const apiRes = await fetch(
      `https://api.pixeora.com/api/images/slug${pathname}`
    );

    if (!apiRes.ok) throw new Error("API failed");

    const data = await apiRes.json();
    const img = data.image || data;

    const title =
      (img.title && img.title.trim()) ||
      "Free HD Image – Pixeora";

    const description =
      img.description ||
      "Download free HD wallpapers and royalty-free stock images.";

    const imageUrl = img.fileName
      ? `https://cdn.pixeora.com/${encodeURIComponent(img.fileName)}`
      : "https://cdn.pixeora.com/preview.jpg";

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>

<meta name="robots" content="index, follow">

<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="Pixeora">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">

<link rel="canonical" href="${pageUrl}">
</head>
<body></body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=600",
      },
    });
  } catch (err) {
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
<title>Pixeora – Free HD Images</title>
<meta property="og:title" content="Pixeora – Free HD Images">
<meta property="og:description" content="Download free HD wallpapers and royalty-free stock images.">
<meta property="og:image" content="https://cdn.pixeora.com/preview.jpg">
<meta property="og:url" content="https://pixeora.com">
</head>
<body></body>
</html>`,
      { headers: { "content-type": "text/html" } }
    );
  }
}
