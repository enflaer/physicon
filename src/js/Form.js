/**
 * Form class.
 */
export class Form {
  /**
   * Form constructor.
   * @param {string} modalId
   */
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.submitButton = this.modal.querySelector('.js-submit-form');
    this.formResult = this.modal.querySelector('.modal-result');
    this.formBody = this.modal.querySelector('.modal-form');
    this.formFieldsets = [...this.modal.querySelectorAll('fieldset')];
  }
  /**
   * form validation
   * @return {boolean} validation result
   */
  validation() {
    return this.formBody.checkValidity();
  }
  /**
   * Validation fails way
   */
  error() {
    this.formFieldsets.forEach((fieldset) => {
      const input = fieldset.querySelector('input');
      if (input.checkValidity()) {
        fieldset.classList.remove('error');
      } else {
        fieldset.classList.add('error');
        const currentPlaceholder = input.getAttribute('placeholder') !== null ? input.getAttribute('placeholder').split('*').slice(0, 1) : false;
        input.setAttribute('placeholder', currentPlaceholder + '* - Заполните поле');
      }
      input.addEventListener('change', () => {
          input.checkValidity() ? fieldset.classList.remove('error') : fieldset.classList.add('error');
      });
    });
  }
  /**
   * Validation success way
   */
  success() {
    this.formResult.classList.toggle('success');
  }
  /**
   * form init
   * @param {function} successHandler
   */
  init(successHandler) {
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.validation()) {
        this.error();
      } else {
        successHandler({target: this.formBody, toggleMessage: this.success});
      }
    });
  }
}

