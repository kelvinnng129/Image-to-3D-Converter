.PHONY: setup dev dev-backend dev-frontend clean help

help:
	@echo "Commands: setup, dev, dev-backend, dev-frontend, clean"

setup:
	cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install
	mkdir -p backend/data

dev:
	@make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && . venv/bin/activate && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

clean:
	rm -rf backend/venv backend/data frontend/node_modules frontend/dist
