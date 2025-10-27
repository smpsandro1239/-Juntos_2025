import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (album(); as alb) {
      <div class="max-w-6xl mx-auto">
        <a routerLink="/albums" class="inline-flex items-center text-teal-600 hover:underline mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            Voltar aos Álbuns
        </a>

        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-3xl font-bold text-teal-600">{{ alb.name }}</h2>
            <p class="text-gray-600 mt-1">{{ alb.photos.length }} fotos</p>
        </div>

        @if (alb.photos.length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                @for(photo of alb.photos; track $index) {
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <img [src]="photo.imageUrl" [alt]="photo.activityName" class="w-full h-48 object-cover">
                        <div class="p-3">
                            <p class="font-semibold text-gray-700 truncate">{{ photo.activityName }}</p>
                        </div>
                    </div>
                }
            </div>
        } @else {
            <div class="text-center py-12">
                <p class="text-gray-500 text-lg">Este álbum ainda não tem fotos.</p>
                 <a routerLink="/" class="text-teal-600 hover:underline font-semibold mt-2 inline-block">Explore atividades para adicionar fotos!</a>
            </div>
        }
      </div>
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">Álbum não encontrado.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  album = signal<Album | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.album.set(this.authService.getAlbumById(id) ?? null);
    }
  }
}
