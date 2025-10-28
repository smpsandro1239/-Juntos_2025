
import { Injectable, signal } from '@angular/core';
import { Activity } from '../models/activity.model';
import { Review } from '../models/review.model';
import { Event } from '../models/event.model';
import { Supplier } from '../models/supplier.model';
import { CommunityPost, CommunityPostComment } from '../models/community-post.model';

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Oceanário de Lisboa',
    category: 'Cultural',
    description: 'Explore um dos maiores aquários da Europa, com uma vasta coleção de espécies marinhas. Ideal para famílias e amantes da natureza.',
    imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
    gallery: ['https://picsum.photos/seed/oceanario1/400/300', 'https://picsum.photos/seed/oceanario2/400/300', 'https://picsum.photos/seed/oceanario3/400/300'],
    price: 19,
    rating: 4.8,
    location: { lat: 38.7635, lng: -9.0945 },
    isSustainable: true,
    accessibility: { wheelchair: 'Acessível', stroller: 'Acessível' }
  },
  {
    id: 2,
    name: 'Passeio de Elétrico 28',
    category: 'Passeio',
    description: 'Uma viagem pitoresca pelos bairros históricos de Lisboa a bordo do famoso elétrico amarelo.',
    imageUrl: 'https://picsum.photos/seed/eletrico28/400/300',
    gallery: [],
    price: 3,
    rating: 4.5,
    location: { lat: 38.7128, lng: -9.1432 },
    isSustainable: true,
    accessibility: { wheelchair: 'Não acessível', stroller: 'Difícil' }
  },
  {
    id: 3,
    name: 'Piquenique no Jardim da Estrela',
    category: 'Ar Livre',
    description: 'Desfrute de uma tarde relaxante com um piquenique neste belo jardim, perfeito para crianças brincarem.',
    imageUrl: 'https://picsum.photos/seed/jardimestrela/400/300',
    gallery: ['https://picsum.photos/seed/jardim1/400/300', 'https://picsum.photos/seed/jardim2/400/300'],
    price: 0,
    rating: 4.6,
    location: { lat: 38.7153, lng: -9.1599 },
    isSustainable: true,
    accessibility: { wheelchair: 'Acessível', stroller: 'Acessível' }
  },
  {
    id: 4,
    name: 'Aula de Surf na Costa da Caparica',
    category: 'Desporto',
    description: 'Aprenda a surfar nas famosas praias da Costa da Caparica com instrutores experientes.',
    imageUrl: 'https://picsum.photos/seed/surfcaparica/400/300',
    gallery: [],
    price: 25,
    rating: 4.9,
    location: { lat: 38.6418, lng: -9.2341 },
    isSustainable: false,
    accessibility: { wheelchair: 'Não acessível', stroller: 'Não aplicável' }
  },
  {
    id: 5,
    name: 'Workshop de Azulejos',
    category: 'Criativo',
    description: 'Crie o seu próprio azulejo tradicional português numa oficina de artesanato local.',
    imageUrl: 'https://picsum.photos/seed/azulejos/400/300',
    gallery: ['https://picsum.photos/seed/azulejo1/400/300', 'https://picsum.photos/seed/azulejo2/400/300'],
    price: 35,
    rating: 4.7,
    location: { lat: 38.7110, lng: -9.1410 },
    isSustainable: true,
    accessibility: { wheelchair: 'Parcialmente acessível', stroller: 'Acessível' }
  },
  {
    id: 6,
    name: 'Passeio de Barco no Tejo',
    category: 'Passeio',
    description: 'Veja os monumentos de Lisboa de uma perspetiva diferente num relaxante passeio de barco pelo rio Tejo.',
    imageUrl: 'https://picsum.photos/seed/barcotejo/400/300',
    gallery: [],
    price: 40,
    rating: 4.6,
    location: { lat: 38.6975, lng: -9.2053 },
    isSustainable: false,
    accessibility: { wheelchair: 'Depende do barco', stroller: 'Acessível' }
  }
];

const MOCK_REVIEWS: Review[] = [
  { id: 1, activityId: 1, userName: 'João Mendes', rating: 5, comment: 'Espetacular! As crianças adoraram e os adultos também. Vale muito a pena.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 2, activityId: 1, userName: 'Carla Sousa', rating: 4, comment: 'Muito bonito, mas um pouco cheio ao fim de semana. Recomendo ir durante a semana.', date: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 3, activityId: 3, userName: 'Ana Silva', rating: 5, comment: 'O jardim é maravilhoso para um dia em família. Muito tranquilo e seguro para as crianças.', date: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const MOCK_EVENTS: Event[] = [
    { id: 1, name: 'Festival de Verão Juntos', description: 'Música, comida e atividades para toda a família no Parque das Nações.', imageUrl: 'https://picsum.photos/seed/event1/320/180', location: 'Parque das Nações', price: 15, startDate: new Date(Date.now() + 86400000 * 10).toISOString(), endDate: new Date(Date.now() + 86400000 * 12).toISOString() },
    { id: 2, name: 'Cinema ao Ar Livre', description: 'Exibição de filmes clássicos de animação no Jardim da Estrela.', imageUrl: 'https://picsum.photos/seed/event2/320/180', location: 'Jardim da Estrela', price: 5, startDate: new Date(Date.now() + 86400000 * 20).toISOString(), endDate: new Date(Date.now() + 86400000 * 20).toISOString() },
    { id: 3, name: 'Feira do Livro Infantil', description: 'Descubra novos livros e autores para os mais pequenos.', imageUrl: 'https://picsum.photos/seed/event3/320/180', location: 'Praça do Comércio', price: 0, startDate: new Date(Date.now() + 86400000 * 30).toISOString(), endDate: new Date(Date.now() + 86400000 * 35).toISOString() },
];

const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'Festa Mágica Animações', category: 'Animação', description: 'Animadores profissionais para festas de aniversário, com pinturas faciais, balões e jogos.', imageUrl: 'https://picsum.photos/seed/sup1/400/300', rating: 4.8, contact: { phone: '912345678', email: 'geral@festamagica.pt', whatsapp: '351912345678' }, location: 'Lisboa' },
    { id: 2, name: 'Catering do Chef Zé', category: 'Catering', description: 'Menus deliciosos e saudáveis para festas infantis, com opções para todas as restrições alimentares.', imageUrl: 'https://picsum.photos/seed/sup2/400/300', rating: 4.9, contact: { phone: '923456789', email: 'info@chefze.pt', website: 'https://chefze.pt' }, location: 'Lisboa' },
    { id: 3, name: 'Quinta dos Sonhos', category: 'Espaços', description: 'Um espaço amplo com jardim, piscina e parque infantil, ideal para festas e eventos ao ar livre.', imageUrl: 'https://picsum.photos/seed/sup3/400/300', rating: 4.7, contact: { phone: '934567890', email: 'reservas@quintadossonhos.pt' }, location: 'Sintra' },
];

const MOCK_POSTS: CommunityPost[] = [
    { id: 1, authorName: 'Marta G.', date: new Date(Date.now() - 86400000).toISOString(), title: 'Melhores parques infantis em Lisboa?', category: 'Perguntas', content: 'Olá a todos! Estou à procura de sugestões de parques infantis com boas sombras e talvez um café por perto. Alguma recomendação?', likes: 15, comments: [{id: 1, authorName: 'Carlos M.', date: new Date().toISOString(), content: 'O parque do Monteiro-Mor é excelente!'}] },
    { id: 2, authorName: 'Pedro R.', date: new Date(Date.now() - 86400000 * 3).toISOString(), title: 'Dica: Levem lanches para o Oceanário', category: 'Dicas', content: 'Fica a dica para quem vai visitar o Oceanário: levem os vossos próprios lanches e bebidas. A comida lá dentro é um pouco cara e as filas podem ser longas.', likes: 22, comments: [] },
];

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities = signal<Activity[]>(MOCK_ACTIVITIES);
  private reviews = signal<Review[]>(MOCK_REVIEWS);
  private events = signal<Event[]>(MOCK_EVENTS);
  private suppliers = signal<Supplier[]>(MOCK_SUPPLIERS);
  private posts = signal<CommunityPost[]>(MOCK_POSTS);

  allActivities = this.activities.asReadonly();
  allEvents = this.events.asReadonly();
  allSuppliers = this.suppliers.asReadonly();
  allPosts = this.posts.asReadonly();

  getActivityById(id: number): Activity | undefined {
    return this.activities().find(a => a.id === id);
  }

  getReviewsByActivityId(activityId: number): Review[] {
    return this.reviews().filter(r => r.activityId === activityId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addReview(review: Review): void {
    this.reviews.update(reviews => [...reviews, review]);
  }

  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers().find(s => s.id === id);
  }
  
  getPostById(id: number): CommunityPost | undefined {
    return this.posts().find(p => p.id === id);
  }
  
  addPost(postData: Omit<CommunityPost, 'id' | 'likes' | 'comments'>): void {
    const newPost: CommunityPost = {
        ...postData,
        id: Date.now(),
        likes: 0,
        comments: []
    };
    this.posts.update(posts => [newPost, ...posts]);
  }
  
  addCommentToPost(postId: number, commentData: Omit<CommunityPostComment, 'id'>): void {
      const newComment: CommunityPostComment = {
          ...commentData,
          id: Date.now()
      };
      this.posts.update(posts => 
          posts.map(post => 
              post.id === postId 
                  ? { ...post, comments: [...post.comments, newComment] } 
                  : post
          )
      );
  }
}
