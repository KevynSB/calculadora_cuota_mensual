/**
 * Objeto de valor (inmutable) con los datos que ingresa el usuario.
 * Responsabilidad única: representar una solicitud de crédito.
 */
export class LoanRequest {
  /**
   * @param {number} amount       Monto del crédito (Q).
   * @param {number} termMonths   Plazo en meses.
   * @param {number} annualRate   Tasa anual en porcentaje (26 = 26 %).
   */
  constructor(amount, termMonths, annualRate) {
    this.amount = amount;
    this.termMonths = termMonths;
    this.annualRate = annualRate;
    Object.freeze(this);
  }

  /** Tasa mensual en forma decimal (26 % anual → 0.021666…). */
  get monthlyRate() {
    return this.annualRate / 100 / 12;
  }
}
