import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleGenAI, Type } from "@google/genai";
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

// Add TripPlan interface for strong typing
interface TripPlan {
  cidade: string;
  roteiro: {
    dia: number;
    atividades: {
      periodo: string;
      titulo:string;
      descricao: string;
    }[];
  }[];
}

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-6 text-teal-600">Roteiro IA</h2>
        
        @if (isPremium()) {
          <p class="text-center text-gray-600 mb-8">
              Bem-vindo, membro Premium! Deixe a nossa IA criar um roteiro perfeito para a sua família.
          </p>
          @if (isApiConfigured) {
            <form [formGroup]="plannerForm" (ngSubmit)="generatePlan()" class="bg-white p-8 rounded-lg shadow-md">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label for="location" class="block text-gray-700 font-bold mb-2">Destino (Cidade)</label>
                        <input type="text" id="location" formControlName="location"
                               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                    <div>
                        <label for="duration" class="block text-gray-700 font-bold mb-2">Duração (dias)</label>
                        <input type="number" id="duration" formControlName="duration" min="1"
                               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </div>
                </div>
                <div class="mb-4">
                    <label for="interests" class="block text-gray-700 font-bold mb-2">Interesses das Crianças</label>
                    <input type="text" id="interests" formControlName="interests" placeholder="Ex: animais, ciência, ar livre"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-6">
                    <label for="budget" class="block text-gray-700 font-bold mb-2">Orçamento</label>
                    <select id="budget" formControlName="budget" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="economico">Económico</option>
                        <option value="moderado">Moderado</option>
                        <option value="flexivel">Flexível</option>
                    </select>
                </div>
                <div class="text-center">
                    <button type="submit" [disabled]="plannerForm.invalid || isLoading()"
                            class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto">
                        @if (isLoading()) {
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            A planear...
                        } @else {
                            <span>Gerar Roteiro</span>
                        }
                    </button>
                </div>
            </form>
          } @else {
            <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
              <p class="font-bold">Serviço Indisponível</p>
              <p>A funcionalidade de IA não está configurada corretamente. Por favor, tente mais tarde.</p>
            </div>
          }
        } @else {
            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg text-center shadow-md">
                <h3 class="text-2xl font-bold mb-3">Esta é uma funcionalidade Premium!</h3>
                <p class="mb-4">Faça o upgrade para criar roteiros ilimitados com a nossa Inteligência Artificial e planeie as melhores viagens em família.</p>
                <a routerLink="/premium" class="bg-yellow-400 text-teal-800 font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition-colors duration-300">
                    Tornar-se Premium
                </a>
            </div>
        }

        @if (errorMessage()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
                <span class="block sm:inline">{{ errorMessage() }}</span>
            </div>
        }

        @if (tripPlan()) {
            <div class="bg-white p-8 rounded-lg shadow-md mt-8">
                <h3 class="text-2xl font-bold mb-4 border-b pb-2">O seu Roteiro para {{ tripPlan()?.cidade }}</h3>
                @for (day of tripPlan()?.roteiro; track day.dia) {
                    <div class="mb-6">
                        <h4 class="text-xl font-semibold text-teal-700 mb-2">Dia {{ day.dia }}</h4>
                        <div class="space-y-4 pl-4 border-l-2 border-teal-200">
                            @for (activity of day.atividades; track $index) {
                                <div>
                                    <p class="font-bold">{{ activity.titulo }} ({{ activity.periodo }})</p>
                                    <p class="text-gray-700">{{ activity.descricao }}</p>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  isLoading = signal(false);
  // Change type from 'any' to 'TripPlan'
  tripPlan = signal<TripPlan | null>(null);
  errorMessage = signal<string | null>(null);
  
  isPremium = computed(() => this.authService.currentUser()?.isPremium ?? false);
  isApiConfigured = !!process.env.API_KEY;

  plannerForm = this.fb.group({
    location: ['Lisboa', Validators.required],
    duration: [3, [Validators.required, Validators.min(1)]],
    interests: ['animais, ciência', Validators.required],
    budget: ['moderado', Validators.required]
  });

  async generatePlan() {
    if (this.plannerForm.invalid || !this.isApiConfigured) {
      return;
    }

    this.isLoading.set(true);
    this.tripPlan.set(null);
    this.errorMessage.set(null);

    const formValue = this.plannerForm.value;
    const prompt = `Cria um roteiro de viagem familiar de ${formValue.duration} dias em ${formValue.location}, Portugal.
    Os interesses principais das crianças são ${formValue.interests}.
    O orçamento é ${formValue.budget}.
    O roteiro deve ser detalhado, com sugestões de atividades para manhã e tarde de cada dia, incluindo nomes de locais, uma breve descrição e porquê é bom para crianças.
    Não adiciones notas ou observações extra no final, apenas o JSON.`;

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cidade: { type: Type.STRING },
              roteiro: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dia: { type: Type.INTEGER },
                    atividades: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          periodo: { type: Type.STRING, description: 'Manhã ou Tarde' },
                          titulo: { type: Type.STRING },
                          descricao: { type: Type.STRING }
                        },
                        required: ['periodo', 'titulo', 'descricao']
                      }
                    }
                  },
                  required: ['dia', 'atividades']
                }
              }
            },
            required: ['cidade', 'roteiro']
          }
        }
      });

      // Handle potential markdown in JSON response and parse
      let text = response.text.trim();
      if (text.startsWith('```json')) {
        text = text.substring(7, text.length - 3);
      }
      this.tripPlan.set(JSON.parse(text) as TripPlan);

    } catch (error) {
      console.error('Error generating trip plan:', error);
      this.errorMessage.set('Ocorreu um erro ao gerar o seu roteiro. Por favor, tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
