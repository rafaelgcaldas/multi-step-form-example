export type Cadastro = {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cidade: string;
  estado: string;
};

export type CadastrosPageResponse = {
  data: Cadastro[];
  total: number;
};
