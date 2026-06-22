import logging
import os
from logging.handlers import TimedRotatingFileHandler

# Create the logs directory if it doesn't exist
log_dir = 'logs'
os.makedirs(log_dir, exist_ok=True)

# Create the requests directory if it doesn't exist
request_log_dir = os.path.join(log_dir, 'requests')
os.makedirs(request_log_dir, exist_ok=True)
request_log_file = os.path.join(request_log_dir, 'requests.log')

# Create the request logger
request_logger = logging.getLogger('request-logger')
request_logger.setLevel(logging.DEBUG)
request_handler = TimedRotatingFileHandler(request_log_file, when='D', interval=7, backupCount=4, encoding='utf-8')
request_formatter = logging.Formatter('[%(asctime)s][%(levelname)s] %(message)s')
request_handler.setFormatter(request_formatter)
request_logger.addHandler(request_handler)

# Create the errors directory if it doesn't exist
error_log_dir = os.path.join(log_dir, 'errors')
os.makedirs(error_log_dir, exist_ok=True)
error_log_file = os.path.join(error_log_dir, 'errors.log')

# Create the error logger
error_logger = logging.getLogger('error-logger')
error_logger.setLevel(logging.ERROR)
error_handler = TimedRotatingFileHandler(error_log_file, when='D', interval=7, backupCount=4, encoding='utf-8')
error_formatter = logging.Formatter('[%(asctime)s][%(levelname)s] %(message)s')
error_handler.setFormatter(error_formatter)
error_logger.addHandler(error_handler)

# Create the performance directory if it doesn't exist
performance_log_dir = os.path.join(log_dir, 'performance')
os.makedirs(performance_log_dir, exist_ok=True)
performance_log_file = os.path.join(performance_log_dir, 'performance.log')

# Create the performance logger
performance_logger = logging.getLogger('performance-logger')
performance_logger.setLevel(logging.DEBUG)
performance_handler = TimedRotatingFileHandler(
    performance_log_file, when='D', interval=7, backupCount=4, encoding='utf-8'
)
performance_formatter = logging.Formatter('[%(asctime)s][%(levelname)s] %(message)s')
performance_handler.setFormatter(performance_formatter)
performance_logger.addHandler(performance_handler)
