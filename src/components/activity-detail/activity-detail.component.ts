import { Component, ChangeDetectionStrategy, inject, signal, OnInit, WritableSignal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Activity } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { PhotoUploadFormComponent } from '../photo-upload-form/photo-upload-form.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, StarRatingComponent, ReviewFormComponent, PhotoUploadFormComponent],
  template: `
    @if (activity()) {
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="activity()?.imageUrl" [alt]="activity()?.name" class="w-full h-64 object-cover">
          <div class="p-6">
            <h1 class="text-3xl font-bold mb-2">{{ activity()?.name }}</h1>
            <div class="flex justify-between items-start mb-4">
              <span class="bg-teal-100 text-teal-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">{{ activity()?.category }}</span>
              <div class="text-right">
                <app-star-rating [rating]="activity()!.rating" [showRatingValue]="true" />
                <span class="text-sm text-gray-500">({{ activity()!.reviews?.length || 0 }} avaliações)</span>
              </div>
            </div>
            
            <p class="text-gray-700 mb-4">{{ activity()?.description }}</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 mb-6">
              <div class="flex items-center">
                <svg class="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{{ activity()?.location.address }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>
                <span class="font-bold text-lg">{{ activity()!.price > 0 ? activity()!.price + '€' : 'Grátis' }}</span>
              </div>
              @if(activity()?.suitableForRainyDays) {
                <div class="flex items-center">
                  <svg class="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                  <span>Adequado para dias de chuva</span>
                </div>
              }
            </div>

             @if (isLoggedIn()) {
              <div class="mt-4 border-t pt-4">
                <button (click)="markAsVisited()" [disabled]="isVisited()"
                        class="w-full text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                        [class]="isVisited() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700 text-white'">
                  @if (isVisited()) {
                    <span>Visitado!</span>
                  } @else {
                    <span>Marcar como Visitado</span>
                  }
                </button>
              </div>
            }

          </div>
        </div>

        <!-- Community Gallery Section -->
        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Galeria da Comunidade</h2>
            @if(activity()?.userImages && activity()!.userImages!.length > 0) {
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  @for(image of activity()!.userImages; track image.id) {
                      <div class="relative group">
                          <img [src]="image.imageUrl" [alt]="'Foto de ' + image.userName" class="w-full h-40 object-cover rounded-lg shadow-md">
                          <div class="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-tr-lg rounded-bl-lg">
                              {{ image.userName }}
                          </div>
                      </div>
                  }
              </div>
            } @else {
              <p class="text-gray-500">Nenhuma foto da comunidade ainda. Partilhe a sua!</p>
            }

            @if (isLoggedIn()) {
              <div class="mt-6">
                @if(showUploadForm()) {
                   <app-photo-upload-form (imageSubmit)="onImageSubmit($event)" (cancel)="showUploadForm.set(false)" />
                } @else {
                   <button (click)="showUploadForm.set(true)" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                        Adicionar Foto
                   </button>
                }
              </div>
            }
        </div>

        <!-- Reviews Section -->
        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Avaliações</h2>
            @if (isLoggedIn()) {
              <app-review-form [activityId]="activity()!.id" (reviewSubmit)="onReviewSubmit($event)"/>
            } @else {
              <div class="bg-gray-100 p-4 rounded-lg text-center">
                <p> <a routerLink="/login" class="text-teal-600 hover:underline font-semibold">Inicie sessão</a> para deixar a sua avaliação. </p>
              </div>
            }
            
            <div class="mt-6 space-y-4">
              @if (reviews().length > 0) {
                @for (review of reviews(); track review.id) {
                  <div class="bg-white p-4 rounded-lg shadow">
                      <div class="flex justify-between items-center mb-2">
                          <span class="font-bold">{{ review.userName }}</span>
                          <app-star-rating [rating]="review.rating" />
                      </div>
                      <p class="text-gray-600">{{ review.comment }}</p>
                      <p class="text-xs text-gray-400 text-right mt-2">{{ formatDate(review.date) }}</p>
                  </div>
                }
              } @else {
                  <p class="text-gray-500">Ainda não existem avaliações. Seja o primeiro a avaliar!</p>
              }
            </div>
        </div>
      </div>
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

  activity: WritableSignal<Activity | null> = signal(null);
  reviews: WritableSignal<Review[]> = signal([]);
  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;
  
  showUploadForm = signal(false);

  isVisited = computed(() => {
    const user = this.currentUser();
    const currentActivity = this.activity();
    if (!user || !currentActivity) return false;
    return user.visitedActivityIds.includes(currentActivity.id);
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      const foundActivity = this.activityService.getActivityById(id);
      if (foundActivity) {
        this.activity.set(foundActivity);
        this.reviews.set(this.activityService.getReviewsForActivity(id));
      }
    }
  }

  onReviewSubmit(review: Omit<Review, 'id'>): void {
    this.activityService.addReview(review);
    // Refresh data
    const activityId = this.activity()!.id;
    this.activity.set(this.activityService.getActivityById(activityId) ?? null);
    this.reviews.set(this.activityService.getReviewsForActivity(activityId));
  }
  
  onImageSubmit(imageData: { imageUrl: string }): void {
    const user = this.currentUser();
    if (user && this.activity()) {
        this.activityService.addUserImage(this.activity()!.id, imageData.imageUrl, user.name);
        this.activity.set(this.activityService.getActivityById(this.activity()!.id) ?? null);
        this.showUploadForm.set(false);
    }
  }

  markAsVisited(): void {
    const currentActivity = this.activity();
    if (currentActivity && !this.isVisited()) {
      this.authService.markActivityAsVisited(currentActivity.id);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-PT', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
