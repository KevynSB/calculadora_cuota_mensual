/**
 * Redondea un valor monetario a 2 decimales evitando errores de
 * punto flotante (por ejemplo 1.005 → 1.01).
 * @param {number} value
 * @returns {number}
 */
export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
