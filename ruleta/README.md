# Ruleta Rusa (2 jugadores) - Pequeño juego web

Descripción

- Dos jugadores, cada uno comienza con 5 vidas.
- Cada jugador recibe 2 objetos aleatorios al inicio: "Aleta" (recupera 1 vida) o "Lupa" (revela la próxima bala: roja o azul).
- Al disparar, la bala puede ser roja (daño: -1 vida) o azul (sin daño).
- Reglas de turnos implementadas:
  - Si te disparas a ti mismo y sale azul, no recibes daño y conservas el turno.
  - Si te disparas a ti mismo y sale roja, pierdes 1 vida y el turno pasa al otro jugador (el receptor).
  - Si disparas al oponente y sale roja, el oponente pierde 1 vida y el turno pasa al oponente (el receptor).
  - Si disparas al oponente y sale azul, no pasa daño y el turno pasa al oponente (el receptor).

Notas y supuestos

- Probabilidad: por defecto la bala es roja con probabilidad 50% y azul 50%. Esto es una suposición; puedo ajustar la probabilidad si lo deseas.
- La Lupa revela la próxima bala (la revelación se consume en el siguiente disparo).
- La Aleta restaura 1 vida hasta el máximo de 5.
- Implementación simple: interfaz en HTML/CSS/JS. Abre `index.html` en tu navegador o sirve con `python3 -m http.server`.

Cómo jugar

1. Abre `index.html` en el navegador.
2. Observa los items que tienes mostrados en la sección de objetos.
3. Puedes usar Aleta o Lupa con los botones, elegir objetivo (tú mismo u oponente) y pulsar "Disparar".

Mejoras posibles

- Mejorar la UI/UX con confirmaciones, animaciones y contador de cámaras.
- Añadir IA para un jugador, historial de acciones, o ajustar probabilidades de la bala.
- Evitar alert() y mostrar modal bonito para fin de partida.

