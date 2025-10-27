import { Injectable, signal, computed } from '@angular/core';
import { en } from '../i18n/en';
import { pt } from '../i18n/pt';

type Language = 'en' | 'pt';
type Dictionary = typeof en; // or typeof pt, they should have the same keys

@Injectable({
  providedIn: 'root'
})
export class L10nService {
  private translations: Record<Language, Dictionary> = { en, pt };
  private currentLang = signal<Language>('pt');

  language = this.currentLang.asReadonly();

  private dictionary = computed(() => this.translations[this.currentLang()]);

  constructor() {
    // In a real app, you might detect browser language or load from storage
  }

  setLanguage(lang: Language): void {
    if (this.translations[lang]) {
      this.currentLang.set(lang);
    }
  }

  translate(key: keyof Dictionary, ...args: any[]): string {
    let translation = this.dictionary()[key] || key;

    // Basic interpolation, e.g., "Hello {0}"
    if (args.length > 0) {
      args.forEach((arg, index) => {
        translation = translation.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
      });
    }

    return translation;
  }
}
