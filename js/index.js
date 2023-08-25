/* DOM element selectors */
const searchBar = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const clearIcon = document.getElementById("clear-icon");
const btnContainer = document.getElementById("btncontainer")
const sortByName = document.getElementById("btn-sortbyname");
const sortByNumber = document.getElementById("btn-sortbynumber");
const cardContainer = document.getElementById("card-container");
let pokemonDataArray = [];
const statNameMapping = { "special-attack": "SP.ATK", "special-defense": "SP.DEF" };
const activeFilters = {};

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
    updateCardDisplay();
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
        
        capitalizedStatName = statNameMapping[statName] || statName.toUpperCase();
        const statInfo = `${capitalizedStatName}: ${statValue}`;
        const statElement = document.createElement("li");
        statElement.className = "stat-element"
        statElement.textContent = statInfo;
        statSheet.appendChild(statElement);
    }
        
    pokemonCard.dataset.type1 = pokeType1;
    pokemonCard.dataset.type2 = pokeType2 || "";
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
    createPokemonCards()
};

function searchPokemon() {
    const input = searchBar;
    const filter = input.value.toLowerCase();
    const cardName = document.getElementsByClassName("pokemon-card");

    for (let i = 0; i < cardName.length; i++) {
        const card = cardName[i];
        const nameElement = card.querySelector(".pokemon-name");
        const name = nameElement.textContent.toLowerCase();

        if (name.includes(filter)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}

function makeButtons(types) {
    for (let i = 0; i < types.length; i++) {
      const button = document.createElement("button");
      button.className = "btn type-btn";
      button.textContent = types[i].charAt(0).toUpperCase() + types[i].slice(1);
      button.value = types[i];
      btnContainer.appendChild(button);
  
      button.addEventListener("click", () => {
        toggleTypeFilter(types[i]);
        updateCardDisplay();
      });
  
      activeFilters[types[i]] = false;
    }
}

function updateCardDisplay() {
    const allPokemonCards = document.querySelectorAll(".pokemon-card");
    allPokemonCards.forEach(card => {
        const type1 = card.dataset.type1;
        const type2 = card.dataset.type2;
    
        if (!anyFilterActive() || activeFilters[type1] || (type2 && activeFilters[type2])) {
        card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
    }

function updateButtonStyles() {
    const typeButtons = document.querySelectorAll(".btn.type-btn");
  
    typeButtons.forEach(button => {
      const typeName = button.value;
      if (activeFilters[typeName]) {
        button.classList.add("active-type-btn");
      } else {
        button.classList.remove("active-type-btn");
      }
    });
  }
  
function toggleTypeFilter(selectedType) {
    activeFilters[selectedType] = !activeFilters[selectedType];
    updateCardDisplay();
    updateButtonStyles();
}
  
function anyFilterActive() {
    return Object.values(activeFilters).some(value => value);
}

sortByNumber.addEventListener("click", (event) => {
    event.preventDefault();
    sortPokemon("id");
    createPokemonCard()
  });
  
  sortByName.addEventListener("click", (event) => {
    event.preventDefault();
    sortPokemon("name");
    createPokemonCard()
  });
  

searchBar.addEventListener("input", () => {
    searchPokemon();
    createPokemonCard();
});

searchBar.addEventListener("keyup", function() {
    if (this.value.length > 0) {
        clearIcon.style.display = "block";
    } else {
        clearIcon.style.display = "none";
    }
});

clearIcon.addEventListener("click" , () => {
    searchBar.value = "";
    clearIcon.style.display = "none";
    searchPokemon();
    createPokemonCard();
})