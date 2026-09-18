import { Controller, useFormContext } from "react-hook-form";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import type { FormData } from "../../schemas/formSchema";

type Props = {
  name: keyof FormData;
  label: string;
} & Omit<TextFieldProps, "name">;

/**
 * Campo de texto genérico conectado ao contexto do react-hook-form.
 * Basta informar `name` e `label`; erros do Zod aparecem automaticamente.
 */
export function ControlledTextField({ name, label, ...rest }: Props) {
  const { control } = useFormContext<FormData>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          {...rest}
          label={label}
          error={!!error}
          helperText={error?.message ?? rest.helperText}
          fullWidth
          size="medium"
        />
      )}
    />
  );
}
