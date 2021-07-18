import {Directive, HostBinding , HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') openList = false ;
  constructor() { }

  @HostListener('click') clickButton() {
    this.openList = !this.openList;
  }
}


