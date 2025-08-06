// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Interfaces mirroring backend DTOs ---
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  priceAtAdd: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  cartId: string | null; // Can be null if starting a new cart
  productId: string;
  quantity: number;
}

export interface UpdateCartItemQuantityRequest {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartIdKey = 'ecommerce_cart_id'; // Key for local storage

  private _cart = new BehaviorSubject<Cart | null>(null);
  readonly cart$ = this._cart.asObservable();

  constructor(private http: HttpClient) {
    this.initializeCart();
  }

  private getCartIdFromLocalStorage(): string | null {
    return localStorage.getItem(this.cartIdKey);
  }

  private setCartIdInLocalStorage(id: string): void {
    localStorage.setItem(this.cartIdKey, id);
  }

  private clearCartIdFromLocalStorage(): void {
    localStorage.removeItem(this.cartIdKey);
  }

  initializeCart(): void {
    const cartId = this.getCartIdFromLocalStorage();
    if (cartId) {
      this.fetchCart(cartId);
    } else {
      // If no cart ID, initialize with an empty, "new" cart state
      this._cart.next({
        id: '',
        items: [],
        totalAmount: 0,
        createdAt: '',
        updatedAt: '',
      });
    }
  }

  fetchCart(cartId: string): void {
    this.http
      .get<Cart>(`${this.apiUrl}/${cartId}`)
      .pipe(
        tap((cart) => {
          this._cart.next(cart);
          this.setCartIdInLocalStorage(cart.id);
        }),
        catchError((error) => {
          console.error(
            'Error fetching cart, potentially invalid ID. Clearing local storage.',
            error
          );
          this.clearCartIdFromLocalStorage();
          this._cart.next({
            id: '',
            items: [],
            totalAmount: 0,
            createdAt: '',
            updatedAt: '',
          }); // Reset to empty cart
          return of(null);
        })
      )
      .subscribe();
  }

  addToCart(productId: string, quantity: number): Observable<Cart> {
    const currentCartId = this.getCartIdFromLocalStorage();
    const request: AddToCartRequest = {
      cartId: currentCartId,
      productId,
      quantity,
    };

    return this.http.post<Cart>(this.apiUrl, request).pipe(
      tap((cart) => {
        this.setCartIdInLocalStorage(cart.id); // Ensure the latest cart ID is stored
        this._cart.next(cart);
      }),
      catchError((error) => {
        console.error('Error adding to cart:', error);
        alert(
          'Failed to add product to cart. Please try again or check stock.'
        );
        return of(this._cart.getValue()!); // Return current cart state on error
      })
    );
  }

  updateCartItemQuantity(itemId: string, quantity: number): Observable<Cart> {
    const cartId = this.getCartIdFromLocalStorage();
    if (!cartId) {
      console.error('No cart ID found for update operation.');
      return of(this._cart.getValue()!);
    }
    const request: UpdateCartItemQuantityRequest = { quantity };
    return this.http
      .put<Cart>(`${this.apiUrl}/${cartId}/items/${itemId}`, request)
      .pipe(
        tap((cart) => {
          this._cart.next(cart);
        }),
        catchError((error) => {
          console.error('Error updating cart item quantity:', error);
          alert('Failed to update item quantity.');
          return of(this._cart.getValue()!);
        })
      );
  }

  removeCartItem(itemId: string): Observable<Cart> {
    const cartId = this.getCartIdFromLocalStorage();
    if (!cartId) {
      console.error('No cart ID found for remove operation.');
      return of(this._cart.getValue()!);
    }
    return this.http
      .delete<Cart>(`${this.apiUrl}/${cartId}/items/${itemId}`)
      .pipe(
        tap((cart) => {
          this._cart.next(cart);
        }),
        catchError((error) => {
          console.error('Error removing cart item:', error);
          alert('Failed to remove item from cart.');
          return of(this._cart.getValue()!);
        })
      );
  }

  clearCart(): void {
    const cartId = this.getCartIdFromLocalStorage();
    if (cartId) {
      this.http
        .delete<void>(`${this.apiUrl}/${cartId}`)
        .pipe(
          catchError((error) => {
            console.error('Error clearing cart:', error);
            alert('Failed to clear cart.');
            return of(null); // Continue even if delete fails on server
          })
        )
        .subscribe(() => {
          this.clearCartIdFromLocalStorage();
          this._cart.next({
            id: '',
            items: [],
            totalAmount: 0,
            createdAt: '',
            updatedAt: '',
          });
        });
    } else {
      this._cart.next({
        id: '',
        items: [],
        totalAmount: 0,
        createdAt: '',
        updatedAt: '',
      });
    }
  }
}
