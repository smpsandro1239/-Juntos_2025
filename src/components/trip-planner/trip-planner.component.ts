import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { GoogleGenAI } from '@google/genai';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [FormsModule, L10nPipe, MarkdownPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800">{{ 'tripPlannerTitle' | l10n }}</h1>
        <p class="text-gray-600 mt-2">{{ 'tripPlannerSubtitle' | l10n }}</p>
      </div>

      <form #form="ngForm" (ngSubmit)="generatePlan()" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700">{{ 'tripDuration' | l10n }}</label>
          <div class="flex items-center mt-1">
            <input type="number" id="duration" name="duration" [(ngModel)]="duration" required min="1" max="14" class="w-24 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
            <span class="ml-2 text-gray-700">{{ 'days' | l10n }}</span>
          </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">{{ 'numberOfPeople' | l10n }}</label>
            <div class="flex items-center mt-1 space-x-4">
                <div class="flex items-center">
                    <input type="number" id="adults" name="adults" [(ngModel)]="adults" required min="1" class="w-16 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                    <label for="adults" class="ml-2 text-gray-700">{{ 'adults' | l10n }}</label>
                </div>
                 <div class="flex items-center">
                    <input type="number" id="children" name="children" [(ngModel)]="children" required min="0" class="w-16 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                    <label for="children" class="ml-2 text-gray-700">{{ 'children' | l10n }}</label>
                </div>
            </div>
        </div>
        
        <div class="md:col-span-2">
            <label for="interests" class="block text-sm font-medium text-gray-700">{{ 'interests' | l10n }}</label>
            <input type="text" id="interests" name="interests" [(ngModel)]="interests" required placeholder="{{ 'interestsPlaceholder' | l10n }}" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
        </div>

        <div>
            <label for="pace" class="block text-sm font-medium text-gray-700">{{ 'travelPace' | l10n }}</label>
            <select id="pace" name="pace" [(ngModel)]="pace" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                <option value="Relaxado">{{ 'relaxed' | l10n }}</option>
                <option value="Moderado">{{ 'moderate' | l10n }}</option>
                <option value="Intenso">{{ 'fastPaced' | l10n }}</option>
            </select>
        </div>

        <div class="md:col-start-2">
            <button type="submit" [disabled]="form.invalid || isLoading()" class="w-full bg-teal-500 text-white py-3 rounded-md font-bold text-lg hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                @if (isLoading()) {
                    <span>{{ 'generating' | l10n }}</span>
                } @else {
                    <span>{{ 'generatePlan' | l10n }}</span>
                }
            </button>
        </div>
      </form>
      
      @if (plan()) {
        <div class="mt-12 border-t pt-8">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">{{ 'yourPlan' | l10n }}</h2>
            <div class="prose max-w-none" [innerHTML]="plan() | markdown"></div>
        </div>
      }

      @if (error()) {
         <div class="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline">{{ error() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .prose h2 { @apply text-xl font-semibold mt-6 mb-3; }
    .prose h3 { @apply text-lg font-semibold mt-4 mb-2; }
    .prose p { @apply my-2; }
    .prose ul { @apply list-disc list-inside pl-4 my-2; }
    .prose li { @apply mb-1; }
    .prose strong { @apply font-bold; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  // Form state
  duration = signal(3);
  adults = signal(2);
  children = signal(1);
  interests = signal('museus, ar livre, comida local');
  pace = signal('Moderado');

  // API state
  isLoading = signal(false);
  plan = signal<string | null>(null);
  error = signal<string | null>(null);

  async generatePlan(): Promise<void> {
    this.isLoading.set(true);
    this.plan.set(null);
    this.error.set(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key not found. Please set the API_KEY environment variable.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Crie um roteiro de viagem detalhado para uma família em Lisboa, Portugal.
        - Duração: ${this.duration()} dias.
        - Família: ${this.adults()} adultos e ${this.children()} criança(s).
        - Interesses: ${this.interests()}.
        - Ritmo: ${this.pace()}.
        
        Forneça um plano dia a dia. Para cada dia, sugira:
        1. Atividades da manhã, tarde e noite que sejam adequadas para crianças.
        2. Sugestões de restaurantes para almoço e jantar que sejam acolhedores para famílias.
        3. Dicas práticas sobre transportes ou bilhetes.
        
        Formate a resposta em Markdown, com cabeçalhos para cada dia. Seja criativo e prático.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      this.plan.set(response.text);

    } catch (e: any) {
      console.error(e);
      this.error.set(e.message || 'An unexpected error occurred while generating the plan.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
