var userKeySpoon = "a4aeaa45f2f5405fa3997ea557ef2ca0";

//console.log(obj.cuisines)

// var dishNameInputEl = document.querySelector("#user-food-input");
//var dishNumberInputEl = document.querySelector("#result-number");
let displayMore = document.querySelector('#display-more > button');

var numberOfRecipeCards = 3;

// neil
var displayRecipeEl = document.querySelector("#recipe-display");

var prevSearch = localStorage.length

// function populateSearch(firstSearch) {
//     console.log("function called");
    
//     // // Get toast DOM Element, get instance, then call dismiss function
//     // var lastRec = document.getElementById("food-input");
//     // lastRec.value = localStorage[0];

//     // var toastElement = document.querySelector('.toast');
//     // var toastInstance = M.Toast.getInstance(toastElement);
//     // toastInstance.dismiss();
    
        
      

//   }

  


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

// displayMore.addEventListener('click', function(event){
//     let recipes = JSON.parse(window.localStorage.getItem('recipes'));
//     let index = parseInt(window.localStorage.getItem('index'));
//     console.log(index);
//     if (index < recipes.length) {
//         for ( i=0; i<3; i++) {     
//             let ids = recipes[index+i];
//             console.log(ids);
//             getID(ids);
//         }
//         index+=3
//         window.localStorage.setItem('index', index)
//     } else {
//         userAlert("There are no more results.");
//     }
// });

// fetch spoonacular for JSON data using user inputs
function getRecipeRepos(dishName) {
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=`
    + `${dishName}&number=9&instructionsRequired=true&apiKey=${userKeySpoon}`)
    .then(function(response) {
        if (response.ok) {
            localStorage.setItem(prevSearch, dishName)
            prevSearch++

            response.json().then(function(data) {
                var resultsObject = data.results;
                let ids = [];
                let index = 0;
                // loop through data object to get ids and put into array
                for(let i = 0; i < resultsObject.length; i++) {
                    let id = resultsObject[i].id;
                    ids.push(id);
                }
                console.log(ids)
                // loop through the array ids to display recipes
                for(; index < numberOfRecipeCards; index++){
                    let id = ids[index];
                    getID(id);
                }
                numberOfRecipeCards+=3;
                window.localStorage.setItem('recipes', JSON.stringify(ids));
                window.localStorage.setItem('index', index);
            })
        } else {
            userAlert("Error: " + response.statusText);
        }
    })
};
//console.log("The user has entered " + obj.cuisines);
getRecipeRepos(obj.cuisines);

// capture user input from submit event
function submitHandler(event) {
    event.preventDefault();
    // get value from input element
    
    if (userCuisineName) {
        dishNameInputEl.value = "";
        // go to fetch data from spoonacular API
        getRecipeRepos(userCuisineName);
    } else {
        userAlert("Please enter a valid dish name.");
    }
    console.log();
};

//dishNameInputForm.addEventListener("submit", submitHandler);
