/**
 * YoutubeLazyLoad class.
 */
export class YoutubeLazyLoad {
  /**
   * YoutubeLazyLoad constructor.
   * @param {string} itemClass
   */
  constructor(itemClass) {
    this.items = [...document.querySelectorAll(itemClass)];
  }
  /**
   * YoutubeLazyLoad listener.
   */
  init() {
    if (this.items.length > 0 ) {
      this.items.forEach((el, index) => {
        const source = 'https://img.youtube.com/vi/' + this.items[index].dataset.embed + '/sddefault.jpg';

        const image = new Image();
        image.src = source;
        image.addEventListener('load', () => {
          this.items[index].appendChild(image);
        });

        this.items[index].addEventListener('click', function() {
          const iframe = document.createElement('iframe');

          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.dataset.embed + '?rel=0&showinfo=0&autoplay=1');

          this.innerHTML = '';
          this.appendChild(iframe);
        });
      });
    }
  }
}

