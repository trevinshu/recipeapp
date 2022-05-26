import { async } from 'regenerator-runtime/runtime';

const categoryBtn = document.querySelectorAll('#categoryBtn');
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

  item = item[0];
  let html = `
  <h2>${item.strMeal}</h2>
  <p>${item.strInstructions}</p>
  `;

  modalContent.innerHTML = html;

  modalContainer.classList.add('showModal');
  // document.body.style.overflow = 'hidden';
  // document.body.style.height = '100vh';
}

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', closeModal);

function closeModal(e) {
  let modalContainer = document.getElementById('modalContainer');
  modalContainer.classList.remove('showModal');
  document.body.style.overflow = 'auto';
  e.preventDefault();
}
