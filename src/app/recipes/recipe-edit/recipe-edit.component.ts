import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeFrom: FormGroup;
  constructor(private route: ActivatedRoute ,
              private  recipeService: RecipeService ,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
      }
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDes  = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode ) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDes = recipe.description;
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name' : new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount , [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)]
              )
            })
          );
        }
      }
    }
    this.recipeFrom = new FormGroup({
      'name': new FormControl(recipeName , Validators.required),
      'imagePath': new FormControl(recipeImagePath , Validators.required),
      'description': new FormControl(recipeDes , Validators.required),
      'ingredients': recipeIngredients
    });
  }

    getControls() {
    return (<FormArray>this.recipeFrom.get('ingredients')).controls;
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeFrom.value.name,
    //   this.recipeFrom.value.description,
    //   this.recipeFrom.value.imagePath,
    //   this.recipeFrom.value.ingredients,
    // );
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id , this.recipeFrom.value);
    } else {
      this.recipeService.addRecipe(this.recipeFrom.value);
    }
    this.onCancle();

  }

  onAddIngredient() {
    (<FormArray>this.recipeFrom.get('ingredients')).push(new FormGroup({
      'name' : new FormControl(null , Validators.required),
      'amount': new FormControl( null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onCancle() {
    this.router.navigate(['../'] , {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeFrom.get('ingredients')).removeAt(index);
  }

}
