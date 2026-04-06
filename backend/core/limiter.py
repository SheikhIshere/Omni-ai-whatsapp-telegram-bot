from slowapi import Limiter
from slowapi.util import get_remote_address

# Default limiter by IP (Good for Admin APIs)
limiter = Limiter(key_func=get_remote_address)
