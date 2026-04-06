from pydantic import BaseModel
from typing import Optional

class WhatsAppTestRequest(BaseModel):
    platform_id: str
    content_sid: Optional[str] = "HXb5b62575e6e4ff6129ad7c8efe1f983e"
    content_variables: Optional[str] = '{"1":"12/1","2":"3pm"}'
