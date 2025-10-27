import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Activity, AccessibilityLevel } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { AuthService } from '../../services/auth.service';
import { AddToAlbumModalComponent } from '../add-to-album-modal/add-to-album-modal.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    StarRatingComponent,
    MapViewComponent,
    ReviewFormComponent,
    AddToAlbumModalComponent,
    L10nPipe
  ],
  template: `
    @if (activity()) {
      @let act = activity()!;
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <button routerLink="/" class="text-teal-500 hover:text-teal-700 mb-4">&larr; {{ 'backToActivities' | l10n }}</button>

        <header class="mb-8">
          <h1 class="text-4xl font-extrabold text-gray-800">{{ act.name }}</h1>
          <div class="flex items-center mt-2">
            <app-star-rating [rating]="act.rating" [showRatingValue]="true" />
            <span class="mx-2 text-gray-400">|</span>
            <span class="text-gray-600">{{ act.category }}</span>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2">
            <img [ngSrc]="act.imageUrl" [alt]="act.name" width="800" height="600" class="w-full rounded-lg shadow-md mb-6" priority>

            <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'description' | l10n }}</h2>
                <p class="text-gray-600 leading-relaxed">{{ act.description }}</p>
            </section>
            
            <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'gallery' | l10n }}</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    @for(image of act.galleryImages; track image) {
                        <img [ngSrc]="image" alt="Gallery image for {{ act.name }}" width="300" height="200" class="rounded-md object-cover w-full h-32 cursor-pointer hover:opacity-80 transition-opacity">
                    }
                </div>
            </section>

          </div>
          <aside>
            <div class="bg-gray-50 p-6 rounded-lg border">
              <h3 class="text-xl font-bold mb-4">{{ 'details' | l10n }}</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">💰</span>
                  <span>{{ act.price > 0 ? (act.price | currency:'EUR') : ('free' | l10n) }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-2xl mr-3">♿</span>
                  <span>{{ 'wheelchair' | l10n }}: {{ accessibilityText(act.accessibility.wheelchair) }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-2xl mr-3">👶</span>
                  <span>{{ 'stroller' | l10n }}: {{ accessibilityText(act.accessibility.stroller) }}</span>
                </div>
              </div>
              @if(authService.isLoggedIn()) {
                <button (click)="markVisited(act.id)" [disabled]="isVisited()" class="w-full mt-6 bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                  {{ isVisited() ? ('activityVisited' | l10n) : ('markAsVisited' | l10n) }}
                </button>
                <button (click)="showAddToAlbumModal.set(true)" class="w-full mt-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                  {{ 'addToAlbum' | l10n }}
                </button>
              }
            </div>
            
            <div class="mt-6">
                <h3 class="text-xl font-bold mb-2">{{ 'location' | l10n }}</h3>
                <app-map-view [locations]="[{lat: act.location.lat, lng: act.location.lng, name: act.name}]" />
            </div>

          </aside>
        </div>

        <hr class="my-8">

        <section>
          <h2 class="text-2xl font-bold text-gray-700 mb-4">{{ 'reviews' | l10n }} ({{ act.reviews.length }})</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            @for(review of act.reviews; track review.id) {
              <div class="bg-gray-50 p-4 rounded-lg border">
                <div class="flex items-center mb-2">
                  <app-star-rating [rating]="review.rating" />
                  <span class="font-semibold ml-auto">{{ review.userName }}</span>
                </div>
                <p class="text-gray-600 italic">"{{ review.comment }}"</p>
                <p class="text-right text-sm text-gray-400 mt-2">{{ review.date | date:'mediumDate' }}</p>
              </div>
            }
            @if(act.reviews.length === 0) {
              <p class="text-gray-500">{{ 'noReviews' | l10n }}</p>
            }
          </div>

          @if (authService.isLoggedIn()) {
            <app-review-form [activityId]="act.id" (reviewSubmitted)="onReviewSubmitted($event)" />
          } @else {
            <div class="text-center bg-gray-100 p-4 rounded-md">
                <p>{{ 'logInToReview' | l10n }} <a routerLink="/login" class="text-teal-600 font-semibold hover:underline">{{ 'login' | l10n }}</a></p>
            </div>
          }
        </section>
        
        @if(showAddToAlbumModal()) {
          <app-add-to-album-modal
            [activityName]="act.name"
            [activityImageUrl]="act.imageUrl"
            (close)="showAddToAlbumModal.set(false)"
          />
        }

      </div>
    } @else {
      <p>A carregar atividade...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  authService = inject(AuthService);

  activity = signal<Activity | undefined>(undefined);
  showAddToAlbumModal = signal(false);

  isVisited = computed(() => {
    const user = this.authService.currentUser();
    const act = this.activity();
    if (!user || !act) return false;
    return user.visitedActivityIds.includes(act.id);
  });

  constructor() {
    const activityId = Number(this.route.snapshot.paramMap.get('id'));
    if (activityId) {
      this.activity.set(this.activityService.getActivityById(activityId));
    }
  }

  onReviewSubmitted(review: Review): void {
    this.activityService.addReview(review);
    // Refresh activity data to show new review
    const act = this.activity();
    if (act) {
        this.activity.set(this.activityService.getActivityById(act.id));
    }
  }

  markVisited(activityId: number): void {
    this.authService.markAsVisited(activityId);
  }

  accessibilityText(level: AccessibilityLevel): string {
    switch (level) {
      case 'total': return 'Total';
      case 'parcial': return 'Parcial';
      case 'nenhum': return 'Nenhuma';
    }
  }
}
