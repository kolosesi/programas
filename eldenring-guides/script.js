// Script para lista de jefes — carga desde bosses.json y renderiza grid
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const search = document.getElementById('search');
const filterDlc = document.getElementById('filterDlc');
let bosses = [];

async function loadBosses(){
  setStatus('Cargando jefes...');
  try{
    const res = await fetch('bosses.json');
    if(!res.ok) throw new Error('No se pudo cargar bosses.json');
    bosses = await res.json();
    renderGrid(bosses);
    setStatus(`Cargados ${bosses.length} jefes.`);
  }catch(err){
    console.error(err);
    setStatus('Error cargando datos: '+err.message, 'error');
    grid.innerHTML = '<div class="error">No se pudieron cargar jefes. Revisa consoles o el archivo bosses.json</div>';
  }
}

function setStatus(msg, cls){ status.textContent = msg || ''; status.className = cls ? `status ${cls}` : 'status'; }

function renderGrid(list){
  grid.innerHTML = '';
  if(!list || list.length===0){ grid.innerHTML = `<div class="loading">No hay jefes para mostrar.</div>`; return; }
  const frag = document.createDocumentFragment();
  list.forEach(b => {
    const card = document.createElement('div'); card.className = 'card';
  const img = document.createElement('img'); img.src = b.image; img.alt = b.displayName;
  // Si falla la carga (por ejemplo ruta incorrecta), usar placeholder
  img.onerror = () => { img.src = 'images/placeholder.svg'; };
    const link = document.createElement('a'); link.href = `details.html?name=${encodeURIComponent(b.name)}`; link.appendChild(img);
    const h = document.createElement('h3'); h.textContent = b.displayName;
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = b.dlc ? 'DLC' : 'Base';
    const badge = document.createElement('div'); badge.className='badge'; badge.textContent = b.dlc ? 'DLC' : 'Principal';
    card.appendChild(link); card.appendChild(h); card.appendChild(badge); card.appendChild(meta);
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function filterAndRender(){
  let list = bosses.slice();
  const q = search.value.trim().toLowerCase();
  if(filterDlc.checked) list = list.filter(b=>b.dlc===true);
  if(q) list = list.filter(b => b.name.includes(q) || b.displayName.toLowerCase().includes(q));
  renderGrid(list);
}

search.addEventListener('input', filterAndRender);
filterDlc.addEventListener('change', filterAndRender);

window.addEventListener('load', loadBosses);
