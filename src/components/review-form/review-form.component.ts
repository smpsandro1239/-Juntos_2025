import { Component, ChangeDetectionStrategy, output, input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/review.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="submitReview()" class="bg-gray-50 p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">Deixe a sua avaliação</h3>
        <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">A sua classificação</label>
            <div class="flex space-x-1">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                    <button type="button" (click)="setRating(star)" (mouseover)="hoveredRating = star" (mouseleave)="hoveredRating = 0">
                        <svg class="w-8 h-8 cursor-pointer" 
                             [class.text-yellow-400]="star <= (hoveredRating || reviewForm.get('rating')?.value || 0)" 
                             [class.text-gray-300]="star > (hoveredRating || reviewForm.get('rating')?.value || 0)" 
                             fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                    </button>
                }
            </div>
             @if (reviewForm.get('rating')?.touched && reviewForm.get('rating')?.invalid) {
                <p class="text-red-500 text-xs italic mt-1">A classificação é obrigatória.</p>
             }
        </div>
        <div class="mb-4">
            <label for="comment" class="block text-gray-700 font-bold mb-2">O seu comentário</label>
            <textarea id="comment" formControlName="comment" rows="4" 
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Partilhe a sua experiência..."></textarea>
             @if (reviewForm.get('comment')?.touched && reviewForm.get('comment')?.invalid) {
                <p class="text-red-500 text-xs italic mt-1">O comentário é obrigatório.</p>
             }
        </div>
        <button type="submit" [disabled]="reviewForm.invalid"
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
            Submeter Avaliação
        </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  activityId = input.required<number>();
  reviewSubmit = output<Omit<Review, 'id'>>();
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  currentUser: User | null = this.authService.currentUser()
  hoveredRating = 0;

  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', Validators.required],
  });

  setRating(rating: number): void {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.currentUser) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.reviewForm.value;
    const newReview: Omit<Review, 'id'> = {
        activityId: this.activityId(),
        userName: this.currentUser.name,
        rating: formValue.rating!,
        comment: formValue.comment!,
        date: new Date().toISOString()
    };

    this.reviewSubmit.emit(newReview);
    this.reviewForm.reset({ rating: 0, comment: '' });
    // This is to reset touched state as well
    Object.keys(this.reviewForm.controls).forEach(key => {
        const control = this.reviewForm.get(key);
        control?.setErrors(null) ;
        control?.markAsUntouched();
        control?.markAsPristine();
    });
  }
}
