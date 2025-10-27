import { Pipe, PipeTransform, inject } from '@angular/core';
import { L10nService } from '../services/l10n.service';
import { en } from '../i18n/en'; // for keyof Dictionary type

type Dictionary = typeof en;

@Pipe({
  name: 'l10n',
  standalone: true,
  pure: false // This allows it to update when language changes
})
export class L10nPipe implements PipeTransform {

  private l10n = inject(L10nService);

  transform(key: keyof Dictionary, ...args: any[]): string {
    return this.l10n.translate(key, ...args);
  }
}
