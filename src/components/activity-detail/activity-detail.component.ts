import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Activity, AccessibilityLevel } from '../../models/activity.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { AddToAlbumModalComponent } from '../add-to-album-modal/add-to-album-modal.component';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { L10nService } from '../../services/l10n.service';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, DatePipe, StarRatingComponent, ReviewFormComponent, MapViewComponent, AddToAlbumModalComponent, L10nPipe],
  template: `
    @if (activity(); as act) {
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img [ngSrc]="act.imageUrl" [alt]="act.name" width="600" height="400" class="w-full h-auto rounded-lg mb-4 shadow-md">
            <div class="grid grid-cols-3 gap-2">
                @for(img of act.galleryImages; track img) {
                    <img [ngSrc]="img" [alt]="act.name" width="200" height="150" class="w-full h-auto rounded-md shadow">
                }
            </div>
          </div>
          <div>
            <span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">{{ act.category }}</span>
            <h1 class="text-4xl font-bold text-gray-800 my-2">{{ act.name }}</h1>
            <div class="flex items-center mb-4">
              <app-star-rating [rating]="act.rating" [showRatingValue]="true" />
            </div>
            <p class="text-gray-600 mb-4">{{ act.description }}</p>

            <div class="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 class="font-bold text-lg mb-2">{{ 'activityAccessibility' | l10n }}</h3>
              <div class="flex items-center space-x-4">
                <span class="text-gray-700">{{ 'accessibilityWheelchair' | l10n }}: <span class="font-semibold">{{ accessibilityLabel(act.accessibility.wheelchair) }}</span></span>
                <span class="text-gray-700">{{ 'accessibilityStroller' | l10n }}: <span class="font-semibold">{{ accessibilityLabel(act.accessibility.stroller) }}</span></span>
              </div>
            </div>

             @if (authService.isLoggedIn()) {
              <div class="flex items-center space-x-4 mt-4">
                <button (click)="markAsVisited()" [disabled]="isVisited()" class="px-4 py-2 rounded-md transition-colors text-white" [class.bg-green-500]="isVisited()" [class.bg-teal-500]="!isVisited()" [class.hover:bg-teal-600]="!isVisited()">
                  {{ isVisited() ? 'Visitado!' : 'Marcar como Visitado' }}
                </button>
                 <button (click)="showAddToAlbumModal.set(true)" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Adicionar a Álbum</button>
              </div>
            }
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'activityLocation' | l10n }}</h2>
              <app-map-view [locations]="[{lat: act.location.lat, lng: act.location.lng, name: act.name}]" />
           </div>
           <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'activityReviews' | l10n }}</h2>
              @for(review of act.reviews; track review.id) {
                <div class="border-b py-4">
                  <div class="flex justify-between items-center">
                    <span class="font-bold">{{ review.userName }}</span>
                    <span class="text-sm text-gray-500">{{ review.date | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <app-star-rating [rating]="review.rating" class="my-1" />
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
              } @empty {
                <p class="text-gray-500 py-4">{{ 'noReviewsYet' | l10n }}</p>
              }

              @if (authService.isLoggedIn()) {
                <div class="mt-6">
                  <h3 class="text-xl font-bold mb-2">{{ 'addYourReview' | l10n }}</h3>
                  <app-review-form [activityId]="act.id" />
                </div>
              } @else {
                  <p class="mt-6 p-4 bg-gray-100 rounded-md text-center">
                    <a routerLink="/login" class="text-teal-500 hover:underline">Faça login</a> para deixar uma avaliação.
                  </p>
              }
           </div>
        </div>
      </div>
    } @else {
      <p>{{ 'loading' | l10n }}</p>
    }

    @if (showAddToAlbumModal() && activity()) {
      <app-add-to-album-modal 
        [activityName]="activity()!.name"
        [activityImageUrl]="activity()!.imageUrl"
        (closeModal)="showAddToAlbumModal.set(false)" />
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
    this.activity.set(this.activityService.getActivityById(activityId));
  }

  markAsVisited(): void {
    const act = this.activity();
    if(act) {
        this.authService.markAsVisited(act.id);
    }
  }

  accessibilityLabel(level: AccessibilityLevel): string {
    const labels = {
      total: 'Total',
      parcial: 'Parcial',
      nenhum: 'Nenhuma'
    };
    return this.l10n.translate(`accessibility${labels[level]}` as any);
  }

  private l10n = inject(L10nService);
}
