.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title:: The Fitz API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm



The Fitz API
================


This API calls the main WASM library C-like methods via the JavaScript object ``libmupdf`` and requires that a pointer to the document is passed through for many of the methods to correctly function.


The :ref:`MuPDF API<mupdf_api>` is built on top of this API.



Methods
----------------------


Consider the following objects and definitions when using this API.

.. _fitz_api_glossary:

Fitz API object glossary
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :widths: 50
   :header-rows: 0

   * - `Annot <https://ghostscript.com/~julian/mupdf/include/html/structpdf__annot.html>`_
   * - `Buffer <https://ghostscript.com/~julian/mupdf/include/html/structfz__buffer.html>`_
   * - `ColorSpace <https://ghostscript.com/~julian/mupdf/include/html/structfz__colorspace.html>`_
   * - `Document <https://ghostscript.com/~julian/mupdf/include/html/structfz__document.html>`_
   * - `IRect <https://ghostscript.com/~julian/mupdf/include/html/structfz__irect.html>`_
   * - `Link <https://ghostscript.com/~julian/mupdf/include/html/structfz__link.html>`_
   * - `Matrix <https://ghostscript.com/~julian/mupdf/include/html/structfz__matrix.html>`_
   * - `Outline <https://ghostscript.com/~julian/mupdf/include/html/structfz__outline.html>`_
   * - `Page <https://ghostscript.com/~julian/mupdf/include/html/structfz__page.html>`_
   * - `Point <https://ghostscript.com/~julian/mupdf/include/html/structfz__point.html>`_
   * - `Pixmap <https://ghostscript.com/~julian/mupdf/include/html/structfz__pixmap.html>`_
   * - `Quad <https://ghostscript.com/~julian/mupdf/include/html/structfz__quad.html>`_
   * - `Rect <https://ghostscript.com/~julian/mupdf/include/html/structfz__rect.html>`_
   * - `Stream <https://ghostscript.com/~julian/mupdf/include/html/structfz__stream.html>`_
   * - `TextPage <https://ghostscript.com/~julian/mupdf/include/html/structfz__stext__page.html>`_


``_wasm_init_context``
~~~~~~~~~~~~~~~~~~~~~~

Initialises the WASM context. This is necessary before attempting to call any futher ``_wasm_*`` methods. Will throw an exception if unable to create the MuPDF context.


.. code-block:: javascript

  libmupdf._wasm_init_context();



.. _fitz_api_wasm_scale:

|

``_wasm_scale``
~~~~~~~~~~~~~~~~~~~

Takes x & y scale arguments and returns a :ref:`matrix<fitz_api_glossary>`.


.. code-block:: javascript

  let matrix = libmupdf._wasm_scale(scale_x, scale_y);


|

``_wasm_transform_rect``
~~~~~~~~~~~~~~~~~~~~~~~~~

Takes :ref:`rectangle<fitz_api_glossary>` and :ref:`matrix<fitz_api_glossary>` parameters and returns a :ref:`rectangle<fitz_api_glossary>` transformed by the :ref:`matrix<fitz_api_glossary>`.


.. code-block:: javascript

  let rect = libmupdf._wasm_transform_rect(x0, y0, x1, y1, a, b, c, d, e, f);


|

``_wasm_open_document_with_buffer``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Takes a :ref:`buffer<fitz_api_glossary>` of data and a magic wildcard (in most cases this is the filename) and returns a pointer to the :ref:`document<fitz_api_glossary>` .

.. code-block:: javascript

  let documentPointer = libmupdf._wasm_open_document_with_buffer(buffer, magic);


|

``_wasm_open_document_with_stream``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Takes a stream of data and a magic wildcard (in most cases this is the filename) and returns a pointer to the :ref:`document<fitz_api_glossary>` .

.. code-block:: javascript

  let documentPointer = libmupdf._wasm_open_document_with_stream(stream, magic);


|

``_wasm_drop_document``
~~~~~~~~~~~~~~~~~~~~~~~~

Deallocates a :ref:`document<fitz_api_glossary>` from the passed in pointer.

.. code-block:: javascript

  libmupdf._wasm_drop_document(documentPointer);


|

``_wasm_document_title``
~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a UTF8 char format representing the :ref:`document<fitz_api_glossary>` title from the passed in pointer.


.. code-block:: javascript

  let title = libmupdf._wasm_document_title(documentPointer);


|

``_wasm_count_pages``
~~~~~~~~~~~~~~~~~~~~~~~


Returns the :ref:`document<fitz_api_glossary>` page count from the passed in pointer.


.. code-block:: javascript

  let pageCount = libmupdf._wasm_count_pages(documentPointer);


|

``_wasm_load_page``
~~~~~~~~~~~~~~~~~~~~~~


Returns a pointer to a :ref:`page<fitz_api_glossary>` from the passed in :ref:`document<fitz_api_glossary>` pointer and page number.

.. code-block:: javascript

  let page_ptr = libmupdf._wasm_load_page(documentPointer, pageNumber);




.. _fitz_api_load_outline:



|

``_wasm_load_outline``
~~~~~~~~~~~~~~~~~~~~~~~


Returns a pointer to the :ref:`outline<fitz_api_glossary>` from the passed in :ref:`document<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let outline = libmupdf._wasm_load_outline(documentPointer);

|

``_wasm_drop_page``
~~~~~~~~~~~~~~~~~~~~~

Deallocates a :ref:`page<fitz_api_glossary>` from the passed in pointer.

.. code-block:: javascript

  libmupdf._wasm_drop_page(page_ptr);


.. _fitz_wasm_bound_page:

|

``_wasm_bound_page``
~~~~~~~~~~~~~~~~~~~~~~


Takes a :ref:`page<fitz_api_glossary>` pointer and returns a :ref:`rectangle<fitz_api_glossary>` representing the :ref:`page<fitz_api_glossary>` bounds.


.. code-block:: javascript

  let rect = libmupdf._wasm_bound_page(page_ptr);


.. _fitz_wasm_new_stext_page_from_page:

|

``_wasm_new_stext_page_from_page``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Takes a :ref:`page<fitz_api_glossary>` pointer and returns a structured :ref:`text page<fitz_api_glossary>`.


.. code-block:: javascript

  let sTextPage = libmupdf._wasm_new_stext_page_from_page(page_ptr);

|

``_wasm_drop_stext_page``
~~~~~~~~~~~~~~~~~~~~~~~~~~~


Deallocates a structured :ref:`text page<fitz_api_glossary>` from the passed in pointer.

.. code-block:: javascript

  libmupdf._wasm_drop_stext_page(sTextPage);

|

``_wasm_print_stext_page_as_json``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Prints a JSON representation of the structured :ref:`text page<fitz_api_glossary>` to the output parameter at a specific scale. For details on the output parameter, see: :ref:`_wasm_new_output_with_buffer<fitz_api_new_output_with_buffer>`


.. code-block:: javascript

  libmupdf._wasm_print_stext_page_as_json(output, sTextPage, scale);


|

``_wasm_load_links``
~~~~~~~~~~~~~~~~~~~~~~

Returns the :ref:`page<fitz_api_glossary>` links (as a linked list of links) from the given pointer.


.. code-block:: javascript

  let links = libmupdf._wasm_load_links(page_ptr);


|

``_wasm_pdf_page_from_fz_page``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns a pointer to a PDF page from a standard (fitz) :ref:`page<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let pdfPage_ptr = libmupdf._wasm_pdf_page_from_fz_page(page_ptr);


|

``_wasm_next_link``
~~~~~~~~~~~~~~~~~~~~~

Returns the next :ref:`link<fitz_api_glossary>` (or ``null``) from a supplied :ref:`link<fitz_api_glossary>`.

.. code-block:: javascript

  let link = libmupdf._wasm_next_link(link);


|

``_wasm_link_rect``
~~~~~~~~~~~~~~~~~~~~


Returns the next :ref:`link<fitz_api_glossary>` rectangle from a supplied :ref:`link<fitz_api_glossary>`.


.. code-block:: javascript

  let rect = libmupdf._wasm_link_rect(link);


|

``_wasm_is_external_link``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns an ``int`` representing whether the :ref:`link<fitz_api_glossary>` is external or not.

.. code-block:: javascript

  let isExternalLink = libmupdf._wasm_is_external_link(link);


|

``_wasm_link_uri``
~~~~~~~~~~~~~~~~~~~


Returns the link `uri` from a supplied :ref:`link<fitz_api_glossary>`.

.. code-block:: javascript

  const uri_string_ptr = libmupdf._wasm_link_uri(link);

|

``_wasm_resolve_link_chapter``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the associated chapter from a :ref:`link<fitz_api_glossary>` uri string pointer against the given :ref:`document<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let chapter = libmupdf._wasm_resolve_link_chapter(documentPointer, uri_string_ptr);


|

``_wasm_resolve_link_page``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the associated :ref:`page<fitz_api_glossary>` from a :ref:`link<fitz_api_glossary>` uri string pointer against the given :ref:`document<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let page = libmupdf._wasm_resolve_link_page(documentPointer, uri_string_ptr);


|

``_wasm_page_number_from_location``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns the :ref:`page<fitz_api_glossary>` number against the given :ref:`document<fitz_api_glossary>` pointer, chapter and :ref:`page<fitz_api_glossary>` parameters.

.. code-block:: javascript

  let pageNumber = libmupdf._wasm_page_number_from_location(documentPointer, chapter, page);

|

``_wasm_outline_title``
~~~~~~~~~~~~~~~~~~~~~~~~

Returns a UTF8 char format representing the :ref:`outline<fitz_api_glossary>` title from the passed in :ref:`outline<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let title = libmupdf._wasm_outline_title(outline);

|

``_wasm_outline_page``
~~~~~~~~~~~~~~~~~~~~~~~

Returns the page number (0-based) that the outline points to from the supplied :ref:`document<fitz_api_glossary>` and :ref:`outline<fitz_api_glossary>` pointers.

.. code-block:: javascript

  let pageNumber = libmupdf._wasm_outline_page(documentPointer, outline);

|

``_wasm_outline_down``
~~~~~~~~~~~~~~~~~~~~~~~

Returns an :ref:`outline<fitz_api_glossary>` (or ``null``) from the node down from the supplied :ref:`outline<fitz_api_glossary>` parameter.

.. code-block:: javascript

  let outlineDown = libmupdf._wasm_outline_down(outline);

|

``_wasm_outline_next``
~~~~~~~~~~~~~~~~~~~~~~~~

Returns an :ref:`outline<fitz_api_glossary>` (or ``null``) from the node next to the supplied :ref:`outline<fitz_api_glossary>` parameter.

.. code-block:: javascript

  let outlineNext = libmupdf._wasm_outline_next(outline);








.. _fitz_api_pdf_annot_funcs:


``_wasm_pdf_create_annot``
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates an annotation.

.. code-block:: javascript

  let annot = libmupdf._wasm_pdf_create_annot(pdfPagePointer, pdf_annot_type);

|

``_wasm_pdf_first_annot``
~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the first :ref:`annotation<fitz_api_glossary>` (or ``null``) from the given PDF :ref:`page<fitz_api_glossary>` pointer.


.. code-block:: javascript

  let annot = libmupdf._wasm_pdf_first_annot(pdfPagePointer);

|

``_wasm_pdf_next_annot``
~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the next :ref:`annotation<fitz_api_glossary>` (or ``null``) from the supplied :ref:`annotation<fitz_api_glossary>` pointer.


.. code-block:: javascript

  let nextAnnotation = libmupdf._wasm_pdf_next_annot(annot);

|

``_wasm_pdf_bound_annot``
~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`rectangle<fitz_api_glossary>` defining the bounds of the supplied :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let rect = libmupdf._wasm_pdf_bound_annot(annot);

|

``_wasm_pdf_annot_type_string``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a UTF8 char format representing the :ref:`annotation<fitz_api_glossary>` type.


.. code-block:: javascript

  let annotType = libmupdf._wasm_pdf_annot_type_string(annot);



|

``_wasm_pdf_annot_active``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns an ``int`` representing whether the :ref:`annotation<fitz_api_glossary>` is active or not.

.. code-block:: javascript

  let isActive = libmupdf._wasm_pdf_annot_active(annot);


|

``_wasm_pdf_set_annot_active``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Sets the active status for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let isActive = libmupdf._wasm_pdf_set_annot_active(annot, active);

|

``_wasm_pdf_annot_hot``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns an ``int`` representing whether the :ref:`annotation<fitz_api_glossary>` is "hot" or not.

.. code-block:: javascript

  let isHot = libmupdf._wasm_pdf_annot_hot(annot);


|

``_wasm_pdf_set_annot_hot``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Sets the whether the :ref:`annotation<fitz_api_glossary>` is "hot" or not.

.. code-block:: javascript

   libmupdf._wasm_pdf_set_annot_hot(annot, hot);


|

``_wasm_pdf_annot_transform``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`matrix<fitz_api_glossary>` for the annotation's transform.

.. code-block:: javascript

  let matrix = libmupdf._wasm_pdf_annot_transform(annot);


|

``_wasm_pdf_annot_needs_resynthesis``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns an ``int`` representing whether the :ref:`annotation<fitz_api_glossary>` needs resynthesis.

.. code-block:: javascript

  let needsResynthesis = libmupdf._wasm_pdf_annot_needs_resynthesis(annot);


|

``_wasm_pdf_set_annot_resynthesised``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` to "resynthesised".

.. code-block:: javascript

   libmupdf._wasm_pdf_set_annot_resynthesised(annot);

|

``_wasm_pdf_dirty_annot``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` to "dirty" (i.e. modified).

.. code-block:: javascript

  libmupdf._wasm_pdf_dirty_annot(annot);

|

``_wasm_pdf_set_annot_popup``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Sets the :ref:`annotation<fitz_api_glossary>` popup from the supplied :ref:`rectangle<fitz_api_glossary>` coordinates.


.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_popup(annot, x0, y0, x1, y1);



|

``_wasm_pdf_annot_popup``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a :ref:`rectangle<fitz_api_glossary>` for the :ref:`annotation<fitz_api_glossary>` popup.

.. code-block:: javascript

  let rect = libmupdf._wasm_pdf_annot_popup(annot);


|

``_wasm_pdf_annot_flags``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the flags for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let flags = libmupdf._wasm_pdf_annot_flags(annot);


|

``_wasm_pdf_set_annot_flags``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the flags for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_flags(annot, flags);



|

``_wasm_pdf_annot_rect``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a :ref:`rectangle<fitz_api_glossary>` in terms of MuPDF's page space.


.. code-block:: javascript

  let rect = libmupdf._wasm_pdf_annot_rect(annot);


|

``_wasm_pdf_set_annot_rect``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Sets the :ref:`annotation<fitz_api_glossary>` rectangle.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_rect(annot, x0, y0, x1, y1);



|

``_wasm_pdf_annot_contents``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the text contents for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let contents = libmupdf._wasm_pdf_annot_contents(annot);

|

``_wasm_pdf_set_annot_contents``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the text contents for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_contents(annot, text_ptr);


|

``_wasm_pdf_annot_has_open``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Check to see if the :ref:`annotation<fitz_api_glossary>` has an open action.

.. code-block:: javascript

  let hasOpen = libmupdf._wasm_pdf_annot_has_open(annot);


|

``_wasm_pdf_annot_is_open``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns whether the :ref:`annotation<fitz_api_glossary>` is open or not.

.. code-block:: javascript

  let isOpen = libmupdf._wasm_pdf_annot_is_open(annot);


|

``_wasm_pdf_annot_set_is_open``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets whether the :ref:`annotation<fitz_api_glossary>` is open or not.

.. code-block:: javascript

  libmupdf._wasm_pdf_annot_set_is_open(annot);


|

``_wasm_pdf_annot_has_icon_name``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Check to see if the :ref:`annotation<fitz_api_glossary>` has an icon name.


.. code-block:: javascript

  let hasIconName = libmupdf._wasm_pdf_annot_has_icon_name(annot);


|

``_wasm_pdf_annot_icon_name``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the :ref:`annotation<fitz_api_glossary>` icon name.

.. code-block:: javascript

  let iconName = libmupdf._wasm_pdf_annot_icon_name(annot);


|

``_wasm_pdf_set_annot_icon_name``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` icon name.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_icon_name(annot, name_ptr);


|

``_wasm_pdf_annot_border``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the :ref:`annotation<fitz_api_glossary>` border width.

.. code-block:: javascript

  libmupdf._wasm_pdf_annot_border(annot);


|

``_wasm_pdf_set_annot_border``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` border width.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_border(annot, width);

|

``_wasm_pdf_annot_language``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Get the :ref:`annotation<fitz_api_glossary>` text language.


.. code-block:: javascript

  let language = libmupdf._wasm_pdf_annot_language(annot);

|

``_wasm_pdf_set_annot_language``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` text language.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_language(annot, lang_ptr);

|

``_wasm_pdf_annot_opacity``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get the :ref:`annotation<fitz_api_glossary>` opacity (float between 0-1).

.. code-block:: javascript

  let opacity = libmupdf._wasm_pdf_annot_opacity(annot);

|

``_wasm_pdf_set_annot_opacity``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Set the :ref:`annotation<fitz_api_glossary>` opacity (float between 0-1).


.. code-block:: javascript

  let opacity = libmupdf._wasm_pdf_set_annot_opacity(annot, opacity);

|

``_wasm_pdf_annot_has_line``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Check to see if the :ref:`annotation<fitz_api_glossary>` has line data.

.. code-block:: javascript

  let hasLineData = libmupdf._wasm_pdf_annot_has_line(annot);

|

``_wasm_pdf_annot_line``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns an array containing the start and end points for the line.


.. code-block:: javascript

  let line_points = libmupdf._wasm_pdf_annot_line(annot);

|

``_wasm_pdf_set_annot_line``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Creates a line with a start and end points from the supplied coordinate parameters.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_line(annot, x0, y0, x1, y1);


|

``_wasm_pdf_annot_has_vertices``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Check to see if the :ref:`annotation<fitz_api_glossary>` has vertices.


.. code-block:: javascript

  let hasVertices = libmupdf._wasm_pdf_annot_has_vertices(annot);

|

``_wasm_pdf_annot_vertex_count``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the vertex count for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let count = libmupdf._wasm_pdf_annot_vertex_count(annot);

|

``_wasm_pdf_annot_vertex``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`point<fitz_api_glossary>` for a vertex index.


.. code-block:: javascript

  let point = libmupdf._wasm_pdf_annot_vertex(annot, i)

|

``_wasm_pdf_clear_annot_vertices``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Clears the :ref:`annotation<fitz_api_glossary>` vertices.

.. code-block:: javascript

  libmupdf._wasm_pdf_clear_annot_vertices(annot);



|

``_wasm_pdf_add_annot_vertex``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Adds a vertex to the :ref:`annotation<fitz_api_glossary>` vertices stack at a given point.


.. code-block:: javascript

  libmupdf._wasm_pdf_add_annot_vertex(annot, x, y);


|

``_wasm_pdf_set_annot_vertex``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Sets a vertex at a given index and point.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_vertex(annot, i, x, y);

|

``_wasm_pdf_annot_modification_date``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the :ref:`annotation<fitz_api_glossary>` modification date in seconds since epoch.

.. code-block:: javascript

  let secondsSinceEpoch = libmupdf._wasm_pdf_annot_modification_date(annot);

|

``_wasm_pdf_annot_creation_date``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the :ref:`annotation<fitz_api_glossary>` creation date in seconds since epoch.

.. code-block:: javascript

  let secondsSinceEpoch = libmupdf._wasm_pdf_annot_creation_date(annot);

|

``_wasm_pdf_set_annot_modification_date``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` modification date in seconds since epoch.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_modification_date(annot, seconds);


|

``_wasm_pdf_set_annot_creation_date``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` creation date in seconds since epoch.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_creation_date(annot, seconds);

|

``_wasm_pdf_annot_has_author``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns an ``int`` representing whether the :ref:`annotation<fitz_api_glossary>` has an author or not.

.. code-block:: javascript

  let hasAuthor = libmupdf._wasm_pdf_annot_has_author(annot);

|

``_wasm_pdf_annot_author``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gets the :ref:`annotation<fitz_api_glossary>` author.

.. code-block:: javascript

  let author = libmupdf._wasm_pdf_annot_author(annot);

|

``_wasm_pdf_set_annot_author``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sets the :ref:`annotation<fitz_api_glossary>` author.

.. code-block:: javascript

  libmupdf._wasm_pdf_set_annot_author(annot, name_ptr);

|

``_wasm_pdf_annot_field_flags``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the field flags for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let flags = libmupdf._wasm_pdf_annot_field_flags(annot);

|

``_wasm_pdf_annot_field_value``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the field value for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let fieldValue = libmupdf._wasm_pdf_annot_field_value(annot);


|

``_wasm_pdf_annot_field_label``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns the field label for the :ref:`annotation<fitz_api_glossary>`.

.. code-block:: javascript

  let fieldLabel = libmupdf._wasm_pdf_annot_field_label(annot);



.. note: ends annotatation funcs



|

``_wasm_search_page``
~~~~~~~~~~~~~~~~~~~~~~~

Returns the resulting hit count of a search needle against a given :ref:`page<fitz_api_glossary>` pointer. Able to limit the max hit count by passing a parameter for ``maxHitCount``.

.. code-block:: javascript

  let hitCount = libmupdf._wasm_search_page(page_ptr, needle_ptr, hits_ptr, maxHitCount);

|

``_wasm_size_of_quad``
~~~~~~~~~~~~~~~~~~~~~~~

Returns the ``size`` of the ``fz_quad`` global.

.. code-block:: javascript

  let size = libmupdf._wasm_size_of_quad();

|

``_wasm_rect_from_quad``
~~~~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`rectangle<fitz_api_glossary>` from a supplied :ref:`quad<fitz_api_glossary>`.

.. code-block:: javascript

  let rect = libmupdf._wasm_rect_from_quad(quad);



.. _fitz_wasm_device_color_space:

|

``_wasm_device_gray``
~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`color space<fitz_api_glossary>` for grayscale.

.. code-block:: javascript

  let color_space = libmupdf._wasm_device_gray();

|

``_wasm_device_rgb``
~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`color space<fitz_api_glossary>` for RGB.

.. code-block:: javascript

  let color_space = libmupdf._wasm_device_rgb();

|

``_wasm_device_bgr``
~~~~~~~~~~~~~~~~~~~~~

Returns a reverse :ref:`color space<fitz_api_glossary>` for RGB.

BGR is used for faster speed. Many graphics APIs (like Windows GDI) store the RGB colors in the opposite direction (so blue is the first byte, not the last). By enabling a BGR color space, an application doesn't need to swap all the color components around to display it.


.. code-block:: javascript

  let color_space = libmupdf._wasm_device_bgr();

|

``_wasm_device_cmyk``
~~~~~~~~~~~~~~~~~~~~~~~


Returns a :ref:`color space<fitz_api_glossary>` for CMYK.

.. code-block:: javascript

  let color_space = libmupdf._wasm_device_cmyk();

|

``_wasm_drop_colorspace``
~~~~~~~~~~~~~~~~~~~~~~~~~~

Deallocates a :ref:`color space<fitz_api_glossary>` from the passed in :ref:`color space<fitz_api_glossary>` pointer.

.. code-block:: javascript

  libmupdf._wasm_drop_colorspace(color_space);


.. _fitz_wasm_new_pixmap_from_page:

|

``_wasm_new_pixmap_from_page``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a :ref:`pixmap<fitz_api_glossary>` from supplied :ref:`page<fitz_api_glossary>`, :ref:`matrix<fitz_api_glossary>`, :ref:`color space<fitz_api_glossary>` and alpha values.


.. code-block:: javascript

  let pixmap = libmupdf._wasm_new_pixmap_from_page(page, a, b, c, d, e, f, color_space, alpha);

|

``_wasm_drop_pixmap``
~~~~~~~~~~~~~~~~~~~~~~~

Deallocates the :ref:`pixmap<fitz_api_glossary>` from the passed in :ref:`pixmap<fitz_api_glossary>` pointer.


.. code-block:: javascript

  libmupdf._wasm_drop_pixmap(pixmap);


.. _fitz_wasm_pixmap_bbox:

|

``_wasm_pixmap_bbox``
~~~~~~~~~~~~~~~~~~~~~~~

Returns an :ref:`IRect<fitz_api_glossary>` pointer from the supplied :ref:`pixmap<fitz_api_glossary>`.

.. code-block:: javascript

  let int_rect_ptr = libmupdf._wasm_pixmap_bbox(pixmap);

|

``_wasm_pixmap_stride``
~~~~~~~~~~~~~~~~~~~~~~~~~


Returns the length of one row of image data from the supplied :ref:`pixmap<fitz_api_glossary>`.

.. code-block:: javascript

  let stride = libmupdf._wasm_pixmap_stride(pixmap);

|

``_wasm_pixmap_samples``
~~~~~~~~~~~~~~~~~~~~~~~~~


Returns the color and (if Pixmap.alpha is true) transparency values for all pixels from a given :ref:`pixmap<fitz_api_glossary>`. See: https://pymupdf.readthedocs.io/en/latest/pixmap.html#Pixmap.samples

.. code-block:: javascript

  let samples = libmupdf._wasm_pixmap_samples(pixmap);



.. _fitz_api_buffer_funcs:

|

``_wasm_new_buffer``
~~~~~~~~~~~~~~~~~~~~~~


Returns a :ref:`buffer<fitz_api_glossary>` from a given capacity.

.. code-block:: javascript

  let buffer = libmupdf._wasm_new_buffer(capacity);

|

``_wasm_new_buffer_from_data``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a :ref:`buffer<fitz_api_glossary>` from a given data & size.

.. code-block:: javascript

  let buffer = libmupdf._wasm_new_buffer_from_data(data, size)

|

``_wasm_new_buffer_from_pixmap_as_png``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Returns a :ref:`buffer<fitz_api_glossary>` from a given :ref:`pixmap<fitz_api_glossary>`.


.. code-block:: javascript

  let buffer = libmupdf._wasm_new_buffer_from_pixmap_as_png(pixmap);

|

``_wasm_drop_buffer``
~~~~~~~~~~~~~~~~~~~~~~~

Deallocates a :ref:`buffer<fitz_api_glossary>` from the passed in pointer.

.. code-block:: javascript

  libmupdf._wasm_drop_buffer(buffer);

|

``_wasm_buffer_data``
~~~~~~~~~~~~~~~~~~~~~~~

Returns the data from a given :ref:`buffer<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let data = libmupdf._wasm_buffer_data(buffer);

|

``_wasm_buffer_size``
~~~~~~~~~~~~~~~~~~~~~~~

Returns the size from a given :ref:`buffer<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let size = libmupdf._wasm_buffer_size(buffer);

|

``_wasm_buffer_capacity``
~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns the capacity from a given :ref:`buffer<fitz_api_glossary>` pointer.

.. code-block:: javascript

  let capacity = libmupdf._wasm_buffer_capacity(buffer);

|

``_wasm_resize_buffer``
~~~~~~~~~~~~~~~~~~~~~~~~


Resizes a :ref:`buffer<fitz_api_glossary>` from the supplied :ref:`buffer<fitz_api_glossary>` pointer and capacity.

.. code-block:: javascript

  libmupdf._wasm_resize_buffer(buffer, capacity);

|

``_wasm_grow_buffer``
~~~~~~~~~~~~~~~~~~~~~~


Grows the :ref:`buffer<fitz_api_glossary>` from the supplied :ref:`buffer<fitz_api_glossary>` pointer.

.. code-block:: javascript

  libmupdf._wasm_grow_buffer(buffer);

|

``_wasm_trim_buffer``
~~~~~~~~~~~~~~~~~~~~~~

Trims the :ref:`buffer<fitz_api_glossary>` from the supplied :ref:`buffer<fitz_api_glossary>` pointer.

.. code-block:: javascript

  libmupdf._wasm_trim_buffer(buffer);

|

``_wasm_clear_buffer``
~~~~~~~~~~~~~~~~~~~~~~~

Clears the :ref:`buffer<fitz_api_glossary>` from the supplied :ref:`buffer<fitz_api_glossary>` pointer.

.. code-block:: javascript

  libmupdf._wasm_clear_buffer(buffer);

|

``_wasm_buffers_eq``
~~~~~~~~~~~~~~~~~~~~~~


Tests for equality between two supplied :ref:`buffers<fitz_api_glossary>`.

.. code-block:: javascript

  let isEqual = libmupdf._wasm_buffers_eq(buffer_a, buffer_b);




.. _fitz_api_new_output_with_buffer:


|

``_wasm_new_output_with_buffer``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a new output from a supplied :ref:`buffer<fitz_api_glossary>`.

.. code-block:: javascript

  let output = _wasm_new_output_with_buffer(buffer);

|

``_wasm_close_output``
~~~~~~~~~~~~~~~~~~~~~~~~

Closes the output from a supplied :ref:`buffer<fitz_api_glossary>`.


.. code-block:: javascript

  libmupdf._wasm_close_output(output);

|

``_wasm_drop_output``
~~~~~~~~~~~~~~~~~~~~~~

Deallocates the output from the passed in pointer.

.. code-block:: javascript

  libmupdf._wasm_drop_output(output);


.. _fitz_api_stream_funcs:

|

``_wasm_open_stream_from_url``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a stream from the supplied url, content length, block size and pre-fetch parameters.

.. code-block:: javascript

  let stream = libmupdf._wasm_open_stream_from_url(url, content_length, block_size, prefetch);

|

``_wasm_new_stream_from_buffer``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a new stream from a supplied :ref:`buffer<fitz_api_glossary>`.


.. code-block:: javascript

  let stream = libmupdf._wasm_new_stream_from_buffer(buffer);

|

``_wasm_new_stream_from_data``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Returns a new stream from supplied data and size.


.. code-block:: javascript

  let stream = libmupdf._wasm_new_stream_from_data(data, size);

|

``_wasm_drop_stream``
~~~~~~~~~~~~~~~~~~~~~


Deallocates the stream from the passed in pointer.


.. code-block:: javascript

  libmupdf._wasm_drop_stream(stream);

|

``_wasm_read_all``
~~~~~~~~~~~~~~~~~~~

Returns a :ref:`buffer<fitz_api_glossary>` from a supplied stream and capacity.

.. code-block:: javascript

  let buffer = libmupdf._wasm_read_all(stream, capacity);

|

``_wasm_on_data_fetched``
~~~~~~~~~~~~~~~~~~~~~~~~~~


Should be called when fetching data.

.. code-block:: javascript

  libmupdf._wasm_on_data_fetched(state, block, data, size);





.. Page links





.. _PDF Page: https://ghostscript.com/~julian/mupdf/include/html/structpdf__page.html
.. _ArrayBuffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
.. _Uint8Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
.. _Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

