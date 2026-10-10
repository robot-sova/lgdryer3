/**
 * Domain move, 2026-10: lgdryer.repair → washeranddryer.repair (one site for washers and dryers of
 * every brand; LG stays as a section). Both domains are attached to this Pages project.
 *
 * Every request on the old host — and on www of either — gets a 301 to the SAME path and query
 * on the new host. Paths were kept identical on purpose: a 1:1 move is what Google's
 * "Change of address" tool expects, and it carries each page's history over to its twin.
 * *.pages.dev previews are not redirected.
 */
const NEW_HOST = 'washeranddryer.repair';
const OLD_HOSTS = new Set(['lgdryer.repair', 'www.lgdryer.repair', 'www.washeranddryer.repair']);

export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);
  if (OLD_HOSTS.has(url.hostname)) {
    url.hostname = NEW_HOST;
    url.protocol = 'https:';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  return next();
};
