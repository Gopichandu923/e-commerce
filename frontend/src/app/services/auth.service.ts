import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<{ token: string; email?: string; name?: string } | null>(this.getUserFromStorage());
    public user$ = this.userSubject.asObservable();

    constructor(private apiService: ApiService) { }

    private getUserFromStorage(): { token: string; email?: string; name?: string } | null {
        const token = localStorage.getItem('token');
        if (token) {
            return { token };
        }
        return null;
    }

    login(email: string, password: string): Observable<any> {
        return this.apiService.login({ email, password }).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    this.userSubject.next({ token: response.token, email: response.email, name: response.name });
                }
            })
        );
    }

    register(userData: { name: string; email: string; password: string }): Observable<any> {
        return this.apiService.register(userData).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    this.userSubject.next({ token: response.token, email: response.email, name: response.name });
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.userSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): { token: string; email?: string; name?: string } | null {
        return this.userSubject.value;
    }
}
