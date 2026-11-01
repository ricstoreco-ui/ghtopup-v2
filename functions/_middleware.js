// Menyisipkan /ext*.js ke setiap halaman HTML, jadi index.html tidak perlu diubah.
// Skrip kecil pertama menonaktifkan intro lama di ext4.js (intro baru ada di ext5.js).
export async function onRequest({ next }) {
  const res = await next();
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
  return new HTMLRewriter()
    .on('body', { element(e) { e.append('<script>try{sessionStorage.setItem("gh_i4","1")}catch(e){}</script><script src="/ext.js?v=1" defer></script><script src="/ext2.js?v=1" defer></script><script src="/ext3.js?v=1" defer></script><script src="/ext4.js?v=1" defer></script><script src="/ext5.js?v=1" defer></script>', { html: true }); } })
    .transform(res);
}
