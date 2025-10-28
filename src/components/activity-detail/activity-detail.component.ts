import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Activity } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MapViewComponent } from '../map-view/map-view.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { AddToAlbumModalComponent } from '../add-to-album-modal/add-to-album-modal.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    CurrencyPipe,
    DatePipe,
    L10nPipe,
    MapViewComponent,
    StarRatingComponent,
    ReviewFormComponent,
    AddToAlbumModalComponent
  ],
  template: `
    @if (activity()) {
      @let act = activity()!;
      <div class="bg-white p-4 md:p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
        <button routerLink="/" class="text-teal-500 hover:text-teal-700 mb-4">&larr; {{ 'backToActivities' | l10n }}</button>

        <header class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img [ngSrc]="act.imageUrl" [alt]="act.name" width="800" height="600" class="w-full h-80 object-cover rounded-lg shadow-md" priority>
              <div class="grid grid-cols-2 gap-2">
                @for(img of act.gallery.slice(0, 4); track img) {
                   <img [ngSrc]="img" [alt]="act.name" width="400" height="300" class="w-full h-full object-cover rounded-lg shadow-sm">
                }
              </div>
            </div>
            <h1 class="text-4xl font-extrabold text-gray-800">{{ act.name }}</h1>
            <p class="text-lg text-gray-500">{{ act.category }}</p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
                 <section class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-700 mb-3">{{ 'description' | l10n }}</h2>
                    <p class="text-gray-600 leading-relaxed">{{ act.description }}</p>
                </section>
                
                <section>
                    <h2 class="text-2xl font-bold text-gray-700 mb-4">{{ 'reviews' | l10n }} ({{ reviews().length }})</h2>
                    @if (isLoggedIn()) {
                      <app-review-form [activityId]="act.id" (reviewSubmitted)="onReviewSubmitted($event)" class="mb-6"/>
                    }
                    <div class="space-y-4">
                      @for (review of reviews(); track review.id) {
                        <div class="border-b pb-4">
                          <div class="flex items-center mb-1">
                              <app-star-rating [rating]="review.rating" />
                              <p class="ml-4 font-semibold text-gray-800">{{ review.userName }}</p>
                          </div>
                          <p class="text-gray-600">{{ review.comment }}</p>
                           <p class="text-xs text-gray-400 mt-1">{{ review.date | date:'medium' }}</p>
                        </div>
                      } @empty {
                         <p class="text-gray-500">{{ 'noReviews' | l10n }}</p>
                      }
                    </div>
                </section>
            </div>
            <aside>
                <div class="bg-gray-50 p-6 rounded-lg border sticky top-24 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-teal-600">{{ act.price > 0 ? (act.price | currency:'EUR') : ('free' | l10n) }}</span>
                         <app-star-rating [rating]="act.rating" [showRatingValue]="true" />
                    </div>
                     <div class="flex space-x-2">
                        @if (isLoggedIn()) {
                            <button (click)="toggleFavorite()" class="flex-1 p-2 rounded-md border transition-colors flex items-center justify-center" [class.bg-red-100]="isFavorite()" [class.text-red-500]="isFavorite()" [class.border-red-300]="isFavorite()">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                             <button (click)="showAlbumModal.set(true)" class="flex-1 p-2 rounded-md border transition-colors flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </button>
                        }
                    </div>

                    <div>
                      <h3 class="font-bold text-gray-700 mb-2">{{ 'location' | l10n }}</h3>
                      <p class="text-sm text-gray-600 mb-2">{{ act.location.address }}</p>
                      <app-map-view [locations]="[{...act.location, name: act.name}]" />
                    </div>

                     <div>
                      <h3 class="font-bold text-gray-700 mb-2">{{ 'accessibility' | l10n }}</h3>
                      <p class="text-sm text-gray-600">♿ {{ 'wheelchair' | l10n }}: {{ act.accessibility.wheelchair }}</p>
                      <p class="text-sm text-gray-600">👶 {{ 'stroller' | l10n }}: {{ act.accessibility.stroller }}</p>
                    </div>

                    @if (act.isSustainable) {
                        <div>
                          <h3 class="font-bold text-gray-700 mb-2">💚 {{ 'sustainable' | l10n }}</h3>
                          <p class="text-sm text-gray-600">{{ 'sustainableDesc' | l10n }}</p>
                        </div>
                    }
                </div>
            </aside>
        </div>
      </div>
      
      @if (showAlbumModal()) {
        <app-add-to-album-modal 
            [activityName]="activity()!.name" 
            [imageUrl]="activity()!.imageUrl"
            (close)="showAlbumModal.set(false)"
            (photoAdded)="onPhotoAddedToAlbum()"
        />
      }
    } @else {
      <p>A carregar atividade...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  activityId = signal(0);
  activity = signal<Activity | undefined>(undefined);
  reviews = signal<Review[]>([]);
  isLoggedIn = this.authService.isLoggedIn;
  showAlbumModal = signal(false);

  isFavorite = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return false;
    return user.favorites.includes(this.activityId());
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.activityId.set(id);
    if (id) {
      this.activity.set(this.activityService.getActivityById(id));
      this.reviews.set(this.activityService.getReviewsForActivity(id));
    }
  }

  onReviewSubmitted(review: Review): void {
    this.activityService.addReview(review);
    this.reviews.set(this.activityService.getReviewsForActivity(this.activityId()));
    this.toastService.show('Obrigado pela sua avaliação!', 'success');
  }

  toggleFavorite(): void {
    this.authService.toggleFavorite(this.activityId());
    const message = this.isFavorite() ? 'Removido dos favoritos.' : 'Adicionado aos favoritos!';
    this.toastService.show(message, 'info');
  }

  onPhotoAddedToAlbum(): void {
    this.showAlbumModal.set(false);
    this.toastService.show('Foto adicionada ao álbum!', 'success');
  }
}
