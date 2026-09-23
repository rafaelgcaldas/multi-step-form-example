import { http, HttpResponse } from "msw";
import { initialCadastros } from "./data";
import type { Cadastro } from "../types/cadastro";

// "Banco de dados" em memória, usado apenas para simular uma API real com o MSW.
const db: Cadastro[] = [...initialCadastros];

export const handlers = [
  // Lista paginada de cadastros: GET /api/cadastros?page=1&pageSize=10
  http.get("/api/cadastros", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // Pequeno delay simulando latência de rede.
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json({
      data: db.slice(start, end),
      total: db.length,
    });
  }),

  // Cria um novo cadastro: POST /api/cadastros
  http.post("/api/cadastros", async ({ request }) => {
    const body = (await request.json()) as Omit<Cadastro, "id">;

    const novoCadastro: Cadastro = {
      id: crypto.randomUUID(),
      nome: body.nome,
      sobrenome: body.sobrenome,
      email: body.email,
      cidade: body.cidade,
      estado: body.estado,
    };

    db.unshift(novoCadastro);

    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json(novoCadastro, { status: 201 });
  }),
];
