/**
 * lazy loading class for all images.
 */
export class ImgLazy {
  /**
   * ImgLazy constructor.
   * @param {string} img we will list
   */
  constructor(img) {
    this.targets = document.querySelectorAll(img);
  }
  /**
   * lazyLoad Logic.
   * @param {array} target is a list of target we are getting from constructor
   */
  lazyLoad(target) {
    const io = new IntersectionObserver((entries, observer) => {
      console.log(entries);
      entries.forEach((entry) => {
        console.log('😍');

        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-lazy');

          img.setAttribute('src', src);
          img.classList.add('animated', 'fadeIn');

          observer.disconnect();
        }
      });
    });

    io.observe(target);
  }
  /**
   * lazyLoad init.
   */
  lazyInit() {
    this.targets.forEach(this.lazyLoad);
  }
}
