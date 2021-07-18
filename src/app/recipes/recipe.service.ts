import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';

@Injectable()
export class RecipeService {

  recipeChanged = new Subject<Recipe[]>();


  constructor(private shoppingListService: ShoppingListService) {
  }

 // private recipes: Recipe[] = [
 //    new Recipe('A Test Recipe' ,
 //            'This is simply a Test ' ,
 //            'https://cdn.stocksnap.io/img-thumbs/960w/food-recipe_G8QICMKLUV.jpg',
 //                     [
 //                         new Ingredient('Meat' , 1 ),
 //                         new Ingredient('french fires' , 20 )
 //              ]),
 //    new Recipe('A Test Recipe2' ,
 //            'This is simply a Test ' ,
 //            'https://cdn.stocksnap.io/img-thumbs/960w/food-recipe_G8QICMKLUV.jpg',
 //            [
 //                       new Ingredient('tomato' , 10 ),
 //                       new Ingredient('botato' , 20 )
 //                      ])
 //  ];

  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

 getRecipes() {
   return this.recipes.slice() ;
 }

  getRecipe(id: number) {
    return this.recipes[id];
  }

 addIngredientsToShoppingList(ingredients: Ingredient[]) {
   this.shoppingListService.addArrOfIngredients(ingredients);
 }


 addRecipe(recipe: Recipe) {
  this.recipes.push(recipe);
  this.recipeChanged.next(this.recipes.slice());
 }

 updateRecipe (index: number, recipe: Recipe) {
  this.recipes[index] = recipe;
   this.recipeChanged.next(this.recipes.slice());
 }


 deleteRecipe(index: number ) {
   this.recipes.splice(index , 1);
   this.recipeChanged.next(this.recipes.slice());

 }




}
