import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  activityService = inject(ActivityService);

  categories: Signal<string[]> = this.activityService.uniqueCategories;
  selectedCategory: Signal<string | null> = this.activityService.selectedCategory;
  showOnlyFree: Signal<boolean> = this.activityService.showOnlyFree;
  showRainyDayOk: Signal<boolean> = this.activityService.showRainyDayOk;

  onCategorySelect(category: string | null): void {
    const currentCategory = this.selectedCategory();
    this.activityService.setCategoryFilter(currentCategory === category ? null : category);
  }
}
