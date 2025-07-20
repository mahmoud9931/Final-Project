import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Product } from '../../../models/product';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './products.html',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedProduct: Product | null = null;
  filterForm: FormGroup;
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      maxPrice: [''],
      availability: [''],
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    this.loadProducts();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.filteredProducts = [...this.products];
        this.extractCategories();
      },
      error: (error) => {
        this.toastService.showError('Failed to load products');
      },
    });
  }

  extractCategories(): void {
    const cats = this.products
      .map((p) => p.category)
      .filter((cat, index, self) => cat && self.indexOf(cat) === index);
    this.categories = cats as string[];
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.filteredProducts = this.products.filter((product) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !product.name.toLowerCase().includes(searchTerm) &&
          !product.description?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      if (filters.availability === 'inStock' && product.stock === 0) {
        return false;
      }
      if (filters.availability === 'outOfStock' && product.stock > 0) {
        return false;
      }

      return true;
    });
  }

  addToCart(product: Product): void {
    if (!this.isLoggedIn) {
      this.toastService.showWarning('Please login to add items to cart');
      return;
    }

    if (product.stock === 0) {
      this.toastService.showWarning('This product is out of stock');
      return;
    }

    this.cartService
      .addToCart({ product: product._id, quantity: 1 })
      .subscribe({
        next: () => {
          this.toastService.showSuccess(`${product.name} added to cart!`);
        },
        error: (error) => {
          this.toastService.showError('Failed to add product to cart');
        },
      });
  }

  showProductDetails(product: Product): void {
    this.selectedProduct = product;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('productModal')
    );
    modal.show();
  }

  editProduct(product: Product): void {
    this.router.navigate(['/add-product'], {
      queryParams: { edit: product._id },
    });
  }

  deleteProduct(product: Product): void {
    this.selectedProduct = product;
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('deleteModal')
    );
    modal.show();
  }

  confirmDelete(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct._id).subscribe({
        next: () => {
          this.toastService.showSuccess('Product deleted successfully');
          this.loadProducts();
          const modal = (window as any).bootstrap.Modal.getInstance(
            document.getElementById('deleteModal')
          );
          modal.hide();
        },
        error: (error) => {
          this.toastService.showError('Failed to delete product');
        },
      });
    }
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }
}
