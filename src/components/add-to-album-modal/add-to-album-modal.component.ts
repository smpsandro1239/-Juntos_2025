import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';

@Component({
  selector: 'app-add-to-album-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" (click)="close.emit()">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">Adicionar ao Álbum</h3>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>

        <div class="mb-4">
          <img [src]="imageUrl()" alt="Foto a adicionar" class="rounded-lg max-h-48 mx-auto">
        </div>

        <form [formGroup]="albumForm" (ngSubmit)="addPhotoToAlbum()">
            <div class="mb-4">
                <label for="album" class="block text-gray-700 font-bold mb-2">Escolha um álbum</label>
                <select id="album" formControlName="albumId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    @for (album of albums(); track album.id) {
                        <option [value]="album.id">{{ album.name }}</option>
                    }
                </select>
            </div>
            
            <div class="flex items-center justify-between">
                <button type="submit" [disabled]="albumForm.invalid" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
                    Adicionar
                </button>
                <button type="button" (click)="close.emit()" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Cancelar
                </button>
            </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToAlbumModalComponent {
  imageUrl = input.required<string>();
  activityName = input.required<string>();
  close = output<void>();
  addPhoto = output<{albumId: number, photoUrl: string, activityName: string}>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  albums = this.authService.userAlbums;

  albumForm = this.fb.group({
    albumId: [this.albums()?.[0]?.id ?? '', Validators.required],
  });

  addPhotoToAlbum(): void {
    if (this.albumForm.invalid) return;
    
    const albumId = this.albumForm.value.albumId!;
    this.addPhoto.emit({
        albumId: +albumId,
        photoUrl: this.imageUrl(),
        activityName: this.activityName(),
    });
  }
}
