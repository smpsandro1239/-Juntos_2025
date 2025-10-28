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
      category: 'Vida Selvagem',
      description: 'Mergulhe num mundo de maravilhas aquáticas no Oceanário de Lisboa, um dos maiores aquários da Europa. Com milhares de criaturas marinhas, é uma experiência inesquecível para toda a família.',
      imageUrl: 'https://picsum.photos/seed/oceanario/400/300',
      gallery: ['https://picsum.photos/seed/oceanario1/400/300', 'https://picsum.photos/seed/oceanario2/400/300', 'https://picsum.photos/seed/oceanario3/400/300'],
      price: 19,
      rating: 4.8,
      location: { lat: 38.7634, lng: -9.0936 },
      isSustainable: true,
      accessibility: { wheelchair: 'Acessível', stroller: 'Acessível' }
    },
    {
      id: 2,
      name: 'Passeio de Elétrico 28',
      category: 'Cultura',
      description: 'Viaje no tempo a bordo do famoso elétrico 28. Percorra as colinas e os bairros históricos de Lisboa, desde Alfama à Estrela, numa viagem pitoresca e cheia de charme.',
      imageUrl: 'https://picsum.photos/seed/eletrico28/400/300',
      gallery: [],
      price: 3,
      rating: 4.5,
      location: { lat: 38.7143, lng: -9.144
      },
      isSustainable: true,
      accessibility: { wheelchair: 'Não acessível', stroller: 'Difícil' }
    },
    {
      id: 3,
      name: 'Piquenique no Jardim da Estrela',
      category: 'Ar Livre',
      description: 'Desfrute de uma tarde relaxante no Jardim da Estrela. Com os seus lagos, quiosques e parques infantis, é o local perfeito para um piquenique em família e para as crianças brincarem.',
      imageUrl: 'https://picsum.photos/seed/jardimestrela/400/300',
      gallery: ['https://picsum.photos/seed/jardimestrela1/400/300'],
      price: 0,
      rating: 4.7,
      location: { lat: 38.7153, lng: -9.1601 },
      isSustainable: true,
      accessibility: { wheelchair: 'Acessível', stroller: 'Acessível' }
    },
    {
      id: 4,
      name: 'Fábrica de Pastéis de Belém',
      category: 'Gastronomia',
      description: 'Prove o pastel de nata original na Fábrica de Pastéis de Belém. Uma delícia crocante e cremosa que faz as delícias de miúdos e graúdos desde 1837.',
      imageUrl: 'https://picsum.photos/seed/pasteisbelem/400/300',
      gallery: [],
      price: 1.15,
      rating: 4.9,
      location: { lat: 38.6975, lng: -9.2033 },
      isSustainable: false,
      accessibility: { wheelchair: 'Acessível com ajuda', stroller: 'Acessível' }
    },
    {
      id: 5,
      name: 'Workshop de Azulejos',
      category: 'Arte',
      description: 'Liberte a sua criatividade num workshop de pintura de azulejos. Uma atividade divertida onde cada membro da família pode criar a sua própria obra de arte e levar uma recordação única de Lisboa.',
      imageUrl: 'https://picsum.photos/seed/azulejos/400/300',
      gallery: ['https://picsum.photos/seed/azulejos1/400/300'],
      price: 25,
      rating: 4.6,
      location: { lat: 38.712, lng: -9.143 },
      isSustainable: true,
      accessibility: { wheelchair: 'Acessível', stroller: 'Acessível' }
    },
    {
      id: 6,
      name: 'Passeio de Barco no Tejo',
      category: 'Ar Livre',
      description: 'Veja Lisboa de uma perspetiva diferente num passeio de barco pelo rio Tejo. Passe por baixo da Ponte 25 de Abril e admire monumentos icónicos enquanto sente a brisa do mar.',
      imageUrl: 'https://picsum.photos/seed/barcotejo/400/300',
      gallery: [],
      price: 30,
      rating: 4.7,
      location: { lat: 38.6925, lng: -9.195 },
      isSustainable: false,
      accessibility: { wheelchair: 'Varia consoante o barco', stroller: 'Acessível' }
    }
];

const MOCK_REVIEWS: Review[] = [
    { id: 1, activityId: 1, userName: 'Carlos Mendes', rating: 5, comment: 'Fantástico! Os miúdos adoraram os pinguins e os tubarões.', date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 2, activityId: 1, userName: 'Sofia Alves', rating: 4, comment: 'Muito bonito e educativo, mas um pouco cheio ao fim de semana.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 3, activityId: 3, userName: 'Ana Silva', rating: 5, comment: 'O nosso local preferido para relaxar em Lisboa. O parque infantil é ótimo.', date: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 4, activityId: 4, userName: 'Pedro Costa', rating: 5, comment: 'Não há palavras, são os melhores pastéis de nata do mundo. A fila vale a pena!', date: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const MOCK_EVENTS: Event[] = [
    { id: 1, name: 'Festival de Verão Juntos', description: 'Música, comida e atividades para toda a família no parque da cidade.', imageUrl: 'https://picsum.photos/seed/event1/320/180', location: 'Parque da Bela Vista, Lisboa', price: 15, startDate: new Date(Date.now() + 86400000 * 10).toISOString(), endDate: new Date(Date.now() + 86400000 * 12).toISOString() },
    { id: 2, name: 'Cinema ao Ar Livre no Parque', description: 'Noites de cinema para toda a família sob as estrelas. Traga a sua manta!', imageUrl: 'https://picsum.photos/seed/event2/320/180', location: 'Jardim da Estrela', price: 0, startDate: new Date(Date.now() + 86400000 * 20).toISOString(), endDate: new Date(Date.now() + 86400000 * 20).toISOString() },
    { id: 3, name: 'Feira do Livro Infantil', description: 'Descubra novos mundos na feira do livro dedicada aos mais pequenos, com sessões de contos e autores convidados.', imageUrl: 'https://picsum.photos/seed/event3/320/180', location: 'Parque Eduardo VII', price: 5, startDate: new Date(Date.now() + 86400000 * 30).toISOString(), endDate: new Date(Date.now() + 86400000 * 35).toISOString() },
];

const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'AnimaFestas', category: 'Animação', description: 'Especialistas em animação de festas infantis, com palhaços, mágicos e insufláveis.', imageUrl: 'https://picsum.photos/seed/supplier1/400/300', rating: 4.5, contact: { phone: '912345678', email: 'geral@animafestas.pt', whatsapp: '351912345678' }, location: 'Lisboa' },
    { id: 2, name: 'Bolos da Maria', category: 'Catering', description: 'Bolos de aniversário personalizados e deliciosos. Designs criativos que as crianças adoram.', imageUrl: 'https://picsum.photos/seed/supplier2/400/300', rating: 4.8, contact: { phone: '934567890', email: 'encomendas@bolosdamaria.pt' }, location: 'Lisboa' },
    { id: 3, name: 'Quinta Pedagógica dos Olivais', category: 'Espaços', description: 'Um espaço fantástico para festas de aniversário, onde as crianças podem interagir com animais da quinta.', imageUrl: 'https://picsum.photos/seed/supplier3/400/300', rating: 4.7, contact: { phone: '218550930', email: 'qpo@cm-lisboa.pt', website: 'https://quintapedagogica.cm-lisboa.pt/' }, location: 'Lisboa' },
    { id: 4, name: 'FotoMagic', category: 'Fotografia', description: 'Fotografia profissional para eventos familiares e festas de aniversário. Capturamos os melhores sorrisos!', imageUrl: 'https://picsum.photos/seed/supplier4/400/300', rating: 4.9, contact: { phone: '967890123', email: 'info@fotomagic.pt', whatsapp: '351967890123' }, location: 'Lisboa' },
];

const MOCK_POSTS: CommunityPost[] = [
    { id: 1, authorName: 'Marta Ferreira', date: new Date(Date.now() - 86400000 * 3).toISOString(), title: 'Melhores parques para piqueniques em Lisboa', content: 'Olá a todos! Quais são as vossas sugestões de parques com boas sombras e espaço para as crianças correrem? Adorava levar os meus filhos a um piquenique este fim de semana. Obrigada!', category: 'Dicas', likes: 15, comments: [{ id: 1, authorName: 'João Santos', date: new Date(Date.now() - 86400000 * 2).toISOString(), content: 'O Parque de Monsanto é excelente! Muito espaço e natureza.' }, { id: 2, authorName: 'Ana Silva', date: new Date(Date.now() - 86400000 * 1).toISOString(), content: 'Concordo com o João, mas o Jardim da Estrela é mais central e tem um ótimo parque infantil.' }] },
    { id: 2, authorName: 'Ricardo Lopes', date: new Date(Date.now() - 86400000 * 5).toISOString(), title: 'Ideias para um dia de chuva?', content: 'Tenho os miúdos em casa este fim de semana e a previsão é de chuva. Alguma sugestão de atividades indoor em Lisboa que não seja o Oceanário (já fomos)?', category: 'Perguntas', likes: 8, comments: [{ id: 3, authorName: 'Carla Dias', date: new Date(Date.now() - 86400000 * 4).toISOString(), content: 'O Pavilhão do Conhecimento é sempre uma boa aposta!' }] },
    { id: 3, authorName: 'Juntos App', date: new Date(Date.now() - 86400000 * 10).toISOString(), title: 'Novo evento: Festival de Verão Juntos!', content: 'Não percam o nosso festival de verão no próximo mês! Haverá música, jogos e muitas surpresas para toda a família. Vejam a secção de eventos para mais detalhes.', category: 'Eventos', likes: 25, comments: [] },
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
    this.reviews.update(reviews => [review, ...reviews]);
    // Recalculate activity rating
    this.activities.update(activities => {
        return activities.map(activity => {
            if (activity.id === review.activityId) {
                const activityReviews = [review, ...this.getReviewsByActivityId(review.activityId)];
                const newRating = activityReviews.reduce((acc, r) => acc + r.rating, 0) / activityReviews.length;
                return { ...activity, rating: parseFloat(newRating.toFixed(1)) };
            }
            return activity;
        });
    });
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
      this.posts.update(posts => {
          return posts.map(post => {
              if (post.id === postId) {
                  return { ...post, comments: [...post.comments, newComment] };
              }
              return post;
          });
      });
  }
}
