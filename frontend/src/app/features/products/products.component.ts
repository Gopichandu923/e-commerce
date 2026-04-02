import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export const API_BASE_URL = "http://localhost:4040/api";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  allAvailableCategories: string[] = [];
  routeCategory: string | null = null;

  priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "$0 - $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $250", min: 100, max: 250 },
    { label: "$250+", min: 250, max: Infinity },
  ];

  selectedCategory = 'all';
  selectedPriceRange = this.priceRanges[0];
  searchTerm = '';
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.routeCategory = params.get('categoryName');
      this.fetchProducts();
    });

    this.route.queryParams.subscribe(params => {
      if (!this.routeCategory && params['category']) {
        this.selectedCategory = params['category'].toLowerCase();
      }
    });

    this.fetchAllCategories();
  }

  fetchAllCategories() {
    this.http.get<any[]>(`${API_BASE_URL}/product/categories`).subscribe({
      next: (data) => this.allAvailableCategories = ['all', ...data.map(c => c.name.toLowerCase())],
      error: () => this.allAvailableCategories = ['all']
    });
  }

  fetchProducts() {
    this.loading = true;
    let url = `${API_BASE_URL}/product`;
    if (this.routeCategory) {
      url = `${API_BASE_URL}/product/category/${encodeURIComponent(this.routeCategory.toLowerCase())}`;
      this.selectedCategory = this.routeCategory.toLowerCase();
    }

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let temp = [...this.products];

    if (this.selectedCategory !== 'all' && !this.routeCategory) {
      temp = temp.filter(p => p.category.toLowerCase() === this.selectedCategory);
    }
    if (this.selectedPriceRange.label !== 'All Prices') {
      temp = temp.filter(p => p.price >= this.selectedPriceRange.min && p.price <= this.selectedPriceRange.max);
    }
    if (this.searchTerm.trim() !== '') {
      const lower = this.searchTerm.toLowerCase();
      temp = temp.filter(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower));
    }

    this.filteredProducts = temp;
  }

  handleCategoryChange(event: any) {
    const newCat = event.target.value;
    this.selectedCategory = newCat;
    if (newCat === 'all') {
      this.router.navigate(['/shop']);
    } else {
      this.router.navigate(['/shop', newCat]);
    }
  }

  handlePriceChange(event: any) {
    const label = event.target.value;
    this.selectedPriceRange = this.priceRanges.find(pr => pr.label === label) || this.priceRanges[0];
    this.applyFilters();
  }

  handleSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = 'all';
    this.selectedPriceRange = this.priceRanges[0];
    this.searchTerm = '';
    this.router.navigate(['/shop']);
  }
}