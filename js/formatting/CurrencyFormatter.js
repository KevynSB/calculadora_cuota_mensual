/**
 * Da formato a montos en quetzales y porcentajes.
 * Responsabilidad única: presentación de números.
 */
export class CurrencyFormatter {
  constructor(locale = 'es-GT', currencySymbol = 'Q') {
    this.symbol = currencySymbol;
    this.number = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.plain = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  }

  /** 846.1 → "Q846.10" */
  money(value) {
    return `${this.symbol}${this.number.format(value)}`;
  }

  /** 846.1 → "846.10" (sin símbolo, para tablas) */
  amount(value) {
    return this.number.format(value);
  }

  /** 26 → "26 %" */
  percent(value) {
    return `${this.plain.format(value)}\u00A0%`; // espacio que no se separa en dos líneas
  }
}
