/**
 * Vista del formulario.
 * Responsabilidad única: leer datos del DOM, mostrar errores y avisar
 * de eventos. No calcula ni valida reglas de negocio.
 */
export class LoanFormView {
  /**
   * @param {HTMLFormElement} form
   * @param {import('../formatting/CurrencyFormatter.js').CurrencyFormatter} formatter
   * @param {import('../formatting/NumberParser.js').NumberParser} parser
   */
  constructor(form, formatter, parser) {
    this.form = form;
    this.formatter = formatter;
    this.parser = parser;
    this.inputs = {
      amount: form.querySelector('#amount'),
      termMonths: form.querySelector('#termMonths'),
      annualRate: form.querySelector('#annualRate'),
    };
    this.chips = [...form.querySelectorAll('[data-term]')];

    this.#bindChips();
    this.#bindAmountFormatting();
  }

  /** Valores numéricos interpretados (null si el campo está vacío). */
  getValues() {
    return {
      amount: this.parser.parse(this.inputs.amount.value),
      termMonths: this.parser.parse(this.inputs.termMonths.value),
      annualRate: this.parser.parse(this.inputs.annualRate.value),
    };
  }

  onSubmit(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      handler(this.getValues());
    });
  }

  /** Se dispara cuando el usuario modifica cualquier dato. */
  onChange(handler) {
    this.form.addEventListener('input', (event) => {
      this.#clearFieldError(event.target.name);
      if (event.target === this.inputs.termMonths) this.#syncChips();
      handler();
    });
  }

  showErrors(errors) {
    this.clearErrors();
    const fieldNames = Object.keys(errors);
    fieldNames.forEach((name) => {
      const field = this.form.querySelector(`[data-field="${name}"]`);
      const message = this.form.querySelector(`#${name}-error`);
      field.classList.add('field--invalid');
      this.inputs[name].setAttribute('aria-invalid', 'true');
      message.textContent = errors[name];
      message.hidden = false;
    });
    if (fieldNames.length) this.inputs[fieldNames[0]].focus();
  }

  clearErrors() {
    Object.keys(this.inputs).forEach((name) => this.#clearFieldError(name));
  }

  reset() {
    this.form.reset();
    this.clearErrors();
    this.#syncChips();
    this.inputs.amount.focus();
  }

  #clearFieldError(name) {
    if (!this.inputs[name]) return;
    const field = this.form.querySelector(`[data-field="${name}"]`);
    const message = this.form.querySelector(`#${name}-error`);
    field.classList.remove('field--invalid');
    this.inputs[name].removeAttribute('aria-invalid');
    message.hidden = true;
    message.textContent = '';
  }

  #bindChips() {
    this.chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        this.inputs.termMonths.value = chip.dataset.term;
        // Notifica el cambio como si el usuario lo hubiera escrito.
        this.inputs.termMonths.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
  }

  #syncChips() {
    const current = this.inputs.termMonths.value.trim();
    this.chips.forEach((chip) => {
      const active = chip.dataset.term === current;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  /** Muestra el monto con separador de miles al salir del campo (21000 → 21,000.00). */
  #bindAmountFormatting() {
    const input = this.inputs.amount;
    input.addEventListener('blur', () => {
      const value = this.parser.parse(input.value);
      if (value !== null && !Number.isNaN(value)) {
        input.value = this.formatter.amount(value);
      }
    });
  }
}
