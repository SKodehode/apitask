/* DOM element selectors */
const searchBar = document.getElementById("search");
const sortByName = document.getElementById("btn-sortbyname");
const sortByType = document.getElementById("btn-sortbytype");
const sortByNumber = document.getElementById("btn-sortbyNumber");
const cardContainer = document.getElementById("card-container");


function catchPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
        .then(response => response.json())
        .then(function(allpokemon){
            allpokemon.results.forEach(function(pokemon){
                fetchPokemonData(pokemon);
            })
        })
}
catchPokemon()


function fetchPokemonData(pokemon){
    const url = pokemon.url
    fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        const pokeName = pokeData.name;
        const pokeNumber = pokeData.id;
        const pokeType1 = pokeData.types[0].type.name;
        const pokeType2 = pokeData.types[1] ? pokeData.types[1].type.name : null;
        const pokeImage = pokeData.sprites.other["official-artwork"].front_default;
        
        const pokemonCard = document.createElement("div");
        pokemonCard.id = "pokemon-card";
        cardContainer.appendChild(pokemonCard);
        
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
        pokemonName.textContent = pokeName;
        cardInfo.appendChild(pokemonName);
    
        const pokemonTypeTitle = document.createElement("h3");
        pokemonTypeTitle.id = "type-title";
        pokemonTypeTitle.textContent = "Types:"
        cardInfo.appendChild(pokemonTypeTitle)
    
        const pokemonType = document.createElement("div");
        pokemonType.id = "pokemon-type-1";
        cardInfo.appendChild(pokemonType);
    
        const pokemonType1 = document.createElement("p");
        pokemonType1.id = "pokemon-type-1";
        pokemonType1.textContent = pokeType1;
        pokemonType.appendChild(pokemonType1);
    
        if (pokeType2) {
            const pokemonType2 = document.createElement("p");
            pokemonType2.id = "pokemon-type-1";
            pokemonType2.textContent = pokeType2;
            pokemonType.appendChild(pokemonType2);
        }
    })
};