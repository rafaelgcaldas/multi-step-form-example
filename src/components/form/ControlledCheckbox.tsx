import { Controller, useFormContext } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import type { FormData } from "../../schemas/formSchema";

type Props = {
  name: keyof FormData;
  label: React.ReactNode;
};

export function ControlledCheckbox({ name, label }: Props) {
  const { control } = useFormContext<FormData>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label={label}
          />
          {error && (
            <FormHelperText error sx={{ ml: 4, mt: -0.5 }}>
              {error.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}
