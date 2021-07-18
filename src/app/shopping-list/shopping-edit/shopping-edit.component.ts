import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Subscription } from 'rxjs';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit , OnDestroy {
  // @ts-ignore
  @ViewChild('f' , { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedIteamIndex: number;
  editedIteam: Ingredient ;



  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
   this.subscription = this.shoppingListService.startedEditing.subscribe(
     ((index: number) => {
       this.editMode = true ;
       this.editedIteamIndex  = index;
       this.editedIteam = this.shoppingListService.getIngredient(index);
       this.slForm.setValue({
         name: this.editedIteam.name,
         amount: this.editedIteam.amount
       });
     })
   );
  }

  onSubmit(form: NgForm) {
    const value = form.value ;
    const newIngredient = new Ingredient(value.name , value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedIteamIndex , newIngredient);
    } else {
      this.shoppingListService.addToIngredients(newIngredient);
    }
    this.editMode = false ;
    form.reset();
  }


  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedIteamIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
