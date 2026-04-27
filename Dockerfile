# Stage 1: Build the frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY axiom-frontend/package*.json ./
RUN npm install
COPY axiom-frontend/ ./
RUN npm run build

# Stage 2: Setup Python backend and serve
FROM python:3.10-slim

# Create user with UID 1000 required by Hugging Face Spaces
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy backend requirements and install
COPY --chown=user axiom-backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Copy backend code
COPY --chown=user axiom-backend /app/axiom-backend

# Copy the built frontend from Stage 1
COPY --chown=user --from=frontend-builder /app/frontend/dist /app/axiom-frontend/dist

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Switch to backend directory and run
WORKDIR /app/axiom-backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
