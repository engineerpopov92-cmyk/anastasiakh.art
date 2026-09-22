'use strict';
const slides = [...document.querySelectorAll('.slide')];
const tabs = [...document.querySelectorAll('[data-slide]')];
let current = 0;
let slideElapsed = 0;
let safetyPaused = false;
let keyboardNavigation = false;
document.addEventListener('keydown', event => {
  if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) keyboardNavigation = true;
});
document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, true);
function selectSlide(index, focus = false, automatic = false) {
  const nextIndex = (index + slides.length) % slides.length;
  const outgoing = slides[current];
  const outgoingHeight = outgoing.getBoundingClientRect().height;
  const shouldAnimate = nextIndex !== current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.slide-transition').forEach(element => element.remove());
  const snapshot = shouldAnimate ? outgoing.cloneNode(true) : null;
  slideElapsed = 0;
  const focusedDirection = document.activeElement?.dataset.direction;
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.hidden = i !== current;
    slide.classList.toggle('active', i === current);
  });
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === current));
    tab.tabIndex = i === current ? 0 : -1;
  });
  if (snapshot) {
    snapshot.classList.remove('active');
    snapshot.classList.add('slide-transition');
    snapshot.removeAttribute('id');
    snapshot.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    snapshot.setAttribute('aria-hidden', 'true');
    snapshot.inert = true;
    snapshot.style.height = `${outgoingHeight}px`;
    outgoing.parentElement.append(snapshot);
    snapshot.animate([{opacity:1},{opacity:0}], {duration:550,easing:'ease-in-out',fill:'forwards'}).finished.then(() => snapshot.remove());
  }
  if (focusedDirection && !automatic) slides[current].querySelector(`[data-direction="${focusedDirection}"]`).focus({preventScroll:true});
  if (!automatic) document.querySelector('#slide-status').textContent = slides[current].getAttribute('aria-label');
  if (focus) tabs[current].focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectSlide(i));
  tab.addEventListener('keydown', event => {
    const targets = {ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1};
    if (event.key in targets) { event.preventDefault(); selectSlide(targets[event.key], true); }
  });
});
document.querySelectorAll('[data-direction]').forEach(button => {
  button.addEventListener('click', () => selectSlide(current + Number(button.dataset.direction)));
});
let touchStart;
const gallery = document.querySelector('.gallery');
gallery.addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 && !event.target.closest('a, button')
    ? {x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY} : null;
}, {passive:true});
gallery.addEventListener('touchcancel', () => { touchStart = null; }, {passive:true});
gallery.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) selectSlide(current + (dx < 0 ? 1 : -1));
  touchStart = null;
}, {passive:true});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const shopToggle = document.querySelector('.shop-toggle');
const shopDropdown = document.querySelector('.shop-dropdown');
const shopLinks = document.querySelector('#shop-dropdown-links');
let shopHoverTimer;
function clearShopTimer() { clearTimeout(shopHoverTimer); }
function openShop() { clearShopTimer(); shopToggle.setAttribute('aria-expanded', 'true'); shopLinks.hidden = false; }
function closeShop() {clearShopTimer();shopToggle.setAttribute('aria-expanded', 'false'); shopLinks.hidden = true;}
function closeMenu() { closeShop(); menuButton.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
  if (!open) closeShop();
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && !shopLinks.hidden) {closeShop(); shopToggle.focus(); return;} if(event.key === 'Escape' && navigation.classList.contains('open')) {closeMenu(); menuButton.focus();} });
document.addEventListener('click', event => {if (!event.target.closest('.header')) closeMenu();});
window.matchMedia('(min-width:761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

shopToggle.addEventListener('click', () => {
  clearShopTimer();
  const open = shopToggle.getAttribute('aria-expanded') !== 'true';
  shopToggle.setAttribute('aria-expanded', String(open));
  shopLinks.hidden = !open;
});
shopToggle.addEventListener('keydown', event => {
  if(event.key === 'ArrowDown') {
    event.preventDefault();shopToggle.setAttribute('aria-expanded','true');shopLinks.hidden=false;shopLinks.querySelector('a').focus();
  }
});
document.addEventListener('click', event => {if (!shopDropdown.contains(event.target)) closeShop();});
shopDropdown.addEventListener('focusout', event => {if (!shopDropdown.contains(event.relatedTarget)) closeShop();});

// Hover intent avoids accidental opening while crossing the header.
shopDropdown.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width:761px) and (hover:hover)').matches) return;
  clearShopTimer();
  shopHoverTimer = setTimeout(openShop, 350);
});
shopDropdown.addEventListener('pointerleave', event => {
  if (event.pointerType !== 'mouse') return;
  clearShopTimer();
  if (!shopDropdown.contains(document.activeElement)) shopHoverTimer = setTimeout(closeShop, 250);
});

// A full reading interval per slide; suspend when visitors interact or leave the gallery.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let rotationPaused = reducedMotion.matches;
let galleryVisible = false;
let lastFrame = performance.now();
const slideDuration = 10000;
reducedMotion.addEventListener('change', () => { rotationPaused = reducedMotion.matches; });
new IntersectionObserver(entries => { galleryVisible = entries[0].isIntersecting; }, {threshold:0}).observe(gallery);
// A conservative mobile fallback, not a diagnosis of the device.
const mobilePlayback = window.matchMedia('(max-width:760px)');
let delayedFrames = [];
let resetFrameClock = true;
function resetPlaybackClock() { resetFrameClock = true; delayedFrames = []; }
document.addEventListener('visibilitychange', resetPlaybackClock);
window.addEventListener('pageshow', resetPlaybackClock);
mobilePlayback.addEventListener('change', resetPlaybackClock);
slides.forEach(slide => {
  const image = slide.querySelector('.scene');
  image.addEventListener('error', () => { safetyPaused = true; });
  if (image.complete && !image.naturalWidth) safetyPaused = true;
});
function updateSlideProgress(now) {
  const elapsed = resetFrameClock ? 0 : now - lastFrame;
  resetFrameClock = false;
  const delta = Math.min(elapsed, 100);
  lastFrame = now;
  if (!document.hidden && galleryVisible && !rotationPaused && !safetyPaused && mobilePlayback.matches) {
    delayedFrames = delayedFrames.filter(time => now - time < 10000);
    if (elapsed > 300) delayedFrames.push(now);
    // Three long gaps within ten seconds suggest persistent stuttering.
    if (delayedFrames.length >= 3) safetyPaused = true;
  } else {
    delayedFrames = [];
  }
  if (!rotationPaused && !safetyPaused && !document.hidden && galleryVisible && !(keyboardNavigation && gallery.contains(document.activeElement))) {
    slideElapsed += delta;
    if (slideElapsed >= slideDuration) {
      const nextImage = slides[(current + 1) % slides.length].querySelector('.scene');
      if (nextImage.complete && nextImage.naturalWidth) selectSlide(current + 1, false, true);
      else if (nextImage.complete) safetyPaused = true;
      else slideElapsed = slideDuration; // Wait for loading; never auto-show a blank image.
    }
  }
  slides[current].querySelectorAll('.slide-progress i').forEach((line, index) => {
    line.style.transform = `scaleX(${index < current ? 1 : index === current ? Math.min(slideElapsed / slideDuration, 1) : 0})`;
  });
  requestAnimationFrame(updateSlideProgress);
}
requestAnimationFrame(updateSlideProgress);

// Discourage casual image saving, without disabling text or link context menus.
document.querySelectorAll('img').forEach(image => image.draggable = false);
function isImageSurface(target) {
  return target instanceof Element && (target.matches('img, .shade') || target.closest('.wallpaper-art'));
}
document.addEventListener('contextmenu', event => {
  if (isImageSurface(event.target)) event.preventDefault();
});
document.addEventListener('dragstart', event => {
  if (isImageSurface(event.target)) event.preventDefault();
});
