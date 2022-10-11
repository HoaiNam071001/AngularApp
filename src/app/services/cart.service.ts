import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() {}

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      (item) => item.id === theCartItem.id
    );
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  decrementQuantity(cartItem: CartItem): void {
    cartItem.quantity--;
    if (cartItem.quantity === 0) this.remove(cartItem);
  }

  addToCart(theCartItem: CartItem) {
    let existingInCart: boolean = false;
    let existItem: CartItem | undefined;

    existItem = this.cartItems.find((item) => item.id === theCartItem.id);
    existingInCart = existItem != undefined;
    if (!existingInCart) this.cartItems.push(theCartItem);
    else if (existItem) existItem.quantity++;
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;
    for (let cartItem of this.cartItems) {
      totalPrice += cartItem.quantity * cartItem.unitPrice;
      totalQuantity += cartItem.quantity;
    }
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }
}
