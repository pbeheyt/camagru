.PHONY: up start down stop stop-all clean clean-all build build-no-cache logs logs-f re

up: start

start: build
	@echo "Starting Docker Compose..."
	docker-compose up -d

down: stop

stop:
	@echo "Stopping Docker Compose..."
	docker-compose stop

stop-all:
	@echo "Stopping and removing Docker Compose containers..."
	docker-compose down

clean:
	@echo "Removing Docker Compose volumes..."
	docker-compose down -v

clean-all:
	@echo "Removing Docker Compose volumes and images..."
	docker-compose down -v --rmi all

build:
	@echo "Building Docker image..."
	docker-compose build

build-no-cache:
	@echo "Building Docker image (no cache)..."
	docker-compose build --no-cache

logs:
	@echo "Viewing Docker Compose logs for container $(CONTAINER)..."
	@if [ -z "$(CONTAINER)" ]; then \
		docker-compose logs; \
	else \
		docker-compose logs $(CONTAINER); \
	fi

logs-f:
	@echo "Viewing Docker Compose logs (follow) for container $(CONTAINER)..."
	@if [ -z "$(CONTAINER)" ]; then \
		docker-compose logs -f; \
	else \
		docker-compose logs -f $(CONTAINER); \
	fi

re: clean-all build start
