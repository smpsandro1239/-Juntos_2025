import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FormsModule } from '@angular/forms';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { signal } from '@angular/core';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [FormsModule, L10nPipe, MarkdownPipe],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-4">Planeador de Viagens IA</h1>
      <p class="text-gray-600 mb-6">Descreva o que procura para a sua viagem em família e a nossa IA criará um itinerário personalizado!</p>
      
      <form (ngSubmit)="generatePlan()">
        <div class="mb-4">
          <label for="prompt" class="block text-gray-700 font-bold mb-2">O que gostaria de fazer?</label>
          <textarea id="prompt" name="prompt" rows="4" [(ngModel)]="prompt" class="w-full px-3 py-2 border rounded-md" placeholder="Ex: Um fim de semana em Lisboa para uma família com duas crianças (5 e 8 anos) que adoram animais e ciência."></textarea>
        </div>
        <button type="submit" [disabled]="loading()" class="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400">
          {{ loading() ? 'A gerar plano...' : 'Gerar Plano de Viagem' }}
        </button>
      </form>

      @if(loading()) {
        <div class="mt-6 text-center">
          <p>A nossa IA está a preparar a sua aventura... Por favor, aguarde.</p>
        </div>
      }

      @if(error()) {
        <div class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p><strong>Ocorreu um erro:</strong> {{ error() }}</p>
        </div>
      }

      @if(plan()) {
        <div class="mt-8 prose max-w-none">
          <div [innerHTML]="plan() | markdown"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  prompt = 'Um fim de semana em Lisboa para uma família com duas crianças (5 e 8 anos) que adoram animais e ciência.';
  loading = signal(false);
  plan = signal<string | null>(null);
  error = signal<string | null>(null);
  
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error("API_KEY environment variable not set.");
      this.error.set("A chave da API não está configurada. Não é possível usar o planeador IA.");
    }
  }

  async generatePlan(): Promise<void> {
    if (!this.ai) return;

    this.loading.set(true);
    this.plan.set(null);
    this.error.set(null);

    try {
      const fullPrompt = `You are a friendly and helpful travel planner for families visiting Portugal.
      Create a personalized travel itinerary based on the user's request.
      Format the response in Markdown. Include suggestions for activities, places to eat that are kid-friendly, and some fun facts.
      User request: "${this.prompt}"`;
      
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      });
      
      this.plan.set(response.text);

    } catch (e) {
      console.error(e);
      this.error.set('Não foi possível gerar o plano. Por favor, tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
