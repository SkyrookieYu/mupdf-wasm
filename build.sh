#!/bin/bash

EMSDK_DIR=/opt/emsdk

MUPDF_OPTS="-DTOFU -DTOFU_CJK -DFZ_ENABLE_XPS=0 -DFZ_ENABLE_SVG=0 -DFZ_ENABLE_CBZ=0 -DFZ_ENABLE_IMG=0 -DFZ_ENABLE_HTML=0 -DFZ_ENABLE_EPUB=0 -DFZ_ENABLE_JS=0 -DFZ_ENABLE_OCR_OUTPUT=0 -DFZ_ENABLE_DOCX_OUTPUT=0 -DFZ_ENABLE_ODT_OUTPUT=0"

export EMSDK_QUIET=1
source $EMSDK_DIR/emsdk_env.sh
echo

echo BUILDING LIBMUPDF
make -j4 -C libmupdf build=release OS=wasm XCFLAGS="$MUPDF_OPTS" libs
echo

echo BUILDING WASM
mkdir -p dist
emcc -o dist/mupdf-wasm.js -Ilibmupdf/include src/wrap.c \
	-O1 -g \
	-sALLOW_MEMORY_GROWTH=1 \
	-sMODULARIZE=1 \
	-sEXPORT_NAME='"libmupdf"' \
	-sEXPORTED_RUNTIME_METHODS='["ccall","UTF8ToString","lengthBytesUTF8","stringToUTF8"]' \
	libmupdf/build/wasm/release/libmupdf.a \
	libmupdf/build/wasm/release/libmupdf-third.a
echo
