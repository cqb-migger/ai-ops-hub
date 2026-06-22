from app.core.common.exceptions import BaseException, NotFoundError


class UserNotFoundError(NotFoundError):
    """Exception for when a user is not found"""

    def __init__(self, message: str = 'The requested user was not found'):
        super().__init__(message)


class UserAlreadyExistsError(BaseException):
    """Exception for when a user already exists"""

    def __init__(self, message: str = 'The requested user already exists'):
        super().__init__(message)


class InvalidCredentialsError(BaseException):
    """Exception for when invalid credentials are provided"""

    def __init__(self, message: str = 'Invalid credentials provided'):
        super().__init__(message)
