import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleGenAI } from '@google/genai';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TripPlan } from '../../models/trip-plan.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, L10nPipe, MarkdownPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-800">{{ 'tripPlannerTitle' | l10n }}</h1>
        <p class="text-gray-600 mt-2">{{ 'tripPlannerSubtitle' | l10n }}</p>
      </div>

      <form #form="ngForm" (ngSubmit)="generatePlan()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700">{{ 'destination' | l10n }}</label>
            <input type="text" id="destination" name="destination" required [(ngModel)]="formState.destination" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="{{ 'destinationPlaceholder' | l10n }}">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700">{{ 'duration' | l10n }}</label>
              <input type="text" id="duration" name="duration" required [(ngModel)]="formState.duration" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="{{ 'durationPlaceholder' | l10n }}">
            </div>
            <div>
              <label for="travelers" class="block text-sm font-medium text-gray-700">{{ 'travelers' | l10n }}</label>
              <input type="text" id="travelers" name="travelers" required [(ngModel)]="formState.travelers" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="{{ 'travelersPlaceholder' | l10n }}">
            </div>
          </div>
        </div>
        <div class="mb-6">
          <label for="interests" class="block text-sm font-medium text-gray-700">{{ 'interests' | l10n }}</label>
          <input type="text" id="interests" name="interests" required [(ngModel)]="formState.interests" class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="{{ 'interestsPlaceholder' | l10n }}">
        </div>
        <button type="submit" [disabled]="form.invalid || isLoading()" class="w-full bg-teal-500 text-white font-bold py-3 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400">
          @if (isLoading()) {
            <span>{{ 'generatingPlan' | l10n }}...</span>
          } @else {
            <span>{{ 'generatePlan' | l10n }}</span>
          }
        </button>
      </form>

      @if (generatedPlan() || errorMessage()) {
        <div class="mt-10 border-t pt-8">
          @if (errorMessage()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span class="block sm:inline">{{ errorMessage() }}</span>
            </div>
          }
          @if (generatedPlan()) {
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-3xl font-bold text-gray-800">{{ 'planTitle' | l10n }}</h2>
              <button (click)="savePlan()" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">{{ 'savePlan' | l10n }}</button>
            </div>
            <div class="prose max-w-none" [innerHTML]="generatedPlan() | markdown"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .prose h1, .prose h2, .prose h3 {
      font-weight: bold;
      margin-bottom: 0.5em;
      margin-top: 1em;
    }
    .prose h1 { font-size: 1.875rem; }
    .prose h2 { font-size: 1.5rem; }
    .prose h3 { font-size: 1.25rem; }
    .prose p { margin-bottom: 1em; }
    .prose ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1em; }
    .prose li { margin-bottom: 0.25em; }
    .prose strong { font-weight: bold; }
    .prose em { font-style: italic; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private ai: GoogleGenAI;

  formState = {
    destination: 'Lisboa, Portugal',
    duration: '3 dias',
    travelers: 'Uma família com 2 crianças (5 e 8 anos)',
    interests: 'cultura, comida, atividades ao ar livre, evitar grandes multidões'
  };

  isLoading = signal(false);
  generatedPlan = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    // This will not work in a browser without a proxy, but for the purpose of this exercise,
    // we assume process.env.API_KEY is available.
    if (typeof process === 'undefined' || !process.env['API_KEY']) {
       console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
       // In a real app, you would handle this more gracefully.
       // For this app, we will mock the API key to avoid breaking the constructor.
       this.ai = new GoogleGenAI({apiKey: "mock-api-key"});
    } else {
      this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY']! });
    }
  }

  async generatePlan(): Promise<void> {
    this.isLoading.set(true);
    this.generatedPlan.set('');
    this.errorMessage.set(null);

    const prompt = `Cria um roteiro de viagem detalhado para uma família.
      Destino: ${this.formState.destination}
      Duração: ${this.formState.duration}
      Viajantes: ${this.formState.travelers}
      Interesses: ${this.formState.interests}

      O roteiro deve ser dividido por dias (ex: Dia 1, Dia 2).
      Para cada dia, sugere atividades para a manhã, tarde e noite, com descrições curtas e cativantes.
      Inclui sugestões de restaurantes adequados para famílias.
      Formata a resposta usando markdown. Usa títulos (##) para os dias e listas (-) para as atividades.
    `;

    try {
      if (this.ai.apiKey === "mock-api-key") {
        this.handleMockResponse();
        return;
      }

      const stream = await this.ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      for await (const chunk of stream) {
        this.generatedPlan.update(currentPlan => (currentPlan ?? '') + chunk.text);
      }
    } catch (error) {
      console.error('Error generating trip plan:', error);
      this.errorMessage.set(this.authService.translate('errorGeneratingPlan'));
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private handleMockResponse() {
    const mockPlan = `
## Dia 1: Chegada e Descobertas Históricas

**Manhã:**
- **Chegada e Check-in:** Acomodem-se no vosso alojamento.
- **Passeio pela Baixa:** Explorem a Praça do Comércio e o Arco da Rua Augusta.

**Tarde:**
- **Elevador de Santa Justa:** Subam para vistas incríveis da cidade.
- **Almoço:** Experimentem o "Museu da Cerveja" na Praça do Comércio, com opções para todos.

**Noite:**
- **Jantar:** Jantem na "Casa do Alentejo", um restaurante com um pátio interior surpreendente.
- **Passeio Noturno:** Um passeio tranquilo pelo Rossio.

## Dia 2: Contos de Fadas e Delícias

**Manhã:**
- **Castelo de São Jorge:** Explorem as muralhas e torres do castelo.
- **Alfama:** Percam-se nas ruas estreitas e pitorescas de Alfama.

**Tarde:**
- **Almoço:** Piquenique no Miradouro das Portas do Sol.
- **Elétrico 28:** Apanhem o famoso elétrico para uma viagem divertida pela cidade.

**Noite:**
- **Jantar:** "Pizzeria Romana al Taglio" para uma pizza deliciosa que as crianças vão adorar.
- **Fado para Crianças:** Procurem uma casa de fados com uma sessão mais cedo e familiar.

## Dia 3: Explorações Marítimas

**Manhã:**
- **Mosteiro dos Jerónimos:** Visitem esta obra-prima da arquitetura manuelina.
- **Pastéis de Belém:** Provem os autênticos e deliciosos pastéis de nata.

**Tarde:**
- **Padrão dos Descobrimentos e Torre de Belém:** Tirem fotos icónicas junto ao rio.
- **Almoço:** Comam algo leve nos jardins de Belém.

**Noite:**
- **Jantar de Despedida:** "Darwin's Café", com uma vista espetacular para o rio Tejo.
- **Passeio à beira-rio:** Desfrutem da brisa do rio Tejo para uma última noite mágica.
    `;
    // Simulate streaming for mock
    let streamedText = '';
    const interval = setInterval(() => {
        if (streamedText.length < mockPlan.length) {
            const nextChunk = mockPlan.substring(streamedText.length, streamedText.length + 50);
            streamedText += nextChunk;
            this.generatedPlan.update(current => (current ?? '') + nextChunk);
        } else {
            clearInterval(interval);
            this.isLoading.set(false);
        }
    }, 50);
  }

  savePlan(): void {
    const planText = this.generatedPlan();
    if (!planText) return;

    // Simple parsing to create a TripPlan object
    const title = this.formState.destination;
    
    const newPlan: TripPlan = {
      id: Date.now(),
      title: `Viagem para ${title}`,
      description: planText,
      details: {
        duration: this.formState.duration,
        travelers: this.formState.travelers,
        interests: this.formState.interests.split(',').map(i => i.trim()),
      },
      days: [] // In a real app, you would parse the markdown into this structure
    };
    
    this.authService.addSavedPlan(newPlan);
    this.toastService.show(this.authService.translate('planSaved'), 'success');
  }
}
