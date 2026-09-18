import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutlined";

import {
  fullFormSchema,
  stepFields,
  stepLabels,
  defaultValues,
  type FormData,
} from "./schemas/formSchema";

import { PersonalDataStep } from "./steps/PersonalDataStep";
import { AddressStep } from "./steps/AddressStep";
import { AccountStep } from "./steps/AccountStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { ReviewStep } from "./steps/ReviewStep";

const stepComponents = [
  <PersonalDataStep key="personal" />,
  <AddressStep key="address" />,
  <AccountStep key="account" />,
  <PreferencesStep key="preferences" />,
];

const lastStepIndex = stepLabels.length - 1;

export function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const { trigger, handleSubmit } = methods;

  async function handleNext() {
    if (activeStep === lastStepIndex) return;
    const fieldsToValidate = stepFields[activeStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }

  function handleEditStep(step: number) {
    setActiveStep(step);
  }

  const onSubmit = (data: FormData) => {
    // Aqui entraria a chamada real à API, ex: await api.post("/cadastro", data)
    console.log("Formulário enviado:", data);
    setSubmittedData(data);
  };

  const isReviewStep = activeStep === lastStepIndex;

  return (
    <FormProvider {...methods}>
      <Paper elevation={2} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {stepLabels.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box sx={{ minHeight: 320 }}>
            {isReviewStep ? (
              <ReviewStep onEditStep={handleEditStep} />
            ) : (
              stepComponents[activeStep]
            )}
          </Box>

          <Stack direction="row" sx={{ justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Voltar
            </Button>

            {isReviewStep ? (
              <Button type="submit" variant="contained" size="large">
                Confirmar e enviar
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Próximo
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={!!submittedData}
        autoHideDuration={5000}
        onClose={() => setSubmittedData(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="success"
          variant="filled"
          onClose={() => setSubmittedData(null)}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Formulário enviado com sucesso!
          </Typography>
          <Typography variant="caption">
            Confira os dados no console do navegador (F12).
          </Typography>
        </Alert>
      </Snackbar>
    </FormProvider>
  );
}
