import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="flex items-center">
      @for (star of stars(); track $index) {
        <svg
          class="w-5 h-5"
          [class.text-yellow-400]="star === 'full'"
          [class.text-gray-300]="star === 'empty'"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      }
      @if (showRatingValue()) {
        <span class="text-gray-600 ml-2 text-sm">({{ rating().toFixed(1) }})</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  rating = input.required<number>();
  showRatingValue = input<boolean>(false);

  stars = computed(() => {
    const fullStars = Math.round(this.rating());
    const emptyStars = 5 - fullStars;
    return [
      ...Array(fullStars).fill('full'),
      ...Array(emptyStars).fill('empty')
    ];
  });
}
