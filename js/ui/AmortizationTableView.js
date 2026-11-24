/**
 * Vista de la tabla de amortización.
 * Responsabilidad única: construir y mostrar/ocultar la tabla.
 */
export class AmortizationTableView {
  /**
   * @param {HTMLElement} section
   * @param {import('../formatting/CurrencyFormatter.js').CurrencyFormatter} formatter
   */
  constructor(section, formatter) {
    this.section = section;
    this.formatter = formatter;
    this.heading = section.querySelector('#schedule-title');
    this.caption = section.querySelector('[data-schedule="caption"]');
    this.body = section.querySelector('[data-schedule="body"]');
    this.foot = section.querySelector('[data-schedule="foot"]');
    this.paymentNote = section.querySelector('[data-schedule="paymentNote"]');
    this.printButton = section.querySelector('#print');
  }

  /** @param {import('../domain/LoanCalculator.js').LoanResult} result */
  render(result) {
    const f = this.formatter;
    const { amount, termMonths, annualRate } = result.request;

    this.caption.textContent =
      `Crédito de ${f.money(amount)} · ${termMonths} meses · ${f.percent(annualRate)} anual sobre saldos`;

    // En celulares la columna "Cuota" se oculta (es la misma cada mes)
    // y se explica en esta nota para que la tabla quepa sin desplazarse.
    const last = result.schedule.at(-1);
    this.paymentNote.innerHTML =
      `Su cuota de <strong>${f.money(result.monthlyPayment)}</strong> es la misma cada mes.` +
      (last.payment !== result.monthlyPayment
        ? ` La última es de <strong>${f.money(last.payment)}</strong> por ajuste de centavos.`
        : '');

    const fragment = document.createDocumentFragment();
    result.schedule.forEach((row) => {
      const tr = document.createElement('tr');
      [
        [String(row.period)],
        [f.amount(row.payment), 'col-payment'],
        [f.amount(row.interest)],
        [f.amount(row.principal)],
        [f.amount(row.balance)],
      ].forEach(([value, className]) => {
        const td = document.createElement('td');
        td.textContent = value;
        if (className) td.className = className;
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    this.body.replaceChildren(fragment);

    this.foot.innerHTML = `
      <tr>
        <td>Total</td>
        <td class="col-payment">${f.amount(result.totalPaid)}</td>
        <td>${f.amount(result.totalInterest)}</td>
        <td>${f.amount(amount)}</td>
        <td></td>
      </tr>`;
  }

  show() {
    this.section.hidden = false;
    this.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.heading.focus({ preventScroll: true });
  }

  hide() {
    this.section.hidden = true;
  }

  onPrint(handler) {
    this.printButton.addEventListener('click', handler);
  }
}
