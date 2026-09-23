import { http, HttpResponse } from "msw";
import { initialCadastros } from "./data";
import type { Cadastro } from "../types/cadastro";

// "Banco de dados" em memória, usado apenas para simular uma API real com o MSW.
const db: Cadastro[] = [...initialCadastros];

// "Banco de dados" em memória para os rascunhos (dados parciais do formulário
// de múltiplas etapas, persistidos a cada avanço de step).
const rascunhos: Record<string, Record<string, unknown>> = {};

// Cria um handler de upsert: se o `id` enviado no corpo não existir ainda,
// cria um novo rascunho; caso contrário, faz o merge dos dados enviados com
// os dados já existentes do rascunho (atualização parcial por etapa).
function upsertRascunhoHandler(path: string) {
  return http.put(path, async ({ request }) => {
    const body = (await request.json()) as {
      id?: string;
      data: Record<string, unknown>;
    };

    const id = body.id ?? crypto.randomUUID();
    rascunhos[id] = { ...(rascunhos[id] ?? {}), ...body.data };

    // Pequeno delay simulando latência de rede.
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json({ id, ...rascunhos[id] });
  });
}

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

  // Rascunho do formulário de múltiplas etapas: cada etapa salva/atualiza
  // (upsert) seus dados no mesmo endpoint, identificados pelo `id` do rascunho.
  upsertRascunhoHandler("/api/cadastros/rascunho/dados-pessoais"),
  upsertRascunhoHandler("/api/cadastros/rascunho/endereco"),
  upsertRascunhoHandler("/api/cadastros/rascunho/conta"),
  upsertRascunhoHandler("/api/cadastros/rascunho/preferencias"),

  // Finaliza o cadastro: remove o rascunho em memória após o envio final.
  http.delete("/api/cadastros/rascunho/:id", async ({ params }) => {
    const { id } = params;
    delete rascunhos[id as string];

    await new Promise((resolve) => setTimeout(resolve, 300));

    return new HttpResponse(null, { status: 204 });
  }),
];
