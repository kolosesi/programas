# Calculadora Científica (Web)

Proyecto mínimo de una calculadora científica hecha con HTML/CSS/JS.

Características principales:
- Operaciones básicas: +, -, ×, ÷
- Funciones científicas: sin, cos, tan, log (base10), ln (natural), sqrt, pow
- Constantes: π, e
- Modo RAD/DEG (botón en la cabecera)
- Evaluación de expresiones (soporta paréntesis y potencias con `^`)

Cómo usar:
1. Abre `index.html` en tu navegador (doble clic o "Abrir con → navegador").
2. Escribe la expresión usando los botones o teclado y pulsa `=` o Enter.

Ejemplos:
- `sin(30)` (en modo DEG) → 0.5
- `pow(2,3)` o `2^3` → 8
- `log(100)` → 2
- `ln(e)` → 1

Limitaciones y seguridad:
- La evaluación se realiza usando `Function(...)` en el contexto del navegador. Evita introducir expresiones no confiables en entornos compartidos.

Siguientes mejoras posibles:
- Historial de cálculos
- Mejor manejo de errores y mensajes más claros
- Tests automatizados y soporte completo de teclado

