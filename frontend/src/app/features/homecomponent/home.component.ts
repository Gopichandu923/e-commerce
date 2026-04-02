import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf and *ngFor
import { RouterModule } from '@angular/router'; // Required for routerLink

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  categoriesData = [
    {
      image: "https://images.unsplash.com/photo-1490533332354-742750763c3a?w=400",
      name: "men's clothing",
      title: "Men's Clothing"
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
      name: "women's clothing",
      title: "Women's Clothing"
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      name: "electronics",
      title: "Electronics"
    },
    {
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
      name: "jewelery",
      title: "Jewelery"
    }
  ];

  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
  }

  encodeCategory(name: string): string {
    return encodeURIComponent(name.toLowerCase());
  }
}