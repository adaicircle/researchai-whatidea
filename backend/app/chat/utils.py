import re

from app.schema import Document as DocumentSchema


# TODO: We need to define how we build the title of the document
def build_title_for_document(document: DocumentSchema) -> str:
    """
    Extracts the title of the document from a given URL by removing the UUID, 
    replacing underscores with spaces, and removing the file extension.
    """
    file_name = document.url.split('/')[-1]

    uuid_pattern = r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_'

    clean_title = re.sub(uuid_pattern, '', file_name).replace('_', ' ').rsplit('.', 1)[0]

    return clean_title


