/**
 * Vista del resultado (cuota mensual y resumen).
 * Responsabilidad única: pintar el resultado y exponer sus botones.
 */
export class ResultView {
  /**
   * @param {HTMLElement} section
   * @param {import('../formatting/CurrencyFormatter.js').CurrencyFormatter} formatter
   */
  constructor(section, formatter) {
    this.section = section;
    this.formatter = formatter;
    this.heading = section.querySelector('#result-title');
    this.toggleButton = section.querySelector('#toggle-table');
    this.toggleLabel = this.toggleButton.querySelector('[data-label]');
    this.resetButton = section.querySelector('#reset');
    this.slots = {
      monthlyPayment: section.querySelector('[data-result="monthlyPayment"]'),
      summary: section.querySelector('[data-result="summary"]'),
      amount: section.querySelector('[data-result="amount"]'),
      totalInterest: section.querySelector('[data-result="totalInterest"]'),
      totalPaid: section.querySelector('[data-result="totalPaid"]'),
    };
  }

  /** @param {import('../domain/LoanCalculator.js').LoanResult} result */
  render(result) {
    const f = this.formatter;
    const { amount, termMonths, annualRate } = result.request;

    this.slots.monthlyPayment.innerHTML = `${f.money(result.monthlyPayment)} <small>al mes</small>`;
    this.slots.summary.innerHTML =
      `Por un crédito de <strong>${f.money(amount)}</strong> a <strong>${termMonths} ${termMonths === 1 ? 'mes' : 'meses'}</strong> ` +
      `con una tasa del <strong>${f.percent(annualRate)} anual sobre saldos</strong>, ` +
      `usted pagaría <strong>${f.money(result.monthlyPayment)}</strong> cada mes.`;
    this.slots.amount.textContent = f.money(amount);
    this.slots.totalInterest.textContent = f.money(result.totalInterest);
    this.slots.totalPaid.textContent = f.money(result.totalPaid);

    this.setTableExpanded(false);
    this.section.hidden = false;
    this.#bringIntoView();
  }

  hide() {
    this.section.hidden = true;
    this.setTableExpanded(false);
  }

  get isVisible() {
    return !this.section.hidden;
  }

  setTableExpanded(expanded) {
    this.toggleButton.setAttribute('aria-expanded', String(expanded));
    this.toggleLabel.textContent = expanded
      ? 'Ocultar tabla de amortización'
      : 'Ver tabla de amortización';
  }

  onToggleTable(handler) {
    this.toggleButton.addEventListener('click', () => {
      const expanded = this.toggleButton.getAttribute('aria-expanded') === 'true';
      handler(!expanded);
    });
  }

  onReset(handler) {
    this.resetButton.addEventListener('click', handler);
  }

  #bringIntoView() {
    this.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.heading.focus({ preventScroll: true });
  }
}
