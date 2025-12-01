# Pokédex por Generación (demo)

Este proyecto es una Pokédex simple que carga todos los Pokémon de una generación usando la PokeAPI (https://pokeapi.co) y muestra su imagen oficial y datos básicos.

Archivos
- `index.html` — Interfaz principal.
- `style.css` — Estilos.
- `script.js` — Lógica para cargar la generación y mostrar tarjetas usando la PokeAPI.

Cómo usar
1. Abre `index.html` en tu navegador. (Si tu navegador bloquea peticiones CORS/seguridad al abrir un archivo local, sirve la carpeta con un servidor local:)

```sh
cd /home/chewu8/Desktop/programas/pokedex
python3 -m http.server 8000
# luego abre http://localhost:8000 en el navegador
```

2. Selecciona una generación y pulsa "Cargar generación". La app descargará los datos de PokeAPI y mostrará tarjetas con imagen, tipos, habilidades y stats.

Notas
- Carga: la app realiza muchas peticiones (una por Pokémon) y puede tardar varios segundos según la generación. He implementado cargas por lotes para evitar saturar la API.
- Imágenes: se usan las imágenes oficiales (official-artwork) provistas por la PokeAPI.
- Si hace falta soporte offline, podemos agregar caché/localStorage o descargar un dataset.

Mejoras posibles
- Paginación o carga perezosa (lazy-load) para no renderizar todos a la vez.
- Filtros por tipo, rango de estadísticas o búsqueda avanzada.
- Exportar lista a CSV o añadir comparador de Pokémon.
 - Página de detalle: al hacer clic en la imagen de un Pokémon se abre `details.html?name={name}` con ficha extendida (habitat, flavor text, localizaciones de encuentro, stats).

Licencia
Proyecto demo — usa libremente para aprendizaje. Datos e imágenes son provistos por PokeAPI.
