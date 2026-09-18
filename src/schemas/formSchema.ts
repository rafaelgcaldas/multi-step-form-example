import { z } from "zod";

// ────────────────────────────────────────────────────────────
// Etapa 1 — Dados Pessoais
// ────────────────────────────────────────────────────────────
export const personalDataSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  sobrenome: z.string().min(2, "Informe seu sobrenome"),
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .max(15, "Telefone inválido"),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato esperado: 000.000.000-00"),
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  genero: z.enum(["feminino", "masculino", "outro", "prefiro_nao_dizer"], {
    message: "Selecione uma opção",
  }),
});

// ────────────────────────────────────────────────────────────
// Etapa 2 — Endereço
// ────────────────────────────────────────────────────────────
export const addressSchema = z.object({
  cep: z.string().length(8, "CEP deve ter 8 dígitos (somente números)"),
  logradouro: z.string().min(1, "Informe o logradouro"),
  numero: z.string().min(1, "Informe o número"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Informe o bairro"),
  cidade: z.string().min(1, "Informe a cidade"),
  estado: z.string().length(2, "Selecione o estado"),
  pais: z.string().min(1, "Informe o país"),
});

// ────────────────────────────────────────────────────────────
// Etapa 3 — Conta de Acesso
// ────────────────────────────────────────────────────────────
const accountFieldsSchema = z.object({
  username: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Use apenas letras, números e underline"),
  senha: z.string().min(8, "Mínimo 8 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme sua senha"),
});

// ────────────────────────────────────────────────────────────
// Etapa 4 — Preferências
// ────────────────────────────────────────────────────────────
export const preferencesSchema = z.object({
  plano: z.enum(["gratuito", "basico", "pro", "enterprise"], {
    message: "Selecione um plano",
  }),
  newsletter: z.boolean(),
  notificacoesPush: z.boolean(),
  formaContato: z.enum(["email", "telefone", "whatsapp"], {
    message: "Selecione uma forma de contato",
  }),
  comentarios: z
    .string()
    .max(500, "Máximo de 500 caracteres")
    .optional()
    .or(z.literal("")),
  aceitaTermos: z.boolean().refine((value) => value === true, {
    message: "Você precisa aceitar os termos para continuar",
  }),
});

// ────────────────────────────────────────────────────────────
// Schema completo (merge de todas as etapas + validação cruzada)
// ────────────────────────────────────────────────────────────
export const fullFormSchema = personalDataSchema
  .merge(addressSchema)
  .merge(accountFieldsSchema)
  .merge(preferencesSchema)
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type FormData = z.infer<typeof fullFormSchema>;

// Campos pertencentes a cada etapa — usado para validar apenas
// o "pedaço" do formulário relevante ao avançar de etapa.
export const stepFields: Record<number, (keyof FormData)[]> = {
  0: ["nome", "sobrenome", "email", "telefone", "cpf", "dataNascimento", "genero"],
  1: ["cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado", "pais"],
  2: ["username", "senha", "confirmarSenha"],
  3: ["plano", "newsletter", "notificacoesPush", "formaContato", "comentarios", "aceitaTermos"],
};

export const stepLabels = [
  "Dados Pessoais",
  "Endereço",
  "Conta",
  "Preferências",
  "Revisão",
];

export const defaultValues: FormData = {
  nome: "",
  sobrenome: "",
  email: "",
  telefone: "",
  cpf: "",
  dataNascimento: "",
  genero: "" as FormData["genero"],
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  pais: "Brasil",
  username: "",
  senha: "",
  confirmarSenha: "",
  plano: "" as FormData["plano"],
  newsletter: false,
  notificacoesPush: true,
  formaContato: "email",
  comentarios: "",
  aceitaTermos: false,
};
