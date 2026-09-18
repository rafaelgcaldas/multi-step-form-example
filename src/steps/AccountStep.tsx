import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ControlledTextField } from "../components/form/ControlledTextField";

export function AccountStep() {
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Conta de Acesso
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Escolha um nome de usuário e uma senha segura.
        </Typography>
      </Grid>

      <Grid size={12}>
        <ControlledTextField
          name="username"
          label="Nome de usuário"
          helperText="Apenas letras, números e underline"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField
          name="senha"
          label="Senha"
          type={showSenha ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSenha((v) => !v)} edge="end">
                    {showSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledTextField
          name="confirmarSenha"
          label="Confirmar senha"
          type={showConfirmar ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmar((v) => !v)} edge="end">
                    {showConfirmar ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
