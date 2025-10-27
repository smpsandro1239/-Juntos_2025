import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleGenAI } from "@google/genai";

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-extrabold text-teal-600 mb-4">KidsGo Premium</h2>
      <p class="text-xl text-gray-700 mb-8">
        Desbloqueie funcionalidades exclusivas com a nossa IA para criar memórias inesquecíveis!
      </p>

      <div class="grid md:grid-cols-2 gap-8 text-left">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold mb-3">Planeador de Viagens Ilimitado</h3>
          <p class="text-gray-600">
            Crie quantos roteiros personalizados quiser. A aventura nunca acaba!
          </p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold mb-3">Criador de Histórias para Dormir</h3>
          <p class="text-gray-600">
            Transforme as aventuras do dia em contos de fadas mágicos para a hora de dormir.
          </p>
        </div>
      </div>

      <div class="mt-12 bg-white p-8 rounded-lg shadow-lg">
        <h3 class="text-2xl font-bold mb-2">Experimente: Criador de Mascotes Mágicas</h3>
        <p class="text-gray-600 mb-6">Dê vida à imaginação! Descreva uma criatura e a nossa IA irá desenhá-la para si.</p>
        
        <div class="flex flex-col sm:flex-row gap-4 items-start">
            <div class="w-full sm:w-1/2">
                <form [formGroup]="imageForm" (ngSubmit)="generateImage()" class="space-y-4">
                    <div>
                        <label for="prompt" class="sr-only">Descrição da Mascote</label>
                        <textarea id="prompt" formControlName="prompt" rows="4"
                                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Ex: um coelho astronauta fofinho a flutuar no espaço com estrelas coloridas"></textarea>
                    </div>
                    <div>
                        <button type="submit" [disabled]="imageForm.invalid || isLoading()"
                                class="w-full bg-yellow-400 hover:bg-yellow-500 text-teal-800 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline disabled:bg-gray-400 flex items-center justify-center">
                            @if (isLoading()) {
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                A criar...
                            } @else {
                                <span>Criar Mascote</span>
                            }
                        </button>
                    </div>
                </form>
                @if (errorMessage()) {
                    <p class="text-red-500 text-sm mt-2">{{ errorMessage() }}</p>
                }
            </div>
            <div class="w-full sm:w-1/2 h-80 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                @if (isLoading()) {
                    <p class="text-gray-500">A desenhar a sua mascote...</p>
                } @else if (generatedImageUrl()) {
                    <img [src]="generatedImageUrl()" alt="Mascote gerada por IA" class="rounded-lg object-contain h-full w-full">
                } @else {
                    <p class="text-gray-500 p-4">A sua imagem aparecerá aqui.</p>
                }
            </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent {
  private fb = inject(FormBuilder);
  
  isLoading = signal(false);
  generatedImageUrl = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  imageForm = this.fb.group({
    prompt: ['um dragão bebé amigável a ler um livro numa biblioteca de fantasia', Validators.required],
  });

  async generateImage() {
    if (this.imageForm.invalid) return;

    this.isLoading.set(true);
    this.generatedImageUrl.set(null);
    this.errorMessage.set(null);

    const prompt = this.imageForm.value.prompt!;

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      this.generatedImageUrl.set(`data:image/jpeg;base64,${base64ImageBytes}`);

    } catch (error) {
      console.error('Error generating image:', error);
      this.errorMessage.set('Não foi possível criar a imagem. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
