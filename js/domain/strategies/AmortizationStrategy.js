/**
 * Contrato (abstracción) para cualquier método de amortización.
 *
 * Principio Abierto/Cerrado: para agregar otro método (por ejemplo,
 * capital fijo) se crea una nueva clase que extienda esta, sin modificar
 * el resto de la aplicación.
 * Principio de Sustitución de Liskov: cualquier subclase debe poder usarse
 * donde se espera una AmortizationStrategy.
 */
export class AmortizationStrategy {
  /** Nombre legible del método (se muestra al usuario). */
  get name() {
    throw new Error('AmortizationStrategy.name debe implementarse.');
  }

  /**
   * Genera las filas de la tabla de amortización.
   * @param {import('../LoanRequest.js').LoanRequest} request
   * @returns {Array<{period:number, payment:number, interest:number, principal:number, balance:number}>}
   */
  buildSchedule(request) {
    throw new Error('AmortizationStrategy.buildSchedule debe implementarse.');
  }
}
