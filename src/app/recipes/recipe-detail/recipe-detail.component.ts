import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {RecipeService} from '../recipe.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;
  // @ts-ignore
  constructor(private recipeService: RecipeService ,
              private route: ActivatedRoute ,
              private router: Router) { }

  onAddtoShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  ngOnInit() {
    // for the first time
    this.recipe = this.recipeService.getRecipe(+this.route.snapshot.params['id']);
    // for everytime when we are in the same page
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }

  onEditRecipe() {
    // both are correct
    // this.router.navigate(['edit'] , {relativeTo : this.route});
    this.router.navigate(['../', this.id , 'edit' ] , {relativeTo: this.route});
  }


  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'] , {relativeTo: this.route});

  }

}
