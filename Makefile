FRONTEND=./frontend
BACKEND=./backend
BRUNO=./bruno-api


.PHONY: up down install test docker-stop docker-reset

up:
	docker-compose up -d

down:
	docker-compose down

install:
	npm install

test:
	npm --workspace $(BRUNO) run test

docker-reset:
	docker-compose down -v --remove-orphans
	docker stop $$(docker ps -q) || true
	docker rm $$(docker ps -aq) || true
	docker container prune -f
	docker image prune -a -f
	docker volume prune -f
	docker network prune -f
	docker builder prune -a -f
	docker system prune -a -f
