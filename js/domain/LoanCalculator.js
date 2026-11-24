import { roundMoney } from './money.js';

/**
 * Servicio de cálculo de créditos.
 *
 * Principio de Inversión de Dependencias: no sabe qué método de
 * amortización usa; recibe la estrategia desde afuera (main.js).
 */
export class LoanCalculator {
  /** @param {import('./strategies/AmortizationStrategy.js').AmortizationStrategy} strategy */
  constructor(strategy) {
    this.strategy = strategy;
  }

  /**
   * @param {import('./LoanRequest.js').LoanRequest} request
   * @returns {LoanResult}
   */
  calculate(request) {
    const schedule = this.strategy.buildSchedule(request);
    const totalInterest = roundMoney(schedule.reduce((sum, row) => sum + row.interest, 0));
    const totalPaid = roundMoney(schedule.reduce((sum, row) => sum + row.payment, 0));

    return {
      request,
      methodName: this.strategy.name,
      monthlyPayment: schedule[0].payment,
      totalInterest,
      totalPaid,
      schedule,
    };
  }
}

/**
 * @typedef {Object} LoanResult
 * @property {import('./LoanRequest.js').LoanRequest} request
 * @property {string} methodName
 * @property {number} monthlyPayment
 * @property {number} totalInterest
 * @property {number} totalPaid
 * @property {Array<{period:number, payment:number, interest:number, principal:number, balance:number}>} schedule
 */
