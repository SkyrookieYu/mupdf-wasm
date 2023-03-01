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

"use strict"

var libmupdf

// If running in Node.js environment
if (typeof require === "function") {
	if (typeof SharedArrayBuffer === "undefined")
		libmupdf = require("../dist/mupdf-wasm-mt.js")
	else
		libmupdf = require("../dist/mupdf-wasm.js")
}

function checkType(value, type) {
	if (typeof type === "string" && typeof value !== type)
		throw new Error("incorrect argument type")
	if (typeof type === "object" && !(value instanceof type))
		throw new Error("incorrect argument type")
}

function assert(pred, message) {
	if (!pred)
		throw new Error(message || "assertion failed")
}

function allocateUTF8(str) {
	var size = libmupdf.lengthBytesUTF8(str) + 1
	var pointer = libmupdf._wasm_malloc(size)
	libmupdf.stringToUTF8(str, pointer, size)
	return pointer
}

function point_from_wasm(ptr) {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0],
		libmupdf.HEAPF32[ptr + 1],
	]
}

function rect_from_wasm(ptr) {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0],
		libmupdf.HEAPF32[ptr + 1],
		libmupdf.HEAPF32[ptr + 2],
		libmupdf.HEAPF32[ptr + 3],
	]
}

function matrix_from_wasm(ptr) {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0],
		libmupdf.HEAPF32[ptr + 1],
		libmupdf.HEAPF32[ptr + 2],
		libmupdf.HEAPF32[ptr + 3],
		libmupdf.HEAPF32[ptr + 4],
		libmupdf.HEAPF32[ptr + 5],
	]
}

function quad_from_wasm(ptr) {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0],
		libmupdf.HEAPF32[ptr + 1],
		libmupdf.HEAPF32[ptr + 2],
		libmupdf.HEAPF32[ptr + 3],
		libmupdf.HEAPF32[ptr + 4],
		libmupdf.HEAPF32[ptr + 5],
		libmupdf.HEAPF32[ptr + 6],
		libmupdf.HEAPF32[ptr + 7],
	]
}

class MupdfError extends Error {
	constructor(message) {
		super(message)
		this.name = "MupdfError"
	}
}

class MupdfTryLaterError extends MupdfError {
	constructor(message) {
		super(message)
		this.name = "MupdfTryLaterError"
	}
}

// TODO - Port fitz geometry methods
// See platform/java/src/com/artifex/mupdf/fitz/Point.java
class Point {
	constructor(x, y) {
		assert(typeof x === "number" && !Number.isNaN(x), "invalid x argument")
		assert(typeof y === "number" && !Number.isNaN(y), "invalid y argument")
		this.x = x
		this.y = y
	}

	// TODO - See 'Matrix.from' below
	// static from(value)

	static fromPtr(ptr) {
		ptr = ptr >> 2
		return new Point(libmupdf.HEAPF32[ptr], libmupdf.HEAPF32[ptr + 1])
	}
}

// TODO - Port fitz geometry methods
// See platform/java/src/com/artifex/mupdf/fitz/Rect.java
class Rect {
	constructor(x0, y0, x1, y1) {
		assert(typeof x0 === "number" && !Number.isNaN(x0), "invalid x0 argument")
		assert(typeof y0 === "number" && !Number.isNaN(y0), "invalid y0 argument")
		assert(typeof x1 === "number" && !Number.isNaN(x1), "invalid x1 argument")
		assert(typeof y1 === "number" && !Number.isNaN(y1), "invalid y1 argument")
		this.x0 = x0
		this.y0 = y0
		this.x1 = x1
		this.y1 = y1
	}

	// TODO - See 'Matrix.from' below
	// static from(value)

	static fromFloatRectPtr(ptr) {
		ptr = ptr >> 2
		return new Rect(
			libmupdf.HEAPF32[ptr],
			libmupdf.HEAPF32[ptr + 1],
			libmupdf.HEAPF32[ptr + 2],
			libmupdf.HEAPF32[ptr + 3]
		)
	}

	static fromIntRectPtr(ptr) {
		ptr = ptr >> 2
		return new Rect(libmupdf.HEAP32[ptr], libmupdf.HEAP32[ptr + 1], libmupdf.HEAP32[ptr + 2], libmupdf.HEAP32[ptr + 3])
	}

	width() {
		return this.x1 - this.x0
	}

	height() {
		return this.y1 - this.y0
	}

	translated(xoff, yoff) {
		return new Rect(this.x0 + xoff, this.y0 + yoff, this.x1 + xoff, this.y1 + yoff)
	}

	transformed(matrix) {
		return matrix.transformRect(this)
	}
}

// TODO - Port fitz geometry methods
// See platform/java/src/com/artifex/mupdf/fitz/Matrix.java
class Matrix {
	constructor(a, b, c, d, e, f) {
		this.a = a
		this.b = b
		this.c = c
		this.d = d
		this.e = e
		this.f = f
	}

	static Identity = new Matrix(1, 0, 0, 1, 0, 0)

	static from(value) {
		if (value instanceof Matrix)
			return value
		if (Array.isArray(value) && value.length === 6)
			return new Matrix(value[0], value[1], value[2], value[3], value[4], value[5])
		else
			throw new Error(`cannot create matrix from '${value}'`)
	}

	static fromPtr(ptr) {
		ptr = ptr >> 2
		return new Matrix(
			libmupdf.HEAPF32[ptr],
			libmupdf.HEAPF32[ptr + 1],
			libmupdf.HEAPF32[ptr + 2],
			libmupdf.HEAPF32[ptr + 3],
			libmupdf.HEAPF32[ptr + 4],
			libmupdf.HEAPF32[ptr + 5]
		)
	}

	static scale(scale_x, scale_y) {
		return Matrix.fromPtr(libmupdf._wasm_scale(scale_x, scale_y))
	}

	transformRect(rect) {
		checkType(rect, Rect)
		return Rect.fromFloatRectPtr(
			libmupdf._wasm_transform_rect(rect.x0, rect.y0, rect.x1, rect.y1, this.a, this.b, this.c, this.d, this.e, this.f)
		)
	}
}

const finalizer = new FinalizationRegistry(f => f())

class Wrapper {
	constructor(pointer, dropFunction) {
		this.pointer = pointer
		this.dropFunction = dropFunction

		if (typeof pointer !== "number" || pointer === 0)
			throw new Error("invalid pointer: " + typeof pointer)
		if (typeof dropFunction !== "function")
			throw new Error("invalid dropFunction")
		if (pointer === 0)
			throw new Error("invalid pointer: null")

		finalizer.register(this, () => dropFunction(pointer), this)
	}

	destroy() {
		finalizer.unregister(this)
		this.dropFunction(this.pointer)
		this.pointer = 0
	}

	toString() {
		return `[${this.constructor.name} ${this.pointer}]`
	}
}

class Buffer extends Wrapper {
	constructor(arg) {
		let pointer = 0
		if (typeof arg === "undefined") {
			pointer = libmupdf._wasm_new_buffer(1024)
		} else if (typeof arg === "number") {
			pointer = arg
		} else if (typeof arg === "string") {
			let data_len = libmupdf.lengthBytesUTF8(arg)
			let data_ptr = libmupdf._wasm_malloc(data_len) + 1
			libmupdf.stringToUTF8(arg, data_len, data_ptr + 1)
			pointer = libmupdf._wasm_new_buffer_from_data(data_ptr, data_len)
		} else if (arg instanceof ArrayBuffer || arg instanceof Uint8Array) {
			let data_len = arg.byteLength
			let data_ptr = libmupdf._wasm_malloc(data_len)
			libmupdf.HEAPU8.set(new Uint8Array(arg), data_ptr)
			pointer = libmupdf._wasm_new_buffer_from_data(data_ptr, data_len)
		}
		super(pointer, libmupdf._wasm_drop_buffer)
	}

	getLength() {
		return libmupdf._wasm_buffer_size(this.pointer)
	}

	readByte(at) {
		let data = libmupdf._wasm_buffer_data(this.pointer)
		libmupdf.HEAPU8[data + at]
	}

	write(s) {
		s = allocateUTF8(s)
		try {
			libmupdf._wasm_append_string(this.pointer, s)
		} finally {
			libmupdf._wasm_free(s)
		}
	}

	writeByte(b) {
		libmupdf._wasm_append_byte(this.pointer, b)
	}

	writeLine(s) {
		this.write(s)
		this.writeByte(10)
	}

	writeBuffer(other) {
		if (!(other instanceof Buffer))
			other = new Buffer(other)
		libmupdf._wasm_append_buffer(this.pointer, other.pointer)
	}

	asUint8Array() {
		let data = libmupdf._wasm_buffer_data(this.pointer)
		let size = libmupdf._wasm_buffer_size(this.pointer)
		return libmupdf.HEAPU8.subarray(data, data + size)
	}

	asString() {
		let data = libmupdf._wasm_buffer_data(this.pointer)
		let size = libmupdf._wasm_buffer_size(this.pointer)
		return libmupdf.UTF8ToString(data, size)
	}
}

class ColorSpace extends Wrapper {
	constructor(pointer) {
		// TODO: ICC profile
		super(pointer, libmupdf._wasm_drop_colorspace)
	}
}

class Font extends Wrapper {
	constructor(arg1) {
		let pointer = 0
		if (typeof arg1 === "number") {
			pointer = libmupdf._wasm_keep_font(arg1)
		} else if (typeof arg1 === "string") {
			let name = allocateUTF8(arg1)
			try {
				pointer = libmupdf._wasm_new_base14_font(name)
			} finally {
				libmupdf._wasm_free(name)
			}
		}
		else if (arg1 instanceof Buffer) {
			pointer = libmupdf._wasm_new_font_from_buffer(arg1.pointer, arg2 | 0)
		}
		super(pointer, libmupdf._wasm_drop_font)
	}

	encodeCharacter(uni) {
		if (typeof uni === "string")
			uni = uni.charCodeAt(0)
		return libmupdf._wasm_encode_character(this.pointer, uni)
	}

	advanceGlyph(gid, wmode = 0) {
		return libmupdf._wasm_advance_glyph(this.pointer, gid, wmode))
	}
}

class Image extends Wrapper {
	constructor(arg1) {
		let pointer = 0
		if (typeof arg1 === "number")
			pointer = libmupdf._wasm_keep_image(arg1)
		else if (arg1 instanceof Pixmap)
			pointer = libmupdf._wasm_new_from_pixmap(arg1.pointer)
		else if (arg1 instanceof Buffer)
			pointer = libmupdf._wasm_new_image_from_buffer(arg1.pointer)
		super(pointer, libmupdf._wasm_drop_image)
	}

	// TODO: toPixmap
}

class Path extends Wrapper {
	constructor() {
		super(libmupdf._new_path(), libmupdf._drop_path)
	}
	getBounds() {
		return rect_from_wasm(libmupdf._wasm_bound_path(this.pointer))
	}
	moveTo(x, y) {
		libmupdf._wasm_moveto(this.pointer, x, y)
	}
	lineTo(x, y) {
		libmupdf._wasm_lineto(this.pointer, x, y)
	}
	curveTo(x1, y1, x2, y2, x3, y3) {
		libmupdf._wasm_curveto(this.pointer, x1, y1, x2, y2, x3, y3)
	}
	curveToV(cx, cy, ex, ey) {
		libmupdf._wasm_curvetov(this.pointer, cx, cy, ex, ey)
	}
	curveToY(cx, cy, ex, ey) {
		libmupdf._wasm_curvetoy(this.pointer, cx, cy, ex, ey)
	}
	closePath() {
		libmupdf._wasm_closepath(this.pointer)
	}
	rect(x1, y1, x2, y2) {
		libmupdf._wasm_rectto(this.pointer, x1, y1, x2, y2)
	}
	transform(matrix) {
		checkType(matrix, Array)
		libmupdf._wasm_transform_path(this.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5]
		)
	}
	walk(walker) {
		// TODO
	}
}

class Text extends Wrapper {
	constructor() {
		super(libmupdf._new_text(), libmupdf._drop_text)
	}
	getBounds() {
		return rect_from_wasm(libmupdf._wasm_bound_text(this.pointer))
	}
	showGlyph(font, trm, gid, uni, wmode = 0) {
		checkType(font, Font)
		checkType(trm, Array)
		checkType(gid, "number")
		checkType(uni, "number")
		libmupdf._wasm_show_glyph(
			this.pointer,
			font.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5],
			gid,
			uni,
			wmode
		)
	}
	showString(font, trm, str, wmode = 0) {
		checkType(font, Font)
		checkType(trm, Array)
		checkType(str, "string")
		str = allocateUTF8(str)
		try {
			out_trm = libmupdf._wasm_show_string(
				this.pointer,
				font.pointer,
				matrix[0], matrix[1],
				matrix[2], matrix[3],
				matrix[4], matrix[5],
				str,
				wmode
			)
			out_trm = out_trm >> 2
			matrix[4] = libmupdf.HEAPF32[out_trm + 4]
			matrix[5] = libmupdf.HEAPF32[out_trm + 5]
		} finally {
			libmupdf._wasm_free(str)
		}
	}
	walk(walker) {
		// TODO
	}
}

class DisplayList extends Wrapper {
	constructor(arg1) {
		if (typeof arg1 === "number") {
			pointer = arg1
		} else {
			let mediabox = arg1
			pointer = libmupdf._wasm_new_display_list(mediabox[0], mediabox[1], mediabox[1], mediabox[2])
		}
		super(pointer, libmupdf._wasm_drop_display_list)
	}

	getBounds() {
		return rect_from_wasm(libmupdf._wasm_bound_display_list(this.pointer)
	}

	// TODO: run
	// TODO: toPixmap
	// TODO: toStructuredText
	// TODO: search
}

class Pixmap extends Wrapper {
	constructor(arg1, bbox = null, alpha = false) {
		let pointer = arg1
		if (arg1 instanceof ColorSpace) {
			checkType(bbox, Array)
			pointer = libmupdf._wasm_new_pixmap_with_bbox(arg1.pointer, bbox[0], bbox[1], bbox[2], bbox[3], 0, alpha)
		}
		super(pointer, libmupdf._wasm_drop_pixmap)
	}

	clear(value) {
		if (typeof value === "undefined")
			libmupdf._wasm_clear_pixmap(this.pointer)
		else
			libmupdf._wasm_clear_pixmap_with_value(this.pointer, value)
	}

	getBounds() {
		return rect_from_wasm(libmupdf._wasm_pixmap_bbox(this.pointer))
	}

	getWidth() {
		let bbox = this.getBounds()
		return bbox[2] - bbox[0]
	}

	getHeight() {
		let bbox = this.getBounds()
		return bbox[3] - bbox[1]
	}

	getPixels() {
		let stride = libmupdf._wasm_pixmap_stride(this.pointer)
		let n = stride * this.height
		let p = libmupdf._wasm_pixmap_samples(this.pointer)
		return new Uint8ClampedArray(libmupdf.HEAPU8.buffer, p, n)
	}

	saveAsPNG() {
		let buf = libmupdf._wasm_new_buffer_from_pixmap_as_png(this.pointer)
		try {
			let data = libmupdf._wasm_buffer_data(buf)
			let size = libmupdf._wasm_buffer_size(buf)
			return libmupdf.HEAPU8.slice(data, data + size)
		} finally {
			libmupdf._wasm_drop_buffer(buf)
		}
	}
}

class StructuredText extends Wrapper {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_drop_stext_page)
	}

	static SELECT_CHARS = 0
	static SELECT_WORDS = 1
	static SELECT_LINES = 2

	walk(walker) {
		let block = libmupdf._wasm_stext_block(this.pointer)
		while (block) {
			let block_type = libmupdf._wasm_stext_block_type(block)
			let block_bbox = rect_from_wasm(libmupdf._wasm_stext_block_bbox(block))

			if (block_type === 1) {
				if (typeof walker.onImageBlock) {
					let matrix = matrix_from_wasm(libmupdf._wasm_stext_block_transform(block))
					// TODO: refcount
					let image = new Image(libmupdf._wasm_stext_block_image(block))
					walker.onImageBlock(block_bbox, matrix, image)
				}
			} else {
				if (walker.beginTextBlock)
					walker.beginTextBlock(block_bbox)

				let line = libmupdf._wasm_stext_line(block)
				while (line) {
					let line_bbox = rect_from_wasm(libmupdf._wasm_stext_line_bbox(line))
					let line_wmode = libmupdf._wasm_stext_line_wmode(line)

					if (walker.beginLine)
						walker.beginLine(line_bbox, line_wmode)

					if (walker.onChar) {
						let ch = libmupdf._wasm_stext_char(line)
						while (ch) {
							let ch_rune = libmupdf._wasm_stext_char_rune(ch)
							let ch_origin = point_from_wasm(libmupdf._wasm_stext_char_origin(ch))
							// TODO: refcount
							let ch_font = new Font(libmupdf._wasm_stext_char_font(ch))
							let ch_size = libmupdf._wasm_stext_char_size(ch)
							let ch_quad = quad_from_wasm(libmupdf._wasm_stext_char_quad(ch))
							let ch_color = libmupdf._wasm_stext_char_color(ch)

							walker.onChar(ch_rune, ch_origin, ch_font, ch_size, ch_quad, ch_color)

							ch = libmupdf._wasm_stext_char_next(ch)
						}
					}

					if (walker.endLine)
						walker.endLine()
				}

				if (walker.endTextBlock)
					walker.endTextBlock()

				line = libmupdf._wasm_stext_line_next(line)
			}

			block = libmupdf._wasm_stext_block_next(block)
		}
	}

	// TODO: search
	// TODO: highlight
	// TODO: copy
	// TODO: snapSelection

	asJSON(scale = 1) {
		let text_ptr = libmupdf._wasm_print_stext_page_as_json(this.pointer, scale)
		text = libmupdf.UTF8ToString(text_ptr)
		libmupdf._wasm_free(text_ptr)
		return text
	}
}


class Device extends Wrapper {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_drop_device)
	}

	close() {
		libmupdf._wasm_close_device(this.pointer)
	}
}

class DrawDevice extends Device {
	constructor(matrix, pixmap) {
		checkType(matrix, Array)
		checkType(pixmap, Pixmap)
		return new Device(
			libmupdf._wasm_new_draw_device(
				matrix[0], matrix[1],
				matrix[2], matrix[3],
				matrix[4], matrix[5],
				pixmap.pointer
			)
		)
	}
}

class DisplayListDevice extends Device {
	constructor(displayList) {
		checkType(displayList, DisplayList)
		return new Device(
			libmupdf._wasm_new_list_device(displayList.pointer)
		)
	}
}

// === Document ===

class Document extends Wrapper {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_drop_document)
	}

	static META_FORMAT = "format"
	static META_ENCRYPTION = "encryption";
	static META_INFO_AUTHOR = "info:Author";
	static META_INFO_TITLE = "info:Title";
	static META_INFO_SUBJECT = "info:Subject";
	static META_INFO_KEYWORDS = "info:Keywords";
	static META_INFO_CREATOR = "info:Creator";
	static META_INFO_PRODUCER = "info:Producer";
	static META_INFO_CREATIONDATE = "info:CreationDate";
	static META_INFO_MODIFICATIONDATE = "info:ModDate";

	static PERMISSION_PRINT = "p".charCodeAt(0)
	static PERMISSION_COPY = "c".charCodeAt(0)
	static PERMISSION_EDIT = "e".charCodeAt(0)
	static PERMISSION_ANNOTATE = "n".charCodeAt(0)

	static openDocument(from, magic) {
		let pointer = 0

		magic = allocateUTF8(magic)
		try {
			if (from instanceof ArrayBuffer || from instanceof Uint8Array)
				from = new Buffer(from)
			if (from instanceof Buffer)
				pointer = libmupdf._wasm_open_document_with_buffer(from.pointer, magic)
			else if (from instanceof Stream)
				pointer = libmupdf._wasm_open_document_with_stream(from.pointer, magic)
			else
				throw new Error("not a Buffer or Stream")
		} finally {
			libmupdf._wasm_free(magic)
		}

		let pdf_ptr = libmupdf._wasm_pdf_document_from_fz_document(pointer)
		if (pdf_ptr)
			return new PDFDocument(pointer)
		return new Document(pointer)
	}

	isPDF() {
		return false
	}

	needsPassword() {
		return libmupdf._wasm_needs_password(this.pointer)
	}

	authenticatePassword(password) {
		password = allocateUTF8(password)
		try {
			return libmupdf._wasm_authenticate_password(this.pointer, password)
		} finally {
			libmupdf._wasm_free(password)
		}
	}

	hasPermission(flag) {
		if (typeof flag === "string") {
			switch (flag) {
				case "print":
					flag = Document.PERMISSION_PRINT
					break
				case "annotatate":
					flag = Document.PERMISSION_ANNOTATE
					break
				case "edit":
					flag = Document.PERMISSION_EDIT
					break
				case "copy":
					flag = Document.PERMISSION_COPY
					break
				default:
					throw new Error("invalid permission name")
					break
			}
		}
		return libmupdf._wasm_has_permission(this.pointer, flag)
	}

	getMetaData(key) {
		key = allocateUTF8(key)
		try {
			let value = libmupdf._wasm_lookup_metadata(this.pointer, key)
			if (value)
				return libmupdf.UTF8ToString(value)
			return undefined
		} finally {
			libmupdf._wasm_free(key)
		}
	}

	setMetaData(key, value) {
		key = allocateUTF8(key)
		value = allocateUTF8(value)
		try {
			libmupdf._wasm_set_metadata(this.pointer, key, value)
		} finally {
			libmupdf._wasm_free(value)
			libmupdf._wasm_free(key)
		}
	}

	resolveLink(link) {
		// TODO
		return 0
	}

	countPages() {
		return libmupdf._wasm_count_pages(this.pointer)
	}

	isReflowable() {
		// no HTML/EPUB support in WASM
		return false
	}

	layout(pageW, pageH, fontSize) {
		// no HTML/EPUB support in WASM
	}

	loadPage(index) {
		let fz_ptr = libmupdf._wasm_load_page(this.pointer, index)
		let pdf_ptr = libmupdf._wasm_pdf_page_from_fz_page(fz_ptr)
		if (pdf_ptr)
			return new PDFPage(pdf_ptr)
		return new Page(fz_ptr)
	}

	loadOutline() {
		let doc = this
		function to_outline(outline) {
			let result = []
			while (outline) {
				let item = {}

				let title = libmupdf._wasm_outline_title(outline)
				if (title)
					item.title = libmupdf.UTF8ToString(title)

				let uri = libmupdf._wasm_outline_uri(outline)
				if (uri)
					item.uri = libmupdf.UTF8ToString(uri)

				let page = libmupdf._wasm_outline_page(doc.pointer, outline)
				if (page >= 0)
					item.page = page

				let down = libmupdf._wasm_outline_down(outline)
				if (down)
					item.down = to_outline(down)

				result.push(item)

				outline = libmupdf._wasm_outline_next(outline)
			}
			return result
		}
		return to_outline(libmupdf._wasm_load_outline(this.pointer))
	}

	resolveLink(link) {
		if (link instanceof Link)
			return libmupdf._wasm_resolve_link(this.pointer, libmupdf._wasm_link_uri(link.pointer))
		link = allocateUTF8(link)
		try {
			return libmupdf._wasm_resolve_link(this.pointer, link)
		} finally {
			libmupdf._wasm_free(link)
		}
	}

	// TODO: resolveLinkDestination
}

class PDFDocument extends Document {
	isPDF() {
		return true
	}
}

class Page extends Wrapper {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_drop_page)
	}

	isPDF() {
		return false
	}

	getBounds() {
		return rect_from_wasm(libmupdf._wasm_bound_page(this.pointer))
	}

	run(device, matrix, cookie = null) {
		checkType(device, Device)
		checkType(matrix, Array)
		libmupdf._wasm_run_page(this.pointer,
			device.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5],
			cookie?.pointer)
	}

	runPageContents(device, matrix, cookie = null) {
		checkType(device, Device)
		checkType(matrix, Array)
		libmupdf._wasm_run_page_contents(this.pointer,
			device.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5],
			cookie?.pointer)
	}

	runPageAnnots(device, matrix, cookie = null) {
		checkType(device, Device)
		checkType(matrix, Array)
		libmupdf._wasm_run_page_annots(this.pointer,
			device.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5],
			cookie?.pointer)
	}

	runPageWidgets(device, matrix, cookie = null) {
		checkType(device, Device)
		checkType(matrix, Array)
		libmupdf._wasm_run_page_widgets(this.pointer,
			device.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5],
			cookie?.pointer)
	}

	toPixmap(matrix, colorspace, alpha = false, showExtras = true) {
		checkType(matrix, Array)
		checkType(colorspace, ColorSpace)
		let result
		if (showExtras)
			result = libmupdf._new_pixmap_from_page(this.pointer, matrix, colorspace, alpha)
		else
			result = libmupdf._new_pixmap_from_page_contents(this.pointer, matrix, colorspace, alpha)
		return new Pixmap(result)
	}

	toDisplayList(showExtras = true) {
		let result
		if (showExtras)
			result = libmupdf._new_display_list_from_page(this.pointer)
		else
			result = libmupdf._new_display_list_from_page_contents(this.pointer)
		return new DisplayList(result)
	}

	toStructuredText(options) {
		// TODO: parse options
		return new StructuredText(libmupdf._wasm_new_stext_page_from_page(this.pointer))
	}

	getLinks() {
		let links = []
		let link = libmupdf._wasm_load_links(this.pointer)
		while (link) {
			links.push(new Link(libmupdf._wasm_keep_link(link)))
			link = libmupdf._wasm_next_link(link)
		}
		return links
	}

	search(needle, max_hits = 500) {
		checkType(needle, "string")
		needle = allocateUTF8(needle)
		let hits = 0
		let marks = 0
		try {
			hits = libmupdf._wasm_malloc(32 * max_hits)
			marks = libmupdf._wasm_malloc(4 * max_hits)
			let n = libmupdf._wasm_search_page(this.pointer, needle, marks, hits, max_hits)
			let outer = []
			if (n > 0) {
				let inner = []
				for (let i = 0; i < n; ++i) {
					let mark = libmupdf.HEAP32[(marks>>2) + i]
					let quad = quad_from_wasm(hits + i * 32)
					if (i > 0 && mark) {
						outer.push(inner)
						inner = []
					}
					inner.push(quad)
				}
				outer.push(inner)
			}
			return outer
		} finally {
			libmupdf._wasm_free(needle)
			libmupdf._wasm_free(marks)
			libmupdf._wasm_free(hits)
		}
	}
}

class PDFPage extends Page {
	constructor(pointer) {
		super(pointer)
		this._annots = null
	}

	isPDF() {
		return true
	}

	getWidgets() {
		let list = []
		let widget = libmupdf._wasm_pdf_first_widget(this.pointer)
		while (widget) {
			list.push(new PDFWidget(libmupdf._wasm_pdf_keep_annot(widget)))
			widget = libmupdf._wasm_pdf_next_widget(widget)
		}
		return list
	}

	getAnnotations() {
		if (!this._annots) {
			this._annots = []
			let annot = libmupdf._wasm_pdf_first_annot(this.pointer)
			while (annot) {
				this._annots.push(new PDFAnnotation(libmupdf._wasm_pdf_keep_annot(annot)))
				annot = libmupdf._wasm_pdf_next_annot(annot)
			}
		}
		return this._annots
	}

	createAnnotation(type) {
		if (typeof type === "string")
			type = PDFAnnotation.TYPES.indexOf(type)
		let annot = new PDFAnnotation(libmupdf._wasm_pdf_create_annot(this.pointer, type))
		if (this._annots)
			this._annots.push(annot)
		return annot
	}

	deleteAnnotation(annot) {
		checkType(annot, PDFAnnotation)
		libmupdf._wasm_pdf_delete_annot(this.pointer, annot.pointer)
		if (this._annots) {
			let ix = this._annots.indexOf(annot)
			if (ix >= 0)
				this._annots.splice(ix, 1)
		}
	}

	static REDACT_IMAGE_NONE = 0
	static REDACT_IMAGE_REMOVE = 1
	static REDACT_IMAGE_PIXELS = 2

	applyRedactions(blackBoxes = 1, imageMethod = 2) {
		libmupdf._wasm_pdf_redact_page(this.pointer, black_boxes, image_method)
	}

	update() {
		return !!libmupdf._wasm_pdf_update_page(this.pointer)
	}

	createLink(bbox, uri) {
		checkType(bbox, Array)
		uri = allocateUTF8(uri)
		try {
			return new Link(libmupdf._wasm_pdf_create_link(this.pointer, bbox[0], bbox[1], bbox[2], bbox[3], uri))
		} finally {
			libmupdf._wasm_free(uri)
		}
	}
}

class Link extends Wrapper {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_drop_link)
	}

	getBounds() {
		return rect_from_wasm(libmupdf._wasm_link_rect(this.pointer))
	}

	setBounds(rect) {
		libmupdf._wasm_link_set_rect(this.pointer, rect[0], rect[1], rect[2], rect[3])
	}

	getURI() {
		return libmupdf.UTF8ToString(libmupdf._wasm_link_uri(this.pointer))
	}

	setURI(uri) {
		uri = allocateUTF8(uri)
		try {
			libmupdf._wasm_link_set_uri(this.pointer, uri)
		} finally {
			libmupdf._wasm_free(uri)
		}
	}

	isExternal() {
		return !!libmupdf._wasm_is_external_link(this.pointer)
	}
}

class PDFAnnotation extends Wrapper {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_pdf_drop_annot)
	}

	/* IMPORTANT: Keep in sync with mupdf/pdf/annot.h and PDFAnnotation.java */
	static TYPES = [
		"Text",
		"Link",
		"FreeText",
		"Line",
		"Square",
		"Circle",
		"Polygon",
		"PolyLine",
		"Highlight",
		"Underline",
		"Squiggly",
		"StrikeOut",
		"Redact",
		"Stamp",
		"Caret",
		"Ink",
		"Popup",
		"FileAttachment",
		"Sound",
		"Movie",
		"RichMedia",
		"Widget",
		"Screen",
		"PrinterMark",
		"TrapNet",
		"Watermark",
		"3D",
		"Projection",
	]

        static LINE_ENDING_NONE = 0
        static LINE_ENDING_SQUARE = 1
        static LINE_ENDING_CIRCLE = 2
        static LINE_ENDING_DIAMOND = 3
        static LINE_ENDING_OPEN_ARROW = 4
        static LINE_ENDING_CLOSED_ARROW = 5
        static LINE_ENDING_BUTT = 6
        static LINE_ENDING_R_OPEN_ARROW = 7
        static LINE_ENDING_R_CLOSED_ARROW = 8
        static LINE_ENDING_SLASH = 9

        static BORDER_STYLE_SOLID = 0
        static BORDER_STYLE_DASHED = 1
        static BORDER_STYLE_BEVELED = 2
        static BORDER_STYLE_INSET = 3
        static BORDER_STYLE_UNDERLINE = 4

        static BORDER_EFFECT_NONE = 0
        static BORDER_EFFECT_CLOUDY = 1

        static IS_INVISIBLE = 1 << (1-1)
        static IS_HIDDEN = 1 << (2-1)
        static IS_PRINT = 1 << (3-1)
        static IS_NO_ZOOM = 1 << (4-1)
        static IS_NO_ROTATE = 1 << (5-1)
        static IS_NO_VIEW = 1 << (6-1)
        static IS_READ_ONLY = 1 << (7-1)
        static IS_LOCKED = 1 << (8-1)
        static IS_TOGGLE_NO_VIEW = 1 << (9-1)
        static IS_LOCKED_CONTENTS = 1 << (10-1)

	getBounds() {
		return rect_from_wasm(libmupdf._wasm_pdf_bound_annot(this.pointer))
	}

	run(device, matrix) {
		checkType(device, Device)
		checkType(matrix, Array)
		libmupdf._wasm_pdf_run_annot(this.pointer,
			device.pointer,
			matrix[0], matrix[1],
			matrix[2], matrix[3],
			matrix[4], matrix[5]
		)
	}

	toPixmap(matrix, colorspace, alpha = false) {
		checkType(matrix, Array)
		checkType(colorspace, ColorSpace)
		return new Pixmap(
			libmupdf._wasm_pdf_new_pixmap_from_annot(
				this.pointer,
				matrix[0], matrix[1],
				matrix[2], matrix[3],
				matrix[4], matrix[5],
				colorspace.pointer,
				alpha)
		)
	}

	toDisplayList() {
		return new DisplayList(libmupdf._wasm_pdf_new_display_list_from_annot(this.pointer))
	}

	update() {
		return !!libmupdf._wasm_pdf_update_annot(this.pointer)
	}

	getObject() {
		let obj = libmupdf._wasm_pdf_annot_obj(this.pointer)
		return new PDFObject(libmupdf._wasm_pdf_keep_obj(obj))
	}

	getType() {
		let type = libmupdf._wasm_pdf_annot_type(this.pointer)
		return PDFAnnotation.TYPES[type]
	}

	getFlags() {
		return libmupdf._wasm_pdf_annot_flags(this.pointer)
	}

	setFlags(flags) {
		return libmupdf._wasm_pdf_set_annot_flags(this.pointer, flags)
	}

	getContents() {
		let text_ptr = libmupdf._wasm_pdf_annot_contents(this.pointer)
		try {
			return libmupdf.UTF8ToString(text_ptr)
		} finally {
			libmupdf._wasm_free(text_ptr)
		}
	}

	setContents(text) {
		let text_ptr = allocateUTF8(text)
		try {
			libmupdf._wasm_pdf_set_annot_contents(this.pointer, text_ptr)
		} finally {
			libmupdf._wasm_free(text_ptr)
		}
	}





	getPopup() {
		return rect_from_wasm(libmupdf._wasm_pdf_annot_popup(this.pointer))
	}

	setPopup(rect) {
		libmupdf._wasm_pdf_set_annot_popup(this.pointer, rect[0], rect[1], rect[2], rect[3])
	}

	// TODO

	hasRect() {
		return libmupdf._wasm_pdf_annot_has_rect(this.pointer)
	}

	getRect() {
		return rect_from_wasm(libmupdf._wasm_pdf_annot_rect(this.pointer))
	}

	setRect(rect) {
		libmupdf._wasm_pdf_set_annot_rect(this.pointer, rect[0], rect[1], rect[2], rect[3])
	}

	hasOpen() {
		return libmupdf._wasm_pdf_annot_has_open(this.pointer)
	}

	isOpen() {
		return libmupdf._wasm_pdf_annot_is_open(this.pointer)
	}

	setIsOpen(isOpen) {
		return libmupdf._wasm_pdf_annot_set_is_open(this.pointer, isOpen ? 1 : 0)
	}

	hasIconName() {
		return libmupdf._wasm_pdf_annot_has_icon_name(this.pointer)
	}

	getIconName() {
		// the string returned by this function is static and doesn't need to be freed
		return libmupdf.UTF8ToString(libmupdf._wasm_pdf_annot_icon_name(this.pointer))
	}

	setIconName(name) {
		let name_ptr = allocateUTF8(name)
		try {
			libmupdf._wasm_pdf_set_annot_icon_name(this.pointer, name_ptr)
		} finally {
			libmupdf._wasm_free(name_ptr)
		}
	}

	// TODO - line endings

	getBorder() {
		return libmupdf._wasm_pdf_annot_border(this.pointer)
	}

	setBorder(width) {
		libmupdf._wasm_pdf_set_annot_border(this.pointer, width)
	}

	// TODO - fz_document_language

	getLanguage() {
		// the string returned by this function is static and doesn't need to be freed
		return libmupdf.UTF8ToString(libmupdf._wasm_pdf_annot_language(this.pointer))
	}

	setLanguage(lang) {
		let lang_ptr = allocateUTF8(lang)
		try {
			libmupdf._wasm_pdf_set_annot_language(this.pointer, lang_ptr)
		} finally {
			libmupdf._wasm_free(lang_ptr)
		}
	}

	// TODO
	//wasm_pdf_annot_quadding
	//wasm_pdf_set_annot_quadding

	opacity() {
		return libmupdf._wasm_pdf_annot_opacity(this.pointer)
	}

	setOpacity(opacity) {
		libmupdf._wasm_pdf_set_annot_opacity(this.pointer, opacity)
	}

	// TODO
	// pdf_annot_MK_BG
	// pdf_set_annot_color
	// pdf_annot_interior_color

	hasLine() {
		return libmupdf._wasm_pdf_annot_has_line(this.pointer)
	}

	getLine() {
		let line_ptr = libmupdf._wasm_pdf_annot_line(this.pointer)
		return [ Point.fromPtr(line_ptr), Point.fromPtr(line_ptr + 8) ]
	}

	setLine(a, b) {
		libmupdf._wasm_pdf_set_annot_line(this.pointer, a[0], a[1], b[0], b[1])
	}

	hasVertices() {
		return libmupdf._wasm_pdf_annot_has_vertices(this.pointer)
	}

	vertexCount() {
		return libmupdf._wasm_pdf_annot_vertex_count(this.pointer)
	}

	vertex(i) {
		return Point.fromPtr(libmupdf._wasm_pdf_annot_vertex(this.pointer, i))
	}

	// TODO pdf_set_annot_vertices

	clearVertices() {
		libmupdf._wasm_pdf_clear_annot_vertices(this.pointer)
	}

	addVertex(point) {
		assert(point instanceof Point, "invalid point argument")
		libmupdf._wasm_pdf_add_annot_vertex(this.pointer, point[0], point[1])
	}

	setVertex(i, point) {
		assert(point instanceof Point, "invalid point argument")
		libmupdf._wasm_pdf_set_annot_vertex(this.pointer, i, point[0], point[1])
	}

	// TODO - quad points

	modificationDate() {
		// libmupdf uses seconds since epoch, but Date expects milliseconds
		return new Date(libmupdf._wasm_pdf_annot_modification_date(this.pointer) * 1000)
	}

	creationDate() {
		// libmupdf uses seconds since epoch, but Date expects milliseconds
		return new Date(libmupdf._wasm_pdf_annot_creation_date(this.pointer) * 1000)
	}

	setModificationDate(date) {
		assert(date instanceof Date, "invalid date argument")
		// Date stores milliseconds since epoch, but libmupdf expects seconds
		libmupdf._wasm_pdf_set_annot_modification_date(this.pointer, date.getTime() / 1000)
	}

	setCreationDate(date) {
		assert(date instanceof Date, "invalid date argument")
		// Date stores milliseconds since epoch, but libmupdf expects seconds
		libmupdf._wasm_pdf_set_annot_creation_date(this.pointer, date.getTime() / 1000)
	}

	hasAuthor() {
		return libmupdf._wasm_pdf_annot_has_author(this.pointer)
	}

	author() {
		let string_ptr = libmupdf._wasm_pdf_annot_author(this.pointer)
		try {
			return libmupdf.UTF8ToString(string_ptr)
		} finally {
			libmupdf._wasm_free(string_ptr)
		}
	}

	setAuthor(name) {
		let name_ptr = allocateUTF8(name)
		try {
			libmupdf._wasm_pdf_set_annot_author(this.pointer, name_ptr)
		} finally {
			libmupdf._wasm_free(name_ptr)
		}
	}

	// TODO - default appearance

	fieldFlags() {
		return libmupdf._wasm_pdf_annot_field_flags(this.pointer)
	}

	fieldValue() {
		let string_ptr = libmupdf._wasm_pdf_annot_field_value(this.pointer)
		try {
			return libmupdf.UTF8ToString(string_ptr)
		} finally {
			libmupdf._wasm_free(string_ptr)
		}
	}

	fieldLabel() {
		let string_ptr = libmupdf._wasm_pdf_annot_field_label(this.pointer)
		try {
			return libmupdf.UTF8ToString(string_ptr)
		} finally {
			libmupdf._wasm_free(string_ptr)
		}
	}

	// TODO
	//int pdf_set_annot_field_value(fz_context *ctx, pdf_document *doc, pdf_annot *annot, const char *text, int ignore_trigger_events)
	// void pdf_set_annot_appearance(fz_context *ctx, pdf_annot *annot, const char *appearance, const char *state, fz_matrix ctm, fz_rect bbox, pdf_obj *res, fz_buffer *contents)
	// void pdf_set_annot_appearance_from_display_list(fz_context *ctx, pdf_annot *annot, const char *appearance, const char *state, fz_matrix ctm, fz_display_list *list)

	// TODO filespec
}

class PDFWidget extends PDFAnnotation {
	constructor(pointer) {
		super(pointer, libmupdf._wasm_pdf_drop_annot)
	}
	
	/* IMPORTANT: Keep in sync with mupdf/pdf/widget.h and PDFWidget.java */
	static TYPE_UNKNOWN = 0;
	static TYPE_BUTTON = 1;
	static TYPE_CHECKBOX = 2;
	static TYPE_COMBOBOX = 3;
	static TYPE_LISTBOX = 4;
	static TYPE_RADIOBUTTON = 5;
	static TYPE_SIGNATURE = 6;
	static TYPE_TEXT = 7;

	static TX_FORMAT_NONE = 0;
	static TX_FORMAT_NUMBER = 1;
	static TX_FORMAT_SPECIAL = 2;
	static TX_FORMAT_DATE = 3;
	static TX_FORMAT_TIME = 4;

	/* Field flags */
	static PDF_FIELD_IS_READ_ONLY = 1;
	static PDF_FIELD_IS_REQUIRED = 1 << 1;
	static PDF_FIELD_IS_NO_EXPORT = 1 << 2;

	/* Text fields */
	static PDF_TX_FIELD_IS_MULTILINE = 1 << 12;
	static PDF_TX_FIELD_IS_PASSWORD = 1 << 13;
	static PDF_TX_FIELD_IS_COMB = 1 << 24;

	/* Button fields */
	static PDF_BTN_FIELD_IS_NO_TOGGLE_TO_OFF = 1 << 14;
	static PDF_BTN_FIELD_IS_RADIO = 1 << 15;
	static PDF_BTN_FIELD_IS_PUSHBUTTON = 1 << 16;

	/* Choice fields */
	static PDF_CH_FIELD_IS_COMBO = 1 << 17;
	static PDF_CH_FIELD_IS_EDIT = 1 << 18;
	static PDF_CH_FIELD_IS_SORT = 1 << 19;
	static PDF_CH_FIELD_IS_MULTI_SELECT = 1 << 21;

	/* Signature appearance */
	static PDF_SIGNATURE_SHOW_LABELS = 1;
	static PDF_SIGNATURE_SHOW_DN = 2;
	static PDF_SIGNATURE_SHOW_DATE = 4;
	static PDF_SIGNATURE_SHOW_TEXT_NAME = 8;
	static PDF_SIGNATURE_SHOW_GRAPHIC_NAME = 16;
	static PDF_SIGNATURE_SHOW_LOGO = 32;
	static PDF_SIGNATURE_DEFAULT_APPEARANCE = 63;

	// TODO
}







class JobCookie extends Wrapper {
	constructor(pointer) {
		if (!pointer)
			pointer = libmupdf._wasm_new_cookie()
		super(pointer, libmupdf._wasm_free_cookie)
	}

	aborted() {
		return libmupdf._wasm_cookie_aborted(this.pointer)
	}
}

function createCookie() {
	return libmupdf._wasm_new_cookie()
}

function cookieAborted(cookiePointer) {
	return libmupdf._wasm_cookie_aborted(cookiePointer)
}

function deleteCookie(cookiePointer) {
	libmupdf._wasm_free_cookie(cookiePointer)
}

class Stream extends Wrapper {
	constructor(pointer, internalBuffer = null) {
		super(pointer, libmupdf._wasm_drop_stream)
		// We keep a reference so the internal buffer isn't dropped before the stream is.
		this.internalBuffer = internalBuffer
	}

	static fromUrl(url, contentLength, block_size, prefetch) {
		let url_ptr = allocateUTF8(url)
		try {
			let pointer = libmupdf._wasm_open_stream_from_url(url_ptr, contentLength, block_size, prefetch)
			return new Stream(pointer)
		} finally {
			libmupdf._wasm_free(url_ptr)
		}
	}

	// This takes a reference to the buffer, not a clone.
	// Modifying the buffer after calling this function will change the returned stream's output.
	static fromBuffer(buffer) {
		assert(buffer instanceof Buffer, "invalid buffer argument")
		return new Stream(libmupdf._wasm_new_stream_from_buffer(buffer.pointer), buffer)
	}

	static fromJsBuffer(buffer) {
		return Stream.fromBuffer(Buffer.fromJsBuffer(buffer))
	}

	static fromJsString(string) {
		return Stream.fromBuffer(Buffer.fromJsString(string))
	}

	readAll(suggestedCapacity = 0) {
		return new Buffer(libmupdf._wasm_read_all(this.pointer, suggestedCapacity))
	}
}




// Background progressive fetch

// TODO - move in Stream
function onFetchData(id, block, data) {
	let n = data.byteLength
	let p = libmupdf._wasm_malloc(n)
	libmupdf.HEAPU8.set(new Uint8Array(data), p)
	libmupdf._wasm_on_data_fetched(id, block, p, n)
	libmupdf._wasm_free(p)
}

// TODO - replace with map
let fetchStates = {}

function fetchOpen(id, url, contentLength, blockShift, prefetch) {
	console.log("OPEN", url, "PROGRESSIVELY")
	fetchStates[id] = {
		url: url,
		blockShift: blockShift,
		blockSize: 1 << blockShift,
		prefetch: prefetch,
		contentLength: contentLength,
		map: new Array((contentLength >>> blockShift) + 1).fill(0),
		closed: false,
	}
}

async function fetchRead(id, block) {
	let state = fetchStates[id]

	if (state.map[block] > 0)
		return

	state.map[block] = 1
	let contentLength = state.contentLength
	let url = state.url
	let start = block << state.blockShift
	let end = start + state.blockSize
	if (end > contentLength)
		end = contentLength

	try {
		let response = await fetch(url, { headers: { Range: `bytes=${start}-${end - 1}` } })
		if (state.closed)
			return

		// TODO - use ReadableStream instead?
		let buffer = await response.arrayBuffer()
		if (state.closed)
			return

		console.log("READ", url, block + 1, "/", state.map.length)
		state.map[block] = 2

		onFetchData(id, block, buffer)

		onFetchCompleted(id)

		// TODO - Does this create a risk of stack overflow?
		if (state.prefetch)
			fetchReadNext(id, block + 1)
	} catch (error) {
		state.map[block] = 0
		console.log("FETCH ERROR", url, block, error.toString)
	}
}

function fetchReadNext(id, next) {
	let state = fetchStates[id]
	if (!state)
		return

	// Don't prefetch if we're already waiting for any blocks.
	for (let block = 0; block < state.map.length; ++block)
		if (state.map[block] === 1)
			return

	// Find next block to prefetch (starting with the last fetched block)
	for (let block = next; block < state.map.length; ++block)
		if (state.map[block] === 0)
			return fetchRead(id, block)

	// Find next block to prefetch (starting from the beginning)
	for (let block = 0; block < state.map.length; ++block)
		if (state.map[block] === 0)
			return fetchRead(id, block)

	console.log("ALL BLOCKS READ")
}

function fetchClose(id) {
	fetchStates[id].closed = true
	delete fetchStates[id]
}

// --- EXPORTS ---

const mupdf = {
	Matrix,
	Buffer,
	ColorSpace,
	Font,
	Image,
	Path,
	Text,
	Pixmap,
	DrawDevice,
	DisplayListDevice,
	Document,
	PDFDocument,
	onFetchCompleted: () => {},
}

// TODO - Figure out better naming scheme for fetch methods
function onFetchCompleted(id) {
	mupdf.onFetchCompleted(id)
}

const libmupdf_injections = {
	fetchOpen,
	fetchRead,
	fetchClose,
	MupdfError,
	MupdfTryLaterError,
}

mupdf.ready = libmupdf(libmupdf_injections).then((m) => {
	libmupdf = m
	libmupdf._wasm_init_context()

	mupdf.DeviceGray = new ColorSpace(libmupdf._wasm_device_gray())
	mupdf.DeviceRGB = new ColorSpace(libmupdf._wasm_device_rgb())
	mupdf.DeviceBGR = new ColorSpace(libmupdf._wasm_device_bgr())
	mupdf.DeviceCMYK = new ColorSpace(libmupdf._wasm_device_cmyk())

	if (!globalThis.crossOriginIsolated)
		return null
	if (globalThis.SharedArrayBuffer == null)
		return null
	if (libmupdf.wasmMemory == null)
		return null
	if ((libmupdf.wasmMemory instanceof WebAssembly.Memory) && (libmupdf.wasmMemory.buffer instanceof SharedArrayBuffer))
		return libmupdf.wasmMemory.buffer
	return null
})

// If running in Node.js environment
if (typeof require === "function")
	module.exports = mupdf
