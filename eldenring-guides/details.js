// details.js - carga bosses.json y muestra la ficha extendida del jefe seleccionado
const content = document.getElementById('content');

function getQueryParam(name){ const p = new URLSearchParams(window.location.search); return p.get(name); }

async function loadDetail(){
  const name = getQueryParam('name');
  if(!name){ content.innerHTML = '<div class="error">No se indicó jefe (use ?name=identifier)</div>'; return; }
  content.innerHTML = '<div class="loading">Cargando información del jefe...</div>';
  try{
    const res = await fetch('bosses.json');
    if(!res.ok) throw new Error('No se pudo cargar bosses.json');
    const list = await res.json();
    const boss = list.find(b => b.name === name || b.id === Number(name));
    if(!boss) { content.innerHTML = '<div class="error">Jefe no encontrado.</div>'; return; }
    renderBoss(boss);
  }catch(err){ console.error(err); content.innerHTML = `<div class="error">Error: ${err.message}</div>`; }
}

function renderBoss(b){
  const img = `<img src="${b.image}" alt="${b.displayName}" onerror="this.src='images/placeholder.svg'"/>`;
  const weaknesses = b.weaknesses && b.weaknesses.length ? `<ul>${b.weaknesses.map(w=>`<li>${w}</li>`).join('')}</ul>` : 'Desconocido';
  const timings = b.attack_timings && b.attack_timings.length ? `<ol class="timings">${b.attack_timings.map(t=>`<li>${t}</li>`).join('')}</ol>` : 'No disponible';
  const tips = b.tips && b.tips.length ? `<ul class="tips">${b.tips.map(t=>`<li>${t}</li>`).join('')}</ul>` : '';
  const html = `
    <div class="head">
      ${img}
      <div class="info">
        <h2>${b.displayName}</h2>
        <div class="meta">ID: ${b.id} • ${b.dlc ? 'DLC' : 'Base'}</div>
        <div class="meta">Arma recomendada: ${b.recommended_weapon}</div>
      </div>
    </div>
    <div class="section">
      <h3>Debilidades</h3>
      ${weaknesses}
    </div>
    <div class="section">
      <h3>Timings / patrones de ataque</h3>
      ${timings}
    </div>
    <div class="section">
      <h3>Lore</h3>
      <p>${b.lore}</p>
    </div>
    <div class="section">
      <h3>Consejos y estrategias</h3>
      ${tips}
    </div>
  `;
  content.innerHTML = html;
}

window.addEventListener('load', loadDetail);
