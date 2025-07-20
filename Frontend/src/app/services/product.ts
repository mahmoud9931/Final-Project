import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<{ message: string; products: Product[] }> {
    return this.http.get<{ message: string; products: Product[] }>(this.apiUrl);
  }

  getProductById(
    id: string
  ): Observable<{ message: string; product: Product }> {
    return this.http.get<{ message: string; product: Product }>(
      `${this.apiUrl}/${id}`
    );
  }

  addProduct(
    product: ProductRequest
  ): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(
      this.apiUrl,
      product
    );
  }

  updateProduct(
    id: string,
    product: Partial<ProductRequest>
  ): Observable<{ message: string; product: Product }> {
    return this.http.put<{ message: string; product: Product }>(
      `${this.apiUrl}/${id}`,
      product
    );
  }

  deleteProduct(id: string): Observable<{ message: string; product: Product }> {
    return this.http.delete<{ message: string; product: Product }>(
      `${this.apiUrl}/${id}`
    );
  }
}
