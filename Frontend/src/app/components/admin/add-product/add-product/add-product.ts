import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product';
import { ToastService } from '../../../../services/toast';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      category: [''],
      stock: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['edit']) {
        this.isEditMode = true;
        this.productId = params['edit'];
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (response) => {
          this.productForm.patchValue(response.product);
        },
        error: (error) => {
          this.toastService.showError('Failed to load product');
          this.router.navigate(['/products']);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const productData = this.productForm.value;

      if (this.isEditMode && this.productId) {
        this.productService
          .updateProduct(this.productId, productData)
          .subscribe({
            next: (response) => {
              this.toastService.showSuccess('Product updated successfully!');
              this.router.navigate(['/products']);
            },
            error: (error) => {
              this.toastService.showError(
                error.error?.message || 'Failed to update product'
              );
              this.isLoading = false;
            },
          });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: (response) => {
            this.toastService.showSuccess('Product added successfully!');
            this.productForm.reset();
          },
          error: (error) => {
            this.toastService.showError(
              error.error?.message || 'Failed to add product'
            );
          },
          complete: () => {
            this.isLoading = false;
          },
        });
      }
    }
  }
}
