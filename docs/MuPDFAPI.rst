.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title::The MuPDF API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm





The MuPDF API
============================

This API supplies an API to the dedicated ``mupdf-view-worker``, as such the :ref:`View API<view_api>` is built on top of this API.

A set of classes & functions are defined within a ``mupdf`` namespace object as follows:


.. code-block:: javascript

  const mupdf = {
    MupdfError,
    MupdfTryLaterError,
    Rect,
    Matrix,
    Document,
    Page,
    Links,
    Link,
    Location,
    Outline,
    PdfPage,
    AnnotationList,
    Annotation,
    ColorSpace,
    Pixmap,
    Buffer,
    Stream,
    Output,
    STextPage,
    onFetchCompleted: () => {},
  };


Classes
----------------------

.. _mupdf_api_mupdfError_class:


``MupdfError``
~~~~~~~~~~~~~~~~~~~~~~~

A wrapper class for the `JavaScript Error <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error>`_ object.

constructor
""""""""""""

Constructor with error message string.

.. code-block:: javascript

    /**
    * @param {String} message
    */
    constructor(message)


.. _mupdf_api_mupdfTryLaterError_class:

|

``MupdfTryLaterError``
~~~~~~~~~~~~~~~~~~~~~~~

A wrapper class for MuPDFError_ used to flag error reporting in relation to "busy" asynchronous operations.


constructor
"""""""""""

Constructor with error message string.

.. code-block:: javascript

    /**
    * @param {String} message
    */
    constructor(message)



.. _mupdf_api_point_class:

|

``Point``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the `Fitz Point`_ equivalent.


constructor
"""""""""""

Constructor with coordinate float values.

.. code-block:: javascript

    /**
    * @param {Number} x
    * @param {Number} y
    */
    constructor(x, y)


fromPtr
"""""""""""""""""""""""

Returns a :ref:`Point<mupdf_api_point_class>` from a `Fitz Point`_ pointer object.

.. code-block:: javascript

    /**
    * @param {Object} ptr
    * @return {Point}
    */
    static fromPtr(ptr)



.. _mupdf_api_rect_class:

|

``Rect``
~~~~~~~~~~~~~~~~~~~~~~~


A class representing the `Fitz Rect`_ equivalent.


constructor
"""""""""""

Constructor with coordinate float values.

.. code-block:: javascript

    /**
    * @param {Number} x0
    * @param {Number} y0
    * @param {Number} x1
    * @param {Number} y1
    */
    constructor(x0, y0, x1, y1)


fromFloatRectPtr
"""""""""""""""""""""""

Returns a :ref:`Rect<mupdf_api_rect_class>` from a `Fitz Rect`_ pointer object.

.. code-block:: javascript

    /**
    * @param {Object} ptr
    * @return {Rect}
    */
    static fromFloatRectPtr(ptr)


fromIntRectPtr
"""""""""""""""""""""""


Returns a :ref:`Rect<mupdf_api_rect_class>` from a `Fitz IRect`_ pointer object


.. code-block:: javascript

    /**
    * @param {Object} ptr
    * @return {Rect}
    */
    static fromIntRectPtr(ptr)


width
"""""""""""""""""""""""

Returns the width of the :ref:`Rect<mupdf_api_rect_class>`.

.. code-block:: javascript

    /**
    * @return {Number}
    */
    width()


height
"""""""""""""""""""""""

Returns the height of the :ref:`Rect<mupdf_api_rect_class>`.

.. code-block:: javascript

    /**
    * @return {Number}
    */
    height()



translated
"""""""""""""""""""""""

Translates the :ref:`Rect<mupdf_api_rect_class>` with the x & y offset float parameters.

.. code-block:: javascript

    /**
    * @param {Number} xoff
    * @param {Number} yoff
    */
    translated(xoff, yoff)


.. note::

  ``Fitz Rect`` & ``Fitz IRect`` pointers are objects corresponding to :ref:`Rect<fitz_api>`& :ref:`IRect<fitz_api>` objects returned from :ref:`The Fitz API<fitz_api>` , e.g. see: :ref:`_wasm_bound_page<fitz_wasm_bound_page>` & :ref:`_wasm_pixmap_bbox<fitz_wasm_pixmap_bbox>`.


.. _mupdf_api_matrix_class:

|

``Matrix``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the `Fitz Matrix`_ equivalent.


constructor
"""""""""""

Constructor with coordinate float values.

.. code-block:: javascript

    /**
    * @param {Number} a
    * @param {Number} b
    * @param {Number} c
    * @param {Number} d
    * @param {Number} e
    * @param {Number} f
    */
    constructor(a, b, c, d, e, f)



fromPtr
"""""""""""""""""""""""

Returns a :ref:`Matrix<mupdf_api_matrix_class>` from a `Fitz Matrix`_ pointer object.

.. code-block:: javascript

    /**
    * @param {Object} ptr
    * @return {Matrix}
    */
    static fromPtr(ptr)


scale
"""""""""""""""""""""""

Returns a :ref:`Matrix<mupdf_api_matrix_class>` from x & y scale float values.

.. code-block:: javascript

    /**
    * @param {Number} scale_x
    * @param {Number} scale_y
    * @return {Matrix}
    */
    static scale(scale_x, scale_y)


transformRect
"""""""""""""""""""""""

Returns a new :ref:`Rect<mupdf_api_rect_class>` from the :ref:`Matrix<mupdf_api_matrix_class>` with the transformation applied from the ``rect`` parameter.

.. code-block:: javascript

    /**
    * @param {Rect} rect
    * @return {Rect}
    */
    transformRect(rect)


.. note::

  ``Fitz Matrix`` pointers are objects corresponding to the :ref:`Matrix<fitz_api>`object returned from :ref:`The Fitz API<fitz_api>` , e.g. see: :ref:`_wasm_scale<fitz_api_wasm_scale>`.




.. _mupdf_api_document_class:

|

``Document``
~~~~~~~~~~~~~~~~~~~~~~~


A class representing the `Fitz Document`_ equivalent.


constructor
"""""""""""

Constructor with pointer to document data and an optional buffer.

.. code-block:: javascript

    /**
    * @param {Object} pointer
    * @param {Object} buffer
    */
    constructor(pointer, buffer = null)




free
"""""""""""""""""""""""

Deallocates the instance

.. code-block:: javascript

    free()


openFromJsBuffer
"""""""""""""""""""""""

Opens a document from JavaScript buffer data, the "magic" parameter should be a string and can be used for filename, url or whatever else may be required.

This method converts JavaScript buffer data to `Fitz Buffer`_ data and then calls `openFromBuffer`_.

.. code-block:: javascript

    /**
    * @param {Object} buffer
    * @param {String} magic
    */
    static openFromJsBuffer(buffer, magic)


openFromBuffer
"""""""""""""""""""""""

Opens a document from `Fitz Buffer`_ data, the "magic" parameter should be a string and can be used for filename, url or whatever else may be required.

.. code-block:: javascript

    /**
    * @param {Object} buffer
    * @param {String} magic
    */
    static openFromBuffer(buffer, magic)


countPages
"""""""""""""""""""""""

Returns the page count in the :ref:`Document<mupdf_api_document_class>` instance as an integer.

.. code-block:: javascript

    /**
    * @return {Number}
    */
    countPages()


loadPage
"""""""""""""""""""""""

Returns a page from the :ref:`Document<mupdf_api_document_class>` instance as a :ref:`Page<mupdf_api_page_class>` or `PdfPage`_.

Note: The ``pageNumber`` parameter is zero-based.

.. code-block:: javascript

    /**
    * @param {Number} pageNumber
    * @return {Page | PdfPage}
    */
    loadPage(pageNumber)



title
"""""""""""""""""""""""

Returns the document title from the :ref:`Document<mupdf_api_document_class>` instance as a string.

.. code-block:: javascript

    /**
    * @return {String}
    */
    title()


loadOutline
"""""""""""""""""""""""

Returns the document outline (or ``null``) from the :ref:`Document<mupdf_api_document_class>` instance as an :ref:`Outline<mupdf_api_outline_class>`.

.. code-block:: javascript

    /**
    * @return {Outline | null}
    */
    loadOutline()




.. _mupdf_api_page_class:


|

``Page``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the core of the `Fitz Page`_ equivalent.


constructor
"""""""""""


Constructor with pointer to page data.


.. code-block:: javascript

    /**
    * @param {Object} pointer
    */
    constructor(pointer)


bounds
"""""""""""""""""""""""


Returns a :ref:`Rect<mupdf_api_rect_class>` which represents the bounds of the page.


.. code-block:: javascript

    /**
    * @return {Rect}
    */
    bounds()


width
"""""""""""""""""""""""

Returns the width of the page.

.. code-block:: javascript

    /**
    * @return {Number}
    */
    width()


height
"""""""""""""""""""""""

Returns the height of the page.

.. code-block:: javascript

    /**
    * @return {Number}
    */
    height()


toPixmap
"""""""""""""""""""""""

Returns a new JavaScript :ref:`Pixmap<mupdf_api_pixmap_class>` instance from the :ref:`Page<mupdf_api_page_class>`.

.. code-block:: javascript

    /**
    * @param {Matrix} transformMatrix
    * @param {ColorSpace} colorspace
    * @param {Boolean} alpha
    * @return {Pixmap}
    */
    toPixmap(transformMatrix, colorspace, alpha = false)



toSTextPage
"""""""""""""""""""""""

Returns a new :ref:`Structured Text Page<mupdf_api_sTextPage_class>` instance from the :ref:`Page<mupdf_api_page_class>`.

.. code-block:: javascript

  /**
  * @return {STextPage}
  */
  toSTextPage()


loadLinks
"""""""""""""""""""""""


Returns a new :ref:`Links<mupdf_api_links_class>` instance from the :ref:`Page<mupdf_api_page_class>`.

.. code-block:: javascript

  /**
  * @return {Links}
  */
  loadLinks()


search
"""""""""""""""""""""""

Returns an array of :ref:`Rect<mupdf_api_rect_class>` objects or ``null`` corresponding to search results for the :ref:`Page<mupdf_api_page_class>`.

.. code-block:: javascript

  /**
  * @param {String} needle
  * @return {[Rect]}
  */
  search(needle)



.. _mupdf_api_link_class:

|

``Link``
~~~~~~~~~~~~~~~~~~~~~~~


A class representing the core of the `Fitz Link`_ equivalent.


constructor
"""""""""""


Constructor with pointer to link data.


.. code-block:: javascript

    /**
    * @param {Object} pointer
    */
    constructor(pointer)



rect
"""""""""""""""""""""""

Returns a :ref:`Rect<mupdf_api_rect_class>` for the :ref:`Link<mupdf_api_link_class>` bounds.

.. code-block:: javascript

    /**
    * @return {Rect}
    */
    rect()



isExternalLink
"""""""""""""""""""""""

Returns a ``true`` if the link is external to the :ref:`Document<mupdf_api_document_class>`.

.. code-block:: javascript

    /**
    * @return {Boolean}
    */
    isExternalLink()



uri
"""""""""""""""""""""""

Returns a string value for the link uri.

.. code-block:: javascript

    /**
    * @return {String}
    */
    uri()



resolve
"""""""""""""""""""""""

Returns a :ref:`Location<mupdf_api_document_class>` object against the :ref:`Document<mupdf_api_document_class>` parameter.

.. code-block:: javascript

    /**
    * @param {Object} doc
    * @return {Location}
    */
    resolve(doc)



delete
"""""""""""""""""""""""

Deletes the :ref:`Link<mupdf_api_link_class>` instance.

.. code-block:: javascript

    delete()


.. _mupdf_api_links_class:


|

``Links``
~~~~~~~~~~~~~~~~~~~~~~~


A class which holds all the generated :ref:`Link<mupdf_api_link_class>` instances from any `loadLinks`_ results.



constructor
"""""""""""


Constructor with an array of :ref:`Link<mupdf_api_link_class>` instances.


.. code-block:: javascript

    /**
    * @param {[Link]} links
    */
    constructor(links)



free
"""""""""""""""""""""""

Deallocates the instance.

.. code-block:: javascript

  free()



.. _mupdf_api_location_class:


|

``Location``
~~~~~~~~~~~~~~~~~~~~~~~


A class used to store location values for :ref:`Link<mupdf_api_link_class>` instances.


constructor
""""""""""""


Constructor with chapter number and :ref:`Page<mupdf_api_page_class>` instance.



.. code-block:: javascript

  /**
  * @param {Number} chapter
  * @param {Page} page
  */
  constructor(chapter, page)




pageNumber
"""""""""""""""""""""""

Returns the page number for the :ref:`Location<mupdf_api_link_class>` instance against the supplied :ref:`Document<mupdf_api_document_class>` parameter.

.. code-block:: javascript

  /**
  * @param {Document} doc
  * @return {Number}
  */
  pageNumber(doc)



.. _mupdf_api_outline_class:

|

``Outline``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the core of the `Fitz Outline`_ equivalent.

An :ref:`Outline<mupdf_api_outline_class>` is part of a linked list of :ref:`Outline<mupdf_api_outline_class>` objects.


constructor
""""""""""""


Constructor with a `Fitz Outline`_ pointer object.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)



.. note::

  ``Fitz Outline`` pointers are objects corresponding to the :ref:`Outline<fitz_api>` object returned from :ref:`The Fitz API<fitz_api>`.



pageNumber
"""""""""""""""""""""""

Returns the page number for the :ref:`Outline<mupdf_api_outline_class>`.


.. code-block:: javascript

  /**
  * @param {Document} doc
  * @return {Number}
  */
  pageNumber(doc)


title
"""""""""""""""""""""""

Returns the title for the :ref:`Outline<mupdf_api_outline_class>`.

.. code-block:: javascript

  /**
  * @return {String}
  */
  title()


down
"""""""""""""""""""""""


The next :ref:`Outline<mupdf_api_outline_class>` object on the next level down. Returns ``null`` if there is none.


.. code-block:: javascript

  /**
  * @return {Outline | null}
  */
  down()



next
"""""""""""""""""""""""


The next :ref:`Outline<mupdf_api_outline_class>` object at the same level. Returns ``null`` if there is none.


.. code-block:: javascript

  /**
  * @return {Outline | null}
  */
  next()





.. _mupdf_api_pdfPage_class:

|

``PdfPage``
~~~~~~~~~~~~~~~~~~~~~~~

Extends the JavaScript :ref:`Page<mupdf_api_page_class>` class with PDF specific functionality.


constructor
"""""""""""


Constructor with pointer to both page data and PDF page data.


.. code-block:: javascript

  /**
  * @param {Object} pagePointer
  * @param {Object} pdfPagePointer
  */
  constructor(pagePointer, pdfPagePointer)



annotations
"""""""""""""""""""""""

Returns a :ref:`list of annotations<mupdf_api_annotationList_class>` for the :ref:`PdfPage<mupdf_api_pdfPage_class>` instance.

.. code-block:: javascript

  /**
  * @return {AnnotationList}
  */
  annotations()



createLink
"""""""""""""""""""""""

Creates a :ref:`Link<mupdf_api_link_class>` at a defined :ref:`Rect<mupdf_api_link_class>` on the :ref:`PdfPage<mupdf_api_pdfPage_class>` instance.

.. code-block:: javascript

  /**
  * @param {Rect} bbox
  * @param {String} uri
  * @return {Link}
  */
  createLink(bbox, uri)






.. _mupdf_api_annotation_class:

|

``Annotation``
~~~~~~~~~~~~~~~~~~~~~~~

.. Include a separate file here as the Annotation class is so big.


.. include:: mupdf_api_annotation_class.rst


.. _mupdf_api_annotationList_class:

|

``AnnotationList``
~~~~~~~~~~~~~~~~~~~~~~~

A class used to store a list of annotations.

constructor
""""""""""""

Constructor with an array of :ref:`Annotation<mupdf_api_annotation_class>` objects.

.. code-block:: javascript

  /**
  * @param {[Annotation]} annotations
  */
  constructor(annotations)



free
"""""""""""""""""""""""

Deallocates the :ref:`AnnotationList<mupdf_api_annotationList_class>` instance.

.. code-block:: javascript

  free()




.. _mupdf_api_colorSpace_class:

|

``ColorSpace``
~~~~~~~~~~~~~~~~~~~~~~~




constructor
""""""""""""


Constructor with a `Fitz ColorSpace`_ pointer sourced from :ref:`WASM color space functions<fitz_wasm_device_color_space>`.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)


.. _mupdf_api_pixmap_class:

|

``Pixmap``
~~~~~~~~~~~~~~~~~~~~~~~

Pixmaps (“pixel maps”) are objects representing plane rectangular sets of pixels. Each pixel is described by a number of bytes defining its color, plus an optional alpha byte defining its transparency.


constructor
""""""""""""


Constructor with `Fitz Pixmap`_ pointer object, e.g. sourced from :ref:`wasm_new_pixmap_from_page<fitz_wasm_new_pixmap_from_page>`.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)



width
"""""""""""""""""""""""

Returns the width of the :ref:`Pixmap<mupdf_api_pixmap_class>` in pixels.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  width()


height
"""""""""""""""""""""""

Returns the height of the :ref:`Pixmap<mupdf_api_pixmap_class>` in pixels.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  height()


samples
"""""""""""""""""""""""

Returns the bytes copy of the pixel area for all pixels of the image as an ArrayBuffer_.

.. code-block:: javascript

  /**
  * @return {ArrayBuffer}
  */
  samples()



toPNG
"""""""""""""""""""""""

Returns the PNG representation of the image as an ArrayBuffer_.

.. code-block:: javascript

  /**
  * @return {ArrayBuffer}
  */
  toPNG()


.. _mupdf_api_buffer_class:

|

``Buffer``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the `Fitz Buffer`_ equivalent.

A buffer is a wrapper around a dynamically allocated array of bytes.

Buffers have a capacity (the number of bytes storage immediately available) and a current size.


constructor
"""""""""""


Constructor with `Fitz Buffer`_ pointer object, e.g. sourced from :ref:`_wasm_new_buffer<fitz_api_buffer_funcs>`.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)


empty
"""""""""""""""""""""""

Creates an empty :ref:`Buffer<mupdf_api_buffer_class>` with an optional capacity.

.. code-block:: javascript

  /**
  * @param {Number} capacity
  * @return {Buffer}
  */
  static empty(capacity = 0)


fromJsBuffer
"""""""""""""""""""""""

Creates a :ref:`Buffer<mupdf_api_buffer_class>` from JavaScript buffer data.

.. code-block:: javascript

  /**
  * @param {Object} buffer
  * @return {Buffer}
  */
  static fromJsBuffer(buffer)


fromJsString
"""""""""""""""""""""""

Creates a :ref:`Buffer<mupdf_api_buffer_class>` from JavaScript string data.

.. code-block:: javascript

  /**
  * @param {String} string
  * @return {Buffer}
  */
  static fromJsString(string)


size
"""""""""""""""""""""""

Returns the size of the :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  size()


capacity
"""""""""""""""""""""""

Returns the size of the :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  /**
  *
  */
  capacity()


resize
"""""""""""""""""""""""

Resizes the :ref:`Buffer<mupdf_api_buffer_class>` to the defined capacity.

.. code-block:: javascript

  /**
  * @param {Number} capacity
  */
  resize(capacity)


grow
"""""""""""""""""""""""

Make some space within the :ref:`Buffer<mupdf_api_buffer_class>` (i.e. ensure that capacity > size).

.. code-block:: javascript

  grow()


trim
"""""""""""""""""""""""

Trim wasted capacity from the :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  trim()


clear
"""""""""""""""""""""""

Empties the :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  clear()


toUint8Array
"""""""""""""""""""""""

Returns an `Uint8Array`_ of the :ref:`Buffer<mupdf_api_buffer_class>` data.

.. code-block:: javascript

  /**
  * @return {Uint8Array}
  */
  toUint8Array()


toJsString
"""""""""""""""""""""""

Returns a JavaScript string of the :ref:`Buffer<mupdf_api_buffer_class>` data.

.. code-block:: javascript

  /**
  * @return {String}
  */
  toJsString()


sameContentAs
"""""""""""""""""""""""

Checks for equivalence between the :ref:`Buffer<mupdf_api_buffer_class>` and another :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  /**
  * @param {Buffer}
  */
  sameContentAs(otherBuffer)





.. _mupdf_api_stream_class:


|


``Stream``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the `Fitz Stream`_ equivalent.


constructor
""""""""""""


Constructor with `Fitz Stream`_ pointer object, e.g. sourced from :ref:`_wasm_open_stream_from_url<_fitz_api_stream_funcs>`.

The optional internal buffer is utilized by the `fromBuffer`_ method only.

.. code-block:: javascript

  /**
  * @param {Object} pointer
  * @param {Buffer} internalBuffer
  */
  constructor(pointer, internalBuffer = null)



fromUrl
"""""""""""""""""""""""

Returns a :ref:`Stream<mupdf_api_stream_class>` from a supplied URL.

.. code-block:: javascript

  /**
  * @param {String} url
  * @param {Number} contentLength
  * @param {Number} block_size
  * @param {Number} prefetch
  * @return {Stream}
  */
  static fromUrl(url, contentLength, block_size, prefetch)






fromBuffer
"""""""""""""""""""""""

Returns a :ref:`Stream<mupdf_api_stream_class>` from a supplied :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  /**
  * @param {Buffer} buffer
  * @return {Stream}
  */
  static fromBuffer(buffer)





fromJsBuffer
"""""""""""""""""""""""

Returns a :ref:`Stream<mupdf_api_stream_class>` from a supplied JavaScript buffer.

.. code-block:: javascript

  /**
  * @param {Object} buffer
  * @return {Stream}
  */
  static fromJsBuffer(buffer)






fromJsString
"""""""""""""""""""""""

Returns a :ref:`Stream<mupdf_api_stream_class>` from a supplied JavaScript string.

.. code-block:: javascript

  /**
  * @param {String} string
  * @return {Stream}
  */
  static fromJsString(string)






readAll
"""""""""""""""""""""""

Returns a :ref:`Buffer<mupdf_api_buffer_class>` from the :ref:`Stream<mupdf_api_stream_class>`.

Note: the ``suggestedCapacity`` is useful if you know the size of your required :ref:`Buffer<mupdf_api_buffer_class>`, if not the :ref:`Buffer<mupdf_api_buffer_class>` will `grow`_ as required.

.. code-block:: javascript

  /**
  * @param {Number} suggestedCapacity
  * @return {Buffer}
  */
  readAll(suggestedCapacity = 0)







.. _mupdf_api_output_class:

|


``Output``
~~~~~~~~~~~~~~~~~~~~~~~

A class representing the `Fitz Output`_ equivalent. Outputs can be created to write to files or buffers.


constructor
""""""""""""


Constructor with `Fitz Output`_ pointer object, e.g. sourced from :ref:`_wasm_new_output_with_buffer<fitz_api_new_output_with_buffer>`.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)



withBuffer
"""""""""""""""""""""""

Returns an :ref:`Output<mupdf_api_output_class>` from a supplied :ref:`Buffer<mupdf_api_buffer_class>`.

.. code-block:: javascript

  /**
  * @param {Buffer} buffer
  * @return {Output}
  */
  static withBuffer(buffer)



close
"""""""""""""""""""""""

Closes an :ref:`Output<mupdf_api_output_class>`.

.. code-block:: javascript

  close()





.. _mupdf_api_sTextPage_class:

|

``STextPage``
~~~~~~~~~~~~~~~~~~~~~~~


A class representing the `Fitz TextPage`_ equivalent.



constructor
""""""""""""


Constructor with `Fitz TextPage`_ pointer object, e.g. sourced from :ref:`_wasm_new_stext_page_from_page<fitz_wasm_new_stext_page_from_page>`.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)


printAsJson
"""""""""""""""""""""""

Returns JSON data from the :ref:`STextPage<mupdf_api_sTextPage_class>` to the ``output`` parameter with an applied scale. Scale is necessary because the function returns a JSON of text objects with their positions.

.. code-block:: javascript

  /**
  * @param {Output} output
  * @param {Number} scale
  */
  printAsJson(output, scale)




Methods
------------------


``onFetchCompleted``


A user defined method which can be used from your when a fetch has completed as follows:


.. code-block:: javascript

  /**
  * @param {Number} id
  */
  mupdf.onFetchCompleted = function (id) {

  }


.. external links:

.. _Fitz Document:
.. _Fitz Buffer:
.. _Fitz Output:
.. _Fitz Stream:
.. _Fitz Page:
.. _Fitz Outline:
.. _Fitz Link:
.. _Fitz Matrix:
.. _Fitz Pixmap:
.. _Fitz Point:
.. _Fitz Rect:
.. _Fitz IRect:
.. _Fitz Quad:
.. _Fitz ColorSpace:
.. _Fitz Annot:
.. _Fitz TextPage: #fitz-api

.. _PDF Page: https://ghostscript.com/~julian/mupdf/include/html/structpdf__page.html
.. _ArrayBuffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
.. _Uint8Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array


