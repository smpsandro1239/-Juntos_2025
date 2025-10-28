import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Album, AlbumPhoto } from '../../models/album.model';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { PhotoUploadFormComponent } from '../photo-upload-form/photo-upload-form.component';
import { CreateVideoModalComponent } from '../create-video-modal/create-video-modal.component';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, L10nPipe, PhotoUploadFormComponent, CreateVideoModalComponent],
  template: `
    @if(album()) {
      @let alb = album()!;
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <div class="flex justify-between items-start mb-6">
          <div>
            <a routerLink="/albums" class="text-teal-500 hover:text-teal-700 mb-2 inline-block">&larr; {{ 'allAlbums' | l10n }}</a>
            <h1 class="text-3xl font-bold text-gray-800">{{ alb.name }}</h1>
          </div>
          <div class="flex space-x-2">
              <button 
                (click)="showCreateVideoModal.set(true)"
                [disabled]="alb.photos.length === 0"
                class="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                🎬 {{ 'createVideo' | l10n }}
              </button>
              <button 
                (click)="navigateToOrder()"
                [disabled]="alb.photos.length === 0"
                class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                📦 {{ 'orderPrint' | l10n }}
              </button>
          </div>
        </div>
        
        <app-photo-upload-form [albumId]="alb.id" (photoUploaded)="onPhotoUploaded($event)" class="mb-8" />

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          @for (photo of alb.photos; track photo.imageUrl) {
            <div class="group relative aspect-square">
              <img [ngSrc]="photo.imageUrl" [alt]="photo.activityName" width="400" height="400" class="w-full h-full object-cover rounded-lg shadow-sm">
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end p-2 rounded-lg">
                <p class="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{{ photo.activityName }}</p>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-16 bg-gray-50 rounded-lg">
              <p class="text-gray-500">{{ 'noPhotos' | l10n }}</p>
              <p class="text-sm text-gray-400 mt-2">{{ 'uploadSome' | l10n }}</p>
            </div>
          }
        </div>
      </div>
    } @else {
      <p>A carregar álbum...</p>
    }

    @if (showCreateVideoModal() && album()) {
      <app-create-video-modal [album]="album()!" (close)="showCreateVideoModal.set(false)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);
    
    albumId = signal(0);
    album = computed(() => this.authService.getAlbumById(this.albumId()));
    showCreateVideoModal = signal(false);

    constructor() {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.albumId.set(id);
    }
    
    onPhotoUploaded(photo: AlbumPhoto) {
        this.authService.addPhotoToAlbum(this.albumId(), photo);
    }

    navigateToOrder() {
        this.router.navigate(['/order-print', this.albumId()]);
    }
}
