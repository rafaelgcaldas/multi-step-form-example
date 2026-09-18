import { Controller, useFormContext } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import type { FormData } from "../../schemas/formSchema";

type Option = { label: string; value: string };

type Props = {
  name: keyof FormData;
  label: string;
  options: Option[];
};

export function ControlledSelect({ name, label, options }: Props) {
  const { control } = useFormContext<FormData>();
  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            {...field}
            value={field.value ?? ""}
            labelId={labelId}
            label={label}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
