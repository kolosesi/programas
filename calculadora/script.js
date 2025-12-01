// Calculadora científica simple
let isDegree = false; // false = radianes, true = grados
const display = document.getElementById('display');
const modeBtn = document.getElementById('modeBtn');
modeBtn.addEventListener('click', toggleMode);

function insert(value){
  display.value = (display.value || '') + value;
}
function backspace(){
  display.value = (display.value || '').slice(0,-1);
}
function clearDisplay(){
  display.value = '';
}

function toggleMode(){
  isDegree = !isDegree;
  modeBtn.textContent = isDegree ? 'DEG' : 'RAD';
}

// Wrappers para funciones trigonométricas que respetan el modo grados/radianes
function sin(x){ return isDegree ? Math.sin(x * Math.PI / 180) : Math.sin(x); }
function cos(x){ return isDegree ? Math.cos(x * Math.PI / 180) : Math.cos(x); }
function tan(x){ return isDegree ? Math.tan(x * Math.PI / 180) : Math.tan(x); }
function log(x){ return Math.log10(x); }
function ln(x){ return Math.log(x); }
function sqrt(x){ return Math.sqrt(x); }
function pow(a,b){ return Math.pow(a,b); }

function calculate(){
  if(!display.value) return;
  let expr = display.value;
  // Normalizaciones visuales a operador JS
  expr = expr.replace(/×/g,'*').replace(/÷/g,'/');
  // Potencia con ^ => ** (soporta 2^3) — pero también ofrecemos pow(a,b)
  expr = expr.replace(/\^/g,'**');
  // Reemplazar constantes visuales
  expr = expr.replace(/π/g,'Math.PI').replace(/\be\b/g,'Math.E');

  try{
    // Usamos Function para evaluar en el scope global donde nuestras wrappers están definidas
    const result = Function('return (' + expr + ')')();
    display.value = String(result);
  }catch(e){
    display.value = 'Error';
    console.error('Error al evaluar:', e);
  }
}

// Soporte para tecla Enter y Backspace
document.addEventListener('keydown', (e) =>{
  if(e.key === 'Enter'){
    e.preventDefault(); calculate();
  }else if(e.key === 'Backspace'){
    backspace();
  }
});
