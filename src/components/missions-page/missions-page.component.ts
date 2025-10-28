import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { Mission } from '../../models/mission.model';

@Component({
  selector: 'app-missions-page',
  standalone: true,
  imports: [CommonModule, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ 'missions' | l10n }}</h1>
      <p class="text-gray-600 mb-6">{{ 'missionsSubtitle' | l10n }}</p>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-1">
          <span class="text-base font-medium text-teal-700">{{ 'progress' | l10n }}</span>
          <span class="text-sm font-medium text-teal-700">{{ completedMissions() }} de {{ missions().length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-teal-500 h-2.5 rounded-full" [style.width.%]="progressPercentage()"></div>
        </div>
      </div>
      
      <!-- Missions List -->
      <div class="space-y-4">
        @for (mission of missions(); track mission.id) {
            <div class="border rounded-lg p-4 flex items-center" [class.bg-green-50]="mission.isCompleted">
                <div class="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-2xl" [class.bg-green-200]="mission.isCompleted" [class.bg-gray-200]="!mission.isCompleted">
                    @if (mission.isCompleted) {
                        <span>✅</span>
                    } @else {
                        <span>🎯</span>
                    }
                </div>
                <div class="ml-4 flex-grow">
                    <h2 class="font-bold text-lg text-gray-800">{{ mission.title }}</h2>
                    <p class="text-sm text-gray-600">{{ mission.description }}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg text-yellow-500">+{{ mission.points }} {{ 'points' | l10n }}</p>
                    @if (mission.isCompleted) {
                        <p class="text-sm font-semibold text-green-600">{{ 'completed' | l10n }}</p>
                    }
                </div>
            </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionsPageComponent {
    private authService = inject(AuthService);
    
    missions = computed(() => this.authService.currentUser()?.missions ?? []);
    
    completedMissions = computed(() => this.missions().filter(m => m.isCompleted).length);

    progressPercentage = computed(() => {
        const total = this.missions().length;
        if (total === 0) return 0;
        return (this.completedMissions() / total) * 100;
    });
}
