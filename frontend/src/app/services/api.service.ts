import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:4040/api';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }

    private getHeaders(token?: string): { headers: HttpHeaders } {
        const headersConfig: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
            headersConfig['Authorization'] = `Bearer ${token}`;
        }
        return { headers: new HttpHeaders(headersConfig) };
    }

    // ==================== USER API ====================

    // Login
    login(data: { email: string; password: string }): Observable<any> {
        return this.http.post(`${API_BASE_URL}/user/login`, data);
    }

    // Register
    register(data: { name: string; email: string; password: string }): Observable<any> {
        return this.http.post(`${API_BASE_URL}/user`, data);
    }

    // ==================== PRODUCT API ====================

    // Get all products
    getAllProducts(): Observable<any> {
        return this.http.get(`${API_BASE_URL}/product`);
    }

    // Get product by ID
    getProductById(id: string): Observable<any> {
        return this.http.get(`${API_BASE_URL}/product/${id}`);
    }

    // Get all categories
    getAllCategories(): Observable<any> {
        return this.http.get(`${API_BASE_URL}/product/categories`);
    }

    // Get products by category
    getProductsByCategory(category: string): Observable<any> {
        return this.http.get(`${API_BASE_URL}/product/category/${category}`);
    }

    // Search products
    searchProducts(keyword: string): Observable<any> {
        return this.http.get(`${API_BASE_URL}/product/search?keyword=${encodeURIComponent(keyword)}`);
    }

    // Submit product review
    submitReview(productId: string, rating: number, comment: string, token: string): Observable<any> {
        return this.http.post(
            `${API_BASE_URL}/product/${productId}/reviews`,
            { rating, comment },
            this.getHeaders(token)
        );
    }

    // ==================== CART API ====================

    // Get all cart items
    getCartItems(token: string): Observable<any> {
        return this.http.get(`${API_BASE_URL}/cart`, this.getHeaders(token));
    }

    // Clear cart
    deleteCartItems(token: string): Observable<any> {
        return this.http.delete(`${API_BASE_URL}/cart`, this.getHeaders(token));
    }

    // Add item to cart
    addItemToCart(token: string, productId: string): Observable<any> {
        return this.http.post(
            `${API_BASE_URL}/cart/add`,
            { productId },
            this.getHeaders(token)
        );
    }

    // Update cart item
    updateCart(token: string, id: string, quantity: number): Observable<any> {
        return this.http.put(
            `${API_BASE_URL}/cart/${id}`,
            { quantity },
            this.getHeaders(token)
        );
    }

    // Remove item from cart
    deleteCartItem(token: string, id: string): Observable<any> {
        return this.http.delete(`${API_BASE_URL}/cart/${id}`, this.getHeaders(token));
    }

    // ==================== FAVOURITES API ====================

    // Get all favourites
    getFavouriteItems(token: string): Observable<any> {
        return this.http.get(`${API_BASE_URL}/favourite`, this.getHeaders(token));
    }

    // Add item to favourites
    addItemToFavourites(token: string, id: string): Observable<any> {
        return this.http.post(
            `${API_BASE_URL}/favourite/${id}`,
            {},
            this.getHeaders(token)
        );
    }

    // Remove item from favourites
    removeItemFromFavourites(token: string, id: string): Observable<any> {
        return this.http.delete(`${API_BASE_URL}/favourite/${id}`, this.getHeaders(token));
    }
}
