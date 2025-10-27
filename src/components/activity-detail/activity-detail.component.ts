import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Activity } from '../../models/activity.model';
import { Review } from '../../models/review.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { PhotoUploadFormComponent } from '../photo-upload-form/photo-upload-form.component';
import { AddToAlbumModalComponent } from '../add-to-album-modal/add-to-album-modal.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [RouterLink, StarRatingComponent, ReviewFormComponent, PhotoUploadFormComponent, AddToAlbumModalComponent],
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
            <span class="text-sm font-semibold text-teal-600">{{ act.category }}</span>
            <h1 class="text-3xl font-bold mt-1 mb-2">{{ act.name }}</h1>
            <div class="flex justify-between items-start mb-4">
                <app-star-rating [rating]="act.rating" [showRatingValue]="true" />
                <span class="text-lg font-bold text-gray-800">{{ act.price > 0 ? act.price + '€' : 'Grátis' }}</span>
            </div>
            
            <p class="text-gray-700 mb-6">{{ act.description }}</p>

            <div class="flex flex-wrap gap-4 items-center border-t pt-4">
                @if (isLoggedIn()) {
                    <button (click)="markAsVisited()" [disabled]="hasVisited()"
                        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-700 disabled:cursor-not-allowed">
                        {{ hasVisited() ? '✅ Visitado' : 'Marcar como Visitado' }}
                    </button>
                     <button (click)="showReviewForm.set(!showReviewForm())"
                        class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                        {{ showReviewForm() ? 'Cancelar Avaliação' : 'Deixar Avaliação' }}
                    </button>
                    <button (click)="showPhotoUploadForm.set(!showPhotoUploadForm())"
                        class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
                        {{ showPhotoUploadForm() ? 'Cancelar Foto' : 'Adicionar Foto' }}
                    </button>
                } @else {
                    <p class="text-gray-600">
                        <a routerLink="/login" class="text-teal-600 font-bold hover:underline">Entre</a> para marcar como visitado, avaliar ou adicionar fotos.
                    </p>
                }
            </div>
          </div>
        </div>

        <!-- Forms -->
        <div class="mt-8">
          @if (showReviewForm()) {
            <app-review-form [activityId]="act.id" (reviewSubmit)="addReview($event)" />
          }
          @if (showPhotoUploadForm()) {
            <app-photo-upload-form (imageSubmit)="addUserImage($event)" (cancel)="showPhotoUploadForm.set(false)" />
          }
        </div>

        <!-- User Photos -->
        @if (act.userImages && act.userImages.length > 0) {
          <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Galeria dos Visitantes</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (image of act.userImages; track image.id) {
                <div class="relative group">
                  <img [src]="image.imageUrl" [alt]="'Foto de ' + image.userName" class="rounded-lg object-cover w-full h-40">
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-between p-2 text-white">
                     <p class="text-sm opacity-0 group-hover:opacity-100 transition-opacity">por {{ image.userName }}</p>
                     @if (isLoggedIn()) {
                        <button (click)="openAddToAlbumModal(image.imageUrl)"
                            class="text-xs bg-white text-black rounded-full px-2 py-1 self-end opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200">
                            + Álbum
                        </button>
                     }
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Reviews -->
        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Avaliações ({{ act.reviews?.length || 0 }})</h2>
            @if (act.reviews && act.reviews.length > 0) {
                <div class="space-y-6">
                    @for (review of act.reviews; track review.id) {
                        <div class="bg-white p-4 rounded-lg shadow">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="font-bold">{{ review.userName }}</p>
                                    <p class="text-sm text-gray-500">{{ formatDate(review.date) }}</p>
                                </div>
                                <app-star-rating [rating]="review.rating" />
                            </div>
                            <p class="mt-2 text-gray-700">{{ review.comment }}</p>
                        </div>
                    }
                </div>
            } @else {
                <p class="text-gray-600">Ainda não existem avaliações. Seja o primeiro a avaliar!</p>
            }
        </div>
      </div>
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">Atividade não encontrada.</p>
      </div>
    }

    @if (showAlbumModal() && selectedImageUrlForAlbum()) {
      <app-add-to-album-modal 
        [imageUrl]="selectedImageUrlForAlbum()!"
        [activityName]="activity()!.name"
        (close)="showAlbumModal.set(false)"
        (addPhoto)="onAddPhotoToAlbum($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);

  activity = signal<Activity | null>(null);
  showReviewForm = signal(false);
  showPhotoUploadForm = signal(false);
  showAlbumModal = signal(false);
  selectedImageUrlForAlbum = signal<string | null>(null);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;
  
  hasVisited = computed(() => {
    const user = this.currentUser();
    const act = this.activity();
    if (!user || !act) return false;
    return user.visitedActivityIds.includes(act.id);
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      const foundActivity = this.activityService.getActivityById(id);
      this.activity.set(foundActivity ?? null);
    }
  }

  addReview(review: Omit<Review, 'id'>) {
    this.activityService.addReview(review);
    // The filteredActivities computed signal will update automatically, refreshing the data
    this.showReviewForm.set(false);
  }
  
  addUserImage({imageUrl}: {imageUrl: string}) {
    const activityId = this.activity()?.id;
    const userName = this.currentUser()?.name;
    if (activityId && userName) {
        this.activityService.addUserImage(activityId, imageUrl, userName);
        this.showPhotoUploadForm.set(false);
    }
  }

  markAsVisited() {
      const activityId = this.activity()?.id;
      if (activityId) {
          this.authService.markAsVisited(activityId);
      }
  }
  
  openAddToAlbumModal(imageUrl: string) {
    this.selectedImageUrlForAlbum.set(imageUrl);
    this.showAlbumModal.set(true);
  }

  onAddPhotoToAlbum(event: { albumId: number; photoUrl: string; activityName: string }) {
     this.authService.addPhotoToAlbum(event.albumId, { imageUrl: event.photoUrl, activityName: event.activityName });
     this.showAlbumModal.set(false);
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
