
function obtenerColorPorTipo(tipo){ //lo uso para  poner un color de fondo a la tarjeta segun su tipo
    const colores ={
        electric: "#FFEA70",
        fire: "#F7786B",
        water: "#58ABF6",
        grass: "#8BBE8A",
        bug: "#A8B820",
        normal: "#A8A878",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        rock: "#B8A038",
        ice: "#98D8D8",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
        ghost: "#7B62A3"
    };
    return colores[tipo] || "#D3D3D3"
}


async function obtenerpokemon(id) {
    const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json(); 
    return{
        id:data.id,
        name: data.name,
        sprite: data.sprites.other.home.front_default || data.sprites.front_default || data.sprites.other["official-artwork"].front_default,
        tipo:data.types[0].type.name,
        ataque: data.stats[1].base_stat,
        defensa: data.stats[2].base_stat,
    };
}

function idrandom(cantidad, max=1025){
    const idd= [];
    for (let i = 0; i<cantidad; i++){
        idd.push(Math.floor(Math.random()*max)+1)
    }
    return idd;
}

let equipo1 =[];
let equipo2 =[];
let dado1 =[];
let dado2 =[];
let tiro1 = 0;
let tiro2 = 0;

function cargarPokemon(equipo,containerId) {
    const container= document.getElementById(containerId);
    container.innerHTML =equipo.map(pokemon=>
    `<div class="pokemon-card" style="background-color: ${obtenerColorPorTipo(pokemon.tipo)};">
    <div class="pokemon-id">${pokemon.id}</div>
    <img src ="${pokemon.sprite}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
    <p>Tipo: ${pokemon.tipo}</p>
    <p>ataque:${pokemon.ataque}</p>
    <p>defensa:${pokemon.defensa}</p>    
        </div>`
    ).join('');
    }

async function iniciaequipo() {
    const idd = idrandom(6);
    equipo1=[];
    equipo2=[];
    for (let i=0; i<3;i++){
    const poke = await obtenerpokemon(idd[i]);
    equipo1.push(poke)
    }
    for (let i=3; i<6;i++){
    const poke = await obtenerpokemon(idd[i]);
    equipo2.push(poke)
    }
    cargarPokemon(equipo1,"pokemon1")
    cargarPokemon(equipo2,"pokemon2");
    dado1 =[];
    dado2 =[];
    tiro1 =0;
    tiro2 =0;
    document.getElementById("dados-1").innerHTML = "";
    document.getElementById("dados-2").innerHTML = "";
    document.getElementById("tirar-dados-1").disabled = true;
    document.getElementById("tirar-dados-2").disabled = true;
    document.getElementById("iniciar-batalla").disabled = false;
    document.getElementById("resultado").innerHTML = "";
}

async function tiradado(equipo) {
    const d1 = Math.floor(Math.random()*6)+1;//dado1
    const d2 = Math.floor(Math.random()*6)+1;//dado2
    const suma = d1 +d2;
    if (equipo === 1){
        dado1.push(suma);
        tiro1= tiro1 +1;
        document.getElementById("dados-1").innerHTML += `<p> tirada ${tiro1}: ${d1} + ${d2} = <b> ${suma} </b></p>`;
        if (tiro1 >= 3) {
            document.getElementById("tirar-dados-1").disabled= true;
        } 
    } else{
        dado2.push(suma);
        tiro2= tiro2 +1;
        document.getElementById("dados-2").innerHTML += `<p> tirada ${tiro2}: ${d1} + ${d2} = <b> ${suma} </b></p>`;
        if (tiro2 >= 3) {
            document.getElementById("tirar-dados-2").disabled= true;
        } 
    }
    if (tiro1 >= 3 && tiro2 >=3){
        desempate();
    }
}

async function battle() {
    const ataque1 = equipo1.reduce((acc,pokemon) => acc + pokemon.ataque,0);
    const defensa1 = equipo1.reduce((acc,pokemon) => acc + pokemon.defensa,0);
    const ataque2 = equipo2.reduce((acc,pokemon) => acc + pokemon.ataque,0);
    const defensa2 = equipo2.reduce((acc,pokemon) => acc + pokemon.defensa,0);

    let dif1= ataque1-defensa2;
    let dif2= ataque2-defensa1;

    let resultado= `<h2>resultado de la batalla</h2>
    <p><b>Equipo 1</b>  - ataque: ${ataque1}, defensa: ${defensa1}</p>
    <p><b>Equipo 2</b>  - ataque: ${ataque2}, defensa: ${defensa2}</p>
    <p>diferencia del ataque del equipo 1 contra la defensa del equipo 2: <b> ${dif1}</b></p>
    <p>diferencia del ataque del equipo 2 contra la defensa del equipo 1: <b> ${dif2}</b></p>`;

    let ganador ="";
    if (dif1>dif2){
        ganador = "gano equipo 1";
    } else if (dif2>dif1){
        ganador = "gana equipo 2";
    } else {
        document.getElementById("tirar-dados-1").disabled = false;
        document.getElementById("tirar-dados-2").disabled = false;
        document.getElementById("iniciar-batalla").disabled = true;
        resultado +=`<p>empate, tire dados para desempatar</p>`;
        document.getElementById("resultado").innerHTML = resultado;
        return;
    }
    resultado += `<h3 class="ganador">${ganador}</h3>`;
    document.getElementById("resultado").innerHTML= resultado;
}

function desempate(){
        const max1 = Math.max(...dado1);
        const max2 = Math.max(...dado2);
        const idx1= dado1.indexOf(max1)+1;
        const idx2= dado2.indexOf(max2)+1;
        let resultado = document.getElementById("resultado").innerHTML;
        resultado += `
        <p>mayor tirada equipo 1: <b>${max1}</b> (tirada ${idx1})</p>
         <p>mayor tirada equipo 2: <b>${max2}</b> (tirada ${idx2})</p>`;
        let ganador ="";
         if (max1>max2) {
            ganador = "gano equipo 1";
         } else if (max2>max1) {
            ganador = "gano equipo 2"
         } else {
            ganador= "empate"
    }
    resultado += `<h3 class="ganador">${ganador}</h3>`;
    document.getElementById("resultado").innerHTML= resultado;
}

window.addEventListener("DOMContentLoaded", iniciaequipo);
