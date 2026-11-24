import { LoanRequest } from '../domain/LoanRequest.js';

/**
 * Controlador: coordina vistas, validación y cálculo.
 *
 * Inversión de dependencias: recibe todas sus dependencias ya creadas
 * (ver main.js), por lo que no depende de clases concretas y es fácil
 * de probar o extender.
 */
export class LoanController {
  constructor({ formView, resultView, tableView, validator, calculator, printer }) {
    this.formView = formView;
    this.resultView = resultView;
    this.tableView = tableView;
    this.validator = validator;
    this.calculator = calculator;
    this.printer = printer;
    this.lastResult = null;
  }

  init() {
    this.formView.onSubmit((values) => this.handleCalculate(values));
    this.formView.onChange(() => this.handleInputChanged());
    this.resultView.onToggleTable((expand) => this.handleToggleTable(expand));
    this.resultView.onReset(() => this.handleReset());
    this.tableView.onPrint(() => this.printer.print());
  }

  handleCalculate(values) {
    const { isValid, errors } = this.validator.validate(values);
    if (!isValid) {
      this.formView.showErrors(errors);
      this.#clearResult();
      return;
    }

    this.formView.clearErrors();
    const request = new LoanRequest(values.amount, values.termMonths, values.annualRate);
    this.lastResult = this.calculator.calculate(request);

    this.tableView.hide();
    this.resultView.render(this.lastResult);
  }

  /** Si cambian los datos, el resultado anterior ya no es válido. */
  handleInputChanged() {
    if (this.lastResult) this.#clearResult();
  }

  handleToggleTable(expand) {
    if (!this.lastResult) return;
    this.resultView.setTableExpanded(expand);
    if (expand) {
      this.tableView.render(this.lastResult);
      this.tableView.show();
    } else {
      this.tableView.hide();
    }
  }

  handleReset() {
    this.#clearResult();
    this.formView.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  #clearResult() {
    this.lastResult = null;
    this.resultView.hide();
    this.tableView.hide();
  }
}
