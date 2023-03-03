// Copyright (C) 2004-2023 Artifex Software, Inc.
//
// This file is part of MuPDF WASM Library.
//
// MuPDF is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// MuPDF is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with MuPDF. If not, see <https://www.gnu.org/licenses/agpl-3.0.en.html>
//
// Alternative licensing terms are available from the licensor.
// For commercial licensing, see <https://www.artifex.com/> or contact
// Artifex Software, Inc., 1305 Grant Avenue - Suite 200, Novato,
// CA 94945, U.S.A., +1(415)492-9861, for further information.

// TODO: Story
// TODO: DOM

// TODO: Device
// TODO: Image
// TODO: Font
// TODO: Text
// TODO: Path

// TODO: PDFDocument
// TODO: PDFPage
// TODO: PDFAnnotation
// TODO: PDFWidget
// TODO: PDFObject
// TODO: PDFGraftMap

// TODO: WASMDevice with callbacks
// TODO: PDFPage.process with callbacks

#include "emscripten.h"
#include "mupdf/fitz.h"
#include "mupdf/pdf.h"
#include <string.h>
#include <math.h>

static fz_context *ctx;

static fz_matrix out_matrix;
static fz_rect out_rect;

#define EXPORT EMSCRIPTEN_KEEPALIVE

#define TRY(CODE) { fz_try(ctx) CODE fz_catch(ctx) wasm_rethrow(ctx); }

// Simple wrappers for one-line functions...
#define POINTER(F, ...) void* p; TRY({ p = (void*)F(ctx, __VA_ARGS__); }) return p;
#define INTEGER(F, ...) int p; TRY({ p = F(ctx, __VA_ARGS__); }) return p;
#define NUMBER(F, ...) float p; TRY({ p = F(ctx, __VA_ARGS__); }) return p;
#define MATRIX(F, ...) TRY({ out_matrix = F(ctx, __VA_ARGS__); }) return &out_matrix;
#define RECT(F, ...) TRY({ out_rect = F(ctx, __VA_ARGS__); }) return &out_rect;
#define VOID(F, ...) TRY({ F(ctx, __VA_ARGS__); })

__attribute__((noinline)) void
wasm_rethrow(fz_context *ctx)
{
	if (fz_caught(ctx) == FZ_ERROR_TRYLATER)
		EM_ASM({ throw new libmupdf.TryLaterError("operation in progress"); });
	else
		EM_ASM({ throw new Error(UTF8ToString($0)); }, fz_caught_message(ctx));
}

EXPORT
void wasm_init_context(void)
{
	ctx = fz_new_context(NULL, NULL, 100<<20);
	if (!ctx)
		EM_ASM({ throw new Error("Cannot create MuPDF context!"); });
	fz_register_document_handlers(ctx);
}

EXPORT
void * wasm_malloc(size_t size)
{
	POINTER(fz_malloc, size)
}

EXPORT
void wasm_free(void *p)
{
	fz_free(ctx, p);
}

// --- REFERENCE COUNTING ---

#define KEEP_(WNAME,FNAME) EXPORT void * WNAME(void *p) { return FNAME(ctx, p); }
#define DROP_(WNAME,FNAME) EXPORT void WNAME(void *p) { FNAME(ctx, p); }

#define KEEP(NAME) KEEP_(wasm_keep_ ## NAME, fz_keep_ ## NAME)
#define DROP(NAME) DROP_(wasm_drop_ ## NAME, fz_drop_ ## NAME)

#define REFS(NAME) KEEP(NAME) DROP(NAME)

#define PDF_REFS(NAME) \
        KEEP_(wasm_pdf_keep_ ## NAME, pdf_keep_ ## NAME) \
        DROP_(wasm_pdf_drop_ ## NAME, pdf_drop_ ## NAME)

REFS(buffer)
REFS(stream)

REFS(colorspace)
REFS(pixmap)
REFS(font)
REFS(image)
REFS(path)
REFS(text)
REFS(device)
REFS(display_list)
DROP(stext_page)
DROP(document_writer)

REFS(document)
REFS(page)
REFS(link)
REFS(outline)

PDF_REFS(annot)
PDF_REFS(obj)

// --- PLAIN STRUCT ACCESSORS ---

#define GETP(S,T,F) EXPORT T* wasm_ ## S ## _get_ ## F (fz_ ## S *p) { return &p->F; }
#define GETU(S,T,F,U) EXPORT T wasm_ ## S ## _get_ ## F (fz_ ## S *p) { return p->U; }
#define GET(S,T,F) EXPORT T wasm_ ## S ## _get_ ## F (fz_ ## S *p) { return p->F; }
#define SET(S,T,F) EXPORT void wasm_ ## S ## _set_ ## F (fz_ ## S *p, T v) { p->F = v; }

#define PDF_GET(S,T,F) EXPORT T wasm_ ## S ## _get_ ## F (pdf_ ## S *p) { return p->F; }
#define PDF_SET(S,T,F) EXPORT void wasm_ ## S ## _set_ ## F (pdf_ ## S *p, T v) { p->F = v; }

GET(buffer, void*, data)
GET(buffer, int, len)

GET(colorspace, int, type)
GET(colorspace, int, n)
GET(colorspace, char*, name)

GET(pixmap, int, w)
GET(pixmap, int, h)
GET(pixmap, int, x)
GET(pixmap, int, y)
GET(pixmap, int, n)
GET(pixmap, int, stride)
GET(pixmap, int, xres)
GET(pixmap, int, yres)
GET(pixmap, fz_colorspace*, colorspace)
GET(pixmap, unsigned char*, samples)

SET(pixmap, int, xres)
SET(pixmap, int, yres)

GET(font, char*, name)

GET(image, int, w)
GET(image, int, h)
GET(image, int, n)
GET(image, int, bpc)
GET(image, int, xres)
GET(image, int, yres)
GET(image, fz_colorspace*, colorspace)
GET(image, fz_image*, mask)

GET(outline, char*, title)
GET(outline, char*, uri)
GET(outline, fz_outline*, next)
GET(outline, fz_outline*, down)
GET(outline, int, is_open)

GETP(link, fz_rect, rect)
GET(link, char*, uri)
GET(link, fz_link*, next)

GETP(stext_page, fz_rect, mediabox)
GET(stext_page, fz_stext_block*, first_block)

GET(stext_block, fz_stext_block*, next)
GET(stext_block, int, type)
GETP(stext_block, fz_rect, bbox)
GETU(stext_block, fz_stext_line*, first_line, u.t.first_line)

GET(stext_line, fz_stext_line*, next)
GET(stext_line, int, wmode)
GETP(stext_line, fz_rect, bbox)
GET(stext_line, fz_stext_char*, first_char)

GET(stext_char, fz_stext_char*, next)
GET(stext_char, int, c)
GETP(stext_char, fz_point, origin)
GETP(stext_char, fz_quad, quad)
GET(stext_char, float, size)
GET(stext_char, fz_font*, font)

// --- Buffer ---

EXPORT
fz_buffer * wasm_new_buffer(size_t capacity)
{
	POINTER(fz_new_buffer, capacity)
}

EXPORT
fz_buffer * wasm_new_buffer_from_data(unsigned char *data, size_t size)
{
	POINTER(fz_new_buffer_from_data, data, size)
}

EXPORT
void wasm_append_string(fz_buffer *buf, char *str)
{
	VOID(fz_append_string, buf, str)
}

EXPORT
void wasm_append_byte(fz_buffer *buf, int c)
{
	VOID(fz_append_byte, buf, c)
}

EXPORT
void wasm_append_buffer(fz_buffer *buf, fz_buffer *src)
{
	VOID(fz_append_buffer, buf, src)
}

// --- ColorSpace ---

EXPORT fz_colorspace * wasm_device_gray(void) { return fz_device_rgb(ctx); }
EXPORT fz_colorspace * wasm_device_rgb(void) { return fz_device_rgb(ctx); }
EXPORT fz_colorspace * wasm_device_bgr(void) { return fz_device_bgr(ctx); }
EXPORT fz_colorspace * wasm_device_cmyk(void) { return fz_device_cmyk(ctx); }
EXPORT fz_colorspace * wasm_device_lab(void) { return fz_device_lab(ctx); }

// --- Pixmap ---

EXPORT
fz_pixmap * wasm_new_pixmap_from_page(fz_page *page, fz_matrix *ctm, fz_colorspace *colorspace, int alpha)
{
	POINTER(fz_new_pixmap_from_page, page, *ctm, colorspace, alpha)
}

EXPORT
fz_pixmap * wasm_new_pixmap_with_bbox(fz_colorspace *colorspace, fz_rect *bbox, int alpha)
{
	POINTER(fz_new_pixmap_with_bbox, colorspace, fz_irect_from_rect(*bbox), NULL, alpha)
}

EXPORT
void wasm_clear_pixmap(fz_pixmap *pix)
{
	VOID(fz_clear_pixmap, pix)
}

EXPORT
void wasm_clear_pixmap_with_value(fz_pixmap *pix, int value)
{
	VOID(fz_clear_pixmap_with_value, pix, value)
}

EXPORT
void wasm_invert_pixmap(fz_pixmap *pix)
{
	VOID(fz_invert_pixmap, pix)
}

EXPORT
void wasm_invert_pixmap_luminance(fz_pixmap *pix)
{
	VOID(fz_invert_pixmap_luminance, pix)
}

EXPORT
void wasm_gamma_pixmap(fz_pixmap *pix, float gamma)
{
	VOID(fz_gamma_pixmap, pix, gamma)
}

EXPORT
void wasm_tint_pixmap(fz_pixmap *pix, int black_hex_color, int white_hex_color)
{
	VOID(fz_tint_pixmap, pix, black_hex_color, white_hex_color)
}

EXPORT
fz_buffer * wasm_new_buffer_from_pixmap_as_png(fz_pixmap *pix)
{
	POINTER(fz_new_buffer_from_pixmap_as_png, pix, fz_default_color_params)
}

EXPORT
fz_pixmap * wasm_convert_pixmap(fz_pixmap *pixmap, fz_colorspace *colorspace, int keep_alpha)
{
	POINTER(fz_convert_pixmap, pixmap, colorspace, NULL, NULL, fz_default_color_params, keep_alpha)
}

// --- DisplayList ---

EXPORT
fz_display_list * wasm_new_display_list(fz_rect *mediabox)
{
	POINTER(fz_new_display_list, *mediabox)
}

EXPORT
fz_rect * wasm_bound_display_list(fz_display_list *list)
{
	RECT(fz_bound_display_list, list)
}

EXPORT
void wasm_run_display_list(fz_display_list *display_list, fz_device *dev, fz_matrix *ctm)
{
	VOID(fz_run_display_list, display_list, dev, *ctm, fz_infinite_rect, NULL)
}

EXPORT
fz_pixmap * wasm_new_pixmap_from_display_list(fz_display_list *display_list, fz_matrix *ctm, fz_colorspace *colorspace, int alpha)
{
	POINTER(fz_new_pixmap_from_display_list, display_list, *ctm, colorspace, alpha)
}

EXPORT
fz_stext_page * wasm_new_stext_page_from_display_list(fz_display_list *display_list)
{
	// TODO: parse options
	fz_stext_options options = { FZ_STEXT_PRESERVE_SPANS };
	POINTER(fz_new_stext_page_from_display_list, display_list, &options)
}

// --- Device ---

EXPORT
fz_device * wasm_new_draw_device(fz_matrix *ctm, fz_pixmap *dest)
{
	POINTER(fz_new_draw_device, *ctm, dest)
}

EXPORT
fz_device * wasm_new_display_list_device(fz_display_list *list)
{
	POINTER(fz_new_list_device, list)
}

EXPORT
void wasm_close_device(fz_device *dev)
{
	VOID(fz_close_device, dev)
}

// --- DocumentWriter ---

EXPORT
fz_document_writer * wasm_new_document_writer(fz_buffer *buf, char *format, char *options)
{
	fz_document_writer *wri = NULL;
	TRY ({
		fz_output *out = fz_new_output_with_buffer(ctx, buf);
		wri = fz_new_document_writer_with_output(ctx, out, format, options);
		fz_drop_output(ctx, out);
	})
	return wri;
}

EXPORT
fz_device * wasm_begin_page(fz_document_writer *wri, fz_rect *mediabox)
{
	POINTER(fz_begin_page, wri, *mediabox)
}

EXPORT
void wasm_end_page(fz_document_writer *wri)
{
	VOID(fz_end_page, wri)
}

EXPORT
void wasm_close_document_writer(fz_document_writer *wri)
{
	VOID(fz_close_document_writer, wri)
}

// --- StructuredText ---

EXPORT
unsigned char * wasm_print_stext_page_as_json(fz_stext_page *page, float scale)
{
	unsigned char *data = NULL;
	TRY ({
		fz_buffer *buf = fz_new_buffer(ctx, 1024);
		fz_output *out = fz_new_output_with_buffer(ctx, buf);
		fz_print_stext_page_as_json(ctx, out, page, scale);
		fz_drop_output(ctx, out);
		fz_terminate_buffer(ctx, buf);
		fz_buffer_extract(ctx, buf, &data);
	})
	return data;
}

// TODO: search
// TODO: highlight
// TODO: copy

// --- Document ---

EXPORT
fz_document * wasm_open_document_with_buffer(char *magic, fz_buffer *buffer)
{
	POINTER(fz_open_document_with_buffer, magic, buffer)
}

EXPORT
fz_document * wasm_open_document_with_stream(char *magic, fz_stream *stream)
{
	POINTER(fz_open_document_with_stream, magic, stream)
}

EXPORT
int wasm_needs_password(fz_document *doc)
{
	INTEGER(fz_needs_password, doc)
}

EXPORT
int wasm_authenticate_password(fz_document *doc, char *password)
{
	INTEGER(fz_authenticate_password, doc, password)
}

EXPORT
int wasm_count_pages(fz_document *doc)
{
	INTEGER(fz_count_pages, doc)
}

EXPORT
fz_page * wasm_load_page(fz_document *doc, int number)
{
	POINTER(fz_load_page, doc, number)
}

EXPORT
char * wasm_lookup_metadata(fz_document *doc, char *key)
{
	static char buf[500];
	char *result = NULL;
	TRY ({
		if (fz_lookup_metadata(ctx, doc, key, buf, sizeof buf) > 0)
			result = buf;
	})
	return result;
}

EXPORT
int wasm_resolve_link(fz_document *doc, const char *uri)
{
	INTEGER(fz_page_number_from_location, doc, fz_resolve_link(ctx, doc, uri, NULL, NULL))
}

EXPORT
fz_outline * wasm_load_outline(fz_document *doc)
{
	POINTER(fz_load_outline, doc)
}

EXPORT
int wasm_outline_get_page(fz_document *doc, fz_outline *outline)
{
	// fz_location to page index wrapper
	INTEGER(fz_page_number_from_location, doc, outline->page)
}

// --- Page ---

// TODO: Page.search
// TODO: Page.createLink
// TODO: Page.deleteLink

EXPORT
fz_rect * wasm_bound_page(fz_page *page)
{
	RECT(fz_bound_page, page)
}

EXPORT
fz_link * wasm_load_links(fz_page *page)
{
	POINTER(fz_load_links, page)
}

EXPORT
void wasm_run_page(fz_page *page, fz_device *dev, fz_matrix *ctm)
{
	VOID(fz_run_page, page, dev, *ctm, NULL)
}

EXPORT
void wasm_run_page_contents(fz_page *page, fz_device *dev, fz_matrix *ctm)
{
	VOID(fz_run_page_contents, page, dev, *ctm, NULL)
}

EXPORT
void wasm_run_page_annots(fz_page *page, fz_device *dev, fz_matrix *ctm)
{
	VOID(fz_run_page_annots, page, dev, *ctm, NULL)
}

EXPORT
void wasm_run_page_widgets(fz_page *page, fz_device *dev, fz_matrix *ctm)
{
	VOID(fz_run_page_widgets, page, dev, *ctm, NULL)
}

EXPORT
fz_stext_page * wasm_new_stext_page_from_page(fz_page *page)
{
	// TODO: parse options
	fz_stext_options options = { FZ_STEXT_PRESERVE_SPANS };
	POINTER(fz_new_stext_page_from_page, page, &options)
}

EXPORT
fz_display_list * wasm_new_display_list_from_page(fz_page *page)
{
	POINTER(fz_new_display_list_from_page, page)
}

EXPORT
fz_display_list * wasm_new_display_list_from_page_contents(fz_page *page)
{
	POINTER(fz_new_display_list_from_page_contents, page)
}

EXPORT
char * wasm_page_label(fz_page *page)
{
	static char buf[100];
	POINTER(fz_page_label, page, buf, sizeof buf)
}

// --- PDFDocument --

EXPORT
pdf_document * wasm_pdf_document_from_fz_document(fz_document *document)
{
	return pdf_document_from_fz_document(ctx, document);
}

EXPORT
pdf_page * wasm_pdf_page_from_fz_page(fz_page *page)
{
	return pdf_page_from_fz_page(ctx, page);
}



/* PROGRESSIVE FETCH STREAM */

struct fetch_state
{
	int block_shift;
	int block_size;
	int content_length; // Content-Length in bytes
	int map_length; // Content-Length in blocks
	uint8_t *content; // Array buffer with bytes
	uint8_t *map; // Map of which blocks have been requested and loaded.
};

EM_JS(void, js_open_fetch, (struct fetch_state *state, char *url, int content_length, int block_shift, int prefetch), {
	libmupdf.fetchOpen(state, UTF8ToString(url), content_length, block_shift, prefetch);
});

static void fetch_close(fz_context *ctx, void *state_)
{
	struct fetch_state *state = state_;
	fz_free(ctx, state->content);
	fz_free(ctx, state->map);
	state->content = NULL;
	state->map = NULL;
	// TODO: wait for all outstanding requests to complete, then free state
	// fz_free(ctx, state);
	EM_ASM({
		libmupdf.fetchClose($0);
	}, state);
}

static void fetch_seek(fz_context *ctx, fz_stream *stm, int64_t offset, int whence)
{
	struct fetch_state *state = stm->state;
	stm->wp = stm->rp = state->content;
	if (whence == SEEK_END)
		stm->pos = state->content_length + offset;
	else if (whence == SEEK_CUR)
		stm->pos += offset;
	else
		stm->pos = offset;
	if (stm->pos < 0)
		stm->pos = 0;
	if (stm->pos > state->content_length)
		stm->pos = state->content_length;
}

static int fetch_next(fz_context *ctx, fz_stream *stm, size_t len)
{
	struct fetch_state *state = stm->state;

	int block = stm->pos >> state->block_shift;
	int start = block << state->block_shift;
	int end = start + state->block_size;
	if (end > state->content_length)
		end = state->content_length;

	if (state->map[block] == 0) {
		state->map[block] = 1;
		EM_ASM({
			libmupdf.fetchRead($0, $1);
		}, state, block);
		fz_throw(ctx, FZ_ERROR_TRYLATER, "waiting for data");
	}

	if (state->map[block] == 1) {
		fz_throw(ctx, FZ_ERROR_TRYLATER, "waiting for data");
	}

	stm->rp = state->content + stm->pos;
	stm->wp = state->content + end;
	stm->pos = end;

	if (stm->rp < stm->wp)
		return *stm->rp++;
	return -1;
}

EXPORT
void wasm_on_data_fetched(struct fetch_state *state, int block, uint8_t *data, int size)
{
	if (state->content) {
		memcpy(state->content + (block << state->block_shift), data, size);
		state->map[block] = 2;
	}
}

EXPORT
fz_stream *wasm_open_stream_from_url(char *url, int content_length, int block_size, int prefetch)
{
	fz_stream *stream = NULL;
	struct fetch_state *state = NULL;

	fz_var(stream);
	fz_var(state);

	fz_try (ctx)
	{
		int block_shift = (int)log2(block_size);

		if (block_shift < 10 || block_shift > 24)
			fz_throw(ctx, FZ_ERROR_GENERIC, "invalid block shift: %d", block_shift);

		state = fz_malloc(ctx, sizeof *state);
		state->block_shift = block_shift;
		state->block_size = 1 << block_shift;
		state->content_length = content_length;
		state->content = fz_malloc(ctx, state->content_length);
		state->map_length = content_length / state->block_size + 1;
		state->map = fz_malloc(ctx, state->map_length);
		memset(state->map, 0, state->map_length);

		stream = fz_new_stream(ctx, state, fetch_next, fetch_close);
		// stream->progressive = 1;
		stream->seek = fetch_seek;

		js_open_fetch(state, url, content_length, block_shift, prefetch);
	}
	fz_catch(ctx)
	{
		if (state)
		{
			fz_free(ctx, state->content);
			fz_free(ctx, state->map);
			fz_free(ctx, state);
		}
		fz_drop_stream(ctx, stream);
		wasm_rethrow(ctx);
	}
	return stream;
}

#if 0

EXPORT
int wasm_search_page(fz_page *page, const char *needle, int *marks, fz_quad *hit_bbox, int hit_max)
{
	int hitCount;
	fz_try(ctx)
		hitCount = fz_search_page(ctx, page, needle, marks, hit_bbox, hit_max);
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return hitCount;
}

#endif
