import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ControlledTextField } from "../components/form/ControlledTextField";
import { ControlledRadioGroup } from "../components/form/ControlledRadioGroup";

const generoOptions = [
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
  { label: "Outro", value: "outro" },
  { label: "Prefiro não dizer", value: "prefiro_nao_dizer" },
];

export function PersonalDataStep() {
  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Dados Pessoais
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Conte um pouco sobre você.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="nome" label="Nome" autoFocus />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="sobrenome" label="Sobrenome" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="email" label="E-mail" type="email" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField
          name="telefone"
          label="Telefone"
          placeholder="(11) 91234-5678"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="cpf" label="CPF" placeholder="000.000.000-00" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField
          name="dataNascimento"
          label="Data de nascimento"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Grid>

      <Grid size={12}>
        <ControlledRadioGroup name="genero" label="Gênero" options={generoOptions} row />
      </Grid>
    </Grid>
  );
}
