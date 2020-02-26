import 'babel-polyfill';


document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('js-submit-mailto');
  const modal = document.getElementById('ajax-form');
  const form = document.querySelector('.modal');
  const formName = form.querySelector('input[name="name"]');
  const formMail = form.querySelector('input[name="email"]');
  const pageTitle = document.querySelector('title').innerHTML;

  const regexp = /([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;

  /**
   * sending formData to server.
   * @param {url} url with send file.
   * @param {form} form with data.
   * @return {fetch} fetching formdata.
   */
  async function postData(url, form) {
    const formData = new FormData(form);

    formData.append('pageTitle', pageTitle);

    return fetch(url, {
      method: 'POST',
      body: formData,
    })
        .then((response) => response.json());
  }
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (formName.checkValidity() === true && regexp.test(formMail.value) === true) {
      postData('send.php', modal)
          .then(function() {
            form.classList.add('success');
            setTimeout(function() {
              form.classList.remove('success');
            }, 3000);
          }, function() {
            form.classList.add('error');
            setTimeout(function() {
              form.classList.remove('error');
            }, 3000);
          })
          .catch((error) => console.error(error));
    } else {
      form.classList.add('error');
      setTimeout(function() {
        form.classList.remove('error');
      }, 3000);
    }
  });
  // smooth anchors

  // let linkNav = document.querySelectorAll('[href^="#"]'),
  //   V = 0.25;
  // for (let i = 0; i < linkNav.length; i++) {
  //   linkNav[i].addEventListener('click', function (e) {
  //     e.preventDefault();
  //     let w = window.pageYOffset,
  //       hash = this.href.replace(/[^#]*(.*)/, '$1'),
  //       t = document.querySelector(hash).getBoundingClientRect().top,
  //       start = null;
  //     requestAnimationFrame(step);
  //
  //     function step(time) {
  //       if (start === null) start = time;
  //       let progress = time - start,
  //         r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
  //       window.scrollTo(0, r);
  //       if (r !== w + t) {
  //         requestAnimationFrame(step)
  //       } else {
  //         location.hash = hash;
  //       }
  //     }
  //   }, false);
  // }

  // modal

  const btnJs = document.querySelector('.btn-js');
  /**
   * It creates modal class.
   */
  class Modal {
    /**
     * It creates modal constructor.
     * @param {dataId} dataId finding form by data-id.
     */
    constructor(dataId) {
      this.modal = document.querySelector('.modal[data-modal="' + dataId + '"]');

      this.modalBg = document.querySelector('.modal-bg');

      this.modalClose = document.querySelector('.modal-close');

      this.modalBg.addEventListener('click', () => {
        this.modalToggle();
      });

      this.modalClose.addEventListener('click', () => {
        this.modalToggle();
      });
    }
    /**
     * It's show/hide modal'.
     */
    modalToggle() {
      this.modal.classList.toggle('active');
      this.modalBg.classList.toggle('active');
    }
  }

  const modalMail = new Modal('mailto');

  btnJs ?
    btnJs.addEventListener('click', () => {
      modalMail.modalToggle();
    }) : () => {
      return false;
    };

  // youtube lazy loading

  const youtube = [...document.querySelectorAll('.youtube')];

  if (youtube.length > 0) {
    youtube.forEach((el, index) => {
      const source = 'https://img.youtube.com/vi/' + youtube[index].dataset.embed + '/sddefault.jpg';

      const image = new Image();
      image.src = source;
      image.addEventListener('load', function() {
        youtube[index].appendChild(image);
      }(index));

      youtube[index].addEventListener('click', function() {
        const iframe = document.createElement('iframe');

        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.dataset.embed + '?rel=0&showinfo=0&autoplay=1');

        this.innerHTML = '';
        this.appendChild(iframe);
      });
    });
  }
  // mobile menu TODO Rewrite to vanilla js
  // const mobMenu = $('#header-mobile-menu');
  // const mobMenuFire = $('#header__mobile-menu-button');
  // // event click
  // mobMenuFire.on('click', function() {
  //   // self
  //   const mobMenuFireState = $(this);
  //   // logic
  //   if (mobMenuFireState.hasClass('active')) {
  //     mobMenuFireState.removeClass('active');
  //     mobMenu.slideUp();
  //   } else {
  //     mobMenuFireState.addClass('active');
  //     mobMenu.slideDown();
  //   }
  // });
});

