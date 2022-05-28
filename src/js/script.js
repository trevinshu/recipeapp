import { async } from 'regenerator-runtime/runtime';

const categoryBtn = document.querySelectorAll('#categoryBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const recipeContainer = document.getElementById('recipeContainer');

categoryBtn.forEach((categoryItem) => categoryItem.addEventListener('click', categoryClick));

function categoryClick(e) {
  const categoryName = e.target.innerText.toLowerCase();
  getRecipesByCategory(categoryName);
  e.preventDefault();
}

async function getRecipesByCategory(categoryName) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
  const data = await response.json();
  const meals = data.meals.slice(0, 10);
  let html = '';

  if (meals) {
    meals.forEach((meal) => {
      html += `
      <div class="recipeItem" data-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="" />
        <div class="recipeContent">
          <h2>${meal.strMeal}</h2>
          <button id="viewRecipeBtn" class="viewRecipeBtn" href="#">View Recipe</button>
        </div>
      </div>
      `;
    });
  }
  recipeContainer.innerHTML = html;
}

searchBtn.addEventListener('click', searchBtnClick);

function searchBtnClick(e) {
  e.preventDefault();
  getRecipeBySearchTerm(searchInput.value.toLowerCase());
}
async function getRecipeBySearchTerm(searchTerm) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  const data = await response.json();
  const searchResponse = data.meals.slice(0, 10);
  let html = '';

  if (searchResponse) {
    searchResponse.forEach((meal) => {
      html += `
      <div class="recipeItem" data-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="" />
        <div class="recipeContent">
          <h2>${meal.strMeal}</h2>
          <button id="viewRecipeBtn" class="viewRecipeBtn" href="#">View Recipe</button>
        </div>
      </div>
      `;
    });
  }
  recipeContainer.innerHTML = html;
}

recipeContainer.addEventListener('click', viewRecipe);

async function viewRecipe(e) {
  if (e.target.classList.contains('viewRecipeBtn')) {
    let recipeItem = e.target.parentElement.parentElement;

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeItem.dataset.id}`);
    const data = await response.json();
    const item = data.meals;

    mealRecipeModal(item);
  }
  e.preventDefault();
}

function mealRecipeModal(item) {
  let modalContainer = document.getElementById('modalContainer');
  let modalContent = document.getElementById('modalContent');
  const ingredients = [];
  item = item[0];
  for (let i = 1; i <= 20; i++) {
    if (item[`strIngredient${i}`]) {
      ingredients.push(`${item[`strMeasure${i}`]} - ${item[`strIngredient${i}`]}`);
    } else {
      break;
    }
  }
  console.log(item.strYoutube);
  const instructions = item.strInstructions;
  let html = `
  <h2>${item.strMeal}</h2>
  <p><span>Cuisine: </span>${item.strArea}</p>
  <img src="${item.strMealThumb}"/>
  <h3>Ingredients:</h3>
  <ul>
    ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
  </ul>
  <h3>Directions:</h3>
  <p>${instructions.split('.').join('. <br/> <br/>')}</p>
  <h3>Watch Recipe:</h3>
  <div class="videoContainer">
    <iframe class="recipeVideo" src="https://www.youtube.com/embed/${item.strYoutube.slice(-11)}" allow="fullscreen;"></iframe>
  </div>
  `;

  modalContent.innerHTML = html;

  modalContainer.classList.add('showModal');
  document.body.style.overflow = 'hidden';
}

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', closeModal);

function closeModal(e) {
  let modalContainer = document.getElementById('modalContainer');
  modalContainer.classList.remove('showModal');
  document.body.style.overflow = 'scroll';
  e.preventDefault();
}
