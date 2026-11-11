// Resolve metadata against the current domain so it follows future domain changes.
for (const link of document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')) {
  link.href = new URL(link.getAttribute('href'), window.location.origin).href;
}
const shareImage = document.querySelector('meta[property="og:image"]');
if (shareImage) {
  shareImage.content = new URL(shareImage.getAttribute('content'), window.location.origin).href;
}

const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.toggleAttribute('data-open', open);
}

menu.addEventListener('click', () => setMenu(!nav.hasAttribute('data-open')));
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.hasAttribute('data-open')) {
    setMenu(false);
    menu.focus();
  }
});

const dialog = document.querySelector('.lightbox');
const gallery = [...document.querySelectorAll('[data-gallery-item]')];
const picture = dialog.querySelector('img');
const caption = dialog.querySelector('figcaption');
let active = 0;

function showPhoto(index) {
  active = (index + gallery.length) % gallery.length;
  const source = gallery[active].querySelector('img');
  picture.src = source.src;
  picture.alt = source.alt;
  caption.textContent = source.alt + ' · ' + (active + 1) + ' / ' + gallery.length;
}

gallery.forEach((item, index) => {
  item.addEventListener('click', () => {
    showPhoto(index);
    dialog.showModal();
  });
});
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(active - 1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(active + 1));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPhoto(active - 1);
  if (event.key === 'ArrowRight') showPhoto(active + 1);
});
