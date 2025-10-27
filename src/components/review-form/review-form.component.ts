import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="submitReview()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">A sua avaliação</label>
        <div class="flex mt-1">
            @for (star of [1, 2, 3, 4, 5]; track star) {
                <button type="button" (click)="rating = star" (mouseover)="hoverRating = star" (mouseleave)="hoverRating = 0" class="text-3xl" [class.text-yellow-400]="star <= (hoverRating || rating)" [class.text-gray-300]="star > (hoverRating || rating)">★</button>
            }
        </div>
      </div>
      <div>
        <label for="comment" class="block text-sm font-medium text-gray-700">Comentário</label>
        <textarea id="comment" name="comment" rows="3" [(ngModel)]="comment" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"></textarea>
      </div>
      <button type="submit" [disabled]="!rating || !comment" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400">Submeter</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  activityId = input.required<number>();
  
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  
  rating = 0;
  hoverRating = 0;
  comment = '';

  submitReview(): void {
    const user = this.authService.currentUser();
    if (!user || !this.comment || this.rating === 0) {
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      activityId: this.activityId(),
      userName: user.name,
      rating: this.rating,
      comment: this.comment,
      date: new Date().toISOString(),
    };

    this.activityService.addReview(newReview);

    // Reset form
    this.rating = 0;
    this.comment = '';
  }
}
