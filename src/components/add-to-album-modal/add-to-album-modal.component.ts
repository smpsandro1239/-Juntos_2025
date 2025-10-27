import { Component, ChangeDetectionStrategy, inject, input, output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-to-album-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
     <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close()">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold mb-4">Adicionar a um Álbum</h2>
        
        <div class="mb-4">
            <label for="album" class="block text-sm font-medium text-gray-700">Selecionar Álbum</label>
            <select id="album" name="album" [(ngModel)]="selectedAlbumId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                @for(album of albums(); track album.id) {
                    <option [value]="album.id">{{ album.name }}</option>
                }
            </select>
        </div>
        <button (click)="addPhotoToSelectedAlbum()" [disabled]="!selectedAlbumId" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400">Adicionar Foto</button>

        <div class="my-4 text-center text-gray-500">ou</div>

        <form (ngSubmit)="createNewAlbumAndAddPhoto()" class="space-y-2">
            <div>
                <label for="newAlbumName" class="block text-sm font-medium text-gray-700">Criar Novo Álbum</label>
                <input type="text" id="newAlbumName" name="newAlbumName" [(ngModel)]="newAlbumName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Nome do novo álbum">
            </div>
            <button type="submit" [disabled]="!newAlbumName" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400">Criar e Adicionar</button>
        </form>

        <button (click)="close()" class="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToAlbumModalComponent {
    activityName = input.required<string>();
    activityImageUrl = input.required<string>();
    closeModal = output<void>();

    private authService = inject(AuthService);
    albums = this.authService.userAlbums;

    selectedAlbumId: number | null = null;
    newAlbumName: string = '';

    addPhotoToSelectedAlbum(): void {
        if (!this.selectedAlbumId) return;
        this.authService.addPhotoToAlbum(this.selectedAlbumId, {
            imageUrl: this.activityImageUrl(),
            activityName: this.activityName()
        });
        this.close();
    }

    createNewAlbumAndAddPhoto(): void {
        if (!this.newAlbumName) return;
        this.authService.addAlbum(this.newAlbumName);
        // This is a simplification. In a real app, we'd get the new album's ID back.
        // Here we assume the last album is the new one.
        const newAlbum = this.albums().slice(-1)[0];
        if (newAlbum) {
            this.authService.addPhotoToAlbum(newAlbum.id, {
                imageUrl: this.activityImageUrl(),
                activityName: this.activityName()
            });
        }
        this.close();
    }

    close(): void {
        this.closeModal.emit();
    }
}
