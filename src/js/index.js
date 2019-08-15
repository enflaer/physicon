import $ from 'jquery';


document.addEventListener("DOMContentLoaded", () => {
  
  // smooth anchors
  
  let linkNav = document.querySelectorAll('[href^="#"]'),
    V = 0.25;
  for (let i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function (e) {
      e.preventDefault();
      let w = window.pageYOffset,
        hash = this.href.replace(/[^#]*(.*)/, '$1'),
        t = document.querySelector(hash).getBoundingClientRect().top,
        start = null;
      requestAnimationFrame(step);
      
      function step(time) {
        if (start === null) start = time;
        let progress = time - start,
          r = (t < 0 ? Math.max(w - progress / V, w + t) : Math.min(w + progress / V, w + t));
        window.scrollTo(0, r);
        if (r !== w + t) {
          requestAnimationFrame(step)
        } else {
          location.hash = hash;
        }
      }
    }, false);
  }
  
  // form submit
  
  let formSubmit = $("#js-submit-mailto"),
    form = $('.modal');
  
  $(document).ready(function () {
    formSubmit.click(
      function () {
        sendAjaxForm('result-form', 'ajax-form', 'send.php');
        return false;
      }
    );
  });
  
  function sendAjaxForm(result_form, ajax_form, url) {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "html",
      data: $("#" + ajax_form).serialize(),
      success: function (response) {
        let result = $.parseJSON(response);
        form.addClass('success');
        setTimeout(function () {
          form.removeClass('success');
        }, 3000);
      },
      error: function (response) {
        document.getElementById(result_form).innerHTML = "Ошибка. Данные не отправленны.";
        form.addClass('error');
        setTimeout(function () {
          form.removeClass('error');
        }, 3000);
      }
    });
  }
  
  // modal
  
  let btnJs = document.querySelector('.btn-js');
  
  class Modal {
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
    
    modalToggle() {
      this.modal.classList.toggle('active');
      this.modalBg.classList.toggle('active');
    };
  }
  
  let modalMail = new Modal('mailto');
  
  btnJs ?
  btnJs.addEventListener('click', function () {
    modalMail.modalToggle();
  }) : () => {return false};
  
  // youtube lazy loading
  
  let youtube = [...document.querySelectorAll( ".youtube" )];
  
  if (youtube.length > 0) {
    youtube.forEach( (el, index) => {
      
      let source = "https://img.youtube.com/vi/"+ youtube[index].dataset.embed +"/sddefault.jpg";
      
      let image = new Image();
      image.src = source;
      image.addEventListener( "load", function() {
        youtube[index].appendChild( image );
      }(index) );
      
      youtube[index].addEventListener( "click", function() {
        
        let iframe = document.createElement( "iframe" );
        
        iframe.setAttribute( "frameborder", "0" );
        iframe.setAttribute( "allowfullscreen", "" );
        iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );
        
        this.innerHTML = "";
        this.appendChild( iframe );
      } );
    })
  }
  
});

