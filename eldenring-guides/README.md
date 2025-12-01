# Guía de Jefes — Elden Ring (local)

Proyecto simple: guía de jefes para Elden Ring. Muestra una cuadrícula de jefes (con soporte para marcar entries como DLC) y fichas detalladas con debilidades, arma recomendada, timings de ataques, lore y consejos.

Estructura
- `index.html` — lista y búsqueda de jefes.
- `style.css` — estilos.
- `script.js` — carga `bosses.json` y renderiza grid.
- `bosses.json` — datos de los jefes (editar para añadir o cambiar información). Ejemplos incluidos.
- `details.html` / `details.js` — ficha individual (abrir con `?name=identifier`).
- `images/` — imágenes de ejemplo (SVG placeholders). Sustituye por imágenes reales si quieres.

Cómo ejecutar
1. Servir la carpeta localmente (recomendado para evitar restricciones de navegador):

```sh
cd /home/chewu8/Desktop/programas/eldenring-guides
python3 -m http.server 8000
# luego visitar http://localhost:8000
```

2. La página principal carga automáticamente los jefes definidos en `bosses.json`. Haz clic en la imagen para abrir la ficha completa.

Cómo añadir/editar jefes
- Edita `bosses.json` y añade objetos con los campos:
  - `id` (número),
  - `name` (identificador corto, usado en URL),
  - `displayName` (nombre legible),
  - `dlc` (booleano),
  - `image` (ruta local o URL),
  - `weaknesses` (array de strings),
  - `recommended_weapon` (string),
  - `attack_timings` (array de strings),
  - `lore` (string),
  - `tips` (array de strings).

Notas y mejoras sugeridas
- Las imágenes incluidas son placeholders SVG. Puedes reemplazarlas con imágenes de tu colección.
- Podría añadirse paginación, filtrado por tipo de jefe, o un modal en lugar de abrir una página nueva.
- Si quieres, puedo integrar datos reales desde una wiki (requiere respetar licencias) o añadir una interfaz de edición en el navegador.
 
Soporte para imágenes JPG/PNG
- Puedes usar imágenes en formato `.jpg`, `.jpeg` o `.png`. Coloca los archivos en la carpeta `images/` y actualiza el campo `image` en `bosses.json` con la ruta relativa, por ejemplo:

```json
{
  "id": 10,
  "name": "example",
  "displayName": "Ejemplo",
  "image": "image/home/chewu8/Baixades/elden-ring-rennala-boss-npc-runebearer-fight-scene-2805199805.jpg"
  ...
}
```

- El código ya maneja SVG y formatos raster (jpg/png). Si la ruta es incorrecta o el archivo falta, la web mostrará `images/placeholder.svg` en su lugar.

- Nota: si abres los archivos directamente con `file://` algunos navegadores bloquean recursos; se recomienda servir la carpeta con un servidor local (ver sección "Cómo ejecutar").

Licencia
- Este repositorio es una plantilla local. El contenido de lore/tips es original y orientativo; evita copiar texto largo protegido por derechos sin permiso.
