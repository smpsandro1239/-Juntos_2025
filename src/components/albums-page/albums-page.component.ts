import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-albums-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ 'yourAlbums' | l10n }}</h1>
        <button (click)="showCreateForm.set(!showCreateForm())" class="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
          {{ 'createNew' | l10n }}
        </button>
      </div>

      @if(showCreateForm()) {
        <div class="bg-gray-50 p-4 rounded-lg border mb-6">
            <form #form="ngForm" (ngSubmit)="createAlbum(); form.reset()" class="flex space-x-3">
                <input 
                    type="text" 
                    [(ngModel)]="newAlbumName" 
                    name="albumName"
                    required
                    placeholder="{{ 'albumName' | l10n }}"
                    class="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                >
                <button type="submit" [disabled]="!newAlbumName.trim()" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400">
                    {{ 'create' | l10n }}
                </button>
            </form>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (album of albums(); track album.id) {
            <div class="border rounded-lg shadow-sm overflow-hidden">
                <a [routerLink]="['/album', album.id]">
                    <div class="aspect-square bg-gray-200 flex items-center justify-center">
                        @if (album.photos.length > 0) {
                             <img [src]="album.photos[0].imageUrl" [alt]="album.name" class="w-full h-full object-cover">
                        } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    </div>
                </a>
                <div class="p-4 bg-white">
                    <h3 class="font-semibold truncate">{{ album.name }}</h3>
                    <p class="text-sm text-gray-500">{{ album.photos.length }} {{ 'photos' | l10n }}</p>
                    <a [routerLink]="['/album', album.id]" class="text-teal-600 text-sm font-semibold hover:underline mt-2 inline-block">{{ 'viewAlbum' | l10n }}</a>
                </div>
            </div>
        } @empty {
             <div class="sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12">
                <p class="text-gray-500">{{ 'noAlbums' | l10n }}</p>
            </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsPageComponent {
    private authService = inject(AuthService);

    albums = this.authService.userAlbums;
    showCreateForm = signal(false);
    newAlbumName = '';

    createAlbum() {
        if (this.newAlbumName.trim()) {
            this.authService.addAlbum(this.newAlbumName.trim());
            this.newAlbumName = '';
            this.showCreateForm.set(false);
        }
    }
}
