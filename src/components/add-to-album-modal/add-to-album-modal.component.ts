import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AlbumPhoto } from '../../models/album.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-add-to-album-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, L10nPipe],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
        <h3 class="text-xl font-bold mb-4">{{ 'addToAlbum' | l10n }}</h3>
        
        <form #form="ngForm" (ngSubmit)="addToAlbum()">
          <div class="mb-4">
            <label for="album" class="block text-sm font-medium text-gray-700">{{ 'selectAlbum' | l10n }}</label>
            <select name="album" [(ngModel)]="selectedAlbumId" id="album" class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
              @for(album of albums(); track album.id) {
                <option [value]="album.id">{{ album.name }}</option>
              }
            </select>
          </div>

          <div class="text-center my-4 text-gray-500">{{ 'or' | l10n }}</div>

          <div class="mb-4">
            <label for="newAlbum" class="block text-sm font-medium text-gray-700">{{ 'createNewAlbum' | l10n }}</label>
            <input type="text" name="newAlbum" [(ngModel)]="newAlbumName" id="newAlbum" class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{{ 'cancel' | l10n }}</button>
            <button type="submit" [disabled]="!canSubmit()" class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-400">{{ 'add' | l10n }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToAlbumModalComponent {
  activityName = input.required<string>();
  imageUrl = input.required<string>();
  
  close = output<void>();
  photoAdded = output<void>();

  private authService = inject(AuthService);
  
  albums = this.authService.userAlbums;
  selectedAlbumId = signal<number>(this.albums()[0]?.id || 0);
  newAlbumName = signal('');

  canSubmit(): boolean {
    return !!this.selectedAlbumId() || !!this.newAlbumName().trim();
  }
  
  addToAlbum(): void {
    if (!this.canSubmit()) return;

    const photo: AlbumPhoto = {
      imageUrl: this.imageUrl(),
      activityName: this.activityName()
    };

    if (this.newAlbumName().trim()) {
      this.authService.addAlbum(this.newAlbumName().trim());
      // A bit of a hack: find the newest album to add the photo to.
      // In a real app, addAlbum would return the new album ID.
      const newAlbum = this.albums().reduce((latest, current) => latest.id > current.id ? latest : current);
      this.authService.addPhotoToAlbum(newAlbum.id, photo);
    } else {
      this.authService.addPhotoToAlbum(this.selectedAlbumId(), photo);
    }
    
    this.photoAdded.emit();
  }
}
