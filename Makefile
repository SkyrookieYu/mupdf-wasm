default: build

build:
	bash build.sh

clean:
	make -C libmupdf nuke
	rm -f dist/*
