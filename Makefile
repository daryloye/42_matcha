FRONTEND=./frontend
BACKEND=./backend
BRUNO=./bruno-api


.PHONY: up down install test prune

up:
	docker-compose up -d

down:
	docker-compose down

install:
	npm install

test:
	npm --workspace $(BRUNO) run test

prune:
	docker container prune -f
	docker image prune -a -f
	docker volume prune -f
	docker network prune -f
	docker builder prune -a -f
	docker system prune -a -f