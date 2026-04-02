import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  favorites: any[] = [];
  loading = true;

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit() {
    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
      this.loading = false;
    });
    // This triggers the fetch
    this.favoritesService.getFavourites();
  }

  handleRemoveFavorite(id: string) {
    this.loading = true; // optional UI blocking
    this.favoritesService.removeFromFavourites(id);
  }
}