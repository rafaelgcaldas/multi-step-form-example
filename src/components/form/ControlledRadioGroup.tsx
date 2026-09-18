import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";
import type { FormData } from "../../schemas/formSchema";

type Option = { label: string; value: string };

type Props = {
  name: FieldPath<FormData>;
  label: string;
  options: Option[];
  row?: boolean;
};

export function ControlledRadioGroup({ name, label, options, row }: Props) {
  const { control } = useFormContext<FormData>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} component="fieldset" fullWidth>
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup {...field} value={field.value ?? ""} row={row}>
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
