.PHONY: install-python install-node install-all

install-python:
	@echo "Installing backend dependencies…"
	pip install -r backend/requirements.txt
	@echo "Installing scraper dependencies…"
	pip install -r scraper/requirements.txt

install-node:
	@echo "Installing frontend dependencies…"
	npm ci --prefix frontend

install-all: install-python install-node
	@echo "✅ All dependencies installed."
