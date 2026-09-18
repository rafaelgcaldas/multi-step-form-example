import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import { ControlledTextField } from "../components/form/ControlledTextField";
import { ControlledSelect } from "../components/form/ControlledSelect";
import { brazilianStates } from "../utils/brazilianStates";
import { fetchAddressByCep } from "../utils/viaCep";
import type { FormData } from "../schemas/formSchema";

export function AddressStep() {
  const { setValue, setFocus, trigger, getValues } = useFormContext<FormData>();
  const [loadingCep, setLoadingCep] = useState(false);

  async function handleCepBlur() {
    const cep = getValues("cep");
    if (!cep || cep.replace(/\D/g, "").length !== 8) return;

    setLoadingCep(true);
    const address = await fetchAddressByCep(cep);
    setLoadingCep(false);

    if (!address) return;

    setValue("logradouro", address.logradouro, { shouldValidate: true });
    setValue("bairro", address.bairro, { shouldValidate: true });
    setValue("cidade", address.localidade, { shouldValidate: true });
    setValue("estado", address.uf, { shouldValidate: true });
    void trigger(["logradouro", "bairro", "cidade", "estado"]);
    setFocus("numero");
  }

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Endereço
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Informe o CEP para preencher automaticamente (API ViaCEP).
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <ControlledTextField
          name="cep"
          label="CEP"
          placeholder="00000000"
          onBlur={handleCepBlur}
          slotProps={{
            input: {
              endAdornment: loadingCep ? (
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 8 }}>
        <ControlledTextField name="logradouro" label="Logradouro" />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <ControlledTextField name="numero" label="Número" />
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <ControlledTextField name="complemento" label="Complemento (opcional)" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="bairro" label="Bairro" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="cidade" label="Cidade" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledSelect name="estado" label="Estado" options={brazilianStates} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField name="pais" label="País" />
      </Grid>
    </Grid>
  );
}
