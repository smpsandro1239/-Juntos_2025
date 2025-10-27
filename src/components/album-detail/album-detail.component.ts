import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';
import { PhotoUploadFormComponent } from '../photo-upload-form/photo-upload-form.component';
import { AlbumPhoto } from '../../models/album.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, PhotoUploadFormComponent],
  template: `
    @if(album(); as alb) {
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
                 <h1 class="text-3xl font-bold">{{ alb.name }}</h1>
                 <a [routerLink]="['/order-print', alb.id]" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Encomendar Impressão</a>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                @for(photo of alb.photos; track photo.imageUrl) {
                    <div class="group relative aspect-square">
                        <img [ngSrc]="photo.imageUrl" [alt]="photo.activityName" fill class="object-cover rounded-lg">
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end p-2">
                           <p class="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">{{ photo.activityName }}</p>
                        </div>
                    </div>
                }
            </div>

            @if(alb.photos.length === 0) {
                <p class="text-gray-500 text-center py-8">Este álbum ainda não tem fotos.</p>
            }

            <div class="mt-8 pt-8 border-t">
                <h2 class="text-2xl font-bold mb-4">Adicionar Nova Foto</h2>
                <app-photo-upload-form (photoAdded)="addPhoto($event)" />
            </div>
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

    album = signal<Album | undefined>(undefined);
    albumId = 0;

    constructor() {
        this.albumId = Number(this.route.snapshot.paramMap.get('id'));
        this.album.set(this.authService.getAlbumById(this.albumId));
    }

    addPhoto(photo: AlbumPhoto): void {
        this.authService.addPhotoToAlbum(this.albumId, photo);
        // The album signal needs to be updated to reflect the change
        this.album.set(this.authService.getAlbumById(this.albumId));
    }
}
