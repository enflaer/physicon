// vendors
import 'babel-polyfill';
import $ from 'jquery';
import JQuery from 'jquery';
// classes
import {ImgLazy} from './ImgLazy';
import {YoutubeLazyLoad} from './YoutubeLazyLoad';
import {Modal} from './Modal';
import {Form} from './Form';
// components


window.$ = window.JQuery = JQuery;
window.Form = Form;

document.addEventListener('DOMContentLoaded', () => {
  // modal
  const btnsJs = [...document.querySelectorAll('.btn-js-submit')];

  btnsJs.forEach((el) => {
    el.addEventListener('click', () => {
      new Modal(el.getAttribute('data-modal')).modalToggle();
    });
  });

  // [block] mobile menu
  // nodes
  const mobMenu = $('#header-mobile-menu');
  const mobMenuFire = $('#header__mobile-menu-button');
  // event click
  mobMenuFire.on('click', function() {
    // self
    const mobMenuFireState = $(this);
    // logic
    if (mobMenuFireState.hasClass('active')) {
      mobMenuFireState.removeClass('active');
      mobMenu.slideUp();
    } else {
      mobMenuFireState.addClass('active');
      mobMenu.slideDown();
    }
  });

  // yt lazyLoad
  new YoutubeLazyLoad('.youtube').init();


  // lazy loading images
  new ImgLazy([]).lazyInit();
});

