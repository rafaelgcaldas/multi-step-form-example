import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import { CadastrosTable } from "./components/CadastrosTable";
import { NovoCadastroDialog } from "./components/NovoCadastroDialog";
import { createCadastro } from "./api/cadastros";
import type { FormData } from "./schemas/formSchema";

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

  async function handleFormSubmitSuccess(data: FormData) {
    try {
      await createCadastro({
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        cidade: data.cidade,
        estado: data.estado,
      });

      // Atualiza a tabela para exibir o novo cadastro.
      setRefreshSignal((prev) => prev + 1);

      // Pequeno delay para o usuário ver a confirmação de envio do formulário
      // antes do modal ser fechado.
      setTimeout(() => setIsDialogOpen(false), 800);
    } catch (error) {
      console.error("Erro ao criar cadastro:", error);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Cadastros
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Exemplo com React + Vite, TanStack Table, MSW e Material UI
          </Typography>
        </Box>

        <Stack spacing={2}>
          {/* A `key` força a tabela a remontar e buscar os dados atualizados
              sempre que um novo cadastro é criado. */}
          <CadastrosTable key={refreshSignal} />

          <Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
            >
              Novo cadastro
            </Button>
          </Box>
        </Stack>

        <NovoCadastroDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </Container>
    </Box>
  );
}

export default App;
