import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommunityPost } from '../../models/community-post.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, L10nPipe, DatePipe, FormsModule],
  template: `
    @if (post()) {
      @let p = post()!;
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <a routerLink="/community" class="text-teal-500 hover:text-teal-700 mb-4 inline-block">&larr; {{ 'backToCommunity' | l10n }}</a>
        
        <header class="border-b pb-4 mb-6">
            <span class="text-sm font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full">{{ p.category }}</span>
            <h1 class="text-3xl font-extrabold text-gray-800 mt-2">{{ p.title }}</h1>
            <p class="text-sm text-gray-500 mt-2">por {{ p.authorName }} - {{ p.date | date:'fullDate' }}</p>
        </header>

        <article class="prose max-w-none mb-8">
            <p>{{ p.content }}</p>
        </article>

        <section>
          <h2 class="text-2xl font-bold text-gray-700 mb-4">{{ 'comments' | l10n }} ({{ p.comments.length }})</h2>

          @if(isLoggedIn()) {
            <form #form="ngForm" (ngSubmit)="addComment(form)" class="mb-6">
                <textarea name="comment" required ngModel class="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" rows="3" placeholder="{{ 'writeComment' | l10n }}"></textarea>
                <button type="submit" [disabled]="form.invalid" class="mt-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400">
                    {{ 'submitComment' | l10n }}
                </button>
            </form>
          } @else {
             <div class="text-center p-4 bg-gray-100 rounded-lg mb-6">
                <p>{{ 'loginToComment' | l10n }} <a routerLink="/login" class="text-teal-600 font-semibold hover:underline">{{ 'loginHere' | l10n }}</a>.</p>
            </div>
          }

          <div class="space-y-4">
            @for(comment of p.comments; track comment.id) {
              <div class="bg-gray-50 p-4 rounded-lg border">
                <div class="flex justify-between items-center">
                    <p class="font-bold text-gray-800">{{ comment.authorName }}</p>
                    <span class="text-xs text-gray-500">{{ comment.date | date:'medium' }}</span>
                </div>
                <p class="mt-2 text-gray-700">{{ comment.content }}</p>
              </div>
            } @empty {
              <p class="text-gray-500">{{ 'noComments' | l10n }}</p>
            }
          </div>
        </section>
      </div>
    } @else {
      <p>A carregar post...</p>
    }
  `,
  styles: [`
    .prose p { margin-bottom: 1em; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  post = signal<CommunityPost | undefined>(undefined);
  isLoggedIn = this.authService.isLoggedIn;

  constructor() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      // Create a writable signal to hold the post
      const postSignal = signal(this.activityService.getPostById(postId));
      this.post.set(postSignal());

      // This is a simple way to refresh the view when comments are added.
      // In a more complex app, the service would return a signal.
      this.route.params.subscribe(() => {
          this.post.set(this.activityService.getPostById(postId));
      });
    }
  }

  addComment(form: NgForm): void {
      const user = this.authService.currentUser();
      if (!user || form.invalid) return;

      this.activityService.addCommentToPost(this.post()!.id, {
          authorName: user.name,
          date: new Date().toISOString(),
          content: form.value.comment
      });
      
      // Refresh the post data to show the new comment
      this.post.set(this.activityService.getPostById(this.post()!.id));
      form.resetForm();
      this.toastService.show(this.authService.translate('commentAdded'), 'success');
  }
}
