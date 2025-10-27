import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-2">Passaporte de Aventuras</h1>
        <p class="text-gray-600 mb-6">Colecione carimbos de todas as suas visitas!</p>

        @if (visitedActivities().length > 0) {
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                @for (activity of visitedActivities(); track activity.id) {
                    <a [routerLink]="['/activity', activity.id]" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors">
                        <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="80" height="80" class="w-20 h-20 rounded-full object-cover mb-2 border-2 border-teal-500">
                        <h3 class="font-semibold text-gray-700">{{ activity.name }}</h3>
                        <span class="text-sm text-gray-500">Visitado!</span>
                    </a>
                }
            </div>
        } @else {
            <div class="text-center py-10 border-2 border-dashed rounded-lg">
                <p class="text-gray-500">Ainda não tem carimbos no seu passaporte.</p>
                <a routerLink="/" class="mt-4 inline-block bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600">Comece a Explorar</a>
            </div>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent {
    private authService = inject(AuthService);
    private activityService = inject(ActivityService);

    visitedActivities = computed(() => {
        const visitedIds = this.authService.currentUser()?.visitedActivityIds || [];
        const allActivities = this.activityService.allActivities();
        return allActivities.filter(activity => visitedIds.includes(activity.id));
    });
}
