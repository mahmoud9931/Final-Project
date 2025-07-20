// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './gaurds/auth';
import { AdminGuard } from './gaurds/admin';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products/products').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login/login').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/auth/signup/signup/signup').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/carts/cart/cart').then((m) => m.CartComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-orders',
    loadComponent: () =>
      import('./components/my-orders/my-orders/my-orders').then(
        (m) => m.MyOrdersComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./components/admin/add-product/add-product/add-product').then(
        (m) => m.AddProductComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/admin/orders/orders/orders').then(
        (m) => m.OrdersComponent
      ),
    canActivate: [AdminGuard],
  },
  { path: '**', redirectTo: '/home' },
];
