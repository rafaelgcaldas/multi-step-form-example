import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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

import {
  salvarDadosPessoais,
  salvarEndereco,
  salvarConta,
  salvarPreferencias,
  finalizarRascunho,
} from "./api/rascunho";

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

// Função de persistência (mock) correspondente a cada etapa do formulário —
// mesma posição de `stepComponents`/`stepFields`.
const stepPersistFns = [
  salvarDadosPessoais,
  salvarEndereco,
  salvarConta,
  salvarPreferencias,
];

type MultiStepFormProps = {
  /** Chamado após o envio do formulário ser concluído com sucesso. */
  onSubmitSuccess?: (data: FormData) => void;
};

export function MultiStepForm({ onSubmitSuccess }: MultiStepFormProps = {}) {
  const [activeStep, setActiveStep] = useState(0);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  // Id do rascunho persistido no mock — criado ao salvar a primeira etapa e
  // reaproveitado nas etapas seguintes para atualizar o mesmo registro.
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const { trigger, handleSubmit, getValues } = methods;

  async function handleNext() {
    if (activeStep === lastStepIndex) return;
    const fieldsToValidate = stepFields[activeStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (!isStepValid) return;

    const allValues = getValues();
    const stepData: Partial<FormData> = {};
    fieldsToValidate.forEach((field) => {
      (stepData as Record<string, unknown>)[field] = allValues[field];
    });
    const persistStep = stepPersistFns[activeStep];

    setIsSavingStep(true);
    setSaveError(null);
    try {
      const { id } = await persistStep(draftId, stepData);
      setDraftId(id);
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao salvar etapa:", error);
      setSaveError("Não foi possível salvar os dados desta etapa. Tente novamente.");
    } finally {
      setIsSavingStep(false);
    }
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }

  function handleEditStep(step: number) {
    setActiveStep(step);
  }

  const onSubmit = async (data: FormData) => {
    // Aqui entraria a chamada real à API, ex: await api.post("/cadastro", data)
    console.log("Formulário enviado:", data);
    setSubmittedData(data);
    onSubmitSuccess?.(data);

    // Cadastro finalizado: remove o rascunho do mock e limpa o id local.
    if (draftId) {
      try {
        await finalizarRascunho(draftId);
      } catch (error) {
        console.error("Erro ao finalizar rascunho:", error);
      } finally {
        setDraftId(null);
      }
    }
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
              disabled={activeStep === 0 || isSavingStep}
            >
              Voltar
            </Button>

            {isReviewStep ? (
              <Button type="submit" variant="contained" size="large">
                Confirmar e enviar
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isSavingStep}
                startIcon={
                  isSavingStep ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {isSavingStep ? "Salvando..." : "Próximo"}
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

      <Snackbar
        open={!!saveError}
        autoHideDuration={5000}
        onClose={() => setSaveError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setSaveError(null)}
        >
          {saveError}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
}
