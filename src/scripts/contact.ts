// WhatsApp chooser + sticky contact bar. Without JS every WhatsApp button
// still works: it is a plain wa.me link to Michael.

const dialog = document.getElementById('wa-chooser') as HTMLDialogElement | null;

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;
  const trigger = target?.closest('[data-wa-chooser]');
  if (trigger && dialog && typeof dialog.showModal === 'function') {
    event.preventDefault();
    dialog.showModal();
    return;
  }
  if (dialog?.open && target?.closest('[data-close]')) {
    // Let links open first, then close.
    setTimeout(() => dialog.close(), 0);
  }
});

// Close when clicking the backdrop.
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

// Show the sticky bar / floating button once the hero has scrolled away.
const hero = document.querySelector('[data-hero]');
const floating = document.querySelectorAll<HTMLElement>('[data-sticky], [data-fab]');
const setVisible = (visible: boolean) => floating.forEach((el) => el.classList.toggle('is-visible', visible));

if (!hero) {
  setVisible(true);
} else if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
} else {
  setVisible(true);
}
