import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Album, AlbumPhoto } from '../../models/album.model';
import { PhotoUploadFormComponent } from '../photo-upload-form/photo-upload-form.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, PhotoUploadFormComponent, L10nPipe],
  template: `
    @if(album()) {
        @let alb = album()!;
        <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <a routerLink="/albums" class="text-teal-500 hover:text-teal-700 mb-2 inline-block">&larr; {{ 'myAlbums' | l10n }}</a>
                    <h1 class="text-3xl font-bold text-gray-800">{{ alb.name }}</h1>
                </div>
                <a [routerLink]="['/order-print', alb.id]" class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
                    {{ 'printAlbum' | l10n }}
                </a>
            </div>

            <!-- Photo Upload -->
            <app-photo-upload-form [albumId]="alb.id" (photoUploaded)="onPhotoUploaded($event)" class="mb-8" />

            <!-- Photo Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                @for(photo of alb.photos; track photo.imageUrl) {
                    <div class="group relative aspect-square overflow-hidden rounded-lg shadow-sm">
                        <img [ngSrc]="photo.imageUrl" [alt]="photo.activityName" width="400" height="400" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p class="text-sm font-semibold truncate">{{ photo.activityName }}</p>
                        </div>
                    </div>
                }
            </div>
             @if(alb.photos.length === 0) {
                 <div class="text-center py-12 border-t mt-8">
                    <p class="text-gray-500">{{ 'noPhotos' | l10n }}</p>
                </div>
            }

        </div>
    } @else {
        <p>A carregar álbum...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailComponent {
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);

    albumId = signal(0);
    album = signal<Album | undefined>(undefined);

    constructor() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.albumId.set(id);
        if (id) {
            this.album.set(this.authService.getAlbumById(id));
        }
    }
    
    onPhotoUploaded(photo: AlbumPhoto) {
        this.authService.addPhotoToAlbum(this.albumId(), photo);
        // Refresh album data to show new photo
        this.album.set(this.authService.getAlbumById(this.albumId()));
    }
}
