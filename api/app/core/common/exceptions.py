class BaseException(Exception):
    """Base exception for all custom exceptions."""

    def __init__(self, message: str = 'An application error occurred'):
        """Initialize the exception with a message."""
        self.message = message
        super().__init__(self.message)


class NotFoundError(BaseException):
    """Exception for when a resource is not found"""

    def __init__(self, message: str = 'The requested resource was not found'):
        super().__init__(message)


class ConfigurationError(BaseException):
    """Exception for when a configuration error occurs"""

    def __init__(self, message: str = 'A configuration error occurred'):
        super().__init__(message)


class ValidationError(BaseException):
    """Exception for when a validation error occurs"""

    def __init__(self, message: str = 'A validation error occurred'):
        super().__init__(message)


class ServiceUnavailableError(BaseException):
    """Exception for when a service is unavailable"""

    def __init__(self, message: str = 'The requested service is unavailable'):
        super().__init__(message)
