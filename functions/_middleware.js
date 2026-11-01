// Menyisipkan /ext.js ke setiap halaman HTML, jadi index.html tidak perlu diubah.
export async function onRequest({ next }) {
  const res = await next();
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
  return new HTMLRewriter()
    .on('body', { element(e) { e.append('<script src="/ext.js?v=1" defer></script><script src="/ext2.js?v=1" defer></script>', { html: true }); } })
    .transform(res);
}
