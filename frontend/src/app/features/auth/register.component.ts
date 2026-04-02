import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    imports: [CommonModule, FormsModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    formData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    errors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
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
        const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

        if (!this.formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
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

        if (this.formData.password !== this.formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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

            const { confirmPassword, ...userData } = this.formData;
            this.authService.register(userData).subscribe({
                next: () => {
                    this.successMessage = 'Registration successful!';
                    this.loading = false;
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
                    this.loading = false;
                }
            });
        }
    }
}
