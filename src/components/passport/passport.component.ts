import { Component, ChangeDetectionStrategy, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { Activity } from '../../models/activity.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-passport',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-2 text-teal-600">Passaporte Família</h2>
        <p class="text-center text-gray-600 mb-8">A sua coleção de aventuras e descobertas!</p>

        <!-- Progress Section -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 class="text-xl font-semibold mb-4">Progresso de Descoberta</h3>
            <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-teal-500 h-4 rounded-full" [style.width.%]="discoveryProgress()"></div>
            </div>
            <p class="text-right text-sm text-gray-600 mt-2">{{ visitedCategories().size }} de {{ allCategories().length }} categorias visitadas</p>
        </div>

        <!-- Stamps Section -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 class="text-xl font-semibold mb-4">Selos de Categoria</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
                @for(category of allCategories(); track category) {
                    <div class="p-4 rounded-lg border-2 transition-all duration-300"
                         [class]="visitedCategories().has(category) ? 'bg-teal-100 border-teal-500' : 'bg-gray-100 border-gray-200'">
                        <span class="text-4xl">
                            {{ getCategoryIcon(category) }}
                        </span>
                        <p class="mt-2 font-semibold" [class]="visitedCategories().has(category) ? 'text-teal-800' : 'text-gray-500'">
                            {{ category }}
                        </p>
                    </div>
                }
            </div>
        </div>

        <!-- Recent Visits Section -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Últimas Visitas</h3>
            @if (lastVisitedActivities().length > 0) {
                <div class="space-y-3">
                    @for(activity of lastVisitedActivities(); track activity.id) {
                        <a [routerLink]="['/activity', activity.id]" class="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <img [src]="activity.imageUrl" [alt]="activity.name" class="w-16 h-16 rounded-md object-cover mr-4">
                            <div>
                                <p class="font-bold text-gray-800">{{ activity.name }}</p>
                                <p class="text-sm text-gray-500">{{ activity.category }}</p>
                            </div>
                        </a>
                    }
                </div>
            } @else {
                <div class="text-center py-8">
                    <p class="text-gray-500">Ainda não marcou nenhuma atividade como visitada.</p>
                    <a routerLink="/" class="text-teal-600 hover:underline font-semibold mt-2 inline-block">Comece a explorar!</a>
                </div>
            }
        </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent {
    private authService = inject(AuthService);
    private activityService = inject(ActivityService);

    currentUser: Signal<User | null> = this.authService.currentUser;
    allCategories: Signal<string[]> = this.activityService.uniqueCategories;

    private visitedIds = computed(() => new Set(this.currentUser()?.visitedActivityIds || []));
    
    private visitedActivities = computed(() => {
        const ids = this.visitedIds();
        return this.activityService.filteredActivities().filter(a => ids.has(a.id));
    });

    visitedCategories = computed(() => {
        const categories = this.visitedActivities().map(a => a.category);
        return new Set(categories);
    });

    discoveryProgress = computed(() => {
        const total = this.allCategories().length;
        if (total === 0) return 0;
        return (this.visitedCategories().size / total) * 100;
    });

    lastVisitedActivities = computed(() => {
        const visited = this.currentUser()?.visitedActivityIds || [];
        const reversedVisited = [...visited].reverse().slice(0, 5); // Get last 5
        return reversedVisited.map(id => this.activityService.getActivityById(id)).filter((a): a is Activity => !!a);
    });

    getCategoryIcon(category: string): string {
        switch(category) {
            case 'Museu': return '🏛️';
            case 'Ar Livre': return '🌳';
            case 'Aquário': return '🐠';
            case 'Parque Temático': return '🎢';
            default: return '📍';
        }
    }
}
