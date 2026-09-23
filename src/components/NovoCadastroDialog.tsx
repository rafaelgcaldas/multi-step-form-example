import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { MultiStepForm } from "../MultiStepForm";
import type { FormData } from "../schemas/formSchema";

type NovoCadastroDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: FormData) => void;
};

export function NovoCadastroDialog({
  open,
  onClose,
  onSubmitSuccess,
}: NovoCadastroDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
        }}
      >
        Novo cadastro
        <IconButton onClick={onClose} size="small" aria-label="Fechar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 4 }}>
        {/* O formulário de múltiplas etapas fica contido dentro deste modal. */}
        <MultiStepForm onSubmitSuccess={onSubmitSuccess} />
      </DialogContent>
    </Dialog>
  );
}
