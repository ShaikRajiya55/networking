all: build test

build:
	npm run build

start:
	npm start

test:
	npm test

clean:
	rm -rf node_modules coverage
