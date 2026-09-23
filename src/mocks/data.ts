import { faker } from "@faker-js/faker";
import { brazilianStates } from "../utils/brazilianStates";
import type { Cadastro } from "../types/cadastro";

const cidadesPorEstado: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "Santos", "Sorocaba"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis"],
  MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora"],
  BA: ["Salvador", "Feira de Santana", "Ilhéus"],
  PR: ["Curitiba", "Londrina", "Maringá"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas"],
  SC: ["Florianópolis", "Joinville", "Blumenau"],
  PE: ["Recife", "Olinda", "Caruaru"],
  CE: ["Fortaleza", "Sobral", "Juazeiro do Norte"],
  DF: ["Brasília"],
};

function randomEstado() {
  const estados = Object.keys(cidadesPorEstado);
  return estados[Math.floor(Math.random() * estados.length)];
}

function randomCidade(estado: string) {
  const cidades = cidadesPorEstado[estado] ?? [estado];
  return cidades[Math.floor(Math.random() * cidades.length)];
}

function createRandomCadastro(): Cadastro {
  const nome = faker.person.firstName();
  const sobrenome = faker.person.lastName();
  const estado = randomEstado();

  return {
    id: faker.string.uuid(),
    nome,
    sobrenome,
    email: faker.internet.email({ firstName: nome, lastName: sobrenome }).toLowerCase(),
    cidade: randomCidade(estado),
    estado,
  };
}

// Garante que a lista de estados usada nos dados mockados existe também no
// select do formulário de endereço (apenas para referência/consistência).
export const estadosDisponiveis = brazilianStates.map((estado) => estado.value);

export const initialCadastros: Cadastro[] = faker.helpers.multiple(createRandomCadastro, {
  count: 47,
});
