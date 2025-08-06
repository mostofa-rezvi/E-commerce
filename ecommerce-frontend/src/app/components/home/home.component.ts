import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  isLoading: boolean = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getApprovedProducts().subscribe({
      next: (products) => {
        // Take first 3 or random 3 for featured
        this.featuredProducts = products.slice(0, 3);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching featured products:', err);
        this.isLoading = false;
      },
    });
  }
}
