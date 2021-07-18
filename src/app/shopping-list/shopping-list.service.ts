import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';

export class ShoppingListService {

  ingredientsChange = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples' , 5),
    new Ingredient('tomatos' , 10)
  ] ;

  public getIngredients() {
    return this.ingredients.slice();
  }

  public getIngredient(index: number) {
    return this.ingredients[index];
  }

  public deleteIngredient(index: number) {
    this.ingredients.splice(index , 1);
    this.emitNewIngredientAdded();

  }

  public addToIngredients(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.emitNewIngredientAdded();
  }

  public updateIngredient(index: number , newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.emitNewIngredientAdded();
  }


  public addArrOfIngredients(ingredients: Ingredient[]) {
    // @ts-ignore
    this.ingredients.push(...ingredients);
    this.emitNewIngredientAdded();

  }

  emitNewIngredientAdded() {
    this.ingredientsChange.next(this.ingredients.slice());
  }


}
