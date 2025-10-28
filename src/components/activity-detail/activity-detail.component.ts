import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Activity } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { AddToAlbumModalComponent } from '../add-to-album-modal/add-to-album-modal.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, CurrencyPipe, StarRatingComponent, ReviewFormComponent, MapViewComponent, AddToAlbumModalComponent, L10nPipe],
  template: `
    @if (activity()) {
      @let act = activity()!;
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
        <button routerLink="/" class="text-teal-500 hover:text-teal-700 mb-4">&larr; {{ 'backToActivities' | l10n }}</button>

        <header class="relative mb-6">
          <img [ngSrc]="act.imageUrl" [alt]="act.name" width="1000" height="400" class="w-full h-80 object-cover rounded-lg shadow-md" priority>
          <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
            <h1 class="text-4xl font-extrabold text-white">{{ act.name }}</h1>
            <p class="text-lg text-gray-200">{{ act.category }}</p>
          </div>
        </header>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <!-- Description -->
            <section class="mb-8">
              <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'description' | l10n }}</h2>
              <p class="text-gray-600 leading-relaxed">{{ act.description }}</p>
            </section>

            <!-- Gallery -->
            @if(act.gallery.length > 0) {
              <section class="mb-8">
                <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'gallery' | l10n }}</h2>
                <div class="grid grid-cols-2 gap-4">
                  @for(image of act.gallery; track image) {
                    <img [ngSrc]="image" alt="Gallery image for {{ act.name }}" width="400" height="300" class="w-full h-auto object-cover rounded-lg shadow-sm cursor-pointer" (click)="showInAlbumModal(image)">
                  }
                </div>
              </section>
            }

            <!-- Reviews -->
            <section>
              <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'reviews' | l10n }}</h2>
              @if(isLoggedIn()) {
                <app-review-form [activityId]="act.id" (reviewSubmitted)="onReviewSubmitted($event)" class="mb-6"/>
              } @else {
                <div class="text-center p-4 bg-gray-100 rounded-lg mb-6">
                  <p>{{ 'loginToReview' | l10n }} <a routerLink="/login" class="text-teal-600 font-semibold hover:underline">{{ 'loginHere' | l10n }}</a>.</p>
                </div>
              }
              <div class="space-y-4">
                @for(review of reviews(); track review.id) {
                  <div class="bg-gray-50 p-4 rounded-lg border">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-bold">{{ review.userName }}</p>
                        <app-star-rating [rating]="review.rating" />
                      </div>
                      <span class="text-sm text-gray-500">{{ review.date | date:'mediumDate' }}</span>
                    </div>
                    <p class="mt-2 text-gray-700">{{ review.comment }}</p>
                  </div>
                } @empty {
                  <p class="text-gray-500">{{ 'noReviews' | l10n }}</p>
                }
              </div>
            </section>
          </div>
          
          <aside>
            <div class="sticky top-24 space-y-4">
              <!-- Details Card -->
              <div class="bg-gray-50 p-6 rounded-lg border">
                <h3 class="text-xl font-bold mb-4">{{ 'details' | l10n }}</h3>
                <div class="space-y-4">
                  <div class="flex items-center"><span class="text-2xl mr-3">💰</span> <span class="text-lg font-bold text-teal-600">{{ act.price > 0 ? (act.price | currency:'EUR') : ('free' | l10n) }}</span></div>
                  <div class="flex items-center"><span class="text-2xl mr-3">⭐</span> <app-star-rating [rating]="act.rating" [showRatingValue]="true" /></div>
                  <div class="flex items-start"><span class="text-2xl mr-3">♿</span> <div><p class="font-semibold">{{ 'wheelchair' | l10n }}</p><p>{{ act.accessibility.wheelchair }}</p></div></div>
                  <div class="flex items-start"><span class="text-2xl mr-3">👶</span> <div><p class="font-semibold">{{ 'stroller' | l10n }}</p><p>{{ act.accessibility.stroller }}</p></div></div>
                   @if (act.isSustainable) {
                     <div class="flex items-center"><span class="text-2xl mr-3">💚</span> <span class="font-semibold text-green-700">{{ 'sustainable' | l10n }}</span></div>
                   }
                </div>
                @if(isLoggedIn()) {
                    <button (click)="toggleFavorite()" class="w-full mt-6 py-2 px-4 rounded-md transition-colors font-semibold flex items-center justify-center" [class.bg-red-500]="isFavorite()" [class.text-white]="isFavorite()" [class.bg-gray-200]="!isFavorite()">
                        <span class="mr-2">{{ isFavorite() ? '❤️' : '🤍' }}</span> {{ isFavorite() ? ('unfavorite' | l10n) : ('addFavorite' | l10n) }}
                    </button>
                    <button (click)="showInAlbumModal(act.imageUrl)" class="w-full mt-2 py-2 px-4 rounded-md transition-colors font-semibold flex items-center justify-center bg-teal-500 text-white hover:bg-teal-600">
                        <span class="mr-2">📸</span> {{ 'addToAlbum' | l10n }}
                    </button>
                }
              </div>
              <!-- Map -->
              <app-map-view [locations]="[{name: act.name, lat: act.location.lat, lng: act.location.lng}]" />
            </div>
          </aside>
        </div>
      </div>
    } @else {
      <p>A carregar atividade...</p>
    }
    
    @if(showAddToAlbumModal() && selectedImageUrl()) {
      <app-add-to-album-modal 
        [activityName]="activity()!.name" 
        [imageUrl]="selectedImageUrl()!" 
        (close)="showAddToAlbumModal.set(false)" 
        (photoAdded)="onPhotoAddedToAlbum()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  activity = signal<Activity | undefined>(undefined);
  reviews = signal<Review[]>([]);
  isFavorite = computed(() => {
      const user = this.authService.currentUser();
      const act = this.activity();
      if (!user || !act) return false;
      return user.favorites.includes(act.id);
  });
  
  isLoggedIn = this.authService.isLoggedIn;
  showAddToAlbumModal = signal(false);
  selectedImageUrl = signal<string | null>(null);

  constructor() {
    const activityId = Number(this.route.snapshot.paramMap.get('id'));
    if (activityId) {
      this.activity.set(this.activityService.getActivityById(activityId));
      this.reviews.set(this.activityService.getReviewsByActivityId(activityId));
    }
  }

  onReviewSubmitted(review: Review): void {
    this.activityService.addReview(review);
    this.reviews.set(this.activityService.getReviewsByActivityId(this.activity()!.id));
    this.toastService.show(this.authService.translate('reviewSubmitted'), 'success');
  }
  
  toggleFavorite(): void {
      if (!this.activity()) return;
      this.authService.toggleFavorite(this.activity()!.id);
      const message = this.isFavorite() ? this.authService.translate('favoriteAdded') : this.authService.translate('favoriteRemoved');
      this.toastService.show(message, 'info');
  }

  showInAlbumModal(imageUrl: string): void {
    if (!this.isLoggedIn()) {
      this.toastService.show(this.authService.translate('loginToAddPhoto'), 'error');
      return;
    }
    this.selectedImageUrl.set(imageUrl);
    this.showAddToAlbumModal.set(true);
  }

  onPhotoAddedToAlbum(): void {
      this.showAddToAlbumModal.set(false);
      this.toastService.show(this.authService.translate('photoAdded'), 'success');
  }
}
