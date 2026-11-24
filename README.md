# Calculadora de Créditos · SB_SoftSolutions

Aplicación web sencilla para calcular la **cuota mensual** de un crédito con
**intereses sobre saldos** (cuota nivelada) y consultar, solo si el usuario lo
desea, su **tabla de amortización**.

- Sin login, sin base de datos: todo se calcula en el navegador del usuario.
- Diseño responsivo pensado primero para celulares.
- Textos grandes, pasos numerados y mensajes claros para usuarios con
  conocimientos básicos de tecnología.
- 100 % HTML, CSS y JavaScript (sin frameworks ni compilación), listo para
  publicarse en **GitHub Pages**.

> Pregunta de ejemplo: *¿Cuál es la cuota mensual de un crédito de Q21,000 al
> 26 % anual sobre saldos a 36 meses?* → **Q846.10**
> (total de intereses Q9,459.77; total a pagar Q30,459.77).

## Lógica de cálculo

Replica la cuota de la hoja **Hoja1** del Excel `FLUJO.xls` (celda G4,
`Scheduled_Monthly_Payment`), que equivale a la función de Excel:

```
=PAGO(tasa_anual/12; plazo_meses; -monto)

cuota = M · i · (1 + i)^n / ((1 + i)^n − 1)      con  i = tasa_anual / 12
```

Tabla de amortización, cada mes:

- **Interés** = saldo pendiente × i
- **Capital** = cuota − interés
- **Saldo** = saldo anterior − capital

Todos los valores se redondean a centavos; la última cuota se ajusta para que
el saldo termine exactamente en Q0.00.

## Estructura del proyecto

```
calculadora-creditos/
├── index.html                  # Página única (monolito)
├── css/styles.css              # Estilos, paleta de colores y responsive
├── assets/img/                 # Logo, ícono y favicon
├── js/
│   ├── main.js                 # Punto de entrada: crea y conecta las piezas
│   ├── app/LoanController.js   # Coordina vistas, validación y cálculo
│   ├── domain/
│   │   ├── LoanRequest.js      # Datos del crédito (objeto de valor)
│   │   ├── LoanCalculator.js   # Servicio de cálculo y totales
│   │   ├── money.js            # Redondeo monetario
│   │   └── strategies/
│   │       ├── AmortizationStrategy.js        # Contrato (abstracción)
│   │       └── FrenchAmortizationStrategy.js  # Cuota nivelada sobre saldos
│   ├── validation/LoanValidator.js            # Reglas y mensajes de error
│   ├── formatting/
│   │   ├── CurrencyFormatter.js # Formato Q y %
│   │   └── NumberParser.js      # Interpreta "21,000", "26%", etc.
│   └── ui/
│       ├── LoanFormView.js          # Formulario
│       ├── ResultView.js            # Cuota y resumen
│       └── AmortizationTableView.js # Tabla de amortización
├── tests/calculator.test.mjs   # Pruebas de la lógica (node:test)
├── GUIA_DEPLOY.md              # Paso a paso para publicar en GitHub Pages
└── package.json                # Solo scripts (no hay dependencias)
```

## Principios SOLID aplicados

| Principio | Dónde se aplica |
|---|---|
| **S** – Responsabilidad única | Cada clase hace una sola cosa: validar (`LoanValidator`), formatear (`CurrencyFormatter`), leer números (`NumberParser`), calcular (`LoanCalculator`), pintar cada parte de la pantalla (vistas) y coordinar (`LoanController`). |
| **O** – Abierto/Cerrado | Para agregar otro método de cálculo (p. ej. capital fijo) se crea una nueva clase que extiende `AmortizationStrategy`; no se modifica el resto del código. |
| **L** – Sustitución de Liskov | Cualquier estrategia de amortización puede reemplazar a otra porque todas cumplen el mismo contrato (`name`, `buildSchedule`). |
| **I** – Segregación de interfaces | Las vistas exponen solo lo que el controlador necesita (`render`, `show`, `hide`, `onSubmit`…); el formateador y el lector de números están separados. |
| **D** – Inversión de dependencias | `LoanController` y `LoanCalculator` reciben sus dependencias por constructor; solo `main.js` conoce las clases concretas. |

## Paleta de colores (psicología del color)

| Color | Uso | Por qué |
|---|---|---|
| Azul marino `#0F2A4A` / `#1B3F6E` | Encabezado, botones principales | Confianza, seguridad y estabilidad (colores de la marca) |
| Verde `#146C43` | Cuota resultante y totales | Tranquilidad y salud financiera |
| Rojo `#C8102E` | Solo acento de marca y errores | Llama la atención; en exceso se asocia a pérdidas |
| Gris azulado `#F3F6FA` | Fondo | Orden y descanso visual |

## Probar en su computadora

Los módulos de JavaScript no funcionan si se abre `index.html` con doble clic
(`file://`). Use cualquiera de estas opciones:

- **VS Code:** instale la extensión *Live Server* → clic derecho en
  `index.html` → *Open with Live Server*.
- **Node.js:** `npm start` (usa `npx serve`) y abra la dirección que indique.
- **Python:** `python -m http.server 8000` y abra <http://localhost:8000>.

## Ejecutar las pruebas

Requiere Node.js 18 o superior (no hay dependencias que instalar):

```bash
npm test
```

## Publicar

Siga la guía [GUIA_DEPLOY.md](GUIA_DEPLOY.md).

---

Desarrollado por **SB_SoftSolutions** · Software & Consulting
