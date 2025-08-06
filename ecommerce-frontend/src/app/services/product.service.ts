// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryId: string;
  isApproved: boolean;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
}

// Request DTOs for admin product management
export interface AddProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryId: string;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private adminApiUrl = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) {}

  // --- Public Product Methods ---
  getApprovedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?query=${query}`);
  }

  // --- Admin Product Methods (No Security) ---
  getAllProductsForAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.adminApiUrl}/all`);
  }

  addProduct(product: AddProductRequest): Observable<Product> {
    return this.http.post<Product>(this.adminApiUrl, product);
  }

  updateProduct(
    id: string,
    product: UpdateProductRequest
  ): Observable<Product> {
    return this.http.put<Product>(`${this.adminApiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
  }

  getProductsPendingApproval(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.adminApiUrl}/pending-approval`);
  }

  approveProduct(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.adminApiUrl}/${id}/approve`, {});
  }
}
