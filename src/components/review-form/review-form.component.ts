import { Component, ChangeDetectionStrategy, output, input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="bg-gray-50 p-6 rounded-lg mt-6">
      <h3 class="text-xl font-semibold mb-4">Deixe sua avaliação</h3>
      <div class="mb-4">
        <label for="userName" class="block text-gray-700 font-bold mb-2">Seu Nome</label>
        <input
          id="userName"
          type="text"
          formControlName="userName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        @if (reviewForm.get('userName')?.invalid && reviewForm.get('userName')?.touched) {
          <p class="text-red-500 text-xs italic mt-1">O nome é obrigatório.</p>
        }
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Sua Nota</label>
        <div class="flex space-x-1">
          @for (star of [1, 2, 3, 4, 5]; track star) {
            <button
              type="button"
              (click)="setRating(star)"
              class="text-3xl focus:outline-none transition-transform transform hover:scale-125"
              [class.text-yellow-400]="star <= (reviewForm.get('rating')?.value || 0)"
              [class.text-gray-300]="star > (reviewForm.get('rating')?.value || 0)"
            >
              ★
            </button>
          }
        </div>
        @if (reviewForm.get('rating')?.invalid && reviewForm.get('rating')?.touched) {
          <p class="text-red-500 text-xs italic mt-1">A nota é obrigatória.</p>
        }
      </div>
      <div class="mb-4">
        <label for="comment" class="block text-gray-700 font-bold mb-2">Comentário</label>
        <textarea
          id="comment"
          formControlName="comment"
          rows="4"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
        @if (reviewForm.get('comment')?.invalid && reviewForm.get('comment')?.touched) {
          <p class="text-red-500 text-xs italic mt-1">O comentário é obrigatório.</p>
        }
      </div>
      <button
        type="submit"
        [disabled]="reviewForm.invalid"
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
      >
        Enviar Avaliação
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  activityId = input.required<number>();
  reviewSubmit = output<Omit<Review, 'id' | 'date'>>();

  private fb = inject(FormBuilder);

  reviewForm = this.fb.group({
    userName: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', Validators.required],
  });

  setRating(rating: number): void {
    this.reviewForm.get('rating')?.setValue(rating);
    this.reviewForm.get('rating')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const formValue = this.reviewForm.value;
    this.reviewSubmit.emit({
      activityId: this.activityId(),
      userName: formValue.userName!,
      rating: formValue.rating!,
      comment: formValue.comment!,
    });
    this.reviewForm.reset({ rating: 0, userName: '', comment: '' });
     Object.keys(this.reviewForm.controls).forEach(key => {
      this.reviewForm.get(key)?.setErrors(null) ;
      this.reviewForm.get(key)?.markAsUntouched();
    });
  }
}
