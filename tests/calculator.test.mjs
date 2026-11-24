// Pruebas de la lógica de cálculo (sin navegador).
// Ejecutar con:  npm test   (o bien: node --test)
import test from 'node:test';
import assert from 'node:assert/strict';

import { LoanRequest } from '../js/domain/LoanRequest.js';
import { LoanCalculator } from '../js/domain/LoanCalculator.js';
import { FrenchAmortizationStrategy } from '../js/domain/strategies/FrenchAmortizationStrategy.js';
import { LoanValidator } from '../js/validation/LoanValidator.js';
import { NumberParser } from '../js/formatting/NumberParser.js';

const calculator = new LoanCalculator(new FrenchAmortizationStrategy());

test('Ejemplo del Excel: Q21,000 al 26 % anual a 36 meses → Q846.10', () => {
  const result = calculator.calculate(new LoanRequest(21000, 36, 26));
  assert.equal(result.monthlyPayment, 846.10);
  assert.equal(result.schedule.length, 36);
});

test('Primera fila: interés sobre el saldo inicial', () => {
  const [first] = calculator.calculate(new LoanRequest(21000, 36, 26)).schedule;
  assert.equal(first.interest, 455.00);   // 21,000 × 26 % / 12
  assert.equal(first.principal, 391.10);  // 846.10 − 455.00
  assert.equal(first.balance, 20608.90);
});

test('El saldo termina exactamente en 0 y el capital suma el monto', () => {
  const result = calculator.calculate(new LoanRequest(21000, 36, 26));
  const last = result.schedule.at(-1);
  assert.equal(last.balance, 0);
  const principal = result.schedule.reduce((s, r) => s + r.principal, 0);
  assert.equal(Math.round(principal * 100) / 100, 21000);
  assert.equal(
    Math.round((result.totalPaid - result.totalInterest) * 100) / 100,
    21000,
  );
});

test('Coincide con la función PAGO/PMT de Excel en otros casos', () => {
  // Valores de referencia calculados con =PAGO(tasa/12; n; -monto)
  assert.equal(calculator.calculate(new LoanRequest(5900, 12, 24)).monthlyPayment, 557.90);
  assert.equal(calculator.calculate(new LoanRequest(100000, 60, 18)).monthlyPayment, 2539.34);
});

test('Tasa 0 %: la cuota es el monto dividido entre el plazo', () => {
  const result = calculator.calculate(new LoanRequest(12000, 12, 0));
  assert.equal(result.monthlyPayment, 1000);
  assert.equal(result.totalInterest, 0);
});

test('Validación: campos vacíos o fuera de rango generan mensajes', () => {
  const validator = new LoanValidator();
  const empty = validator.validate({ amount: null, termMonths: null, annualRate: null });
  assert.equal(empty.isValid, false);
  assert.deepEqual(Object.keys(empty.errors).sort(), ['amount', 'annualRate', 'termMonths']);

  const decimalTerm = validator.validate({ amount: 21000, termMonths: 12.5, annualRate: 26 });
  assert.ok(decimalTerm.errors.termMonths);

  assert.equal(validator.validate({ amount: 21000, termMonths: 36, annualRate: 26 }).isValid, true);
});

test('Lectura de números con formato del usuario', () => {
  const parser = new NumberParser();
  assert.equal(parser.parse('21,000.00'), 21000);
  assert.equal(parser.parse('Q 21000'), 21000);
  assert.equal(parser.parse('26%'), 26);
  assert.equal(parser.parse(''), null);
  assert.ok(Number.isNaN(parser.parse('abc')));
});
