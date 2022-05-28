import { async } from 'regenerator-runtime/runtime';

//Select containers, inputs & buttons
const categoryBtn = document.querySelectorAll('#categoryBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const recipeContainer = document.getElementById('recipeContainer');
const closeBtn = document.getElementById('closeBtn');

//Get event listeners
categoryBtn.forEach((categoryItem) => categoryItem.addEventListener('click', categoryClick));
searchBtn.addEventListener('click', searchBtnClick);
recipeContainer.addEventListener('click', viewRecipe);
closeBtn.addEventListener('click', closeModal);

//Handle Category Click
function categoryClick(e) {
  const categoryName = e.target.innerText.toLowerCase();
  getRecipesByCategory(categoryName);
  e.preventDefault();
}

//Get the data for the selected category
async function getRecipesByCategory(categoryName) {
  try {
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
      recipeContainer.innerHTML = html;
    }
    resultContainer('successMsg', '<i class="fa-solid fa-circle-check"></i>', `Search Results for ${categoryName}`);
  } catch {
    recipeContainer.innerHTML = ``;
    resultContainer('errorMsg', '<i class="fa-solid fa-triangle-exclamation"></i>', 'No Data For The Entered Search Query.');
  }
}

//Handle search button click
function searchBtnClick(e) {
  e.preventDefault();
  getRecipeBySearchTerm(searchInput.value.toLowerCase());
}

//Get the data for the searched recipe
async function getRecipeBySearchTerm(searchTerm) {
  try {
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
      resultContainer('successMsg', '<i class="fa-solid fa-badge-check"></i>', `Search Results for ${searchTerm}`);
      recipeContainer.innerHTML = html;
    }
  } catch {
    recipeContainer.innerHTML = ``;
    resultContainer('errorMsg', '<i class="fa-solid fa-triangle-exclamation"></i>', 'No Data For The Entered Search Query.');
  }
}

//Get the data for the selected recipe
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

//Display Modal Content
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

//Close The Modal
function closeModal(e) {
  let modalContainer = document.getElementById('modalContainer');
  modalContainer.classList.remove('showModal');
  document.body.style.overflow = 'scroll';
  e.preventDefault();
}

//Notification for Search Result
function resultContainer(className, icon, message) {
  let msgContainer = document.getElementById('msgContainer');
  msgContainer.innerHTML = `
    <p class='alert ${className}'>${icon} ${message}</p>
  `;

  setTimeout(function () {
    let alert = document.querySelector('.alert');
    alert.remove();
    msgContainer.innerHTML = '';
  }, 5000);
}

//Footer Content
function footerText() {
  let footer = document.getElementById('footerContainer');
  let date = new Date().getFullYear();

  footer.innerHTML = `
  <p>Designed & Developed by Trevin Shu &copy; ${date}</p>
  `;
}

footerText();
