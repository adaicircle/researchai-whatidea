import { useState, useEffect, useRef } from "react";
import { type GroupBase } from "react-select";
import type Select from "react-select/dist/declarations/src/Select";
import {
  type SecDocument,
  type Ticker,
  type DocumentResponse,
} from "~/types/document";
import type { SelectOption } from "~/types/selection";
import {
  getAllTickers,
  sortSelectOptions,
} from "~/utils/documents";
import {
  documentTypeOptions,
} from "~/utils/landing-page-selection";
import useLocalStorage from "./utils/useLocalStorage";
import { backendClient } from "~/api/backend";

export const MAX_NUMBER_OF_SELECTED_DOCUMENTS = 10;

export const useDocumentSelector = () => {
  const [availableDocuments, setAvailableDocuments] = useState<SecDocument[]>(
    []
  );
  const [availableTickers, setAvailableTickers] = useState<Ticker[]>([]);
  const availableDocumentTypes = documentTypeOptions;

  useEffect(() => {
    setAvailableTickers(getAllTickers(availableDocuments));
  }, [availableDocuments]);

  useEffect(() => {
    async function getDocuments() {
      const docs = await backendClient.fetchDocuments();
      setAvailableDocuments(docs);
    }
    getDocuments().catch(() => console.error("could not fetch documents"));
  }, []);

  const [selectedDocuments, setSelectedDocuments] = useLocalStorage<
    DocumentResponse[]
  >("selectedDocuments", []);
  // const sortedSelectedDocuments = sortDocuments(selectedDocuments);

  const handleRemoveDocument = (documentIndex: number) => {
    setSelectedDocuments((prevDocs) =>
      prevDocs.filter((_, index) => index !== documentIndex)
    );
  };

  const handleAddUploadedDocuments = (documents: DocumentResponse[]) => {
    setSelectedDocuments(documents);
  };

  const isDocumentSelectionEnabled =
    selectedDocuments.length < MAX_NUMBER_OF_SELECTED_DOCUMENTS;

  const [shouldFocusCompanySelect, setShouldFocusCompanySelect] =
    useState(false);

  const [focusYear, setFocusYear] = useState(false);
  const yearFocusRef = useRef<Select<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > | null>(null);

  useEffect(() => {
    if (focusYear && yearFocusRef.current) {
      yearFocusRef.current?.focus();
      setFocusYear(false);
    }
  }, [focusYear]);

  const [focusDocumentType, setFocusDocumentType] = useState(false);
  const documentTypeFocusRef = useRef<Select<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > | null>(null);

  useEffect(() => {
    if (focusDocumentType && documentTypeFocusRef.current) {
      documentTypeFocusRef.current?.focus();
      setFocusDocumentType(false);
    }
  }, [focusDocumentType]);

  return {
    availableDocuments,
    availableTickers,
    availableDocumentTypes,
    selectedDocuments,
    // sortedSelectedDocuments,
    handleAddUploadedDocuments,
    handleRemoveDocument,
    isDocumentSelectionEnabled,
    yearFocusRef,
    documentTypeFocusRef,
    shouldFocusCompanySelect,
    setShouldFocusCompanySelect,
  };
};
