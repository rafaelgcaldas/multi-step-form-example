import type { Cadastro, CadastrosPageResponse } from "../types/cadastro";

export type FetchCadastrosParams = {
  page: number; // 1-based
  pageSize: number;
};

export async function fetchCadastros({
  page,
  pageSize,
}: FetchCadastrosParams): Promise<CadastrosPageResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await fetch(`/api/cadastros?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os cadastros.");
  }

  return response.json();
}

export async function createCadastro(
  novoCadastro: Omit<Cadastro, "id">
): Promise<Cadastro> {
  const response = await fetch("/api/cadastros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoCadastro),
  });

  if (!response.ok) {
    throw new Error("Não foi possível criar o cadastro.");
  }

  return response.json();
}
