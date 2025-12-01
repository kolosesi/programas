// PokeDex por generación — usa PokeAPI (https://pokeapi.co)
const apiBase = 'https://pokeapi.co/api/v2';
const loadBtn = document.getElementById('loadBtn');
const generationSelect = document.getElementById('generation');
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const searchInput = document.getElementById('search');

let pokemons = []; // array de objetos con datos cargados
let abortController = null;

loadBtn.addEventListener('click', ()=>{ loadGeneration(parseInt(generationSelect.value,10)); });
searchInput.addEventListener('input', ()=>{ renderGrid(filterPokemons(searchInput.value)); });

function setStatus(msg, cls){ status.textContent = msg || ''; status.className = cls ? `status ${cls}` : 'status'; }

async function loadGeneration(gen){
  if(abortController) abortController.abort();
  abortController = new AbortController();
  pokemons = [];
  grid.innerHTML = '';
  setStatus('Cargando lista de especies...', 'loading');

  try{
    // Obtener endpoint de generación
    const genRes = await fetch(`${apiBase}/generation/${gen}`, {signal: abortController.signal});
    if(!genRes.ok) throw new Error('No se pudo cargar la generación');
    const genData = await genRes.json();

    // species es un array de species (name + url)
    const species = genData.pokemon_species.sort((a,b)=> a.name.localeCompare(b.name));
    setStatus(`Cargando ${species.length} pokémon... Ten en cuenta que puede tardar unos segundos.`, 'loading');

    // Mapear los fetch de cada pokemon (usamos endpoint /pokemon/{name})
    const fetches = species.map(s => fetch(`${apiBase}/pokemon/${s.name}`, {signal: abortController.signal}).then(r=>{
      if(!r.ok) throw new Error('fetch pokemon failed: '+s.name);
      return r.json();
    }));

    // Ejecutar en batches para evitar demasiadas peticiones simultáneas
    const BATCH = 12;
    for(let i=0;i<fetches.length;i+=BATCH){
      const batch = fetches.slice(i,i+BATCH);
      const results = await Promise.all(batch);
      results.forEach(p => pokemons.push(normalizePokemon(p)));
      setStatus(`Cargados ${pokemons.length}/${species.length} pokémon...`, 'loading');
    }

    // Ordenar por id
    pokemons.sort((a,b)=>a.id-b.id);
    setStatus(`Cargados ${pokemons.length} pokémon.`, '');
    renderGrid(pokemons);
  }catch(err){
    if(err.name === 'AbortError'){
      setStatus('Carga cancelada.');
    } else {
      console.error(err);
      setStatus('Error cargando datos: '+err.message, 'error');
    }
  } finally {
    abortController = null;
  }
}

function normalizePokemon(data){
  // data es respuesta de /pokemon/{name}
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map(t=>t.type.name),
    abilities: data.abilities.map(a=>({name:a.ability.name, hidden: a.is_hidden})),
    stats: data.stats.map(s=>({name:s.stat.name, value: s.base_stat})),
    image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
  };
}

function renderGrid(list){
  grid.innerHTML = '';
  if(!list || list.length === 0){
    grid.innerHTML = `<div class="loading">No se encontraron Pokémon para mostrar.</div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  list.forEach(p => {
    const card = document.createElement('div'); card.className = 'card';
    const img = document.createElement('img'); img.alt = p.name; img.src = p.image || '';
    // Enlace a la página de detalles
    const link = document.createElement('a');
    link.href = `details.html?name=${encodeURIComponent(p.name)}`;
    link.title = `Ver ficha de ${p.name}`;
    link.appendChild(img);

    const h = document.createElement('h3'); h.textContent = `#${p.id} ${p.name}`;
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `Alt: ${p.height}  •  Peso: ${p.weight}`;
    const types = document.createElement('div'); types.className = 'types'; p.types.forEach(t=>{ const sp = document.createElement('span'); sp.className='type'; sp.textContent = t; types.appendChild(sp); });

    const stats = document.createElement('div'); stats.className = 'stats';
    p.stats.forEach(s=>{ const row = document.createElement('div'); row.className='stat'; row.innerHTML = `<span>${s.name}</span><strong>${s.value}</strong>`; stats.appendChild(row); });

    const abilities = document.createElement('div'); abilities.className='meta'; abilities.textContent = 'Abilities: ' + p.abilities.map(a=>a.name + (a.hidden? ' (hidden)':'')).join(', ');

    card.appendChild(link);
    card.appendChild(h);
    card.appendChild(meta);
    card.appendChild(types);
    card.appendChild(abilities);
    card.appendChild(stats);
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function filterPokemons(query){
  if(!query) return pokemons;
  const q = String(query).trim().toLowerCase();
  return pokemons.filter(p => p.name.includes(q) || String(p.id) === q);
}

// On load: preselect gen 1 and auto-load
window.addEventListener('load', ()=>{ loadGeneration(parseInt(generationSelect.value,10)); });
