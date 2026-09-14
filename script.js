document.documentElement.classList.add('js');
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const toast = document.querySelector('.toast');

const setTheme = (theme) => {
  const dark = theme === 'dark';
  body.classList.toggle('dark', dark);
  themeToggle?.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#182127' : '#f4f4ef');
  localStorage.setItem('ljw-theme', dark ? 'dark' : 'light');
};

const savedTheme = localStorage.getItem('ljw-theme');
setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeToggle?.addEventListener('click', () => setTheme(body.classList.contains('dark') ? 'light' : 'dark'));

const closeMobileNav = () => {
  if (!mobileNav || !menuToggle) return;
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
};
menuToggle?.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));

const detailButtons = document.querySelectorAll('.detail-toggle, .protocol-toggle');
detailButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.work-card');
    const detailId = button.getAttribute('aria-controls');
    const panel = detailId ? document.getElementById(detailId) : card?.querySelector('.detail-panel');
    if (!card || !panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    card.classList.toggle('is-open', open);
    card.querySelectorAll('.detail-toggle, .protocol-toggle').forEach((control) => control.setAttribute('aria-expanded', String(open)));
    const detail = card.querySelector('.detail-toggle');
    if (detail) detail.innerHTML = `${open ? (card.classList.contains('competition-card') ? '收起项目细节' : '收起研究细节') : (card.classList.contains('competition-card') ? '展开项目细节' : '展开研究细节')} <span>${open ? '－' : '＋'}</span>`;
    const protocol = card.querySelector('.protocol-toggle');
    if (protocol) {
      const protocolLabel = card.classList.contains('competition-card') ? (panel.id === 'kdd-detail' ? '待补充字段' : 'benchmark') : 'protocol';
      protocol.innerHTML = `${open ? '收起' : '查看'} ${protocolLabel} <span>${open ? '⌃' : '⌄'}</span>`;
    }
  });
});

const filterButtons = document.querySelectorAll('.filter-button');
const researchCards = document.querySelectorAll('#research-list .work-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    researchCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.status !== filter));
  });
});

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2200);
};
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast(`已复制：${value}`);
    } catch {
      showToast('复制失败，请手动选择邮箱');
    }
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const openLightbox = (button) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = button.dataset.lightbox;
  lightboxImage.alt = button.querySelector('img')?.alt || '论文图片';
  lightboxCaption.textContent = button.dataset.caption || '';
  lightbox.hidden = false;
  body.classList.add('no-scroll');
  lightbox.querySelector('.lightbox-close')?.focus();
};
const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  body.classList.remove('no-scroll');
  if (lightboxImage) lightboxImage.src = '';
};
document.querySelectorAll('[data-lightbox]').forEach((button) => button.addEventListener('click', () => openLightbox(button)));
lightbox?.querySelectorAll('[data-close-lightbox]').forEach((element) => element.addEventListener('click', closeLightbox));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });

const progress = document.querySelector('.page-progress span');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealItems = document.querySelectorAll('.work-card, .timeline-item, .skill-group');
revealItems.forEach((item) => item.classList.add('reveal-item'));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add('visible'));
