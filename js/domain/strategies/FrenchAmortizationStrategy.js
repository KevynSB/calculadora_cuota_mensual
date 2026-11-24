import { AmortizationStrategy } from './AmortizationStrategy.js';
import { roundMoney } from '../money.js';

/**
 * Cuota nivelada con intereses sobre saldos (sistema francés).
 *
 * Es la misma lógica que usa el Excel de referencia (Hoja1, celda G4,
 * nombre "Scheduled_Monthly_Payment"), equivalente a la función de Excel:
 *     =PAGO(tasa_anual/12; plazo_meses; -monto)
 *
 * Cada mes el interés se calcula sobre el saldo pendiente; la cuota es
 * la misma todos los meses y la última se ajusta por redondeo para que
 * el saldo termine exactamente en Q0.00.
 */
export class FrenchAmortizationStrategy extends AmortizationStrategy {
  get name() {
    return 'Cuota nivelada (intereses sobre saldos)';
  }

  /** Cuota mensual sin redondear. */
  static monthlyPayment(amount, monthlyRate, termMonths) {
    if (monthlyRate === 0) return amount / termMonths;
    const factor = Math.pow(1 + monthlyRate, termMonths);
    return (amount * monthlyRate * factor) / (factor - 1);
  }

  buildSchedule(request) {
    const { amount, termMonths } = request;
    const rate = request.monthlyRate;
    const payment = roundMoney(
      FrenchAmortizationStrategy.monthlyPayment(amount, rate, termMonths)
    );

    const rows = [];
    let balance = amount;

    for (let period = 1; period <= termMonths; period += 1) {
      const interest = roundMoney(balance * rate);
      const isLast = period === termMonths;
      // En el último mes se paga exactamente el saldo restante.
      const principal = isLast ? roundMoney(balance) : roundMoney(payment - interest);
      const rowPayment = isLast ? roundMoney(principal + interest) : payment;
      balance = roundMoney(balance - principal);

      rows.push({ period, payment: rowPayment, interest, principal, balance });
    }

    return rows;
  }
}
