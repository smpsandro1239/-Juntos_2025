import { Component, ChangeDetectionStrategy, output, input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h3 class="text-xl font-semibold mb-4">Leave a Review</h3>
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
      <div class="mb-4">
        <label for="userName" class="block text-gray-700 font-bold mb-2">Your Name</label>
        <input type="text" id="userName" formControlName="userName"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        @if (reviewForm.get('userName')?.invalid && reviewForm.get('userName')?.touched) {
          <p class="text-red-500 text-xs italic">Name is required.</p>
        }
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Rating</label>
        <div class="flex items-center">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <span class="cursor-pointer" (click)="setRating(i)">
              <svg class="w-8 h-8" 
                   [class.text-yellow-400]="i <= (reviewForm.get('rating')?.value ?? 0)" 
                   [class.text-gray-300]="i > (reviewForm.get('rating')?.value ?? 0)"
                   fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          }
        </div>
        @if (reviewForm.get('rating')?.invalid && reviewForm.get('rating')?.touched) {
          <p class="text-red-500 text-xs italic">Rating is required.</p>
        }
      </div>
      <div class="mb-4">
        <label for="comment" class="block text-gray-700 font-bold mb-2">Comment</label>
        <textarea id="comment" formControlName="comment" rows="4"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        @if (reviewForm.get('comment')?.invalid && reviewForm.get('comment')?.touched) {
          <p class="text-red-500 text-xs italic">Comment is required.</p>
        }
      </div>
      <button type="submit" [disabled]="reviewForm.invalid"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
        Submit Review
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  private fb = inject(FormBuilder);
  
  activityId = input.required<number>();
  reviewSubmitted = output<Omit<Review, 'id' | 'activityId' | 'date'>>();

  reviewForm = this.fb.group({
    userName: ['', Validators.required],
    rating: [null as number | null, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required],
  });

  setRating(rating: number): void {
    this.reviewForm.get('rating')?.setValue(rating);
    this.reviewForm.get('rating')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const formValue = this.reviewForm.value;
    const review = {
      userName: formValue.userName!,
      rating: formValue.rating!,
      comment: formValue.comment!,
    };
    this.reviewSubmitted.emit(review);
    this.reviewForm.reset();
  }
}
