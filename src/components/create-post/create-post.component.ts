import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { CommunityPost } from '../../models/community-post.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <a routerLink="/community" class="text-teal-500 hover:text-teal-700 mb-4 inline-block">&larr; {{ 'backToCommunity' | l10n }}</a>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'newPost' | l10n }}</h1>
      
      <form #form="ngForm" (ngSubmit)="submitPost()">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">{{ 'title' | l10n }}</label>
          <input type="text" id="title" name="title" required [(ngModel)]="post.title" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
        </div>

        <div class="mb-4">
          <label for="category" class="block text-sm font-medium text-gray-700">{{ 'filtersCategory' | l10n }}</label>
          <select id="category" name="category" required [(ngModel)]="post.category" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>
        </div>

        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700">{{ 'content' | l10n }}</label>
          <textarea id="content" name="content" required [(ngModel)]="post.content" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" rows="8"></textarea>
        </div>

        <button type="submit" [disabled]="form.invalid" class="w-full bg-teal-500 text-white font-bold py-3 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400">
            {{ 'publishPost' | l10n }}
        </button>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
    private activityService = inject(ActivityService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    categories: CommunityPost['category'][] = ['Dicas', 'Eventos', 'Perguntas'];

    post = {
        title: '',
        category: this.categories[0],
        content: ''
    };

    submitPost() {
        const user = this.authService.currentUser();
        if (!user) return;

        this.activityService.addPost({
            ...this.post,
            authorName: user.name,
            date: new Date().toISOString()
        });
        
        this.toastService.show(this.authService.translate('postCreated'), 'success');
        this.router.navigate(['/community']);
    }
}
