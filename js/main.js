/**
 * Punto de entrada (composition root).
 * Aquí, y solo aquí, se crean las clases concretas y se conectan entre sí.
 * Para cambiar el método de cálculo basta con inyectar otra estrategia.
 */
import { FrenchAmortizationStrategy } from './domain/strategies/FrenchAmortizationStrategy.js';
import { LoanCalculator } from './domain/LoanCalculator.js';
import { LoanValidator } from './validation/LoanValidator.js';
import { CurrencyFormatter } from './formatting/CurrencyFormatter.js';
import { NumberParser } from './formatting/NumberParser.js';
import { LoanFormView } from './ui/LoanFormView.js';
import { ResultView } from './ui/ResultView.js';
import { AmortizationTableView } from './ui/AmortizationTableView.js';
import { LoanController } from './app/LoanController.js';

const formatter = new CurrencyFormatter('es-GT', 'Q');
const parser = new NumberParser();

const controller = new LoanController({
  formView: new LoanFormView(document.getElementById('loan-form'), formatter, parser),
  resultView: new ResultView(document.getElementById('result'), formatter),
  tableView: new AmortizationTableView(document.getElementById('schedule'), formatter),
  validator: new LoanValidator(),
  calculator: new LoanCalculator(new FrenchAmortizationStrategy()),
  printer: { print: () => window.print() },
});

controller.init();
