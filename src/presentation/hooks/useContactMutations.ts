import { useState, useCallback } from "react";
import { apiPostInput, apiPutInput, InternalServerError } from "@application";
import type {
  NewContact,
  ContactUpdate,
  APIInputError,
  FieldErrorDTO,
} from "@application";
import type { Contact } from "@domain";
import { AppError } from "@application";

type ContactMutationState = {
  isLoading: boolean;
  error: AppError | null;
  validationErrors: FieldErrorDTO[] | null;
};

/**
 * Hook para gestionar las operaciones de escritura (creación y actualización) de contactos.
 * Centraliza el manejo de errores de validación (400) y conflictos (409).
 *
 * @returns Funciones `createContact` y `updateContact`, junto con el estado de la operación.
 */
export const useContactMutations = () => {
  const [state, setState] = useState<ContactMutationState>({
    isLoading: false,
    error: null,
    validationErrors: null,
  });

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      validationErrors: null,
    });
  }, []);

  const handleResult = <T>(result: T, onSuccess?: (data: T) => void) => {
    setState({ isLoading: false, error: null, validationErrors: null });
    onSuccess?.(result);
  };

  const handleError = (err: unknown) => {
    if (err instanceof AppError) {
      setState({ isLoading: false, error: err, validationErrors: null });
    } else {
      // Debería ser un error inesperado
      setState({
        isLoading: false,
        error: new InternalServerError("Ocurrió un error inesperado"),
        validationErrors: null,
      });
    }
    console.error("Mutation failed:", err);
  };

  const handleInputError = (inputError: APIInputError) => {
    if (inputError.type === "input-error") {
      setState({
        isLoading: false,
        error: null,
        validationErrors: inputError.data,
      });
    } else {
      // 'already-exists'
      setState({
        isLoading: false,
        error: new InternalServerError("El contacto ya existe en tu agenda."),
        validationErrors: null,
      });
    }
  };

  /**
   * Crea un nuevo contacto.
   */
  const createContact = useCallback(
    async (
      newContact: NewContact,
      onSuccess?: (contact: Contact) => void,
    ) => {
      setState({ isLoading: true, error: null, validationErrors: null });
      try {
        const result = await apiPostInput<Contact>("/contacts", newContact);
        result.match(
          (contact) => handleResult(contact, onSuccess),
          handleInputError,
        );
      } catch (err) {
        handleError(err);
      }
    },
    [],
  );

  /**
   * Actualiza un contacto existente.
   */
  const updateContact = useCallback(
    async (
      contactUpdate: ContactUpdate,
      onSuccess?: (contact: Contact) => void,
    ) => {
      setState({ isLoading: true, error: null, validationErrors: null });
      try {
        const result = await apiPutInput<Contact>("/contacts", contactUpdate);
        result.match(
          (contact) => handleResult(contact, onSuccess),
          handleInputError,
        );
      } catch (err) {
        handleError(err);
      }
    },
    [],
  );

  return {
    ...state,
    createContact,
    updateContact,
    reset,
  };
};
