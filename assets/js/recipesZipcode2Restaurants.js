//define variables to capture zipcodeinput
var zipcodeFormEl = document.querySelector("#zipcode-form");
var nameInputEl = document.querySelector("#zipcodename");
var locationContainerEl = document.querySelector("#locations-container");
var locationSearchTerm = document.querySelector("#location-search-term");

//define variable to display restaurants
var userKeyZomato = "fd85c6b350ae3ae83bcb37148a9f1d69";
var restaurantDisplay = document.querySelector("#restaurant-display");

/* User Input hard variables */
var userCuisine = "Deli";

////////////////
//define variables to capture food input
var userKeySpoon = "01588f18f96d4b1ca168b2b1a61a876b";

var recipeDisplay = document.querySelector("#recipe-display");
var dishNameInputForm = document.querySelector("#food-input-form");
var dishNameInputEl = document.querySelector("#food-input");
//var dishNumberInputEl = document.querySelector("#result-number");
let displayMore = document.querySelector('#display-more > button');

var numberOfRecipeCards = 3;

// neil
var displayRecipeEl = document.querySelector("#display-recipe");


/******************** Section for Display */
//Code to display restuarants on screen
var numberOfCards = 3;
/**
 * Functions to make cards and render
 * Name: makeCardDOM
 * Parameters: restaurant, type - array 
 * Return: DOM element
 */
// Make the card
var makeCardDOM = function(restaurant){
  var cardDOM = document.createElement("div");
  cardDOM.innerHTML = 
  `<div id="card-${restaurant.id}">
    <h3 class="restaurant-name">${restaurant.name}</h3>
    <div class="restaurant-cuisine">${restaurant.cuisines}</div>
    <div class="restaurant-address">Address: ${restaurant.address}</div>
    <div class="restaurant-timings">Schedule: ${restaurant.timings}</div>
    <a class="restaurant-url" href=${restaurant.menu_url}>Website</a>
    <div class="restaurant-tele">Telephone: ${restaurant.phone_numbers}</div>
  </div>`;
  return cardDOM; 
};

// Render 3 cards to DOM
var make3Cards = function (restaurants, index) {
  for (; index < numberOfCards; index++) {
    var rest = restaurants[index].restaurant;
    restaurantDisplay.appendChild(makeCardDOM(rest));
  }
  numberOfCards += 3;
  return index; // return index after making card
};

var displayMoreRestaurants = document.querySelector("#display-more-restaurants");

/**
 * Function to make display more button display the next 3 from localStorage
 */
displayMoreRestaurants.addEventListener("click", function(){
  var localRestaurants = JSON.parse(window.localStorage.getItem("restaurants"));
  var localIndex = parseInt(window.localStorage.getItem('index'));

  localIndex = make3Cards(localRestaurants, localIndex);

  window.localStorage.setItem('index', localIndex);
});
////////////
// neil - takes title, image and link to display on page
function displayRecipes(recipeTitle, recipeImg, recipeLink) {
    //console.log(recipeTitle, recipeImg, recipeLink);
    
    //get needed variables
    var recipeCard = `
    <div class = "card">
    <a href = "${recipeLink}" class = ""><h3 class = "">${recipeTitle}</h3></a>
    </br>
    <a href = "${recipeLink}" class = ""><img src = "${recipeImg}"></a>  
    </div>
    `
    var recipeContainer = document.createElement("div");
    recipeContainer.innerHTML = recipeCard;
    displayRecipeEl.appendChild(recipeContainer);
};

// take repos to get Id of from results
function getID(recipeId) {
    
    fetch(`https://api.spoonacular.com/recipes/`
    + `${recipeId}/information?includeNutrition=false&apiKey=${userKeySpoon}`)
    .then(function(idResponse) {
        if (idResponse.ok) {
            idResponse.json().then(function(recipeInfo) {
                console.log(recipeInfo);
                var recipeTitle = recipeInfo.title;
                var recipeImg = recipeInfo.image;
                var recipeLink = recipeInfo.sourceUrl;
                displayRecipes(recipeTitle, recipeImg, recipeLink);
            })
        }
    })
};

displayMore.addEventListener('click', function(event){
    let recipes = JSON.parse(window.localStorage.getItem('recipes'));
    let index = parseInt(window.localStorage.getItem('index'));
    console.log(index);
    for(; index  < numberOfRecipeCards; index++) {
        let ids = recipes[index];
        console.log(ids);
        getID(ids);
    }
    
});

/************** Section for API fetch */
//start of main API to fetch information
var getzipcodelocations = function (zipcode) {
    //var zipcodeAPIKey = "RLO4J280IDULHFYJ2Q7P"
    var apiUrl = "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/" + zipcode + "?key=RLO4J280IDULHFYJ2Q7P" ;
  
    fetch(apiUrl)
      .then(function (answer) {
        if (answer.ok) {
          answer.json().then(function (data) {
            var ziptolat = data.Latitude
            var ziptolng = data.Longitude
            fetch("https://developers.zomato.com/api/v2.1/cuisines?lat=" + ziptolat + "&lon=" + ziptolng,
            {headers: {
                "user-key": userKeyZomato,
                "content-type": "application/json"
            }})
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Please enter a valid zip code.");
                }
            })
            .then(function(response) {
                console.log("res: 131", response)
                for (var i = 0; i < response.cuisines.length; i++) {
                if (response.cuisines[i].cuisine.cuisine_name == userCuisine) {
                    console.log(response.cuisines[i].cuisine.cuisine_id);
                    var userCuisineID = response.cuisines[i].cuisine.cuisine_id
            
                    fetch("https://developers.zomato.com/api/v2.1/search?entity_type=city&lat=" + ziptolat + "&lon=" + ziptolng + "&cuisines=${userCuisineID}&sort=real_distance",
                    {headers: {
                    "user-key": userKeyZomato,
                    "content-type": "application/json"
                    }})
                    .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        alert("Please enter a valid zip code.");
                    }
                    })
                    .then(function(response) {
                    var index = 0; 
                    var restaurants = response.restaurants;
                    window.localStorage.setItem('restaurants', JSON.stringify(restaurants));
                    
                    index = make3Cards(restaurants, index);
            
                    console.log("index", index)
                    window.localStorage.setItem('index', index);
                    
                    });
                };
                };
            });
          });
        } else {
          alert("Error " + answer.statusText);
        }
      })
      .catch(function (error) {
        //notice this `.catch()` getting chained onto the end of the `.then` method
        alert("Unable to connect to Zipcode API server");
      });
   };
/////////////
// fetch spoonacular for JSON data using user inputs
function getRecipeRepos(dishName) {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=`
    + `${dishName}&number=21&instructionsRequired=true&apiKey=${userKeySpoon}`)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var resultsObject = data.results;
                let ids = [];
                let index = 0; 
                for(let i = 0; i < resultsObject.length; i++) {
                    let id = resultsObject[i].id;
                    ids.push(id);
                }
                console.log(ids)
                for(; index < numberOfRecipeCards; index++){
                    let id = ids[index];
                    getID(id);
                }
                numberOfRecipeCards+=3;
                window.localStorage.setItem('recipes', JSON.stringify(ids));
                window.localStorage.setItem('index', index);
            })
        } else {
            //need to make Modal
            alert("Error: " + response.statusText);
        }
    })
};


/******** This section to read inputs */

//This function exists to read the correct zipcode from the input form
var formSubmitHandler = function (event) {
 event.preventDefault();
 console.log(event);
 var zipcodename = nameInputEl.value.trim();
 console.log(nameInputEl.value);
 
 if (zipcodename) {
   getzipcodelocations(zipcodename);
   nameInputEl.value = "";
 } else {
   alert("Please enter zipcodename");
 }
};

//This event listener listens for the submit button to be clicked 
//after zipcode is entered into input form
zipcodeFormEl = addEventListener("submit", formSubmitHandler);

//This function exists to read the correct food from the input form
function submitHandler(event) {
    event.preventDefault();
    // get value from input element
    var dishInput = dishNameInputEl.value.trim();
    console.log("The user has entered " + dishInput);
    
    if (dishInput) {
        dishNameInputEl.value = "";
        // go to fetch data from spoonacular API
        getRecipeRepos(dishInput);
    } else {
        //need to make Modal
        alert("Please enter a valid dish name.");
    }
};

//This event listener listens for the submit button to be clicked 
//after food name is entered into input form
dishNameInputForm.addEventListener("submit", submitHandler);
