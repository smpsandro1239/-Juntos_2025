import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Review } from '../../models/review.model';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule, L10nPipe],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md border">
      <h3 class="text-xl font-bold mb-4">{{ 'leaveReviewTitle' | l10n }}</h3>
      <form #form="ngForm" (ngSubmit)="submitReview(form)">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">{{ 'rating' | l10n }}</label>
          <div class="flex space-x-1">
            @for (i of [5, 4, 3, 2, 1]; track i) {
              <button
                type="button"
                (click)="rating.set(i)"
                (mouseover)="hoverRating.set(i)"
                (mouseleave)="hoverRating.set(0)"
                class="text-3xl transition-colors"
                [class.text-yellow-400]="(hoverRating() || rating()) >= i"
                [class.text-gray-300]="(hoverRating() || rating()) < i"
              >
                ★
              </button>
            }
          </div>
          <input type="hidden" name="rating" [ngModel]="rating()">
        </div>
        <div class="mb-4">
          <label for="comment" class="block text-gray-700 font-medium mb-2">{{ 'comment' | l10n }}</label>
          <textarea id="comment" name="comment" required ngModel class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" rows="4"></textarea>
        </div>
        <button type="submit" [disabled]="form.invalid || rating() === 0" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400 transition-colors">{{ 'submitReview' | l10n }}</button>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  activityId = input.required<number>();
  reviewSubmitted = output<Review>();
  
  private authService = inject(AuthService);
  
  rating = signal(0);
  hoverRating = signal(0);

  submitReview(form: NgForm): void {
    const user = this.authService.currentUser();
    if (!user || form.invalid) return;

    const newReview: Review = {
      id: Date.now(),
      activityId: this.activityId(),
      userName: user.name,
      rating: this.rating(),
      comment: form.value.comment,
      date: new Date().toISOString(),
    };
    
    this.reviewSubmitted.emit(newReview);
    form.resetForm();
    this.rating.set(0);
  }
}
