import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading = true;
  error = '';
  subtotal = 0;
  token = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    // In Angular, we subscribe to the AuthService observable or get the synchronous value
    // Assuming synchronous sync for now to match your token implementation
    this.authService.user$.subscribe(user => {
      this.token = user?.token || '';
    });
  }

  ngOnInit() {
    this.fetchCart();
  }

  get headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  fetchCart() {
    this.loading = true;
    this.error = '';

    // Equivalent to your GetCartItems(token)
    this.http.get<any>('http://localhost:4040/api/cart', { headers: this.headers }).subscribe({
      next: (data) => {
        this.cartItems = Array.isArray(data) ? data : data.data || [];
        this.calculateSubtotal(this.cartItems);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error loading cart';
        this.loading = false;
      }
    });
  }

  calculateSubtotal(items: any[]) {
    this.subtotal = items.reduce((sum, item) => sum + item.priceAtAddition * item.quantity, 0);
  }

  updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    this.loading = true;

    // Equivalent to your UpdateCart API
    this.http.put(`http://localhost:4040/api/cart/${itemId}`, { quantity: newQuantity }, { headers: this.headers }).subscribe({
      next: () => {
        this.toastr.success('Cart updated successfully');
        this.fetchCart();
      },
      error: (err) => {
        this.error = 'Error updating item';
        this.loading = false;
      }
    });
  }

  removeItem(itemId: string) {
    this.loading = true;
    // Equivalent to DeleteCartItem API
    this.http.delete(`http://localhost:4040/api/cart/${itemId}`, { headers: this.headers }).subscribe({
      next: () => {
        this.toastr.success('Item removed successfully');
        this.fetchCart();
      },
      error: (err) => {
        this.error = 'Error removing item';
        this.loading = false;
      }
    });
  }

  clearCart() {
    this.loading = true;
    // Equivalent to DeleteCartItems map
    this.http.delete(`http://localhost:4040/api/cart`, { headers: this.headers }).subscribe({
      next: () => {
        this.toastr.success('Cart cleared successfully');
        this.fetchCart();
      },
      error: (err) => {
        this.error = 'Error clearing cart';
        this.loading = false;
      }
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}