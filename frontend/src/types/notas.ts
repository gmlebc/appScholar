export interface NotaInput {
  nota1?: number;
  nota2?: number;
  nota3?: number;
  nota4?: number;
  nota5?: number;
}

export interface LancamentoNotas {
  alunoMatricula: string;
  disciplinaId: number;
  nota1?: number;
  nota2?: number;
  nota3?: number;
  nota4?: number;
  nota5?: number;
}

export interface NotasState {
  [alunoId: number]: NotaInput;
}