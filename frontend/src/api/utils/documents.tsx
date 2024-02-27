import { type BackendDocument } from "~/types/backend/document";
import { type SecDocument, DocumentType } from "~/types/document";
import { documentColors } from "~/utils/colors";
import _ from "lodash";

export const fromBackendDocumentToFrontend = (
  backendDocuments: BackendDocument[]
) => {
  const frontendDocs: SecDocument[] = backendDocuments.map(
    (backendDoc, index) => {
      const frontendDocType = DocumentType.TenK;

      // we have 10 colors for 10 documents
      const colorIndex = index < 10 ? index : 0;
      return {
        id: backendDoc.id,
        url: backendDoc.url,
        ticker: "",
        fullName: "",
        year: new Date().getFullYear().toString(),
        docType: frontendDocType,
        color: documentColors[colorIndex],
        quarter: "",
      } as SecDocument;
    }
  );

  return frontendDocs;
};
