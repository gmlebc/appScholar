export interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: 'geral' | 'lembrete' | 'comunicado' | 'aviso';
  autorId: number;
  dataCriacao: string;
  lido: boolean;
  createdAt: string;
  updatedAt: string;
  autor?: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
}

export interface AvisoFormData {
  titulo: string;
  mensagem: string;
  tipo: 'geral' | 'lembrete' | 'comunicado' | 'aviso';
}
