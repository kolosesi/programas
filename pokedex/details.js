// details.js - muestra ficha extendida del pokemon usando PokeAPI
const apiBase = 'https://pokeapi.co/api/v2';
const content = document.getElementById('content');

function getQueryParam(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadDetails(){
  const name = getQueryParam('name') || getQueryParam('id');
  if(!name){ content.innerHTML = '<div class="error">No se indicó el Pokémon (parámetro ?name=)</div>'; return; }

  content.innerHTML = '<div class="loading">Cargando...</div>';
  try{
    const [pRes, sRes, eRes] = await Promise.all([
      fetch(`${apiBase}/pokemon/${encodeURIComponent(name)}`),
      fetch(`${apiBase}/pokemon-species/${encodeURIComponent(name)}`),
      fetch(`${apiBase}/pokemon/${encodeURIComponent(name)}/encounters`)
    ]);
    if(!pRes.ok) throw new Error('No se encontró el Pokémon');
    const pData = await pRes.json();
    const sData = sRes.ok ? await sRes.json() : null;
    const eData = eRes.ok ? await eRes.json() : [];

    renderDetails(pData, sData, eData);
  }catch(err){
    console.error(err);
    content.innerHTML = `<div class="error">Error al cargar datos: ${err.message}</div>`;
  }
}

function renderDetails(p, species, encounters){
  const img = p.sprites.other['official-artwork'].front_default || p.sprites.front_default || '';
  const types = p.types.map(t=>t.type.name).join(', ');
  const abilities = p.abilities.map(a=>a.ability.name + (a.is_hidden? ' (hidden)':''));
  const stats = p.stats.map(s=>({name:s.stat.name, value:s.base_stat}));

  const habitat = species && species.habitat ? species.habitat.name : 'Desconocido';
  const flavor = species && species.flavor_text_entries ? (
    species.flavor_text_entries.find(f=>f.language.name==='es') || species.flavor_text_entries.find(f=>f.language.name==='en')
  ) : null;
  const flavorText = flavor ? flavor.flavor_text.replace(/\n|\f/g,' ') : 'No hay descripción disponible.';
  const genera = species && species.genera ? (species.genera.find(g=>g.language.name==='es') || species.genera.find(g=>g.language.name==='en')) : null;
  const genus = genera ? genera.genus : '';

  const encounterList = (encounters && encounters.length>0) ? encounters.map(e=>{
    // cada encounter tiene location_area.name
    return e.location_area ? e.location_area.name : null;
  }).filter(Boolean) : [];

  const html = `
    <div class="head">
      <img src="${img}" alt="${p.name}" />
      <div class="info">
        <h2>#${p.id} ${p.name}</h2>
        <div class="meta">Tipos: ${types}</div>
        <div class="meta">Abilities: ${abilities.join(', ')}</div>
        <div class="meta">Altura: ${p.height}  •  Peso: ${p.weight}</div>
        <div class="meta">Genus: ${genus}</div>
        <div class="meta">Habitat: ${habitat}</div>
      </div>
    </div>

    <div class="section">
      <h3>Descripción</h3>
      <p>${flavorText}</p>
    </div>

    <div class="section">
      <h3>Encuentros / Localizaciones</h3>
      <div class="encounters">${encounterList.length>0 ? '<ul>'+encounterList.map(l=>`<li>${l}</li>`).join('')+'</ul>' : 'No se encontraron localizaciones de encuentro via API.'}</div>
    </div>

    <div class="section">
      <h3>Stats base</h3>
      <div class="stats">${stats.map(s=>`<div class="stat"><span>${s.name}</span><strong>${s.value}</strong></div>`).join('')}</div>
    </div>
  `;

  content.innerHTML = html;
}

window.addEventListener('load', loadDetails);
