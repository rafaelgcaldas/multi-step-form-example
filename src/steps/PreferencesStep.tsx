import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { ControlledRadioGroup } from "../components/form/ControlledRadioGroup";
import { ControlledCheckbox } from "../components/form/ControlledCheckbox";
import { ControlledTextField } from "../components/form/ControlledTextField";

const planoOptions = [
  { label: "Gratuito", value: "gratuito" },
  { label: "Básico", value: "basico" },
  { label: "Pro", value: "pro" },
  { label: "Enterprise", value: "enterprise" },
];

const contatoOptions = [
  { label: "E-mail", value: "email" },
  { label: "Telefone", value: "telefone" },
  { label: "WhatsApp", value: "whatsapp" },
];

export function PreferencesStep() {
  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Preferências
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Personalize sua experiência.
        </Typography>
      </Grid>

      <Grid size={12}>
        <ControlledRadioGroup name="plano" label="Escolha um plano" options={planoOptions} row />
      </Grid>

      <Grid size={12}>
        <ControlledRadioGroup
          name="formaContato"
          label="Forma de contato preferida"
          options={contatoOptions}
          row
        />
      </Grid>

      <Grid size={12}>
        <ControlledTextField
          name="comentarios"
          label="Comentários (opcional)"
          multiline
          minRows={3}
        />
      </Grid>

      <Grid size={12}>
        <Divider />
      </Grid>

      <Grid size={12}>
        <ControlledCheckbox name="newsletter" label="Quero receber a newsletter por e-mail" />
        <ControlledCheckbox
          name="notificacoesPush"
          label="Quero receber notificações push"
        />
        <ControlledCheckbox
          name="aceitaTermos"
          label="Li e aceito os termos de uso e a política de privacidade"
        />
      </Grid>
    </Grid>
  );
}
