const form = {
    formEl: null,
    rules: null,
    init() {
        this.formEl = document.querySelector('.my-form');
        this.formEl.addEventListener('submit', e => this.formSubmit(e));
        this.rules = [
            {
                selector: '.name',
                regExp: /^[a-zа-яё\s]+$/i,
                errorText: 'Имя должно содержать только буквы'
            },
            {
                selector: '.phoneNum',
                regExp: /^\+7-\d{3}-\d{3}-\d{4}$/,
                errorText: 'Телефон должен быть по шаблону +7-000-000-0000',
            },
            {
                selector: '.Email',
                regExp: /^[\w._-]+@\w+\.[a-z]{2,4}$/i,
                errorText: 'Email должен быть записан как email@email.ru',
            }
        ];
    },

    formSubmit(e) {
        if (!this.validate()) {
            e.preventDefault();
        }
    },

    validate() {
        let isValid = null;
        let errors = [];
        for (let rule of this.rules) {
            const inputElement = document.querySelector(rule.selector);
            const errorText = rule.errorText;
            isValid = rule.regExp.test(inputElement.value);
            if (isValid !== true) {
                this.setInvalid(inputElement, errorText);
                errors.push(isValid);
            } else {
                this.setValid(inputElement);
            }
        }
        return errors.some(elem => elem === true)
    },

    setInvalid(inputEl, text) {
      const cl = inputEl.classList;
      cl.remove('valid');
      cl.add('invalid');
      inputEl.parentNode.querySelector('.error-text').textContent = text;
    },
    setValid (inputEl) {
        const cl = inputEl.classList;
        cl.remove('invalid');
        cl.add('valid');
        inputEl.parentNode.querySelector('.error-text').textContent = '';
    }
};

form.init();