import { Component, HostListener, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [CommonModule, FormsModule]
})
export class Navbar implements OnInit {
  @Input() cartCount: number = 0;
  @Input() darkMode: boolean = false;
  @Output() darkModeChange = new EventEmitter<boolean>();

  mobileMenuOpen = false;
  searchValue = '';
  isSearchExpanded = false;
  windowWidth = window.innerWidth;

  @ViewChild('searchInput') searchInputRef!: ElementRef;

  categories = [
    { name: "Men's Clothing", to: "/shop/mens-clothing" },
    { name: "Women's Clothing", to: "/shop/womens-clothing" },
    { name: "Electronics", to: "/shop/electronics" },
    { name: "Jewelery", to: "/shop/jewelery" },
    { name: "Home & Furniture", to: "/shop/furniture" },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.handleResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.handleResize();
  }

  handleResize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 768) {
      this.isSearchExpanded = true;
      this.mobileMenuOpen = false;
    }
  }

  toggleSearch() {
    if (this.windowWidth < 768) {
      this.isSearchExpanded = !this.isSearchExpanded;
      if (this.isSearchExpanded) {
        setTimeout(() => this.searchInputRef?.nativeElement.focus(), 50);
      }
    }
  }

  handleSearchSubmit(event: Event) {
    event.preventDefault();
    if (this.searchValue.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchValue.trim() } });
      this.searchValue = '';
      if (this.windowWidth < 768) {
        this.isSearchExpanded = false;
      }
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.darkModeChange.emit(this.darkMode);
    this.closeMobileMenu();
  }
}