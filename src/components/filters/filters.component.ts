import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, L10nPipe],
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  activityService = inject(ActivityService);
  
  categories = this.activityService.getUniqueCategories;

  // Methods to update signals in the service
  onSearchChange(query: string) {
    this.activityService.searchQuery.set(query);
  }

  onCategoryChange(category: string) {
    this.activityService.selectedCategory.set(category);
  }

  onPriceChange(price: number) {
    this.activityService.maxPrice.set(price);
  }

  onRatingChange(rating: number) {
    this.activityService.minRating.set(rating);
  }

  toggleFree() {
    this.activityService.showOnlyFree.update(v => !v);
  }

  toggleRainy() {
    this.activityService.showRainyDayOk.update(v => !v);
  }

  toggleWheelchair() {
    this.activityService.showWheelchairAccessible.update(v => !v);
  }

  toggleStroller() {
    this.activityService.showStrollerAccessible.update(v => !v);
  }
}
