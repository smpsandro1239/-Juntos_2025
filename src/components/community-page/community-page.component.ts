import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { CommunityPost } from '../../models/community-post.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-community-page',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe, DatePipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ 'communityTitle' | l10n }}</h1>
          <p class="text-gray-600">{{ 'communitySubtitle' | l10n }}</p>
        </div>
        @if(isLoggedIn()) {
          <a routerLink="/create-post" class="bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors">
            {{ 'newPost' | l10n }}
          </a>
        }
      </div>

      <!-- Category Filters -->
      <div class="flex space-x-2 mb-8 border-b pb-4">
        <button 
          (click)="selectedCategory.set(null)"
          class="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          [class.bg-teal-500]="selectedCategory() === null"
          [class.text-white]="selectedCategory() === null"
          [class.hover:bg-teal-100]="selectedCategory() !== null"
        >
          {{ 'all' | l10n }}
        </button>
        @for(category of categories; track category) {
           <button 
            (click)="selectedCategory.set(category)"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            [class.bg-teal-500]="selectedCategory() === category"
            [class.text-white]="selectedCategory() === category"
            [class.hover:bg-teal-100]="selectedCategory() !== category"
          >
            {{ category }}
          </button>
        }
      </div>

      <!-- Posts Feed -->
      <div class="space-y-6">
        @for(post of filteredPosts(); track post.id) {
          <div class="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <a [routerLink]="['/post', post.id]"><h2 class="text-xl font-bold text-gray-800 hover:text-teal-600">{{ post.title }}</h2></a>
                <p class="text-sm text-gray-500">por {{ post.authorName }} - {{ post.date | date:'mediumDate' }}</p>
              </div>
              <span class="text-sm font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full">{{ post.category }}</span>
            </div>
            <p class="mt-4 text-gray-700">{{ post.content.substring(0, 150) }}...</p>
            <div class="flex justify-between items-center mt-4">
              <div class="flex space-x-4 text-sm text-gray-500">
                <span>❤️ {{ post.likes }} {{ 'likes' | l10n }}</span>
                <span>💬 {{ post.comments.length }} {{ 'comments' | l10n }}</span>
              </div>
              <a [routerLink]="['/post', post.id]" class="text-teal-600 font-semibold text-sm hover:underline">{{ 'readMore' | l10n }}</a>
            </div>
          </div>
        } @empty {
          <div class="text-center py-12">
            <p class="text-gray-500">{{ 'noPosts' | l10n }}</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityPageComponent {
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  allPosts = this.activityService.allPosts;
  
  categories: CommunityPost['category'][] = ['Dicas', 'Eventos', 'Perguntas'];
  selectedCategory = signal<CommunityPost['category'] | null>(null);

  filteredPosts = computed(() => {
    const posts = this.allPosts();
    const category = this.selectedCategory();
    if (!category) {
      return posts;
    }
    return posts.filter(p => p.category === category);
  });
}
