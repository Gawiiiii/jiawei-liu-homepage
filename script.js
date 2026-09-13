const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('ljw-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('ljw-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

document.querySelectorAll('.expand-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.research-card');
    const open = card.classList.toggle('open');
    button.setAttribute('aria-expanded', open);
    button.innerHTML = `${open ? '收起研究摘要' : '展开研究摘要'} <span>${open ? '－' : '＋'}</span>`;
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.research-card, .timeline-item, .skill-group').forEach((item) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(14px)';
  item.style.transition = 'opacity .6s ease, transform .6s ease';
  revealObserver.observe(item);
});
document.addEventListener('scroll', () => {
  document.querySelectorAll('.visible').forEach((item) => {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  });
}, { passive: true });
