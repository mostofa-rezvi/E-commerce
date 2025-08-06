import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'order-confirm/:orderId',
    loadComponent: () =>
      import(
        './components/order-confirmation/order-confirmation.component'
      ).then((m) => m.OrderConfirmationComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'admin/products',
    loadComponent: () =>
      import('./components/admin/product-manage/product-manage.component').then(
        (m) => m.ProductManageComponent
      ),
  },
  {
    path: 'admin/approval',
    loadComponent: () =>
      import(
        './components/admin/product-approval/product-approval.component'
      ).then((m) => m.ProductApprovalComponent),
  },
  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./components/admin/order-manage/order-manage.component').then(
        (m) => m.OrderManageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
