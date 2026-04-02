import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private favoritesSubject = new BehaviorSubject<any[]>([]);
    public favorites$ = this.favoritesSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) { }

    getFavourites(): void {
        const token = this.authService.getToken();
        if (!token) {
            this.favoritesSubject.next([]);
            return;
        }

        this.apiService.getFavouriteItems(token).subscribe({
            next: (data) => {
                this.favoritesSubject.next(data || []);
            },
            error: () => {
                this.favoritesSubject.next([]);
            }
        });
    }

    addToFavourites(productId: string): Observable<any> {
        const token = this.authService.getToken();
        if (!token) {
            return new Observable(observer => {
                observer.error({ message: 'Not authenticated' });
            });
        }
        return this.apiService.addItemToFavourites(token, productId).pipe(
            tap(() => this.getFavourites())
        );
    }

    removeFromFavourites(productId: string): void {
        const token = this.authService.getToken();
        if (!token) return;

        this.apiService.removeItemFromFavourites(token, productId).subscribe({
            next: () => this.getFavourites(),
            error: () => { }
        });
    }

    isFavorite(productId: string): boolean {
        const favorites = this.favoritesSubject.value;
        return favorites.some(fav => fav.productId?._id === productId || fav.productId === productId);
    }
}
