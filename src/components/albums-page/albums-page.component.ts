import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';

@Component({
  selector: 'app-albums-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-2 text-teal-600">Meus Álbuns de Fotos</h2>
        <p class="text-center text-gray-600 mb-8">Reviva as suas memórias favoritas.</p>

        <!-- New Album Form -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <form [formGroup]="newAlbumForm" (ngSubmit)="createNewAlbum()" class="flex flex-col sm:flex-row gap-4 items-center">
                <input type="text" formControlName="albumName" placeholder="Nome do novo álbum"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow">
                <button type="submit" [disabled]="newAlbumForm.invalid"
                        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 w-full sm:w-auto">
                    Criar Álbum
                </button>
            </form>
        </div>

        <!-- Albums Grid -->
        @if (albums().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                @for(album of albums(); track album.id) {
                    <a [routerLink]="['/album', album.id]" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                        <div class="relative h-48 bg-gray-200 flex items-center justify-center">
                            @if (album.photos.length > 0) {
                                <img [src]="album.photos[0].imageUrl" [alt]="album.name" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black bg-opacity-30"></div>
                            } @else {
                                <span class="text-gray-400 text-5xl">🖼️</span>
                            }
                             <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                                {{ album.photos.length }} fotos
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-xl font-semibold truncate group-hover:text-teal-600 transition-colors">{{ album.name }}</h3>
                        </div>
                    </a>
                }
            </div>
        } @else {
            <div class="text-center py-12">
                <p class="text-gray-500 text-lg">Ainda não tem álbuns. Crie um para começar a guardar as suas memórias!</p>
            </div>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsPageComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    albums = this.authService.userAlbums;

    newAlbumForm = this.fb.group({
        albumName: ['', Validators.required]
    });

    createNewAlbum() {
        if (this.newAlbumForm.invalid) return;

        const albumName = this.newAlbumForm.value.albumName!;
        this.authService.addAlbum(albumName);
        this.newAlbumForm.reset();
    }
}
