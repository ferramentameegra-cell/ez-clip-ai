// Configuração dos verticais nichados
export type VerticalType = 
  | 'politica'
  | 'futebol'
  | 'series-filmes'
  | 'comedia'
  | 'religiao'
  | 'profissoes'
  | 'novelas'
  | 'programas-tv';

export interface Vertical {
  id: VerticalType;
  name: string;
  emoji: string;
  description: string;
}

export const VERTICAIS: Record<VerticalType, Vertical> = {
  'politica': {
    id: 'politica',
    name: 'Política',
    emoji: '🗳️',
    description: 'Debates, escândalos, análises políticas'
  },
  'futebol': {
    id: 'futebol',
    name: 'Futebol',
    emoji: '⚽',
    description: 'Análises de jogos, comentários, memes'
  },
  'series-filmes': {
    id: 'series-filmes',
    name: 'Séries/Filmes',
    emoji: '🎬',
    description: 'Críticas, resumos, reacts'
  },
  'comedia': {
    id: 'comedia',
    name: 'Comédia',
    emoji: '😂',
    description: 'Piadas, esquetes, humor'
  },
  'religiao': {
    id: 'religiao',
    name: 'Religião',
    emoji: '🙏',
    description: 'Pregações, estudos bíblicos, testemunhos'
  },
  'profissoes': {
    id: 'profissoes',
    name: 'Profissões',
    emoji: '💼',
    description: 'Médicos, Advogados, Engenheiros'
  },
  'novelas': {
    id: 'novelas',
    name: 'Novelas',
    emoji: '📺',
    description: 'Resumos, fofocas, entretenimento'
  },
  'programas-tv': {
    id: 'programas-tv',
    name: 'Programas TV',
    emoji: '📡',
    description: 'Talk shows, entrevistas, podcasts'
  }
};

export const VERTICAIS_LIST = Object.values(VERTICAIS);


