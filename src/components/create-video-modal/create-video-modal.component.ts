import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { Album } from '../../models/album.model';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { ToastService } from '../../services/toast.service';
import { L10nService } from '../../services/l10n.service';

const LOADING_MESSAGES = [
  'videoMessage1',
  'videoMessage2',
  'videoMessage3',
  'videoMessage4',
  'videoMessage5',
];

@Component({
  selector: 'app-create-video-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, L10nPipe],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg" (click)="$event.stopPropagation()">
        
        @if (!generatedVideoUrl()) {
          <h3 class="text-xl font-bold mb-4">{{ 'createVideoTitle' | l10n }}: {{ album().name }}</h3>
        }

        @if (isLoading()) {
          <div class="text-center p-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p class="mt-4 text-gray-600 font-semibold">{{ currentLoadingMessage() | l10n }}</p>
          </div>
        } @else if (generatedVideoUrl()) {
            <h3 class="text-xl font-bold mb-4">{{ 'videoReady' | l10n }}</h3>
            <video [src]="generatedVideoUrl()" controls class="w-full rounded-lg"></video>
            <div class="mt-4 flex justify-end">
              <button (click)="close.emit()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{{ 'close' | l10n }}</button>
            </div>
        } @else {
          <form #form="ngForm" (ngSubmit)="generateVideo()">
            <p class="text-sm text-gray-600 mb-4">{{ 'createVideoDesc' | l10n:album().photos.length }}</p>

            <div class="mb-4">
              <label for="prompt" class="block text-sm font-medium text-gray-700">{{ 'prompt' | l10n }}</label>
              <textarea name="prompt" id="prompt" [(ngModel)]="prompt" required rows="3" class="mt-1 w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            
             <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">{{ 'firstImage' | l10n }}</label>
              <img [ngSrc]="album().photos[0].imageUrl" alt="First image" width="100" height="100" class="mt-1 rounded-md border h-24 w-24 object-cover">
            </div>

            @if (errorMessage()) {
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">{{ errorMessage() }}</span>
              </div>
            }

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" (click)="close.emit()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{{ 'cancel' | l10n }}</button>
              <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400">{{ 'generate' | l10n }}</button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVideoModalComponent {
    album = input.required<Album>();
    close = output<void>();

    private toastService = inject(ToastService);
    private l10nService = inject(L10nService);
    private ai: GoogleGenAI;

    isLoading = signal(false);
    errorMessage = signal<string | null>(null);
    generatedVideoUrl = signal<string | null>(null);
    currentLoadingMessage = signal(LOADING_MESSAGES[0]);

    prompt = 'Um vídeo de memórias, com um estilo cinematográfico e uma música inspiradora.';

    constructor() {
      // FIX: Use process.env['API_KEY'] to be safe with property names that might not be valid identifiers.
      this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY']! });
    }

    private async getBase64Image(url: string): Promise<string> {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async generateVideo(): Promise<void> {
        if (!this.album().photos.length) {
            this.errorMessage.set('O álbum não tem fotos.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.startLoadingMessages();

        try {
            const firstImageBase64 = await this.getBase64Image(this.album().photos[0].imageUrl);
            
            let operation = await this.ai.models.generateVideos({
              model: 'veo-2.0-generate-001',
              prompt: this.prompt,
              image: {
                imageBytes: firstImageBase64,
                mimeType: 'image/jpeg',
              },
              config: {
                numberOfVideos: 1
              }
            });

            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              // FIX: Correctly reference the class property `this.ai` instead of a local variable `ai`.
              operation = await this.ai.operations.getVideosOperation({operation: operation});
            }
            
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
                // FIX: Correctly use process.env['API_KEY']
                const response = await fetch(`${downloadLink}&key=${process.env['API_KEY']!}`);
                const videoBlob = await response.blob();
                this.generatedVideoUrl.set(URL.createObjectURL(videoBlob));
            } else {
                 throw new Error('Video generation failed to produce a download link.');
            }
        } catch (error) {
            console.error('Error generating video:', error);
            this.errorMessage.set(this.l10nService.translate('errorGeneratingVideo'));
        } finally {
            this.isLoading.set(false);
        }
    }

    private startLoadingMessages(): void {
        let index = 0;
        const interval = setInterval(() => {
            if (!this.isLoading()) {
                clearInterval(interval);
                return;
            }
            index = (index + 1) % LOADING_MESSAGES.length;
            this.currentLoadingMessage.set(LOADING_MESSAGES[index]);
        }, 4000);
    }
}
