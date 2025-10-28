import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { ThematicSeries, PassportStamp } from '../../models/thematic-series.model';

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ 'passportTitle' | l10n }}</h1>
      <p class="text-gray-600 mb-8">{{ 'passportSubtitle' | l10n }}</p>

      @if(passportSeries().length > 0) {
        <div class="space-y-8">
            @for(series of passportSeries(); track series.id) {
                <section>
                    <h2 class="text-2xl font-bold text-gray-700 mb-1">{{ series.name }}</h2>
                    <p class="text-gray-500 mb-4">{{ series.description }}</p>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        @for(stamp of series.stamps; track stamp.id) {
                            <div class="text-center">
                                <div class="relative aspect-square rounded-full p-2 border-2" [class.border-yellow-400]="stamp.collected" [class.border-gray-300]="!stamp.collected">
                                     <img 
                                        [ngSrc]="stamp.imageUrl" 
                                        [alt]="stamp.name" 
                                        width="100" height="100" 
                                        class="w-full h-full object-cover rounded-full"
                                        [class.grayscale]="!stamp.collected"
                                        [class.opacity-50]="!stamp.collected"
                                     >
                                     @if(stamp.collected) {
                                        <div class="absolute -bottom-2 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                     }
                                </div>
                                <p class="mt-2 text-sm font-semibold truncate">{{ stamp.name }}</p>
                                @if(stamp.collected) {
                                    <p class="text-xs text-yellow-600 font-bold">{{ 'collected' | l10n }}</p>
                                }
                            </div>
                        }
                    </div>
                </section>
            }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent {
    private authService = inject(AuthService);
    
    private user = this.authService.currentUser;

    passportSeries = computed(() => {
        const currentUser = this.user();
        if (!currentUser) return [];

        // Update collected status based on user's collected stamps
        return currentUser.passport.thematicSeries.map(series => ({
            ...series,
            stamps: series.stamps.map(stamp => ({
                ...stamp,
                collected: currentUser.passport.stampsCollected.includes(stamp.id)
            }))
        }));
    });
}
