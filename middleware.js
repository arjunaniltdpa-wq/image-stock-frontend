export const config = {
  matcher: ["/photo/:path*"],
};

export function middleware(req) {
  const ua = req.headers.get("user-agent") || "";

  const isBot = /facebookexternalhit|Facebot|Pinterest|Twitterbot|WhatsApp|LinkedInBot|Slackbot/i.test(ua);

  if (!isBot) return;

  const ogUrl = new URL("/api/og", req.url);
  ogUrl.searchParams.set("url", req.url);

  return Response.rewrite(ogUrl);
}
