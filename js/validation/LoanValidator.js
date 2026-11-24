/**
 * Valida los datos del formulario y devuelve mensajes claros en español.
 * Responsabilidad única: reglas de negocio de los datos de entrada.
 */
export class LoanValidator {
  constructor(limits = {}) {
    this.limits = {
      minAmount: 100,
      maxAmount: 10_000_000,
      minTerm: 1,
      maxTerm: 360,
      minRate: 0,
      maxRate: 100,
      ...limits,
    };
  }

  /**
   * @param {{amount:number|null, termMonths:number|null, annualRate:number|null}} data
   * @returns {{isValid:boolean, errors:Record<string,string>}}
   */
  validate({ amount, termMonths, annualRate }) {
    const l = this.limits;
    const errors = {};

    if (amount === null || Number.isNaN(amount)) {
      errors.amount = 'Escriba el monto del crédito. Ejemplo: 21000';
    } else if (amount < l.minAmount || amount > l.maxAmount) {
      errors.amount = `El monto debe estar entre Q${l.minAmount.toLocaleString('es-GT')} y Q${l.maxAmount.toLocaleString('es-GT')}.`;
    }

    if (termMonths === null || Number.isNaN(termMonths)) {
      errors.termMonths = 'Escriba el plazo en meses. Ejemplo: 36';
    } else if (!Number.isInteger(termMonths)) {
      errors.termMonths = 'El plazo debe ser un número entero de meses (sin decimales).';
    } else if (termMonths < l.minTerm || termMonths > l.maxTerm) {
      errors.termMonths = `El plazo debe estar entre ${l.minTerm} y ${l.maxTerm} meses.`;
    }

    if (annualRate === null || Number.isNaN(annualRate)) {
      errors.annualRate = 'Escriba la tasa de interés anual. Ejemplo: 26';
    } else if (annualRate < l.minRate || annualRate > l.maxRate) {
      errors.annualRate = `La tasa debe estar entre ${l.minRate} % y ${l.maxRate} %.`;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}
