// hooks/useToastHelpers.ts
import { useToast } from "../context/ToastContext";

export const useToastHelpers = () => {
  const { showToast } = useToast();

  const toastSuccess = (title: string, message?: string) => {
    showToast("success", title, message);
  };

  const toastError = (title: string, message?: string) => {
    showToast("error", title, message);
  };

  const toastWarning = (title: string, message?: string) => {
    showToast("warning", title, message);
  };

  const toastInfo = (title: string, message?: string) => {
    showToast("info", title, message);
  };

  // Toasts específicos para operações comuns
  const toastSaved = (entity: string = "Item") => {
    toastSuccess("Salvo com sucesso!", `${entity} foi salvo com sucesso.`);
  };

  const toastDeleted = (entity: string = "Item") => {
    toastSuccess("Excluído!", `${entity} foi excluído com sucesso.`);
  };

  const toastUpdated = (entity: string = "Item") => {
    toastSuccess("Atualizado!", `${entity} foi atualizado com sucesso.`);
  };

  const toastProfileUpdated = () => {
    toastSuccess(
      "Perfil atualizado!",
      "Suas informações foram salvas com sucesso."
    );
  };

  const toastNetworkError = () => {
    toastError(
      "Erro de conexão",
      "Verifique sua conexão com a internet e tente novamente."
    );
  };

  const toastValidationError = (message?: string) => {
    toastError(
      "Dados inválidos",
      message || "Verifique os campos e tente novamente."
    );
  };

  const toastUnauthorized = () => {
    toastError(
      "Acesso negado",
      "Você não tem permissão para realizar esta ação."
    );
  };

  return {
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,
    toastSaved,
    toastDeleted,
    toastUpdated,
    toastProfileUpdated,
    toastNetworkError,
    toastValidationError,
    toastUnauthorized,
  };
};
