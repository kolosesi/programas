// Ruleta Rusa - 2 jugadores (versión simple)
const MAX_LIVES = 5;
const players = [
  { name: 'Jugador 1', lives: MAX_LIVES, items: [] },
  { name: 'Jugador 2', lives: MAX_LIVES, items: [] }
];
let current = 0; // índice del jugador actual (0 o 1)
let revealedColor = null; // si la lupa fue usada, aquí guardamos 'roja' o 'azul' hasta el próximo disparo
const logEl = document.getElementById('log');

function randomItem(){
  // Devuelve 'aleta' o 'lupa' al azar
  return Math.random() < 0.5 ? 'aleta' : 'lupa';
}

function initGame(){
  // Inicializar vidas y objetos
  players.forEach(p => { p.lives = MAX_LIVES; p.items = [randomItem(), randomItem()]; });
  current = 0;
  revealedColor = null;
  logEl.innerHTML = '';
  log(`${players[current].name} comienza.`);
  updateUI();
}

function log(msg){
  const line = document.createElement('div');
  line.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
  logEl.prepend(line);
}

function updateUI(){
  // Vidas
  for(let i=0;i<2;i++){
    const livesEl = document.getElementById('lives'+i);
    livesEl.innerHTML = '';
    for(let j=0;j<players[i].lives;j++){
      const h = document.createElement('span'); h.className='heart'; h.textContent='♥'; livesEl.appendChild(h);
    }
    for(let j=players[i].lives;j<MAX_LIVES;j++){
      const h = document.createElement('span'); h.className='heart'; h.style.opacity='0.2'; h.textContent='♥'; livesEl.appendChild(h);
    }
    // Items
    const itemsEl = document.getElementById('items'+i);
    itemsEl.innerHTML = players[i].items.map(it => (it==='aleta' ? 'Aleta' : 'Lupa')).join(' • ');
  }
  // Turno
  document.getElementById('turnTitle').textContent = `Turno: ${players[current].name}`;
  // Acción: mostrar objetos del jugador actual
  const actionItems = document.getElementById('actionItems');
  actionItems.innerHTML = players[current].items.map((it, idx) => `<span data-idx="${idx}">${it==='aleta'? 'Aleta' : 'Lupa'}</span>`).join('');
}

function getSelectedTarget(){
  const radios = document.getElementsByName('target');
  for(const r of radios) if(r.checked) return r.value;
  return 'self';
}

function useAleta(){
  const p = players[current];
  const idx = p.items.indexOf('aleta');
  if(idx === -1){ log('No tienes aleta disponible.'); return; }
  if(p.lives >= MAX_LIVES){ log('Vidas ya al máximo.'); return; }
  p.items.splice(idx,1);
  p.lives = Math.min(MAX_LIVES, p.lives + 1);
  log(`${p.name} usa Aleta y recupera 1 vida (vidas: ${p.lives}).`);
  updateUI();
}

function useLupa(){
  const p = players[current];
  const idx = p.items.indexOf('lupa');
  if(idx === -1){ log('No tienes lupa disponible.'); return; }
  // Revelar la próxima bala (generamos aleatorio ahora y lo guardamos en revealedColor)
  revealedColor = randomBullet();
  p.items.splice(idx,1);
  log(`${p.name} usa Lupa y revela que la próxima bala es: ${revealedColor.toUpperCase()}.`);
  updateUI();
}

function randomBullet(){
  // Suposición: 50% roja, 50% azul. Puedes ajustar probabilidades aquí.
  return Math.random() < 0.5 ? 'roja' : 'azul';
}

function shoot(){
  const shooter = players[current];
  const targetChoice = getSelectedTarget();
  const targetIdx = (targetChoice === 'self') ? current : 1 - current;
  const target = players[targetIdx];

  // Determinar color: si hay revelado usarlo, si no generar
  const color = revealedColor || randomBullet();
  revealedColor = null; // se consume la revelación

  log(`${shooter.name} dispara a ${targetChoice === 'self' ? 'sí mismo' : target.name} -> bala ${color.toUpperCase()}.`);

  if(color === 'roja'){
    target.lives -= 1;
    log(`${target.name} recibe daño y pierde 1 vida (vidas: ${target.lives}).`);
    if(target.lives <= 0){
      log(`${target.name} ha perdido todas sus vidas. ${shooter.name} gana la partida!`);
      alert(`${shooter.name} ha ganado la partida!`);
      return; // partida terminada
    }
    // Regla: después de un disparo con bala roja, el turno pasa al receptor.
    // Excepción solicitada: si el jugador se disparó a sí mismo y sale roja,
    // entonces el turno debe pasarse al oponente (1 - current).
    if(targetIdx === current){
      // El tirador se disparó a sí mismo y recibió daño -> turno al oponente
      current = 1 - current;
    } else {
      // Si disparó al oponente y le dio, el receptor (target) recibe el siguiente turno
      current = targetIdx;
    }
  } else {
    // bala azul -> sin daño
    log('Bala azul: sin daño.');
    if(targetIdx === current){
      // si te disparas a ti mismo y sale azul, conservas el turno (otra acción)
      log(`${shooter.name} se disparó a sí mismo, salió azul y conserva el turno.`);
      // current no cambia
    } else {
      // si disparas al oponente y sale azul, el turno pasa al receptor (el oponente)
      current = targetIdx;
    }
  }
  updateUI();
}

// Bind UI
document.getElementById('useAleta').addEventListener('click', ()=>{ useAleta(); });
document.getElementById('useLupa').addEventListener('click', ()=>{ useLupa(); });
document.getElementById('shootBtn').addEventListener('click', ()=>{ shoot(); });
document.getElementById('resetBtn').addEventListener('click', ()=>{ initGame(); });

// Inicializar al cargar
initGame();
