import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Album } from '../../models/album.model';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-video-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, L10nPipe],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="close.emit()">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
        
        @if (!videoUrl()) {
          <h3 class="text-xl font-bold mb-2">{{ 'createVideoTitle' | l10n }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ 'createVideoSubtitle' | l10n }}</p>
        }

        @if (isGenerating()) {
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p class="mt-4 text-gray-600 font-semibold">{{ 'generatingVideo' | l10n }}</p>
            <p class="text-sm text-gray-500">{{ generatingMessage() }}</p>
          </div>
        } @else if (videoUrl()) {
          <div class="text-center py-8">
             <div class="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto mb-4">
                🎉
            </div>
            <h3 class="text-xl font-bold mb-2">{{ 'videoReady' | l10n }}</h3>
            <a [href]="videoUrl()" download="juntos-video.mp4" class="mt-4 inline-block bg-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors">
              {{ 'downloadVideo' | l10n }}
            </a>
          </div>
        } @else {
          <form #form="ngForm" (ngSubmit)="generateVideo()">
            <div class="mb-4">
              <label for="theme" class="block text-sm font-medium text-gray-700">{{ 'videoTheme' | l10n }}</label>
              <input type="text" id="theme" name="theme" [(ngModel)]="videoTheme" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm" placeholder="{{ 'videoThemePlaceholder' | l10n }}">
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" (click)="close.emit()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{{ 'cancel' | l10n }}</button>
              <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400">{{ 'generateVideo' | l10n }}</button>
            </div>
          </form>
        }

        @if (videoUrl()) {
            <div class="mt-6 flex justify-end">
                <button (click)="close.emit()" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">{{ 'close' | l10n }}</button>
            </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVideoModalComponent {
  album = input.required<Album>();
  close = output<void>();

  private authService = inject(AuthService);

  videoTheme = signal('');
  isGenerating = signal(false);
  generatingMessage = signal('');
  videoUrl = signal<string | null>(null);
  
  private messageInterval: any;

  // In a real app, this would call the Google GenAI VEO model.
  // This is a simulation for demonstration purposes.
  generateVideo(): void {
    this.isGenerating.set(true);
    this.startGeneratingMessages();

    setTimeout(() => {
      this.isGenerating.set(false);
      this.stopGeneratingMessages();
      // Placeholder video URL
      this.videoUrl.set('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm');
    }, 10000); // Simulate a 10-second generation time
  }

  private startGeneratingMessages(): void {
    const messages = [
      this.authService.translate('generatingVideoMessage1'),
      this.authService.translate('generatingVideoMessage2'),
      this.authService.translate('generatingVideoMessage3'),
    ];
    let index = 0;
    this.generatingMessage.set(messages[index]);
    this.messageInterval = setInterval(() => {
      index = (index + 1) % messages.length;
      this.generatingMessage.set(messages[index]);
    }, 3000);
  }

  private stopGeneratingMessages(): void {
    clearInterval(this.messageInterval);
    this.generatingMessage.set('');
  }
}
