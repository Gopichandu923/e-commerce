import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private apiService: ApiService) { }

    // Get all products
    getProducts(): Observable<any> {
        return this.apiService.getAllProducts();
    }

    // Get products by category
    getProductsByCategory(categoryName: string): Observable<any> {
        return this.apiService.getProductsByCategory(categoryName);
    }

    // Get product by ID
    getProductById(productId: string): Observable<any> {
        return this.apiService.getProductById(productId);
    }

    // Get all categories
    getCategories(): Observable<any> {
        return this.apiService.getAllCategories();
    }

    // Search products
    searchProducts(keyword: string): Observable<any> {
        return this.apiService.searchProducts(keyword);
    }

    // Submit a review for a product
    submitReview(productId: string, rating: number, comment: string, token: string): Observable<any> {
        return this.apiService.submitReview(productId, rating, comment, token);
    }
}
