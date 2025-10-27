import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgOptimizedImage } from '@angular/common';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-albums-page',
  standalone: true,
  imports: [RouterLink, FormsModule, NgOptimizedImage, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'yourAlbums' | l10n }}</h1>

      <div class="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 class="text-xl font-semibold mb-2">{{ 'createNew' | l10n }}</h2>
        <form #form="ngForm" (ngSubmit)="addAlbum(form.value.albumName); form.reset()" class="flex items-center">
            <input type="text" name="albumName" ngModel required class="flex-grow border-gray-300 rounded-l-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="{{ 'albumName' | l10n }}">
            <button type="submit" [disabled]="form.invalid" class="bg-teal-500 text-white px-6 py-2 rounded-r-md hover:bg-teal-600 disabled:bg-gray-400 transition-colors">{{ 'create' | l10n }}</button>
        </form>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (album of albums(); track album.id) {
            <a [routerLink]="['/album', album.id]" class="group block bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div class="relative w-full h-40 flex items-center justify-center">
                   @if (album.photos.length > 0) {
                     <img [ngSrc]="album.photos[0].imageUrl" [alt]="album.name" width="300" height="200" class="w-full h-full object-cover">
                   } @else {
                     <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                     </div>
                   }
                   <div class="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-40 transition-all"></div>
                </div>
                <div class="p-4 bg-white">
                    <h3 class="font-bold text-lg text-gray-800">{{ album.name }}</h3>
                    <p class="text-sm text-gray-500">{{ album.photos.length }} {{ 'photos' | l10n }}</p>
                </div>
            </a>
        }
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsPageComponent {
    private authService = inject(AuthService);
    albums = this.authService.userAlbums;

    addAlbum(name: string) {
        if(name && name.trim()) {
            this.authService.addAlbum(name.trim());
        }
    }
}
