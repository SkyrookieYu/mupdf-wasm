#!/bin/bash

EMSDK_DIR=/opt/emsdk

MUPDF_OPTS="-DTOFU -DTOFU_CJK -DFZ_ENABLE_SVG=0 -DFZ_ENABLE_HTML=0 -DFZ_ENABLE_EPUB=0 -DFZ_ENABLE_JS=0"

export EMSDK_QUIET=1
source $EMSDK_DIR/emsdk_env.sh
echo

echo BUILDING LIBMUPDF
make -j4 -C libmupdf build=release OS=wasm XCFLAGS="$MUPDF_OPTS" libs
echo

echo BUILDING WASM
emcc -o dist/mupdf-wasm.js -Ilibmupdf/include src/wrap.c \
	-O1 -g \
	-sALLOW_MEMORY_GROWTH=1 \
	-sMODULARIZE=1 \
	-sEXPORT_NAME='"libmupdf"' \
	-sEXPORTED_RUNTIME_METHODS='["ccall","UTF8ToString","lengthBytesUTF8","stringToUTF8"]' \
	libmupdf/build/wasm/release/libmupdf.a \
	libmupdf/build/wasm/release/libmupdf-third.a
echo

exit # skip building multi-threaded for now

echo BUILDING LIBMUPDF MT
make -j4 -C libmupdf build=release OS=wasm-mt XCFLAGS="$MUPDF_OPTS" libs
echo

echo BUILDING WASM MT
emcc -o dist/mupdf-wasm-mt.js -Ilibmupdf/include src/wrap.c \
	-O1 -g \
	-pthread \
	-Wno-pthreads-mem-growth \
	-sALLOW_MEMORY_GROWTH=1 \
	-sMODULARIZE=1 \
	-sEXPORT_NAME='"libmupdf"' \
	-sEXPORTED_RUNTIME_METHODS='["ccall","UTF8ToString","lengthBytesUTF8","stringToUTF8"]' \
	libmupdf/build/wasm-mt/release/libmupdf.a \
	libmupdf/build/wasm-mt/release/libmupdf-third.a
echo
