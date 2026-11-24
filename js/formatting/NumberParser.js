/**
 * Convierte lo que escribe el usuario ("21,000", "Q 21 000.50", "26%")
 * en un número. Devuelve null si el campo está vacío.
 * Responsabilidad única: interpretar texto numérico.
 */
export class NumberParser {
  parse(text) {
    if (text === null || text === undefined) return null;
    const clean = String(text)
      .replace(/[Qq%\s]/g, '')
      .replace(/,/g, '');
    if (clean === '') return null;
    // Solo dígitos con un punto decimal opcional.
    if (!/^\d*\.?\d*$/.test(clean)) return Number.NaN;
    return Number(clean);
  }
}
