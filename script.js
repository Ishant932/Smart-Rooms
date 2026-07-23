const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const message = document.getElementById('form-message');

  message.textContent = 'Thanks! We\'ll be in touch soon.';
  message.hidden = false;
  form.reset();

  setTimeout(() => {
    message.hidden = true;
  }, 4000);
}
