import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Album, AlbumPhoto } from '../../models/album.model';
import { NgOptimizedImage } from '@angular/common';
import { PhotoUploadFormComponent } from '../photo-upload-form/photo-upload-form.component';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, PhotoUploadFormComponent, L10nPipe],
  template: `
    @if (album()) {
      @let alb = album()!;
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <div class="flex items-center justify-between mb-6">
            <div>
                <a routerLink="/albums" class="text-teal-500 hover:text-teal-700 mb-2 block">&larr; {{ 'myAlbums' | l10n }}</a>
                <h1 class="text-3xl font-bold text-gray-800">{{ 'album' | l10n }}: {{ alb.name }}</h1>
            </div>
            @if (alb.photos.length > 0) {
                 <a [routerLink]="['/order-print', alb.id]" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                    {{ 'printAlbum' | l10n }}
                </a>
            }
        </div>

        <div class="mb-8">
            <app-photo-upload-form [albumId]="alb.id" (photoUploaded)="onPhotoUploaded($event)" />
        </div>

        @if(alb.photos.length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                @for (photo of alb.photos; track photo.imageUrl) {
                    <div class="group relative aspect-square">
                        <img [ngSrc]="photo.imageUrl" [alt]="photo.activityName" width="300" height="300" class="w-full h-full object-cover rounded-md">
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end p-2">
                            <p class="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">{{ photo.activityName }}</p>
                        </div>
                    </div>
                }
            </div>
        } @else {
            <div class="text-center py-12 border-2 border-dashed rounded-lg">
                <p class="text-gray-500">{{ 'noPhotos' | l10n }}</p>
                <p class="text-gray-400 text-sm mt-1">{{ 'uploadPhoto' | l10n }}</p>
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

    albumId = computed(() => Number(this.route.snapshot.paramMap.get('id')));
    album = signal<Album | undefined>(undefined);

    constructor() {
        this.refetchAlbum();
    }
    
    onPhotoUploaded(photo: AlbumPhoto) {
        this.authService.addPhotoToAlbum(this.albumId(), photo);
        this.refetchAlbum();
    }
    
    private refetchAlbum() {
        if(this.albumId()) {
            this.album.set(this.authService.getAlbumById(this.albumId()));
        }
    }
}
