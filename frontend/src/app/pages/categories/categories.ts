import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Category } from '../../core/models/category.model';

import { CategoryService } from '../../core/services/category';

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

  categories: Category[] = [];

  newCategory = '';

  showForm = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (data: Category[]) => {

          this.categories = data;

          console.log(
            'Categories loaded:',
            data
          );
        },

        error: (error: unknown) => {

          console.error(
            'Failed to load categories:',
            error
          );

        }

      });
  }

  openAddForm(): void {

    this.newCategory = '';

    this.showForm = true;
  }

  closeForm(): void {

    this.showForm = false;

    this.newCategory = '';
  }

  addCategory(): void {

    const name =
      this.newCategory.trim();

    if (!name) {

      alert(
        'Please enter a category name.'
      );

      return;
    }

    const category: Category = {

      id: 0,

      name: name

    };

    this.categoryService
      .createCategory(category)
      .subscribe({

        next: (createdCategory: Category) => {

          console.log(
            'Category created:',
            createdCategory
          );

          this.categories.push(
            createdCategory
          );

          this.newCategory = '';

          this.showForm = false;
        },

        error: (error: unknown) => {

          console.error(
            'Failed to create category:',
            error
          );

          alert(
            'Failed to add category.'
          );
        }

      });
  }

  deleteCategory(id: number): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this category?'
      );

    if (!confirmed) {
      return;
    }

    this.categoryService
      .deleteCategory(id)
      .subscribe({

        next: () => {

          this.categories =
            this.categories.filter(
              category =>
                category.id !== id
            );

        },

        error: (error: unknown) => {

          console.error(
            'Failed to delete category:',
            error
          );

          alert(
            'Failed to delete category.'
          );
        }

      });
  }
}