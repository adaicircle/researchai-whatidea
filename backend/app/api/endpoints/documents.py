

import datetime
import logging
from typing import List, Optional
from uuid import UUID

from fastapi import (APIRouter, Depends, File, Form, HTTPException, Query,
                     Request, UploadFile)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession

from app import schema
from app.api import crud
from app.api.deps import get_db
from app.helpers.file_processor import process_file, process_url
from app.models.db import Document
from scripts.file_utils import Filing
from scripts.stock_utils import Stock

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
async def get_documents(
    document_ids: Optional[List[UUID]] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> List[schema.Document]:
    """
    Get all documents or documents by their ids
    """
    if document_ids is None:
        # If no ids provided, fetch all documents
        docs = await crud.fetch_documents(db)
    else:
        # If ids are provided, fetch documents by ids
        docs = await crud.fetch_documents(db, ids=document_ids)

    if len(docs) == 0:
        raise HTTPException(status_code=404, detail="Document(s) not found")

    return docs


@router.get("/{document_id}")
async def get_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> schema.Document:
    """
    Get all documents
    """
    docs = await crud.fetch_documents(db, id=document_id)
    if len(docs) == 0:
        raise HTTPException(status_code=404, detail="Document not found")

    return docs[0]


@router.post("/upload")
async def upload_documents(
    request: Request,
    files: List[UploadFile] = File(...),
    values: List[str] = Form([])
) -> List[schema.Document]:
    """
    Upload one or multiple documents to AWS S3 and return their URLs. And then,
    Download files from URLs, upload them to AWS S3, and return their URLs.

    TODO: This endpoint need to be extended to add a constraints to allow 2MB of maximum total file size.
        Also it needs to be able to handle various exceptions.
    """
    documents: List[schema.Document] = []
    total_size = 0
    try:
        for file in files:
            """
                TODO: This part of the code needs to be refactored to handle different types of documents.
            
            """
            document, total_size = await process_file(file, total_size, None)
            print(f"Processing document: {document}")
            documents.append(document)

    
        for file_url in values:
            document, total_size = await process_url(file_url, total_size)
            documents.append(document)
            
    except Exception as e:
        # Handle exceptions, possibly logging them and continuing with next file
        pass

    return documents