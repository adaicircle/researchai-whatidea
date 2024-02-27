
import os
from typing import Optional, Tuple

import requests
from fastapi import HTTPException, UploadFile

from app import schema
from app.api import crud
from app.chat.constants import MAX_FILE_UPLOAD_SIZE
from app.chat.engine import upload_file_to_s3
from app.db.session import SessionLocal


async def process_file(file: UploadFile, total_size: int, metadata_map: Optional[schema.DocumentMetadataMap] = None) -> Tuple[schema.Document, int]:
    # Check file size
    file.file.seek(0, os.SEEK_END)  
    file_size = file.file.tell() 
    file.file.seek(0)  

    total_size += file_size

    if total_size > MAX_FILE_UPLOAD_SIZE:  
        raise HTTPException(status_code=400, detail=f"Total file size exceeds {MAX_FILE_UPLOAD_SIZE}MB")

    url_path = await upload_file_to_s3(file)
    
    # Save the document to the database        
    doc = schema.Document(url=str(url_path), metadata_map=metadata_map)
    async with SessionLocal() as db:
        document = await crud.upsert_document_by_url(db, doc)

    return document, total_size

async def process_url(file_url: str, total_size: int) -> Tuple[schema.Document, int]:
    # Download file
    response = requests.get(file_url)
    file = response.content

    # Check file size
    file_size = len(file)
    total_size += file_size

    if total_size > MAX_FILE_UPLOAD_SIZE:  
        raise HTTPException(status_code=400, detail=f"Total file size exceeds {MAX_FILE_UPLOAD_SIZE}MB")

    # Create UploadFile object
    upload_file = UploadFile(file_url, file)

    # Upload file to S3
    s3_url_path = await upload_file_to_s3(upload_file)
    
    doc = schema.Document(url=str(s3_url_path))
    async with SessionLocal() as db:
        document = await crud.upsert_document_by_url(db, doc)

    return document, total_size