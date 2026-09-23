import type { FormData } from "../schemas/formSchema";

type RascunhoResponse = { id: string };

// Salva (cria ou atualiza) os dados de uma etapa do formulário no rascunho
// mockado. Quando `id` é `null`, o backend cria um novo rascunho; quando
// `id` já existe, o backend faz o merge (upsert) dos dados enviados com os
// dados já persistidos anteriormente para aquele rascunho.
async function salvarEtapa(
  url: string,
  id: string | null,
  data: Partial<FormData>
): Promise<RascunhoResponse> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, data }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar os dados desta etapa.");
  }

  return response.json();
}

export const salvarDadosPessoais = (id: string | null, data: Partial<FormData>) =>
  salvarEtapa("/api/cadastros/rascunho/dados-pessoais", id, data);

export const salvarEndereco = (id: string | null, data: Partial<FormData>) =>
  salvarEtapa("/api/cadastros/rascunho/endereco", id, data);

export const salvarConta = (id: string | null, data: Partial<FormData>) =>
  salvarEtapa("/api/cadastros/rascunho/conta", id, data);

export const salvarPreferencias = (id: string | null, data: Partial<FormData>) =>
  salvarEtapa("/api/cadastros/rascunho/preferencias", id, data);

// Remove o rascunho em memória depois que o cadastro foi enviado com sucesso.
export async function finalizarRascunho(id: string): Promise<void> {
  await fetch(`/api/cadastros/rascunho/${id}`, { method: "DELETE" });
}
