/* fetch("http://shibe.online/api/shibes?count=100&urls=true&httpsUrls=true")
.then(response => response.json())
.then(data => console.log(data)) */

async function fetchImages() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
    const data = await response.json()
    console.log(data)
}

fetchImages()

