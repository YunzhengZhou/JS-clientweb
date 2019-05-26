// Global app controller
// f3b8a2e33b272b0e170926cfce3154bc
// 77fa96bd23eddaa133ec914071a39aac 
// https://www.food2fork.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likesView';
import List from './models/List';
import { elements, renderLoader, clearLoader} from './views/base';
import Likes from './models/Likes';

// Global state of the app
// - Search Object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {}

// Search Controller
const controlSearch = async () => {
    const query = searchView.getInput(); //TODO
    console.log(query);

    if (query) {
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        try{
            // Search for recipes
            await state.search.getResults();

            // render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch (err) {
            alert( err + 'Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    // prevent default funciton, run customed function instead
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        // get goto value from ====> <button class="btn-inline results__btn--${type}" data-goto=${type...
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
});


// Recipe Controller
const controlRecipe = async () => {
    // Get ID from url
    // window.location is entire url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Hightlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try{
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
        catch(err) {
            alert(err+'Error processing recipe');
        }
    }
};

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe); 
// above here is equal to code below
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */
const controlList = () => {
    // Create a new list if there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } // Handle value event
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// test
state.likes = new Likes();
/**
 *  Like controller
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likeView.toggleLikeBtn(true);

        // Add like to the UI list
        likeView.renderLike(newLike);
    } 
    else {
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likeView.toggleLikeBtn(false);

        // Remove like to the UI list
        likeView.deleteLike(currentID);
    }
    console.log("num of like is :" + state.likes.getNumLikes());
    likeView.toggleLikeMenu(state.likes.getNumLikes());
}


// Handleing recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if (e.target.matches('.btn-increase, .btn-increase *')) { // .btn-increase will match children that under this class
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if (e.target.matches('.recipe__btn-add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } 
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    //console.log(state.recipe);
});

//window.l = new List();