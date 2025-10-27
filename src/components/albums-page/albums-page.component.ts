import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-albums-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Meus Álbuns de Memórias</h1>
        <form (ngSubmit)="addAlbum()" class="flex space-x-2">
            <input type="text" name="newAlbumName" [(ngModel)]="newAlbumName" placeholder="Novo álbum" class="px-3 py-2 border rounded-md">
            <button type="submit" [disabled]="!newAlbumName" class="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 disabled:bg-gray-400">Criar</button>
        </form>
      </div>

      @if (albums().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for(album of albums(); track album.id) {
            <a [routerLink]="['/album', album.id]" class="block group">
              <div class="relative aspect-square w-full bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  @if (album.photos.length > 0) {
                      <img [ngSrc]="album.photos[0].imageUrl" [alt]="album.name" fill class="object-cover transition-transform group-hover:scale-105">
                  } @else {
                      <div class="text-gray-400">Álbum Vazio</div>
                  }
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                      <h3 class="text-white font-bold text-lg">{{ album.name }} ({{ album.photos.length }})</h3>
                  </div>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="text-center py-10 border-2 border-dashed rounded-lg">
            <p class="text-gray-500">Ainda não criou nenhum álbum.</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsPageComponent {
    authService = inject(AuthService);
    albums = this.authService.userAlbums;
    newAlbumName = '';

    addAlbum(): void {
        if (!this.newAlbumName.trim()) return;
        this.authService.addAlbum(this.newAlbumName);
        this.newAlbumName = '';
    }
}
