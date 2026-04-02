import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface CartItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        image: string;
        price: number;
    };
    quantity: number;
    priceAtAddition: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    public cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private apiService: ApiService) { }

    // Get cart items
    getCart(token: string): Observable<CartItem[]> {
        return this.apiService.getCartItems(token).pipe(
            tap({
                next: (items) => {
                    console.log('Cart items received:', items);
                    this.cartItemsSubject.next(items || []);
                },
                error: (err) => console.error('Error fetching cart:', err)
            })
        );
    }

    // Add item to cart
    addToCart(productId: string, token: string): Observable<any> {
        return this.apiService.addItemToCart(token, productId);
    }

    // Update cart item quantity
    updateCartItem(itemId: string, quantity: number, token: string): Observable<any> {
        return this.apiService.updateCart(token, itemId, quantity);
    }

    // Remove item from cart
    removeFromCart(itemId: string, token: string): Observable<any> {
        return this.apiService.deleteCartItem(token, itemId);
    }

    // Clear entire cart
    clearCart(token: string): Observable<any> {
        return this.apiService.deleteCartItems(token);
    }

    // Calculate cart count
    getCartCount(items: CartItem[]): number {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Calculate cart subtotal
    getCartSubtotal(items: CartItem[]): number {
        return items.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);
    }
}
