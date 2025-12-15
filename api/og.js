export default async function handler(req) {
  try {
    const pageUrl = new URL(req.url).searchParams.get("url");
    if (!pageUrl) throw new Error("No URL");

    const slug = new URL(pageUrl).pathname.replace("/photo/", "");

    const apiRes = await fetch(`https://api.pixeora.com/api/images/slug/${slug}`);
    const data = await apiRes.json();
    const img = data.image || data;

    const imageUrl = `https://cdn.pixeora.com/${encodeURIComponent(img.fileName)}`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>${img.title}</title>

<meta property="og:type" content="article">
<meta property="og:title" content="${img.title}">
<meta property="og:description" content="${img.description || ""}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="Pixeora">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${img.title}">
<meta name="twitter:image" content="${imageUrl}">

<link rel="canonical" href="${pageUrl}">
</head>
<body></body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=UTF-8" },
    });

  } catch (e) {
    // HARD fallback — NEVER 404
    return new Response(`<!DOCTYPE html>
<html>
<head>
<meta property="og:title" content="Pixeora Free HD Images">
<meta property="og:image" content="https://cdn.pixeora.com/preview.jpg">
<meta property="og:url" content="https://pixeora.com">
</head>
<body></body>
</html>`, {
      status: 200,
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  }
}
