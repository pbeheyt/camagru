COMPOSE = docker-compose.yaml

all:
	@echo "Starting Docker Compose..."
	docker-compose -f $(COMPOSE) up -d --build

down:
	@echo "Stopping Docker Compose..."
	docker-compose -f $(COMPOSE) down

clean:
	@echo "Removing unrunning Docker Compose volumes, networks, and images..."
	docker-compose -f $(COMPOSE) down --remove-orphans

fclean: clean
	@echo "Removing all Docker Compose volumes, networks, and images..."
	docker-compose -f $(COMPOSE) down --rmi all

re: fclean all

restart: down all

logs:
	@if [ -z "$(s)" ]; then \
		docker-compose -f $(COMPOSE) logs; \
	else \
		docker-compose -f $(COMPOSE) logs $(s); \
	fi

logs-f:
	@if [ -z "$(s)" ]; then \
		docker-compose -f $(COMPOSE) logs -f; \
	else \
		docker-compose -f $(COMPOSE) logs -f $(s); \
	fi

ssh:
	@if [ -z "$(s)" ]; then \
		echo "Please specify a container name. For example: make ssh s=app"; \
	else \
		docker-compose -f $(COMPOSE) exec $(s) /bin/bash; \
	fi

ssh-v:
	@if [ -z "$(s)" ]; then \
		echo "Please specify a container name. For example: make ssh-v s=app"; \
	else \
		docker-compose -f $(COMPOSE) exec -it $(s) /bin/bash; \
	fi
