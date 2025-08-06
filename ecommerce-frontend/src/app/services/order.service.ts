// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Interfaces mirroring backend DTOs ---
export interface OrderItem {
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  cartId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private adminApiUrl = `${environment.apiUrl}/admin/orders`;

  constructor(private http: HttpClient) {}

  createOrder(request: CheckoutRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // --- Admin Order Methods (No Security) ---
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.adminApiUrl);
  }

  updateOrderStatus(orderId: string, newStatus: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.adminApiUrl}/${orderId}/status?newStatus=${newStatus}`,
      {}
    );
  }
}
