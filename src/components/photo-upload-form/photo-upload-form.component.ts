import { Component, ChangeDetectionStrategy, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-photo-upload-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="uploadForm" (ngSubmit)="submitImage()" class="bg-gray-50 p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4">Partilhe a sua foto</h3>
      <p class="text-sm text-gray-600 mb-4">
        Cole o URL de uma imagem para a adicionar à galeria. Use, por exemplo, um link do <a href="https://picsum.photos/" target="_blank" class="text-teal-600 hover:underline">Picsum Photos</a>.
      </p>
      <div class="mb-4">
        <label for="imageUrl" class="block text-gray-700 font-bold mb-2">URL da Imagem</label>
        <input type="url" id="imageUrl" formControlName="imageUrl"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="https://picsum.photos/seed/minhafoto/400/300">
        @if (uploadForm.get('imageUrl')?.touched && uploadForm.get('imageUrl')?.invalid) {
          <p class="text-red-500 text-xs italic mt-1">Por favor, insira um URL válido.</p>
        }
      </div>
      <div class="flex items-center gap-4">
        <button type="submit" [disabled]="uploadForm.invalid"
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
          Enviar Foto
        </button>
        <button type="button" (click)="cancel.emit()"
                class="bg-transparent hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded">
          Cancelar
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadFormComponent {
  imageSubmit = output<{ imageUrl: string }>();
  cancel = output<void>();
  
  private fb = inject(FormBuilder);

  uploadForm = this.fb.group({
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

  submitImage(): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }
    
    this.imageSubmit.emit({ imageUrl: this.uploadForm.value.imageUrl! });
    this.uploadForm.reset();
  }
}