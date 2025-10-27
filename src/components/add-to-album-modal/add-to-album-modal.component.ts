import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-add-to-album-modal',
  standalone: true,
  imports: [FormsModule, L10nPipe],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeModal()">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
        <h3 class="text-xl font-bold mb-4">{{ 'addToAlbum' | l10n }}</h3>
        
        <div class="mb-4">
          <label for="album-select" class="block text-sm font-medium text-gray-700">{{ 'selectAlbum' | l10n }}</label>
          <select id="album-select" [(ngModel)]="selectedAlbumId" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
            @for(album of albums(); track album.id) {
              <option [value]="album.id">{{ album.name }}</option>
            }
          </select>
        </div>
        
        <p class="text-center my-2 text-gray-500">{{ 'or' | l10n }}</p>

        <div class="mb-4">
            <label for="new-album" class="block text-sm font-medium text-gray-700">{{ 'createNewAlbum' | l10n }}</label>
            <div class="flex mt-1">
                <input type="text" id="new-album" [(ngModel)]="newAlbumName" class="flex-grow border-gray-300 rounded-l-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                <button (click)="createNewAlbum()" [disabled]="!newAlbumName.trim()" class="bg-gray-200 px-4 rounded-r-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors">{{ 'create' | l10n }}</button>
            </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button (click)="closeModal()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{{ 'cancel' | l10n }}</button>
          <button (click)="addToAlbum()" [disabled]="!selectedAlbumId" class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-400">{{ 'add' | l10n }}</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToAlbumModalComponent {
    activityName = input.required<string>();
    activityImageUrl = input.required<string>();
    close = output<void>();

    private authService = inject(AuthService);
    
    albums = this.authService.userAlbums;
    selectedAlbumId: number | null = null;
    newAlbumName = '';
    
    constructor() {
        if (this.albums().length > 0) {
            this.selectedAlbumId = this.albums()[0].id;
        }
    }

    closeModal() {
        this.close.emit();
    }

    addToAlbum() {
        if (this.selectedAlbumId) {
            this.authService.addPhotoToAlbum(this.selectedAlbumId, {
                imageUrl: this.activityImageUrl(),
                activityName: this.activityName()
            });
            this.closeModal();
        }
    }

    createNewAlbum() {
        const name = this.newAlbumName.trim();
        if (name) {
            this.authService.addAlbum(name);
            this.newAlbumName = '';
            // A bit of a hack to select the newly created album. Assumes it's the last one.
            const newAlbum = this.albums().slice(-1)[0];
            if (newAlbum) {
                this.selectedAlbumId = newAlbum.id;
            }
        }
    }
}
