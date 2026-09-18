import { useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/EditOutlined";
import type { FormData } from "../schemas/formSchema";

type ReviewStepProps = {
  onEditStep: (step: number) => void;
};

function SummarySection({
  title,
  step,
  onEdit,
  rows,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  rows: { label: string; value: string }[];
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button
          size="small"
          startIcon={<EditIcon fontSize="small" />}
          onClick={() => onEdit(step)}
        >
          Editar
        </Button>
      </Stack>
      <Grid container spacing={1}>
        {rows.map((row) => (
          <Grid size={{ xs: 12, sm: 6 }} key={row.label}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {row.label}
            </Typography>
            <Typography variant="body2">{row.value || "—"}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

const generoLabels: Record<string, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  outro: "Outro",
  prefiro_nao_dizer: "Prefiro não dizer",
};

const planoLabels: Record<string, string> = {
  gratuito: "Gratuito",
  basico: "Básico",
  pro: "Pro",
  enterprise: "Enterprise",
};

const contatoLabels: Record<string, string> = {
  email: "E-mail",
  telefone: "Telefone",
  whatsapp: "WhatsApp",
};

export function ReviewStep({ onEditStep }: ReviewStepProps) {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  return (
    <Stack spacing={2.5}>
      <Grid container>
        <Grid size={12}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Revisão
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Confira seus dados antes de enviar o formulário.
          </Typography>
        </Grid>
      </Grid>

      <SummarySection
        title="Dados Pessoais"
        step={0}
        onEdit={onEditStep}
        rows={[
          { label: "Nome completo", value: `${values.nome} ${values.sobrenome}` },
          { label: "E-mail", value: values.email },
          { label: "Telefone", value: values.telefone },
          { label: "CPF", value: values.cpf },
          { label: "Data de nascimento", value: values.dataNascimento },
          { label: "Gênero", value: generoLabels[values.genero] },
        ]}
      />

      <SummarySection
        title="Endereço"
        step={1}
        onEdit={onEditStep}
        rows={[
          {
            label: "Logradouro",
            value: `${values.logradouro}, ${values.numero}${
              values.complemento ? ` - ${values.complemento}` : ""
            }`,
          },
          { label: "Bairro", value: values.bairro },
          { label: "Cidade / UF", value: `${values.cidade} / ${values.estado}` },
          { label: "CEP", value: values.cep },
          { label: "País", value: values.pais },
        ]}
      />

      <SummarySection
        title="Conta"
        step={2}
        onEdit={onEditStep}
        rows={[
          { label: "Usuário", value: values.username },
          { label: "Senha", value: "•".repeat(values.senha.length || 8) },
        ]}
      />

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Preferências
          </Typography>
          <Button
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            onClick={() => onEditStep(3)}
          >
            Editar
          </Button>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap", gap: 1, mb: 1.5 }}
        >
          <Chip label={`Plano: ${planoLabels[values.plano]}`} color="primary" size="small" />
          <Chip label={`Contato: ${contatoLabels[values.formaContato]}`} size="small" />
          {values.newsletter && <Chip label="Newsletter ativa" size="small" />}
          {values.notificacoesPush && <Chip label="Notificações push ativas" size="small" />}
        </Stack>

        {values.formaContato === "email" && values.emailsContato.length > 0 && (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              E-mails de contato
            </Typography>
            <Stack spacing={0.25} sx={{ mb: 1.5 }}>
              {values.emailsContato.map((item, index) => (
                <Typography variant="body2" key={index}>
                  {item.value || "—"}
                </Typography>
              ))}
            </Stack>
          </>
        )}

        {values.comentarios && (
          <>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Comentários
            </Typography>
            <Typography variant="body2">{values.comentarios}</Typography>
          </>
        )}
      </Paper>
    </Stack>
  );
}
