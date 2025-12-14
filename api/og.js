export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const url = new URL(req.url);

  // Expect ?url=/photo/slug-id
  const target = url.searchParams.get("url");
  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  const slug = target.split("/").pop();

  // Fetch image metadata from your API
  const apiRes = await fetch(
    `https://api.pixeora.com/api/images/slug/${slug}`
  );

  if (!apiRes.ok) {
    return new Response("Not found", { status: 404 });
  }

  const data = await apiRes.json();
  const img = data.image || data;

  const imageUrl = `https://cdn.pixeora.com/${img.fileName}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${img.title}</title>

  <meta property="og:type" content="article">
  <meta property="og:title" content="${img.title}">
  <meta property="og:description" content="${img.description || ""}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1800">
  <meta property="og:url" content="https://pixeora.com${target}">
  <meta property="og:site_name" content="Pixeora">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${imageUrl}">

  <link rel="image_src" href="${imageUrl}">
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
}
