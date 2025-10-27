import { Component, ChangeDetectionStrategy, input, output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlbumPhoto } from '../../models/album.model';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-photo-upload-form',
  standalone: true,
  imports: [FormsModule],
  template: `
     <form (ngSubmit)="addPhoto()" class="space-y-4">
        <div>
            <label for="photo" class="block text-sm font-medium text-gray-700">Ficheiro da Foto</label>
            <input type="file" id="photo" name="photo" (change)="onFileSelected($event)" accept="image/*" required class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
        </div>
        
        @if (previewUrl) {
            <img [src]="previewUrl" alt="Preview" class="max-h-40 rounded-md mx-auto">
        }

        <div>
            <label for="activityName" class="block text-sm font-medium text-gray-700">Atividade Associada</label>
            <input type="text" id="activityName" name="activityName" [(ngModel)]="activityName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" placeholder="Nome da atividade">
        </div>

        <button type="submit" [disabled]="!selectedFile || !activityName" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400">Adicionar Foto</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadFormComponent {
    photoAdded = output<AlbumPhoto>();

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    activityName: string = '';

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            const reader = new FileReader();
            reader.onload = () => this.previewUrl = reader.result as string;
            reader.readAsDataURL(this.selectedFile);
        }
    }

    addPhoto(): void {
        if (!this.previewUrl || !this.activityName) {
            return;
        }

        this.photoAdded.emit({
            imageUrl: this.previewUrl,
            activityName: this.activityName
        });

        // Reset form
        this.selectedFile = null;
        this.previewUrl = null;
        this.activityName = '';
    }
}
