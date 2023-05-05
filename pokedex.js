//https://github.com/fanzeyi/pokemon.json/tree/master/images
//pokeapi.co


// Crea una funzione asincrona per effettuare la richiesta all'API PokeAPI
async function fetchPokemonTypes() {

    const response = await fetch('https://pokeapi.co/api/v2/type/');
    const data = await response.json(); //(oggetto contenente array di promise) Converte la risposta in un oggetto JSON  
    const types = data.results; //(array di oggetti con campo url) l'array di oggetti dei tipi di Pokémon dalla risposta dell'API
    const pokemonTypes = []; // Crea un nuovo array vuoto per contenere gli oggetti dei tipi di Pokémon
  
    // Usa un ciclo for-await-of per iterare su ogni tipo di Pokémon
    for await (const type of types) {
      // Effettua una richiesta GET per ottenere i dati sul singolo tipo di Pokémon
      const typeResponse = await fetch(type.url);
      const typeData = await typeResponse.json();
  
      // Crea un nuovo oggetto con le informazioni che vuoi conservare
      const pokemonType = {

        name: typeData.name, // il nome del tipo di Pokémon
        weaknesses: typeData.damage_relations.double_damage_from, // le debolezze del tipo di Pokémon
        resistances: typeData.damage_relations.half_damage_from // le resistenze del tipo di Pokémon
      };
  
      pokemonTypes.push(pokemonType); // Aggiungi l'oggetto del tipo di Pokémon al nuovo array
    }
  
    return pokemonTypes; // (sarà comunque restituita una promise contenente l'array, quindi bisognerà
                         // aspettare che sia risolta)
                         // l'array di oggetti dei tipi di Pokémon completo
}


fetch('./all_pokedati.json')
.then(function(response) {
    return response.json();
})
.then(function(json) {
    pokeDati = json;
    main(pokeDati);
})
.catch(function(err) {
    console.log('fetch problem: ' + err.message);
});


async function main(pokeDati) {
    
    const TypesInfo = await fetchPokemonTypes();
    let pokemonArr = pokeDati;
    let pokeCont = document.getElementById(`WhiteCont`);
    let inizio = 0;
    let fine = 20;

    console.log(pokemonArr);

    pokeCont.innerHTML += (
    `<div class = "aumenta">
        <div class = "btn_aumenta"> <h2>Cerca altri</h2> </div>
    </div>`);


    function addCards(pokemonArr, inizio, fine) {
        
        pokemonArr = pokemonArr.slice(inizio,fine);
        console.log(pokemonArr);
        let cont = "";
        let penultimo = pokeCont.lastElementChild.previousElementSibling;

        for (let i = 0; i < 20; i++) {

            let row = (                                 
                `<div class = "cards" id = "${pokemonArr[i].id-1}">
    
                    <div class = "contIMG" id = "${pokemonArr[i].id-1}">
                        <img src="./images/${setIDimg(pokemonArr[i].id)}.png" alt="img_${pokemonArr[i].name.english}" id = "${pokemonArr[i].id-1}">
                    </div>
    
                    <p class = "id" id = "${pokemonArr[i].id-1}">N° ${setIDimg(pokemonArr[i].id)}</p>
                    <p id = "${pokemonArr[i].id-1}">${pokemonArr[i].name.english}</p>
    
                    <div class = "contTYPE ${Ndiv(pokemonArr[i].type)}" id = "${pokemonArr[i].id-1}"> ${DivGen(pokemonArr[i].type)}</div> 
    
                </div>`
            );

            cont += row;
        }

        if(penultimo == null) {

            pokeCont.insertAdjacentHTML("afterbegin", cont);
        } else {
            penultimo.insertAdjacentHTML('afterend', cont);
        }
    
    }

    addCards(pokemonArr, 0, 20);

    document.querySelector(".btn_aumenta").addEventListener("click",() => {

        inizio += 20;
        fine += 20;

        addCards(pokemonArr, inizio, fine);
    });
    
    let important = document.querySelector("#important");


    pokeCont.addEventListener("click", addUnderCards, false);
    
    
    function addUnderCards(e) {

        function updateSize() {

            try {

                const finestra = window.innerWidth;
                const disp = document.querySelector(".disp");
                const annidato = document.querySelector(".contPokedexAnnidato");
                const stats = document.querySelector(".stats");
                const viewportWidth = annidato.offsetWidth;

                document.querySelector(".exit").style.width = document.querySelector(".contPokedex").offsetWidth + "px";

                if(finestra > 970) {

                    annidato.style.width = "950px";
                } else {
                    annidato.style.width = "65%";
                }


                if(finestra < 700) {

                    const newWidth = Math.round(((finestra*65)/100)+150);
                    annidato.style.width = newWidth + "px";
                }
            
                if(finestra <= 970 && finestra > 420) {   
                    
                    const newHeight = Math.round(viewportWidth * 3);
                    disp.style.height = newHeight + "px";

                }
                
                if(finestra >970){
                    disp.style.height = "850px";
                }

                if(finestra <= 420) {

                    stats.style.height = Math.round((stats.offsetWidth*75)/100) + 20 + "px"; 

                    const newHeight = Math.round(viewportWidth * 3.8);
                    disp.style.height = newHeight + "px";

                    if(finestra <= 300) {

                        const newHeight = Math.round(viewportWidth * 4.3);
                        disp.style.height = newHeight + "px";
                    }
                } else {
                    stats.style.height = "46%";
                }

            } catch(err) {

                clearInterval(intervallo);
                //console.log("errore in updateSize: " + err.message);
            }
        }

        const intervallo = setInterval(updateSize, 100);

       
        let idItem = e.target.id;
        let debolezze = debolezzeGen(pokemonArr[idItem].type, TypesInfo);
        let doc_underCard = document.querySelector(".underCards");

        if(doc_underCard != null) {
            doc_underCard.remove();
        }

        if(important != null) {
            important.remove();
        }

        let underCard = (
            `<div class="underCards" id = "undCard"> 

                <div class = "exit" id = "ext">
                    <div class = "icon"></div>
                </div>  

                <div class = "contPokedex"> 

                    <div class = "contPokedexAnnidato">

                        <div class = "titlePokedex">
                            <h1>${pokemonArr[idItem].name.english} N° ${setIDimg(pokemonArr[idItem].id)}</h1> 
                        </div>
                        
                        <div class = "disp">

                            <div id = "contDisplay1">

                                <div class = "contIMG">
                                    <img src="./images/${setIDimg(pokemonArr[idItem].id)}.png" alt="img_${pokemonArr[idItem].name.english}"> 
                                </div> 

                                <div class = "stats">
                                    <div class = "titleStats"><h2>Statistics</h2></div>
                                    
                                    <div class = "contColStats">${genereteStats(pokemonArr[idItem])}</div>
                                </div> 

                            </div>

                            <div id = "contDisplay2">

                                <div class = "info">

                                    <div class = "presentation">
                                        <p>
                                            ${pokemonArr[idItem].description}
                                        </p>
                                    </div>

                                    <div class = "description">

                                        <div class = "col col1">

                                            <div class = "campo">

                                                <h2>Altezza</h2>
                                                <p><b>${pokemonArr[idItem].profile.height}</b></p>
                                            </div>

                                            <div class = "campo">

                                                <h2>Peso</h2>
                                                <p><b>${pokemonArr[idItem].profile.weight}</b></p>
                                            </div>

                                            <div class = "campo">

                                                <h2>Sesso</h2>
                                                <p><b>non lo so</b></p>
                                            </div>
                                            
                                        </div>

                                        <div class = "col col2">

                                            <div class = "campo">

                                                <h2>Categoria</h2>
                                                <p><b>${pokemonArr[idItem].species.split(" ")[0]}</b></p>
                                            </div>

                                            <div class = "campo">

                                                <h2>Abilità</h2>
                                                <p><b>${setAbility(pokemonArr[idItem].profile.ability)}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class = "nature">
                                    <h3>Tipo</h3> 
                                    <div class = "und ${Ndiv(pokemonArr[idItem].type)}">
                                        ${DivGen(pokemonArr[idItem].type)}
                                    </div> 

                                    <h3>Debolezze</h3> 
                                    <div class = "und">
                                        ${divDebolezze(debolezze)}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class = "evoluzioni">

                            <h2>Evoluzioni</h2>

                            <div class = "disp_ev">
                                ${divEvoluzioni(pokemonArr, idItem)}
                            </div>
                        </div>

                    </div> 
                </div> 
            </div>`
        );


        document.body.innerHTML += underCard;
        doc_underCard = document.querySelector(".underCards");


        document.querySelectorAll(".type").forEach((el) => {
            el.classList.remove("type");
        });


        let lastChild = document.querySelector(".disp_ev").lastElementChild;
        document.querySelector(".disp_ev").removeChild(lastChild);


        document.querySelector(".icon").addEventListener("click", () => {

            doc_underCard.remove();

            document.body.style.overflowY = "scroll"
            document.body.appendChild(important);
        });


        document.body.style.overflowY = "hidden"
        document.getElementById("undCard").style.overflowY = "scroll";

        document.querySelectorAll(".evol_el").forEach((el) => {

            el.addEventListener("click", addUnderCards);
        });

    }
}

function divEvoluzioni(pokemon, id) {

    let evolution = pokemon[id].evolution;
    let prev = -1;
    let next = -1;
    let count = 1;
    let box_evolutions = [];
    let cont_div = "";

    if(evolution.hasOwnProperty("prev")) {
        prev = evolution.prev[0];
        count++;
    }

    if(evolution.hasOwnProperty("next")) {
        next = evolution.next[0][0];
        count++;
    }

    if (prev != -1) {

        box_evolutions.push(pokemon[prev-1]);

        if (pokemon[prev-1].evolution.hasOwnProperty("prev")) {
            
            box_evolutions.push(pokemon[(pokemon[prev-1].evolution.prev[0])-1]);
        }
        box_evolutions.reverse();
    }

    box_evolutions.push(pokemon[id]);

    if(next != -1) {

        box_evolutions.push(pokemon[next-1]);

        if (pokemon[next-1].evolution.hasOwnProperty("next")) {
            
            box_evolutions.push(pokemon[(pokemon[next-1].evolution.next[0][0])-1]);
        }
    }

    box_evolutions.forEach((el) => {

        cont_div += `<div class = "evol_el" id = "${el.id-1}">

                        <div class = "img_ev ${selected(el.id, id)}" id = "${el.id-1}"> 
                            <img src="./images/${setIDimg(el.id)}.png" id = "${el.id-1}"/>
                        </div>

                        <div class = "title_ev" id = "${el.id-1}">
                            <h3>${el.name.english} N° ${setIDimg(el.id)}</h3>
                        </div>

                        <div class = "types_ev" id = "${el.id-1}">
                            ${DivGen(el.type)}
                        </div>
                    </div>
                    
                    <div class = "arrow">
                        <div class = "pol"></div>
                    </div>`;
    });

    return cont_div;
}

function selected(id_curr, id_sel) {

    if(id_curr-1 == id_sel) {
        return "sel";
    }
    return "";
}

function divDebolezze(weak) {
    
    let div = "";
    weak.forEach((item) => {

        div += `<div class = "weak ${setColorType(item.charAt(0).toUpperCase() + item.slice(1))}" >
                    <b>${item}</b>
                </div>`;
    });
    return div;
}

function debolezzeGen(arr_type, info_type) {

    let N_tipi = info_type.length-3;
    let i = 0;
    let j = 0;
    let k = 0;
    let flag = 0;
    let type1 = [];
    let type2 = [];
    let cont_weak = [];
    let unique = [];

    if(arr_type.length == 1)  {

        while (i < N_tipi && info_type[i].name != arr_type[0].toLowerCase()) {

            i++;
        }

        info_type[i].weaknesses.forEach((item) => {

            cont_weak.push(item.name);
        })

        return cont_weak;
        
    } else {

        for (i = 0, j = 0; i < arr_type.length; i++) {

            j = 0;

            while (j < N_tipi && info_type[j].name != arr_type[i].toLowerCase()) {

                j++;
            }
            if(i == 0) {

                type1[0] = info_type[j].resistances;
                type1[1] = info_type[j].weaknesses;
            }
            if(i == 1) {

                type2[0] = info_type[j].resistances;
                type2[1] = info_type[j].weaknesses;
            }
        }

        for (let i = 0; i < type1[1].length; i++) {

            flag = 0;

            for (let j = 0; j < type2[0].length; j++) {

                
                if (type1[1][i].name == type2[0][j].name) {
                
                    flag = 1;
                }
            }
            if(flag == 0) {

                cont_weak[k] = type1[1][i].name;
                k++;
            }
        }

        for (let i = 0; i < type2[1].length; i++) {

            flag = 0;

            for (let j = 0; j < type1[0].length; j++) {

                if(type2[1][i].name == type1[0][j].name) {

                    flag = 1;
                }
            }
            if(flag == 0) {

                cont_weak[k] = type2[1][i].name;
                k++;
            }
        }

        cont_weak.forEach((item) => {
            if(!unique.includes(item)) {
                unique.push(item);
            }
        });

        return unique;
    }
}

function setAbility(array) {

    for (let i = 0; i < array.length; i++) {

        if(array[i][1] == "true") return array[i][0];
    }

}

function setColorType(type) {

    switch (type) {

        case "Grass":
            return "grass";
        
        case "Poison":
            return "poison";

        case "Fire":
            return "fire";
        
        case "Flying":
            return "flying";
        
        case "Water":
            return "water";
        
        case "Bug":
            return "bug";

        case "Normal":
            return "normal";
        
        case "Electric":
            return "electric";
        
        case "Ground":
            return "ground";
        
        case "Fairy":
            return "fairy";

        case "Fighting":
            return "fighting";
        
        case "Psychic":
            return "psychic";
        
        case "Grass":
            return "grass";
        
        case "Rock":
            return "rock";

        case "Ghost":
            return "ghost";

        case "Ice":
            return "ice";

        case "Steel":
            return "steel";

        case "Dragon":
            return "dragon";
    }

}

function setIDimg(id) {
    if (id.toString().length == 1) {
        return `00${id}`;
    }
    
    if (id.toString().length == 2) {
        return `0${id}`;
    }

    return id;
}

function DivGen(type) {

    if((type.length) == 1) {
        return `<div class = "type ${setColorType(type[0])}"><b>${type[0]}</b></div>`;
    }

    if((type.length) == 2) {
        return `<div class = "type ${setColorType(type[0])}"><b>${type[0]}</b></div> <div class = "type ${setColorType(type[1])}"><b>${type[1]}</b></div>`;
    }
}

function Ndiv(n) {

    if(n.length == 1) return "type1";
    if(n.length == 2) return "type2";
}

function genereteStats(pokemonArr) {

    function set(temp) {

        let row = ``;

        for(let s = 0; s < temp; s++) {
            row += `<div class = "row eneable"></div>`;
        }

        for(temp; temp < 15; temp++) {
            row += `<div class = "row able"></div>`;
        }

        return row;
    }
    
    function tac(c, pokemonArr) {

        let row = ``;
        let temp = 0;

        // questa funzione può essere migliorata inserendo una catena di if che riconosce
        // in quale colonna mi trovo, non mi serve sapere anche in che tacca mi trovo
        // dato che la funzione set stampa in una volta tutte le tacche che mi servono

        for(let r = 0; r < 15; r++) {

            if(c == 0) {

                temp = (225 - pokemonArr.base.HP) / 15;
                temp = temp.toFixed(0);

                row = set(temp);

                row += (
                    `<div class = "tit">     
                        <b>PS</b>    
                    </div> `
                );
            }

            if(c == 1) {
                
                temp = (225 - pokemonArr.base.Attack) / 15;
                temp = temp.toFixed(0);

                row = set(temp);

                row += (
                    `<div class = "tit">     
                        <b>Attack</b>    
                    </div> `
                );
            }

            if(c == 2) {
                
                temp = (225 - pokemonArr.base.Defense) / 15;
                temp = temp.toFixed(0);

                row = set(temp);

                row += (
                    `<div class = "tit">     
                        <b>Defence</b>    
                    </div> `
                );
            }

            if(c == 3) {
                
                temp = (225 - pokemonArr.base["Sp. Attack"]) / 15;
                temp = temp.toFixed(0);

                row = set(temp);

                row += (
                    `<div class = "tit">     
                        <b>Sp. Attack</b>    
                    </div> `
                );
            }

            if(c == 4) {
                
                temp = (225 - pokemonArr.base["Sp. Defense"]) / 15;
                temp = temp.toFixed(0);

                row = set(temp);

                row += (
                    `<div class = "tit">     
                        <b>Sp. Defence</b>    
                    </div> `
                );
            }
            
            if(c == 5) {
                
                temp = (225 - pokemonArr.base.Speed) / 15;
                temp = temp.toFixed(0);

                row = set(temp);

                row += (
                    `<div class = "tit">     
                        <b>Speed</b>    
                    </div> `
                );
            }
        }
        return row;
    }
    
    let cl = ``;

    for(let c = 0; c < 6; c++) {

        if(c == 0) {
            cl += `<div class = "col q">${tac(c, pokemonArr)}</div>`;
            continue;
        }

        if(c == 5) {
            cl += `<div class = "col w">${tac(c, pokemonArr)}</div>`;

            continue;
        }

        cl += `<div class = "col">${tac(c, pokemonArr)}</div>`;
    }
    
    return cl;
}

