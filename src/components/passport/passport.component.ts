import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ 'passportTitle' | l10n }}</h1>
        <p class="text-gray-600 mb-8">{{ 'passportDescription' | l10n }}</p>

        @if(visitedActivities().length > 0) {
            <div class="border-t pt-6">
                <h2 class="text-2xl font-semibold mb-4">{{ 'visitedActivities' | l10n }} ({{ visitedActivities().length }})</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    @for (activity of visitedActivities(); track activity.id) {
                        <a [routerLink]="['/activity', activity.id]" class="group block">
                            <div class="relative">
                                <img [ngSrc]="activity.imageUrl" [alt]="activity.name" width="300" height="200" class="w-full h-40 object-cover rounded-lg shadow-sm">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                                <h3 class="absolute bottom-2 left-3 text-white font-bold text-lg">{{ activity.name }}</h3>
                            </div>
                        </a>
                    }
                </div>
            </div>
        } @else {
            <div class="text-center py-12 border-2 border-dashed rounded-lg">
                <p class="text-gray-500">{{ 'noVisitedActivities' | l10n }}</p>
            </div>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent {
    private authService = inject(AuthService);
    private activityService = inject(ActivityService);

    user = this.authService.currentUser;
    allActivities = this.activityService.allActivities;

    visitedActivities = computed(() => {
        const visitedIds = this.user()?.visitedActivityIds || [];
        if(visitedIds.length === 0) return [];
        
        const visitedIdSet = new Set(visitedIds);
        return this.allActivities().filter(activity => visitedIdSet.has(activity.id));
    });
}
