/* DOM element selectors */
const searchBar = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const clearIcon = document.getElementById("clear-icon");
const btnContainer = document.getElementById("btncontainer")
const sortByName = document.getElementById("btn-sortbyname");
const sortByNumber = document.getElementById("btn-sortbynumber");
const cardContainer = document.getElementById("card-container");

/* A global and empty array used by different functions in this code. This is where the pokeAPI's information is stored after being processed by the asynchronous fetch functions below. */
let pokemonDataArray = [];
/* An object used to abbreviate the names special-attack and special-defense as these names were too long for my liking, and I shortened them to SP.ATK and SP.DEF. */
const statNameMapping = { "special-attack": "SP.ATK", "special-defense": "SP.DEF" };
/* A global object used to contain information related to filtering. For this page I have implemented a system that filters Pokemon by their assigned types. 
    And when a filter button is clicked the corresponding pokemon will be injected into it. Any other pokemon outside of this object will then be hidden. */
const activeFilters = {};

/* Async function used to fetch information from the PokeAPI. Here we convert the API's information from JSON to readable javascript. 
    We use the await keyword so that the fetch function can fulfill it's promise to collect all the information it can from the API. This will also allow the browser to continue reading
    through the code without having to wait for the promise to be fulfilled. As some API information can take time to gather depending on different factors.
    The Async function is wrapped inside an Asynchronous try key which will test the code while it's using it. In case there are any errors there's a catch key which will display an error message in the console along with the error code. */
async function catchPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
        const allpokemon = await response.json();
        /* We have a .map function which calls a different function named fetchPokemonData. */
        const pokemonPromises = allpokemon.results.map(fetchPokemonData);
        /* We fill a variable with the information we gather from the fetchPokemonData function. */
        const dataArray = await Promise.all(pokemonPromises);
        /* Here we use the global array and fill it with the information we've gathered inside the dataArray variable. */
        pokemonDataArray = dataArray;
        /* We use a method to sort the objects in order by their ID number. So that the generated cards will always display 1 to 151 in a chronological order. */
        pokemonDataArray.sort((a, b) => a.id - b.id);
        /* Then we call on the createPokemonCards function to clear the page of any existing cards and then call on a function named 
        createPokemonCard which is different from this call and is responsible for generating pokemon cards using the information we've fetched from the API. */
        createPokemonCards();

        /* Here a new array is created from the pokemon types using the flatmap and map methods. And we've used Set to automatically remove any duplicate type names.
        And then we call on the makeButtons function adding the processed unique types array, which will create a set of buttons that will serve as filter buttons futher below.  */
        const typesArray = pokemonDataArray.flatMap(pokemon => pokemon.types.map(type => type.type.name));
        const uniqueTypes = [...new Set(typesArray)];
        makeButtons(uniqueTypes);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
/* Here we simply call on the function so it automatically begins it's processes when the page is first loaded. */
catchPokemon();


/* This API didn't contain all the necessary information about each pokemon in the original URL. Just their name and another URL leading to their unique page.
    So another asynchronous function was created to fetch the information inside each pokemon's unique URL and create an object array filled with that information. 
    This function is called upon by the catchPokemon function. */
async function fetchPokemonData(pokemon) {
    const url = pokemon.url;
    return fetch(url)
        .then(response => response.json());
}

/* Function that is responsible for clearing the page of any cards and calling upon a function that will create a unique card for each pokemon inside the global pokemonDataArray using a forEach loop. */
function createPokemonCards() {
    cardContainer.textContent = "";
    pokemonDataArray.forEach(pokeData => {
        createPokemonCard(pokeData);
    });
    /* After calling on the createPokemonCard using the object array as parameter it calls for the updateCardDisplay function which will check if there are any active filters. */
    updateCardDisplay();
}

/* CreatePokemonCard function uses the pokeData array as it's parameter. This function is responsible for generating cards for each pokemon. 
    It is also responsible for creating various HTML elements for each information we've chosen to collect and display from the API. */
function createPokemonCard(pokeData) {
    /* Variable that collects a pokemon's name. */
    const pokeName = pokeData.name;
    /* Variable that collects a pokemon's ID. */
    const pokeNumber = pokeData.id;
    /* Variables that collects a pokemon's first type. */
    const pokeType1 = pokeData.types[0].type.name;
    /* Variable that checks to see if a pokemon has a second type, and if it does it collects that information.  */
    const pokeType2 = pokeData.types[1] ? pokeData.types[1].type.name : null;
    /* A variable that collects a pokemon's official artwork. */
    const pokeImage = pokeData.sprites.other["official-artwork"].front_default;
    
    /* The API provided us information where everything was in lowercase. So we created variables that use the .toUpperCase method on the first letter in a pokemon's name it's types. 
        Taking out the first letter using .charAt(0) and using splice() to insert the now uppercase letter back into the property at the front.*/
    const capitalizedPokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
    const capitalizedPokeType1 = pokeType1.charAt(0).toUpperCase() + pokeType1.slice(1);
    const capitalizedPokeType2 = pokeType2 ? pokeType2.charAt(0).toUpperCase() + pokeType2.slice(1) : null;
    
    /* Variable that creates a div that will wrap a pokemon's information. */
    const pokemonCard = document.createElement("div");
    /* Setting a class name. */
    pokemonCard.className = "pokemon-card";
    /* Appending the div to another div named cardContainer. Which will hold all the individual pokemon cards. */
    cardContainer.appendChild(pokemonCard);
    
    /* Variable that creates a img element for the pokemonImage variable that collects the official artwork for a pokemon. */
    const pokemonImage = document.createElement("img");
    /* Setting a class name. */
    pokemonImage.className = "pokemonImage";
    /* Setting the variable's image source as the pokeImage variable that contains the image properties from the API object. */
    pokemonImage.src = pokeImage;
    /* Added a lazy loading property, this will load images when they are necessary. This will prevent the user from experiencing long load times. As images are only loaded when they are needed. */
    pokeImage.loading = "lazy";
    /* Appending the image to the pokemoncard container. */
    pokemonCard.appendChild(pokemonImage);

    /* Variable that creates a paragraph element for a Pokemon's ID property. */
    const pokemonNumber = document.createElement("p");
    /* Setting a class name. */
    pokemonNumber.className = "pokemon-number";
    /* Setting the paragraph's text content as # + the pokeNumber variable which contains a pokemon's id property. */
    pokemonNumber.textContent = "#" + pokeNumber;
    /* Appending it to the pokemonCard container. */
    pokemonCard.appendChild(pokemonNumber);

    /* Variable that creates a div container to wrap a pokemon's information. */
    const cardInfo = document.createElement("div");
    /* Setting a class name. */
    cardInfo.className = "card-info";
    /* Appending it to the pokemonCard container. */
    pokemonCard.appendChild(cardInfo);

    /* Variable that creates a H1 element for displaying the pokemon's name. */
    const pokemonName = document.createElement("h1")
    /* Setting a class name. */
    pokemonName.className = "pokemon-name";
    /* Setting the text content to capitalizedPokeName which contains the processed pokemon name that is now capitalized. */
    pokemonName.textContent = capitalizedPokeName;
    /* Appending it to the cardInformation wrapper. */
    cardInfo.appendChild(pokemonName);

    /* Variable that creates a new div which will wrap and contain a pokemon's different types. */
    const pokemonType = document.createElement("div");
    /* Setting a class name. */
    pokemonType.className = "pokemon-types";
    /* Appending it to the card Information wrapper. */
    cardInfo.appendChild(pokemonType);

    /* Variable that creates a paragraph element which will contain information about a pokemon's first type. */
    const pokemonType1 = document.createElement("p");
    /* Setting a class name. */
    pokemonType1.className = "pokemon-type";
    /* Setting the text content to capitalizedPokeType1 which is the processed type. */
    pokemonType1.textContent = capitalizedPokeType1;
    /* Appending it to the pokemonType wrapper. */
    pokemonType.appendChild(pokemonType1);

    /* If statment that checks if a pokemon has a second type. */
    if (pokeType2) {
        /* Variable that creates a paragraph element for a pokemon's second type, if it has one. */
        const pokemonType2 = document.createElement("p");
        /* Setting a class name. */
        pokemonType2.className = "pokemon-type";
        /* Setting the text content to be capitalizedPokemonType2 which is the processed Type2 property. */
        pokemonType2.textContent = capitalizedPokeType2;
        /* Appending it to the pokemonType wrapper. */
        pokemonType.appendChild(pokemonType2);
    }
     
    /* Variable that creates a unordered list element which will contain six list items which will hold a pokemon's stat information. */
    const statSheet = document.createElement("ul");
    /* Giving it a class name. */
    statSheet.className = "stat-info"
    /* Appending it to the card information wrapper. */
    cardInfo.appendChild(statSheet);
    /* A for loop that goes through each pokemon stat collecting their name and value. */
    for (let i = 0; i < pokeData.stats.length; i++) {
        /* Variable that uses [i] or a index to target the value inside pokeData's stats property. */
        const stat = pokeData.stats[i];
        /* Variable that targets a pokemon's stat name. */
        const statName = stat.stat.name;
        /* Variable that targets a pokemon's stat value. */
        const statValue = stat.base_stat;
        
        /* Variable that stores the capitalized versions of the pokemon stat names. 
            statNameMapping contains the two abbreviated names and we use a OR operator to capitalize the words in the name mapping and if one of the stat names are not present
            it will use it's original name held inside statName. toUpperCase is used to capitalize all the letters in the stat names. */
        capitalizedStatName = statNameMapping[statName] || statName.toUpperCase();
        /* Variable that will hold the capitalized statname and combining it with the stat value. Separating the two using a : */
        const statInfo = `${capitalizedStatName}: ${statValue}`;
        /* Variable that creates a li element for the pokemon stat. */
        const statElement = document.createElement("li");
        /* Setting a class name. */
        statElement.className = "stat-element"
        /* Setting the textcontent to be the statInfo variable containing the capitalized stat name and the stat value. */
        statElement.textContent = statInfo;
        /* Appending the list element to the unordered list element. */
        statSheet.appendChild(statElement);
    }
    
    /* Datasets that we created for each pokemon type. Using a OR operator for the second type in case there are no second type. */
    pokemonCard.dataset.type1 = pokeType1;
    pokemonCard.dataset.type2 = pokeType2 || "";
}

/* Variable that sets the current sort order to ascending. */
let currentSortOrder = "ascending"
/* Variable that contains an funtion named currentSortOrder. It sets currentSortOrder to be ascending and using a shorthand if statment to set the order to ascending or descending.*/
const sortOrder = () => currentSortOrder = currentSortOrder === "ascending" ? "descending" : "ascending";

/* Sort function that is responsible for sorting Pokemon data from an array. The site currently uses this function to sort pokemon by their name or by their ID number. */
function sortPokemon(sortBy, array = pokemonDataArray) {
    /* Function call to set the sorting order. */
    sortOrder();
    const isOrderAscending = currentSortOrder === "ascending" ? 1 : -1;
    array.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return 1 * isOrderAscending;
        else if (a[sortBy] < b[sortBy]) return -1 * isOrderAscending;
        return 0;
    });
    /* A call for the createPokemonCards is made at the end here to clear out any pokemon cards and it renders them again according to the new sort order. */
    createPokemonCards()
};

/* A function for the HTML input element. This will allow it to be used as a search engine. */
function searchPokemon() {
    /* A variable to change the variable's name. */
    const input = searchBar;
    /* A variable that will process the text value inserted into the input field through the toLowerCase method. A measure applied to avoid any potential capitalization errors. */
    const filter = input.value.toLowerCase();
    /* A variable used to get a html element by it's class name. */
    const cardName = document.getElementsByClassName("pokemon-card");

    /* For loop that will go through every pokemon-name inside the pokemon-card container and check if the input field value matches the value of pokemon-names.
        Displaying every card that matches and hidding all the other cards. */
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

/* A function that generates buttons for each unique pokemon type. */
function makeButtons(types) {
    /* It uses a for loop to go through every type and generate a new button for each one it finds in the object array. */
    for (let i = 0; i < types.length; i++) {
      /* Variable that creates a button element. */
      const button = document.createElement("button");
      /* Setting multiple class names for CSS purposes. */
      button.className = "btn type-btn";
      /* A process to capitalize each pokemon type's first letter. */
      button.textContent = types[i].charAt(0).toUpperCase() + types[i].slice(1);
      /* Setting the button's value to the type name. */
      button.value = types[i];
      /* Appending the buttons to a button container. */
      btnContainer.appendChild(button);
  
      /* Adding a click eventlistener to the button. These buttons are used to filter pokemon cards on the page by their types. When clicked it runs two functions. 
      The first one is toggleTypeFilter */
      button.addEventListener("click", () => {
        toggleTypeFilter(types[i]);
        updateCardDisplay();
      });
  
      activeFilters[types[i]] = false;
    }
}

/* UpdateCardDisplay function that updates the card display depending on the activefilter settings. */
function updateCardDisplay() {
    /* A variable that targets all the elements with the class pokemon-cards. */
    const allPokemonCards = document.querySelectorAll(".pokemon-card");
    /* A forEach loop is used to itterate through each card checking their information about their dataset type1 and type2 */
    allPokemonCards.forEach(card => {
        const type1 = card.dataset.type1;
        const type2 = card.dataset.type2;
    
        /* If statement used to check if any filters are active. And if any filters are active it's going to check for cards that have a matching type in their type 1 dataset 
        and it checks if the card has a type2 dataset and it's type name if there are any. Then if a card's types are matching any of the filter ones they will be set to display block(visible)
        if none of the types match the active filter, then the display is set to none and the card is hidden. */
        if (!anyFilterActive() || activeFilters[type1] || (type2 && activeFilters[type2])) {
        card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
    }

/* This function adds a new class to the type button's class list if their filter is active. Giving the button a new background color to simulate a toggle effect.
    When the filter is deactivated the class name is removed from the button and it returns to it's previous state. This is to signal which filter is active for the user.
    Using a forEach loop the function checks to see which type has an active filter and assigns the new class name. 
    And this is done everytime one of the type buttons is clicked. */
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

/* A function that toggles the type filter for each Pokemon. */
function toggleTypeFilter(selectedType) {
    /* It uses a NOT operator to change the state of the active filters. If a filter is active, it makes it inactive. If a filter is inactive, it makes it active. */
    activeFilters[selectedType] = !activeFilters[selectedType];
    /* After it swaps a filter state, it calls the updateCardDisplay to render the cards anew. */
    updateCardDisplay();
    /* And it calls the updateButtonStyles functions to add a new class name to the button's class list. Giving the button a new style to simulate a toggle on or off effect. */
    updateButtonStyles();
}

/* This function is used to check if any filters are active. This was put in place in case there were no filters active. From previous tests when this was not in place, the page was blank after a filter was turned on and then off again. */
function anyFilterActive() {
    return Object.values(activeFilters).some(value => value);
}

/* Click event listener for the sort by name button. 
    On click it will run the sortPokemon function using a "name" parameter to sort them by their name value.
    Then it calls the createPokemonCard function to render the cards anew with the new sorting order. */
sortByName.addEventListener("click", (event) => {
    event.preventDefault();
    sortPokemon("name");
    createPokemonCard()
  });

/* Click event listener for the sort by number button.
    On click it will run the sortPokemon function using a "id" parameter to sort them by their id value.
    Then it calls the createPokemonCard function to render the cards anew with the new sorting order. */
sortByNumber.addEventListener("click", (event) => {
    event.preventDefault();
    sortPokemon("id");
    createPokemonCard()
  });
  
/* Input event listener for the input element. With each input this listener will call the searchPokemon and createPokemonCard functions.
    This dynamically updates the cardlist in-real time as the user is entering letters into the input field. */
searchBar.addEventListener("input", () => {
    searchPokemon();
    createPokemonCard();
});

/* Keyup event listener for the input field. The moment the input value is larger than 0 a span element is turned visible. 
    This span contains a cross icon and acts as a interactive button which a user can use to clear the input field. */
searchBar.addEventListener("keyup", function() {
    if (this.value.length > 0) {
        clearIcon.style.display = "block";
    } else {
        clearIcon.style.display = "none";
    }
});

/* Click event listener for the span. When it is clicked it will empty the input field and call upon the searchPokemon and createPokemonCard functions to render cards anew. */
clearIcon.addEventListener("click" , () => {
    searchBar.value = "";
    clearIcon.style.display = "none";
    searchPokemon();
    createPokemonCard();
})