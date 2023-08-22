/* DOM element selectors */
const searchBar = document.getElementById("search");
const btnContainer = document.getElementById("btncontainer")
const sortByName = document.getElementById("btn-sortbyname");
const sortByType = document.getElementById("btn-sortbytype");
const sortByNumber = document.getElementById("btn-sortbynumber");
const cardContainer = document.getElementById("card-container");
let typeButtons = {};
let pokemonDataArray = [];

async function catchPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
        const allpokemon = await response.json();
        const pokemonPromises = allpokemon.results.map(fetchPokemonData);
        const dataArray = await Promise.all(pokemonPromises);
        pokemonDataArray = dataArray;
        pokemonDataArray.sort((a, b) => a.id - b.id);
        createPokemonCards();

        const typesArray = pokemonDataArray.flatMap(pokemon => pokemon.types.map(type => type.type.name));
        const uniqueTypes = [...new Set(typesArray)];
        makeButtons(uniqueTypes);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

catchPokemon();


async function fetchPokemonData(pokemon) {
    const url = pokemon.url;
    return fetch(url)
        .then(response => response.json());
}

function createPokemonCards() {
    cardContainer.textContent = "";
    pokemonDataArray.forEach(pokeData => {
        createPokemonCard(pokeData);
    });
}

function createPokemonCard(pokeData) {
    const pokeName = pokeData.name;
    const pokeNumber = pokeData.id;
    const pokeType1 = pokeData.types[0].type.name;
    const pokeType2 = pokeData.types[1] ? pokeData.types[1].type.name : null;
    const pokeImage = pokeData.sprites.other["official-artwork"].front_default;
    
    const capitalizedPokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
    const capitalizedPokeType1 = pokeType1.charAt(0).toUpperCase() + pokeType1.slice(1);
    const capitalizedPokeType2 = pokeType2 ? pokeType2.charAt(0).toUpperCase() + pokeType2.slice(1) : null;
    
    const pokemonCard = document.createElement("div");
    pokemonCard.className = "pokemon-card";
    cardContainer.appendChild(pokemonCard);
    
    const pokemonImage = document.createElement("img");
    pokemonImage.className = "pokemonImage";
    pokemonImage.src = pokeImage;
    pokeImage.loading = "lazy";
    pokemonCard.appendChild(pokemonImage);

    const pokemonNumber = document.createElement("p");
    pokemonNumber.className = "pokemon-number";
    pokemonNumber.textContent = "#" + pokeNumber;
    pokemonCard.appendChild(pokemonNumber);

    const cardInfo = document.createElement("div");
    cardInfo.className = "card-info";
    pokemonCard.appendChild(cardInfo);

    const pokemonName = document.createElement("h1")
    pokemonName.className = "pokemon-name";
    pokemonName.textContent = capitalizedPokeName;
    cardInfo.appendChild(pokemonName);

    const pokemonType = document.createElement("div");
    pokemonType.className = "pokemon-types";
    cardInfo.appendChild(pokemonType);

    const pokemonType1 = document.createElement("p");
    pokemonType1.className = "pokemon-type";
    pokemonType1.textContent = capitalizedPokeType1;
    pokemonType.appendChild(pokemonType1);

    if (pokeType2) {
        const pokemonType2 = document.createElement("p");
        pokemonType2.className = "pokemon-type";
        pokemonType2.textContent = capitalizedPokeType2;
        pokemonType.appendChild(pokemonType2);
    }
     
    const statSheet = document.createElement("ul");
    statSheet.className = "stat-info"
    cardInfo.appendChild(statSheet);
        for (let i = 0; i < pokeData.stats.length; i++) {
            const stat = pokeData.stats[i];
            const statName = stat.stat.name;
            const statValue = stat.base_stat;
    
            const statInfo = `${statName}: ${statValue}`;
            const statElement = document.createElement("li");
            statElement.className = "stat-element"
            statElement.textContent = statInfo;
            statSheet.appendChild(statElement);
        }
        
    pokemonCard.dataset.type1 = pokeType1;
    pokemonCard.dataset.type2 = pokeType2 || "";
}

function makeButtons(types) {
    for (let i = 0; i < types.length; i++) {
        const button = document.createElement("button");
        button.className = "btn";
        button.id = "type-btns"
        button.textContent = types[i].charAt(0).toUpperCase() + types[i].slice(1);
        button.value = types[i];
        btnContainer.appendChild(button);
        button.addEventListener("click", () => {
            toggleTypeFilter(types[i]);
        });
    }
}

function toggleTypeFilter(selectedType) {
    const allPokemonCards = document.querySelectorAll(".pokemon-card");
    allPokemonCards.forEach(card => {
        const type1 = card.dataset.type1;
        const type2 = card.dataset.type2;
        
        if (type1 === selectedType || type2 === selectedType) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

let currentSortOrder = "ascending"
const sortOrder = () => currentSortOrder = currentSortOrder === "ascending" ? "descending" : "ascending";

function sortPokemon(sortBy, array = pokemonDataArray) {
    sortOrder();
    const isOrderAscending = currentSortOrder === "ascending" ? 1 : -1;
    array.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return 1 * isOrderAscending;
        else if (a[sortBy] < b[sortBy]) return -1 * isOrderAscending;
        return 0;
    });
};

sortByNumber.addEventListener("click", (event) => {
    event.preventDefault();
    sortPokemon("id");
    createPokemonCards();
});

sortByName.addEventListener("click", (event) => {
    event.preventDefault();
    sortPokemon("name");
    createPokemonCards();
});

console.log(pokemonDataArray)