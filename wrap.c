#include "emscripten.h"
#include "mupdf/fitz.h"

static fz_context *ctx;

EMSCRIPTEN_KEEPALIVE
void initContext(void)
{
	ctx = fz_new_context(NULL, NULL, 100<<20);
	fz_register_document_handlers(ctx);
}

EMSCRIPTEN_KEEPALIVE
fz_document *openDocumentFromBuffer(char *magic, unsigned char *data, size_t len)
{
	/* Take ownership of data: */
	fz_buffer *buf = fz_new_buffer_from_data(ctx, data, len);
	fz_stream *stream = fz_open_buffer(ctx, buf);
	fz_document *document = fz_open_document_with_stream(ctx, magic, stream);
	return document;
}

EMSCRIPTEN_KEEPALIVE
void freeDocument(fz_document *doc)
{
	fz_drop_document(ctx, doc);
}

EMSCRIPTEN_KEEPALIVE
int countPages(fz_document *doc)
{
	return fz_count_pages(ctx, doc);
}

static fz_page *lastPage = NULL;

static void loadPage(fz_document *doc, int number)
{
	static fz_document *lastPageDoc = NULL;
	static int lastPageNumber = -1;
	if (lastPageNumber != number || lastPageDoc != doc)
	{
		if (lastPage)
			fz_drop_page(ctx, lastPage);
		lastPage = fz_load_page(ctx, doc, number-1);
		lastPageDoc = doc;
		lastPageNumber = number;
	}
}

EMSCRIPTEN_KEEPALIVE
char *pageText(fz_document *doc, int number, float dpi)
{
	static unsigned char *data = NULL;
	fz_stext_page *text;
	fz_buffer *buf;
	fz_output *out;

	fz_stext_options opts = { FZ_STEXT_PRESERVE_SPANS };

	fz_free(ctx, data);
	data = NULL;

	loadPage(doc, number);

	buf = fz_new_buffer(ctx, 0);
	{
		out = fz_new_output_with_buffer(ctx, buf);
		{
			text = fz_new_stext_page_from_page(ctx, lastPage, &opts);
			fz_print_stext_page_as_json(ctx, out, text, dpi / 72);
			fz_drop_stext_page(ctx, text);
		}
		fz_close_output(ctx, out);
		fz_drop_output(ctx, out);
	}

	fz_terminate_buffer(ctx, buf);
	fz_buffer_extract(ctx, buf, &data);
	fz_drop_buffer(ctx, buf);

	return (char*)data;
}

EMSCRIPTEN_KEEPALIVE
char *drawPageAsSVG(fz_document *doc, int number)
{
	static unsigned char *data = NULL;
	fz_buffer *buf;
	fz_output *out;
	fz_device *dev;
	fz_rect bbox;

	fz_free(ctx, data);
	data = NULL;

	loadPage(doc, number);

	buf = fz_new_buffer(ctx, 0);
	{
		out = fz_new_output_with_buffer(ctx, buf);
		{
			bbox = fz_bound_page(ctx, lastPage);
			dev = fz_new_svg_device(ctx, out, bbox.x1-bbox.x0, bbox.y1-bbox.y0, FZ_SVG_TEXT_AS_PATH, 0);
			fz_run_page(ctx, lastPage, dev, fz_identity, NULL);
			fz_close_device(ctx, dev);
			fz_drop_device(ctx, dev);
		}
		fz_write_byte(ctx, out, 0);
		fz_close_output(ctx, out);
		fz_drop_output(ctx, out);
	}
	fz_buffer_extract(ctx, buf, &data);
	fz_drop_buffer(ctx, buf);

	return (char*)data;
}

EMSCRIPTEN_KEEPALIVE
char *drawPageAsPNG(fz_document *doc, int number, float dpi)
{
	static unsigned char *data = NULL;
	float zoom = dpi / 72;
	fz_pixmap *pix;
	fz_buffer *buf;
	fz_output *out;

	fz_free(ctx, data);
	data = NULL;

	loadPage(doc, number);

	buf = fz_new_buffer(ctx, 0);
	{
		out = fz_new_output_with_buffer(ctx, buf);
		{
			pix = fz_new_pixmap_from_page(ctx, lastPage, fz_scale(zoom, zoom), fz_device_rgb(ctx), 0);
			fz_write_pixmap_as_data_uri(ctx, out, pix);
			fz_drop_pixmap(ctx, pix);
		}
		fz_write_byte(ctx, out, 0);
		fz_close_output(ctx, out);
		fz_drop_output(ctx, out);
	}
	fz_buffer_extract(ctx, buf, &data);
	fz_drop_buffer(ctx, buf);

	return (char*)data;
}

static fz_irect pageBounds(fz_document *doc, int number, float dpi)
{
	loadPage(doc, number);
	return fz_round_rect(fz_transform_rect(fz_bound_page(ctx, lastPage), fz_scale(dpi/72, dpi/72)));
}

EMSCRIPTEN_KEEPALIVE
int pageWidth(fz_document *doc, int number, float dpi)
{
	fz_irect bbox = pageBounds(doc, number, dpi);
	return bbox.x1 - bbox.x0;
}

EMSCRIPTEN_KEEPALIVE
int pageHeight(fz_document *doc, int number, float dpi)
{
	fz_irect bbox = pageBounds(doc, number, dpi);
	return bbox.y1 - bbox.y0;
}

EMSCRIPTEN_KEEPALIVE
char *pageLinks(fz_document *doc, int number, float dpi)
{
	static unsigned char *data = NULL;
	fz_buffer *buf;
	fz_link *links, *link;

	fz_free(ctx, data);
	data = NULL;

	loadPage(doc, number);

	buf = fz_new_buffer(ctx, 0);
	{
		fz_append_string(ctx, buf, "[");
		links = fz_load_links(ctx, lastPage);
		{
			for (link = links; link; link = link->next)
			{
				fz_irect bbox = fz_round_rect(fz_transform_rect(link->rect, fz_scale(dpi/72, dpi/72)));
				fz_append_string(ctx, buf, "{");
				fz_append_printf(ctx, buf, "%q:%d,", "x", bbox.x0);
				fz_append_printf(ctx, buf, "%q:%d,", "y", bbox.y0);
				fz_append_printf(ctx, buf, "%q:%d,", "w", bbox.x1 - bbox.x0);
				fz_append_printf(ctx, buf, "%q:%d,", "h", bbox.y1 - bbox.y0);
				if (fz_is_external_link(ctx, link->uri))
				{
					fz_append_printf(ctx, buf, "%q:%q", "href", link->uri);
				}
				else
				{
					fz_location link_loc = fz_resolve_link(ctx, doc, link->uri, NULL, NULL);
					int link_page = fz_page_number_from_location(ctx, doc, link_loc);
					fz_append_printf(ctx, buf, "%q:\"#page%d\"", "href", link_page+1);
				}
				fz_append_string(ctx, buf, "}");
				if (link->next)
					fz_append_string(ctx, buf, ",");
			}
		}
		fz_append_string(ctx, buf, "]");
		fz_drop_link(ctx, links);
	}

	fz_terminate_buffer(ctx, buf);
	fz_buffer_extract(ctx, buf, &data);
	fz_drop_buffer(ctx, buf);

	return (char*)data;
}

EMSCRIPTEN_KEEPALIVE
char *documentTitle(fz_document *doc)
{
	static char buf[100];
	if (fz_lookup_metadata(ctx, doc, FZ_META_INFO_TITLE, buf, sizeof buf) > 0)
		return buf;
	return "Untitled";
}

EMSCRIPTEN_KEEPALIVE
fz_outline *loadOutline(fz_document *doc)
{
	return fz_load_outline(ctx, doc);
}

EMSCRIPTEN_KEEPALIVE
void freeOutline(fz_outline *outline)
{
	fz_drop_outline(ctx, outline);
}

EMSCRIPTEN_KEEPALIVE
char *outlineTitle(fz_outline *node)
{
	return node->title;
}

EMSCRIPTEN_KEEPALIVE
int outlinePage(fz_outline *node)
{
	return node->page + 1;
}

EMSCRIPTEN_KEEPALIVE
fz_outline *outlineDown(fz_outline *node)
{
	return node->down;
}

EMSCRIPTEN_KEEPALIVE
fz_outline *outlineNext(fz_outline *node)
{
	return node->next;
}
