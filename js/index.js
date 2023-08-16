const searchBar = document.getElementById("search")
const sortByName = document.getElementById("btn-sortbyname")
const sortByType = document.getElementById("btn-sortbytype")
const sortByNumber = document.getElementById("btn-sortbyNumber")
const cardContainer = document.getElementsById("card-container")

/* fetch("http://shibe.online/api/shibes?count=100&urls=true&httpsUrls=true")
.then(response => response.json())
.then(data => console.log(data)) */
/* https://pokeapi.co/api/v2/pokemon?limit=151&offset=0 */
/* Official artwork https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/(1-151).png */
/* Need to collect name, id, type slot 1 and type slot 2, height?, weight? */

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