export interface CommunityPostComment {
  id: number;
  authorName: string;
  date: string; // ISO 8601
  content: string;
}

export interface CommunityPost {
  id: number;
  authorName: string;
  date: string; // ISO 8601
  title: string;
  content: string;
  category: 'Dicas' | 'Eventos' | 'Perguntas';
  likes: number;
  comments: CommunityPostComment[];
}
