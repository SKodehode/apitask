/* DOM element selectors */
const searchBar = document.getElementById("search");
const btnContainer = document.getElementById("btncontainer")
const sortByName = document.getElementById("btn-sortbyname");
const sortByType = document.getElementById("btn-sortbytype");
const sortByNumber = document.getElementById("btn-sortbyNumber");
const cardContainer = document.getElementById("card-container");
const typeButtons = {};

/* A funtion that uses a fetch funtion to fetch information from the provided link, in this case the pokemon api. */
/* The goal is to fetch the first 151 pokemons and have them in an object array. And from there we will extract their information. */
/* Using .then methods the function creates a promise to respond asyncronously once it's promise has been fullfiled. */
/* It will then return the  */
function catchPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
        .then(response => response.json())
        .then(function(allpokemon){
            const pokemonPromises = allpokemon.results.map(fetchPokemonData);
            Promise.all(pokemonPromises).then(pokemonDataArray => {
                pokemonDataArray.sort((a, b) => a.id - b.id);
                cardContainer.textContent = "";
                pokemonDataArray.forEach(pokeData => {
                    createPokemonCard(pokeData);
                });
            });
        });
};

catchPokemon();

async function fetchPokemonData(pokemon) {
    const url = pokemon.url;
    return fetch(url)
        .then(response => response.json());
}

function createPokemonCard(pokeData) {
    const pokeName = pokeData.name;
    const pokeNumber = pokeData.id;
    const pokeType1 = pokeData.types[0].type.name;
    const pokeType2 = pokeData.types[1] ? pokeData.types[1].type.name : null;
    const pokeImage = pokeData.sprites.other["official-artwork"].front_default;
    
    /* Syntax used to capitalize the first letter in the pokemon name and the types. */
    const capitalizedPokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
    const capitalizedPokeType1 = pokeType1.charAt(0).toUpperCase() + pokeType1.slice(1);
    const capitalizedPokeType2 = pokeType2 ? pokeType2.charAt(0).toUpperCase() + pokeType2.slice(1) : null;    
    
    /* These blocks of code all use createElement to create various HTML elements to dynamically create cards for each pokemon. */
    /* These cards are created and filled with the information gathered from the API and placed into their own HTML elements. */
    /* starting off it generates a div to wrap all the pokemon's information. */
    /* The information is separated into various CSS elements and each element is given*/
    const pokemonCard = document.createElement("div");
    pokemonCard.id = "pokemon-card";
    cardContainer.appendChild(pokemonCard);
    
    /* Here we give the card an image  */
    const pokemonImage = document.createElement("img");
    pokemonImage.id = "pokemonImage";
    pokemonImage.src = pokeImage;
    pokeImage.loading = "lazy";
    pokemonCard.appendChild(pokemonImage);

    const pokemonNumber = document.createElement("p");
    pokemonNumber.id = "pokemon-number";
    pokemonNumber.textContent = "#" + pokeNumber;
    pokemonCard.appendChild(pokemonNumber);

    const cardInfo = document.createElement("div");
    cardInfo.id = "card-info";
    pokemonCard.appendChild(cardInfo);

    const pokemonName = document.createElement("h1")
    pokemonName.id = "pokemon-name";
    pokemonName.textContent = capitalizedPokeName;
    cardInfo.appendChild(pokemonName);

    const pokemonTypeTitle = document.createElement("h3");
    pokemonTypeTitle.id = "type-title";
    pokemonTypeTitle.textContent = "Types:"
    cardInfo.appendChild(pokemonTypeTitle)

    const pokemonType = document.createElement("div");
    pokemonType.id = "pokemon-types";
    cardInfo.appendChild(pokemonType);

    const pokemonType1 = document.createElement("p");
    pokemonType1.id = "pokemon-type";
    pokemonType1.textContent = capitalizedPokeType1;
    pokemonType.appendChild(pokemonType1);

    if (pokeType2) {
        const pokemonType2 = document.createElement("p");
        pokemonType2.id = "pokemon-type";
        pokemonType2.textContent = capitalizedPokeType2;
        pokemonType.appendChild(pokemonType2);
    }
     
    const statParagraph = document.createElement("ul");
    statParagraph.id = "stat-info"
    cardInfo.appendChild(statParagraph);
        for (let i = 0; i < pokeData.stats.length; i++) {
            const stat = pokeData.stats[i];
            const statName = stat.stat.name;
            const statValue = stat.base_stat;
    
            const statInfo = `${statName}: ${statValue}`;
            const statElement = document.createElement("li");
            statElement.id = "stat-element"
            statElement.textContent = statInfo;
            statParagraph.appendChild(statElement);
        }

    /* This code was implimented with the help of ChatGPT for the sake of having a element type button sorting funtion. */
    /* With my current knowledge I would not be able to create this so I will not take any credit for it. */
    if (!typeButtons[pokeType1]) {
        const button = document.createElement("button");
        button.className = "btn";
        button.textContent = capitalizedPokeType1;
        button.addEventListener('click', () => {
            filterSelection(pokeType1);
        });
        typeButtons[pokeType1] = button;
        btnContainer.appendChild(button);
    }

    if (pokeType2 && !typeButtons[pokeType2]) {
        const button = document.createElement("button");
        button.className = "btn";
        button.textContent = capitalizedPokeType2;
        button.addEventListener('click', () => {
            filterSelection(pokeType2);
        });
        typeButtons[pokeType2] = button;
        btnContainer.appendChild(button);
    }
}
