import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
    product: any = null;
    relatedProducts: any[] = [];
    quantity: number = 1;
    favoriteProcessing = false;
    loading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const productId = params.get('productId');
            if (productId) {
                this.fetchProductDetails(productId);
            }
        });
    }

    fetchProductDetails(productId: string) {
        this.loading = true;
        this.http.get<any>(`http://localhost:4040/api/product/${productId}`).subscribe({
            next: (data) => {
                this.product = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to load product.';
                this.loading = false;
            }
        });
    }
}