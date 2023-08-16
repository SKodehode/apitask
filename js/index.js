/* DOM element selectors */
const searchBar = document.getElementById("search");
const sortByName = document.getElementById("btn-sortbyname");
const sortByType = document.getElementById("btn-sortbytype");
const sortByNumber = document.getElementById("btn-sortbyNumber");
const cardContainer = document.getElementById("card-container");
const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

/* https://pokeapi.co/api/v2/pokemon?limit=151&offset=0 */
/* Official artwork https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/(1-151).png */

/* Need to collect name, id, type slot 1 and type slot 2 */

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
        console.log(pokeData)
    })
}



const paragraph = document.createElement("p")
paragraph.textContent = "This is a test"

cardContainer.appendChild(paragraph)

const text = document.createTextNode(" -this is also a test",);

const linkPara = document.querySelector("p");
linkPara.appendChild(text);

console.log(itemsArray)


const myObjectArray = [
    { name: "Bulbasaur", id: 1, officialartwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", type1: "grass", type2: "poison"},
    { name: "Charmander", id: 2, officialartwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png", type1: "Fire", type2: "Dragon"}
];

for (const obj of myObjectArray){

    const pokemonCard = document.createElement("div");
    pokemonCard.id = "pokemon-card";
    cardContainer.appendChild(pokemonCard);
    
    const pokemonImage = document.createElement("img");
    pokemonImage.id = "pokemonImage";
    pokemonImage.src = obj.officialartwork;
    pokemonCard.appendChild(pokemonImage);

    const pokemonNumber = document.createElement("p");
    pokemonNumber.id = "pokemon-number";
    pokemonNumber.textContent = "#" + obj.id;
    pokemonCard.appendChild(pokemonNumber);

    const cardInfo = document.createElement("div");
    cardInfo.id = "card-info";
    pokemonCard.appendChild(cardInfo);

    const pokemonName = document.createElement("h1")
    pokemonName.id = "pokemon-name";
    pokemonName.textContent = obj.name;
    cardInfo.appendChild(pokemonName);

    const pokemonTypeTitle = document.createElement("h3");
    pokemonTypeTitle.id = "type-title";
    pokemonTypeTitle.textContent = "Type:"
    cardInfo.appendChild(pokemonTypeTitle)

    const pokemonType = document.createElement("div");
    pokemonType.id = "pokemon-type-1";
    cardInfo.appendChild(pokemonType);

    const pokemonType1 = document.createElement("p");
    pokemonType1.id = "pokemon-type-1";
    pokemonType1.textContent = obj.type1;
    pokemonType.appendChild(pokemonType1);

    const pokemonType2 = document.createElement("p");
    pokemonType2.id = "pokemon-type-1";
    pokemonType2.textContent = obj.type2;
    pokemonType.appendChild(pokemonType2);
}