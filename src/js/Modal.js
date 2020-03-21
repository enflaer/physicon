/**
 * It creates modal class.
 */
export class Modal {
  /**
   * It creates modal constructor.
   * @param {dataId} dataId finding form by data-id.
   */
  constructor(dataId) {
    this.modal = document.querySelector('.modal[data-modal="' + dataId + '"]');

    this.modalBg = document.querySelector('.modal[data-modal="' + dataId + '"] .modal-bg');

    this.modalClose = document.querySelector('.modal[data-modal="' + dataId + '"] .modal-close');

    this.modalToggleFunction = () => {
      this.modalToggle();
    };

    this.modalBg.addEventListener('click', this.modalToggleFunction);

    this.modalClose.addEventListener('click', this.modalToggleFunction);
  }

  /**
   * It's show/hide modal'.
   */
  modalToggle() {
    if (this.modal.classList.contains('active')) {
      this.modal.classList.remove('active');
      this.modalBg.removeEventListener('click', this.modalToggleFunction);
      this.modalClose.removeEventListener('click', this.modalToggleFunction);
    } else {
      this.modal.classList.add('active');
    }
  }
}
