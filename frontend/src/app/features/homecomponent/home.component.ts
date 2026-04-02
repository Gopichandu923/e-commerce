import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  categoriesData = [
    { image: "https://encrypted-tbn0.gstatic.com/images...", name: "men's clothing", title: "Men's Clothing" },
    //... (fill in the exact list) ...
  ];

  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // Create URL encode method for templates
  encodeCategory(name: string): string {
    return encodeURIComponent(name.toLowerCase());
  }
}