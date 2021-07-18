import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';
import {Subscription} from 'rxjs';
import {LoggingService} from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit , OnDestroy {

  ingredients: Ingredient[] ;
  private igChangeSub: Subscription;
  constructor(private shoppingListSerive: ShoppingListService , private loggingService: LoggingService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListSerive.getIngredients();
    this.igChangeSub = this.shoppingListSerive.ingredientsChange.subscribe(
      (ingredients: Ingredient[]) => {this.ingredients = ingredients; }
    );

    this.loggingService.printLog('hellow from ShoppingList compoent ngOnInit');
  }

  onEditItem(index: number) {
    this.shoppingListSerive.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.igChangeSub.unsubscribe();
  }


}
