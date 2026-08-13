import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Category
} from '../../core/models/category.model';

import {
  CategoryService
} from '../../core/services/category';

@Component({
  selector: 'app-categories',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './categories.html',

  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  private categoryService =
    inject(CategoryService);


  // =========================
  // Categories
  // =========================

  categories: Category[] = [];


  // =========================
  // New Category
  // =========================

  newCategory: string = '';


  // =========================
  // Loading
  // =========================

  loading: boolean = false;


  // =========================
  // Error
  // =========================

  errorMessage: string = '';


  // =========================
  // Initialize
  // =========================

  ngOnInit(): void {

    this.loadCategories();

  }


  // =========================
  // Load Categories
  // =========================

  loadCategories(): void {

    this.loading = true;

    this.errorMessage = '';

    this.categoryService
      .getCategories()
      .subscribe({

        next: (data: Category[]) => {

          this.categories = data;

          this.loading = false;

        },

        error: (error: unknown) => {

          console.error(
            'Error loading categories:',
            error
          );

          this.errorMessage =
            'Unable to load categories.';

          this.loading = false;

        }

      });

  }


  // =========================
  // Add Category
  // =========================

  addCategory(): void {

    const categoryName =
      this.newCategory.trim();


    // Validation

    if (!categoryName) {

      this.errorMessage =
        'Please enter a category name.';

      return;

    }


    // Check duplicate

    const alreadyExists =
      this.categories.some(
        (category: Category) =>
          category.name.toLowerCase() ===
          categoryName.toLowerCase()
      );


    if (alreadyExists) {

      this.errorMessage =
        'This category already exists.';

      return;

    }


    // Create object

    const category: Category = {

      id: 0,

      name: categoryName

    };


    this.loading = true;

    this.errorMessage = '';


    // Send to API

    this.categoryService
      .createCategory(category)
      .subscribe({

        next: (createdCategory: Category) => {

          console.log(
            'Category created:',
            createdCategory
          );


          // Clear input

          this.newCategory = '';


          // Reload categories

          this.loadCategories();

        },

        error: (error: unknown) => {

          console.error(
            'Error creating category:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Failed to add category.';

        }

      });

  }


  // =========================
  // Delete Category
  // =========================

  deleteCategory(id: number): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this category?'
      );


    if (!confirmed) {

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.categoryService
      .deleteCategory(id)
      .subscribe({

        next: () => {

          console.log(
            'Category deleted'
          );


          // Reload categories

          this.loadCategories();

        },

        error: (error: unknown) => {

          console.error(
            'Error deleting category:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Failed to delete category.';

        }

      });

  }

}