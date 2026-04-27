# Use Python 3.10 slim as base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY axiom-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend
COPY axiom-backend /app/axiom-backend

# Copy the built frontend
COPY axiom-frontend/dist /app/axiom-frontend/dist

# Expose port 7860 for Hugging Face Spaces (or general Docker use)
EXPOSE 7860

# Command to run the application
# Note: we use /app/axiom-backend as the working directory so relative imports work
WORKDIR /app/axiom-backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
