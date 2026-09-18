import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MultiStepForm } from "./MultiStepForm";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Cadastro em Etapas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Exemplo com React + Vite, React Hook Form, Zod e Material UI
          </Typography>
        </Box>

        <MultiStepForm />
      </Container>
    </Box>
  );
}

export default App;
