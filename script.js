const hamburger = document.querySelector('#hamburger');
const navList = document.querySelector('.nav-list');
const image = document.querySelector('#portrait');
const loadingImage = document.querySelector('#loadingImage');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('open');
});

image.addEventListener('load', () => {
  loadingImage.style.display = 'none';
});

navList.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'a') {
    navList.classList.toggle('open');
  }
});

