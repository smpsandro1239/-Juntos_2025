import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlbumPhoto } from '../../models/album.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-photo-upload-form',
  standalone: true,
  imports: [FormsModule, L10nPipe],
  template: `
    <div class="p-4 bg-gray-50 rounded-lg border">
      <h3 class="text-lg font-semibold mb-2">{{ 'uploadPhoto' | l10n }}</h3>
      <form #form="ngForm" (ngSubmit)="uploadPhoto(form.value.activityName); form.reset()" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div class="md:col-span-2">
            <label for="activityName" class="block text-sm font-medium text-gray-700">Atividade (opcional)</label>
            <input type="text" name="activityName" ngModel id="activityName" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
        </div>
        <div>
            <!-- In a real app, this would be an <input type="file"> -->
            <button type="submit" class="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                Carregar
            </button>
        </div>
      </form>
       <p class="text-xs text-gray-500 mt-2">Nota: A funcionalidade de upload é simulada. Será adicionada uma foto de exemplo.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadFormComponent {
    albumId = input.required<number>();
    photoUploaded = output<AlbumPhoto>();

    uploadPhoto(activityName: string) {
        // Mock photo upload
        const randomId = Math.floor(Math.random() * 1000);
        const newPhoto: AlbumPhoto = {
            imageUrl: `https://picsum.photos/seed/${this.albumId()}-${randomId}/400/400`,
            activityName: activityName || 'Memória Especial'
        };
        this.photoUploaded.emit(newPhoto);
    }
}
