import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { AuthService } from '../../services/auth.service';

import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { AddToAlbumModalComponent } from '../add-to-album-modal/add-to-album-modal.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [RouterLink, StarRatingComponent, ReviewFormComponent, AddToAlbumModalComponent],
  template: `
    @if (activity(); as act) {
      <div class="max-w-4xl mx-auto">
        <a routerLink="/" class="inline-flex items-center text-teal-600 hover:underline mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            Voltar a Descobrir
        </a>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="act.imageUrl" [alt]="act.name" class="w-full h-64 object-cover">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                <h1 class="text-3xl font-bold">{{ act.name }}</h1>
                <span class="text-lg font-bold text-gray-800 mt-2 sm:mt-0">{{ act.price > 0 ? act.price + '€' : 'Grátis' }}</span>
            </div>
            <div class="flex items-center mb-4">
                <app-star-rating [rating]="act.rating" [showRatingValue]="true" />
                <span class="text-sm text-gray-500 ml-2">({{ act.reviews.length }} avaliações)</span>
            </div>
            
            <p class="text-gray-700 mb-6">{{ act.description }}</p>

            @if (isLoggedIn()) {
              <div class="flex flex-wrap gap-4 mb-6">
                <button (click)="markAsVisited(act.id)" [disabled]="isVisited()"
                        class="bg-teal-500 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-600">
                  {{ isVisited() ? '✅ Visitado' : 'Marcar como Visitado' }}
                </button>
              </div>
            }

            <!-- Image Gallery -->
            <h2 class="text-2xl font-semibold mb-4 border-t pt-4">Galeria</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                @for(image of act.galleryImages; track image) {
                    <div class="relative group">
                      <img [src]="image" alt="Galeria de {{ act.name }}" class="rounded-lg shadow-md w-full h-32 object-cover">
                      @if (isLoggedIn()) {
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                          <button (click)="openAddToAlbumModal(image)" class="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 px-3 py-1 rounded-full text-sm">Adicionar ao Álbum</button>
                        </div>
                      }
                    </div>
                }
            </div>
            
            <!-- Reviews -->
            <h2 class="text-2xl font-semibold mb-4 border-t pt-4">Avaliações</h2>
            @if(act.reviews.length > 0) {
              <div class="space-y-6">
                @for(review of act.reviews; track review.id) {
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-xl">
                            {{ review.userName.charAt(0) }}
                        </div>
                        <div class="ml-4">
                            <p class="font-bold">{{ review.userName }}</p>
                            <app-star-rating [rating]="review.rating" />
                            <p class="text-gray-600 mt-1">{{ review.comment }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ formatDate(review.date) }}</p>
                        </div>
                    </div>
                }
              </div>
            } @else {
              <p class="text-gray-500">Ainda não existem avaliações. Seja o primeiro a avaliar!</p>
            }
            
            @if (isLoggedIn()) {
                <div class="mt-8 border-t pt-6">
                    <app-review-form [activityId]="act.id" (reviewSubmit)="handleReviewSubmit($event)" />
                </div>
            } @else {
               <div class="mt-8 border-t pt-6 text-center bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-700">Tem de <a routerLink="/login" class="text-teal-600 hover:underline font-semibold">entrar</a> para deixar uma avaliação.</p>
               </div>
            }
          </div>
        </div>
      </div>

      @if (showAddToAlbumModal()) {
        <app-add-to-album-modal 
            [imageUrl]="selectedImageUrl()!" 
            [activityName]="act.name"
            (close)="showAddToAlbumModal.set(false)" 
            (addPhoto)="addPhotoToAlbum($event)" />
      }

    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">Atividade não encontrada.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);

  activity = signal<Activity | null>(null);
  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  showAddToAlbumModal = signal(false);
  selectedImageUrl = signal<string | null>(null);

  isVisited = computed(() => {
    const act = this.activity();
    if (!act || !this.currentUser()) return false;
    return this.currentUser()!.visitedActivityIds.includes(act.id);
  });
  
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.activity.set(this.activityService.getActivityById(id) ?? null);
    }
  }

  handleReviewSubmit(reviewData: Omit<Review, 'id'>): void {
    const newReview: Review = {
      ...reviewData,
      id: Date.now()
    };
    this.activityService.addReview(newReview);
    // Refresh activity from service to get updated reviews and rating
    this.activity.set(this.activityService.getActivityById(reviewData.activityId) ?? null);
  }

  markAsVisited(activityId: number): void {
    this.authService.markAsVisited(activityId);
  }

  openAddToAlbumModal(imageUrl: string): void {
    this.selectedImageUrl.set(imageUrl);
    this.showAddToAlbumModal.set(true);
  }

  addPhotoToAlbum(event: { albumId: number, photoUrl: string, activityName: string }): void {
    this.authService.addPhotoToAlbum(event.albumId, { imageUrl: event.photoUrl, activityName: event.activityName });
    this.showAddToAlbumModal.set(false);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
