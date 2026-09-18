# Formulário Multi-Etapas — React + Vite + React Hook Form + Zod + MUI

Aplicação de exemplo demonstrando um formulário com muitos campos, organizado
em etapas (wizard), usando:

- **Vite** + **React** + **TypeScript**
- **React Hook Form** para gerenciamento de estado do formulário
- **Zod** para validação de schema (com `@hookform/resolvers`)
- **Material UI** para os componentes visuais

## Rodando o projeto

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

## Estrutura

```
src/
  schemas/formSchema.ts      # Schemas Zod por etapa + schema completo + tipos
  components/form/           # Campos controlados reutilizáveis (RHF + MUI)
    ControlledTextField.tsx
    ControlledSelect.tsx
    ControlledCheckbox.tsx
    ControlledRadioGroup.tsx
  steps/                     # Uma etapa do wizard por arquivo
    PersonalDataStep.tsx
    AddressStep.tsx
    AccountStep.tsx
    PreferencesStep.tsx
    ReviewStep.tsx            # Revisão final com opção de editar cada etapa
  utils/
    brazilianStates.ts
    viaCep.ts                # Integração com API pública ViaCEP (busca de endereço por CEP)
  MultiStepForm.tsx           # Orquestra o Stepper (MUI) + navegação entre etapas
  App.tsx
```

## Como funciona a navegação entre etapas

Um único `useForm` (com `zodResolver(fullFormSchema)`) mantém todos os dados
do formulário do início ao fim — nada é perdido ao trocar de etapa. Ao clicar
em "Próximo", apenas os campos da etapa atual são validados via
`trigger(stepFields[activeStep])`, e o avanço só ocorre se eles forem válidos.
Na última etapa (Revisão), o `handleSubmit` do RHF roda a validação completa
do schema (incluindo a checagem de senha/confirmação) antes de "enviar".

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — type-check (`tsc -b`) + build de produção
- `npm run preview` — servir o build de produção localmente
- `npm run lint` — lint com Oxlint
