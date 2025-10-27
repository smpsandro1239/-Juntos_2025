import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
    <div class="container mx-auto px-4 py-8">
      @if (activity(); as act) {
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img [src]="act.imageUrl" [alt]="act.name" class="w-full h-96 object-cover">
          <div class="p-8">
            <div class="flex flex-col sm:flex-row justify-between items-start mb-4">
              <div>
                <h1 class="text-4xl font-extrabold text-gray-900">{{ act.name }}</h1>
                <p class="text-lg text-gray-500 mt-1">{{ act.category }} &middot; {{ act.location.address }}</p>
              </div>
              <div class="text-left sm:text-right mt-4 sm:mt-0">
                <span class="text-3xl font-bold text-teal-600">{{ act.price === 0 ? 'Grátis' : 'R$ ' + act.price }}</span>
                @if (act.rainyDayOk) {
                  <span class="block mt-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Bom para chuva</span>
                }
              </div>
            </div>
            
            <div class="flex items-center mb-6">
              <app-star-rating [rating]="act.rating" />
              <span class="ml-2 text-gray-600">({{ act.rating.toFixed(1) }} de 5 estrelas) de {{ act.reviews.length }} avaliações</span>
            </div>

            <p class="text-gray-700 leading-relaxed mb-8">{{ act.description }}</p>

            <div class="border-t pt-6">
              <h2 class="text-2xl font-bold mb-4">Avaliações</h2>
              @for (review of act.reviews; track review.id) {
                <div class="border-b py-4">
                  <div class="flex items-center mb-2">
                    <strong class="mr-4">{{ review.userName }}</strong>
                    <app-star-rating [rating]="review.rating" />
                  </div>
                  <p class="text-gray-600">{{ review.comment }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ review.date.slice(0, 10) }}</p>
                </div>
              } @empty {
                <p class="text-gray-500">Ainda não há avaliações para esta atividade. Seja o primeiro!</p>
              }
            </div>

            <app-review-form [activityId]="act.id" (reviewSubmit)="onReviewSubmit($event)" />
          </div>
        </div>
      } @else {
        <p class="text-center text-gray-500 text-lg py-16">Atividade não encontrada.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  
  private activityId = +this.route.snapshot.params['id'];
  
  activity: Signal<Activity | undefined> = this.activityService.getActivityById(this.activityId);

  onReviewSubmit(review: Omit<Review, 'id' | 'date'>): void {
    this.activityService.addReview(review);
  }
}
