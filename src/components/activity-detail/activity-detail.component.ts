import { Component, ChangeDetectionStrategy, inject, Signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [RouterLink, StarRatingComponent, ReviewFormComponent],
  template: `
    @if (activity(); as act) {
      <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <a routerLink="/" class="text-blue-500 hover:text-blue-700 mb-4 inline-block">&larr; Back to Discover</a>
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img [src]="act.imageUrl" [alt]="act.name" class="w-full h-64 object-cover">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <h1 class="text-3xl font-bold text-gray-800">{{ act.name }}</h1>
              <span class="text-xl font-semibold text-green-600 mt-2 sm:mt-0">{{ act.price > 0 ? '$' + act.price : 'Free' }}</span>
            </div>
            <div class="flex items-center mb-4">
              <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">{{ act.category }}</span>
              @if (act.rainyDayOk) {
                <span class="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                  Rainy Day OK
                </span>
              }
            </div>
            <p class="text-gray-600 mb-4">{{ act.location.address }}</p>
            <p class="text-gray-700 leading-relaxed mb-6">{{ act.description }}</p>

            <div class="border-t pt-6">
              <h2 class="text-2xl font-semibold mb-4">Reviews ({{ act.reviews.length }})</h2>
              @if (act.rating > 0) {
                <div class="flex items-center mb-4">
                  <app-star-rating [rating]="act.rating" [showRatingValue]="true" />
                </div>
              }
              
              <div class="space-y-4 mb-6">
                @for (review of act.reviews; track review.id) {
                  <div class="border-b pb-4">
                    <div class="flex justify-between items-center">
                      <h4 class="font-semibold">{{ review.userName }}</h4>
                      <app-star-rating [rating]="review.rating" />
                    </div>
                    <p class="text-gray-600 text-sm mb-2">{{ review.date.slice(0, 10) }}</p>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                }
                @if (act.reviews.length === 0) {
                  <p class="text-gray-500">No reviews yet. Be the first to add one!</p>
                }
              </div>
            </div>

            <div class="border-t pt-6">
                <app-review-form [activityId]="act.id" (reviewSubmitted)="onReviewSubmit($event)" />
            </div>

          </div>
        </div>
      </div>
    } @else {
      <p class="text-center text-gray-500 mt-8">Activity not found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  
  private activityId = toSignal(this.route.paramMap.pipe(map(params => params.get('id') ? Number(params.get('id')) : null)));
  
  activity: Signal<Activity | null> = computed(() => {
    const id = this.activityId();
    if (id === null) {
      return null;
    }
    return this.activityService.allActivities().find(a => a.id === id) ?? null;
  });

  onReviewSubmit(review: Omit<Review, 'id' | 'activityId' | 'date'>): void {
      const id = this.activityId();
      if(id !== null) {
          this.activityService.addReview(id, review);
      }
  }
}
