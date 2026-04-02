import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    formData = {
        email: '',
        password: ''
    };
    errors: { email?: string; password?: string } = {};
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    handleChange(event: any): void {
        const { name, value } = event.target;
        this.formData = { ...this.formData, [name]: value };
        if (this.errors[name as keyof typeof this.errors]) {
            this.errors = { ...this.errors, [name]: '' };
        }
    }

    validateForm(): boolean {
        const newErrors: { email?: string; password?: string } = {};

        if (!this.formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!this.formData.password) {
            newErrors.password = 'Password is required';
        } else if (this.formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        this.errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    handleSubmit(event: Event): void {
        event.preventDefault();
        if (this.validateForm()) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            this.authService.login(this.formData.email, this.formData.password).subscribe({
                next: () => {
                    this.successMessage = 'Login successful!';
                    this.loading = false;
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
                    this.loading = false;
                }
            });
        }
    }
}
