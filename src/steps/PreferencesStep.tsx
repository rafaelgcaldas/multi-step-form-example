import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ControlledRadioGroup } from "../components/form/ControlledRadioGroup";
import { ControlledCheckbox } from "../components/form/ControlledCheckbox";
import { ControlledTextField } from "../components/form/ControlledTextField";
import {
  MAX_EMAILS_CONTATO,
  MIN_EMAILS_CONTATO,
  type FormData,
} from "../schemas/formSchema";

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
  const { control, formState } = useFormContext<FormData>();
  const formaContato = useWatch({ control, name: "formaContato" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emailsContato",
  });

  const emailsRootError = formState.errors.emailsContato?.root?.message;

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

      {formaContato === "email" && (
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            E-mails de contato
          </Typography>

          <Stack spacing={1.5}>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                <ControlledTextField
                  name={`emailsContato.${index}.value`}
                  label={`E-mail ${index + 1}`}
                  type="email"
                />
                <IconButton
                  aria-label="Remover e-mail"
                  onClick={() => remove(index)}
                  disabled={fields.length <= MIN_EMAILS_CONTATO}
                  sx={{ mt: 1 }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>

          {emailsRootError && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              {emailsRootError}
            </FormHelperText>
          )}

          <Button
            startIcon={<AddIcon />}
            onClick={() => append({ value: "" })}
            disabled={fields.length >= MAX_EMAILS_CONTATO}
            sx={{ mt: 1 }}
          >
            Adicionar e-mail
          </Button>
        </Grid>
      )}

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
