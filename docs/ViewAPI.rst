.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title::The View API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm


The View API
==============

The View API provides methods for handling a view on a document handled by MuPDF in a browser. If you want to write a document viewer on the web, this is probably the interface you want to use as it will vastly simplify your integration.

This API calls methods via a JavaScript object which uses a predefined web worker to process the actions. The MuPDF document object is contained within the worker and accessor methods are provided via the :ref:`mupdfView<wasm_the_mupdf_view>` object.




.. _wasm_view_api_openDocumentFromBuffer:


``openDocumentFromBuffer``
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. method:: openDocumentFromBuffer(buffer, title)

  Opens a document from an `array buffer`_ of data with a given file name.

  :arg buffer: ``ArrayBuffer``.
  :arg title: ``String``.


  **Example**


  .. code-block:: javascript

    mupdfView.openDocumentFromBuffer(await file.arrayBuffer(), file.name);





``openDocumentFromUrl``
~~~~~~~~~~~~~~~~~~~~~~~~~~


// TODO  - confirm understanding of "progressive" here...

// convince people to rename "magic" ...


.. method:: openDocumentFromUrl(url, contentLength, progressive, prefetch, magic)

  Opens a document from a given url.

  :arg url: ``String``.
  :arg contentLength: ``Number``.
  :arg progressive: ``Number`` the progressive load buffer size.
  :arg prefetch: ``Number`` A boolean representation, should be ``1`` or ``0``.
  :arg magic: ``String`` the "magic" parameter should be a string and can be used for filename, extension, content type or url. Essentially it is required to figure out filetype.

  **Example**

  .. code-block:: javascript

    mupdfView.openDocumentFromUrl("samples/pdfref13.pdf", 4868238, 512, 0, "application/pdf");



``freeDocument``
~~~~~~~~~~~~~~~~~~~~~~~~~~


.. method:: freeDocument()

  Frees any instance of a :title:`MuPDF` :ref:`Document<mupdf_api_document_class>` from memory.


.. note::

  Your Javascript should handle anything else in its logic or UI visuals to remove the rendered document from the DOM.

  **Example**

  .. code-block:: javascript

    mupdfView.freeDocument();


``documentTitle``
~~~~~~~~~~~~~~~~~~~~~~~~~~


.. method:: documentTitle()

  Returns the document's title.

  :return: ``String``.

  **Example**

  .. code-block:: javascript

    var title = mupdfView.documentTitle();


``documentOutline``
~~~~~~~~~~~~~~~~~~~~~~~~~~


.. method:: documentOutline()

  Returns a Promise_.

  The object delivered by the Promise_ is the document outline as a multi-dimensional array of bookmark objects. Each object therein represents the title and page number for the bookmark.

  :return: ``Promise`` The result delivered by the promise is an array of objects with properties as follows:

    .. list-table::
       :header-rows: 1

       * - **Property**
         - **Type**
       * - ``title``
         - ``String``
       * - ``page``
         - ``Number``
       * - ``down``
         - ``Object`` or ``undefined`` - this object represents the next object in the array (if any)


  .. note::

      "Outline" is also known as "Table of Contents" or "Bookmarks". These terms can all be considered to be synonymous.


  **Example**

  .. code-block:: javascript

    function printOutline() {

      mupdfView.documentOutline().then((bookmarks) => {
          for (let bookmark of bookmarks) {
            logBookmark(bookmark)
          }
      });

      function logBookmark(bookmark) {
        console.log(`bookmark title=${bookmark.title}, page=${bookmark.page}, down=${bookmark.down}`);

        if (bookmark.down) {
          for (let item of bookmark.down) {
            logBookmark(item);
          }
        }

      }

    }


``countPages``
~~~~~~~~~~~~~~~~~~~~~~~~~~


.. method:: countPages()

  Returns a Promise_.

  :return: ``Promise`` The result delivered by the promise is a number representing the document page count.


  **Example**

  .. code-block:: javascript

    mupdfView.countPages().then((pageCount) => {
      console.log(`result=${pageCount}`);
    });




``getPageSize``
~~~~~~~~~~~~~~~~~~~~~~~~~~


.. method:: getPageSize(pageNumber)

  Returns a Promise_.


  :arg pageNumber: ``Number``.
  :return: ``Promise`` The result delivered by the promise is an object representing the page size as follows:

    .. list-table::
         :header-rows: 1

         * - **Property**
           - **Type**
         * - ``width``
           - ``Number``
         * - ``height``
           - ``Number``


  **Example**

  .. code-block:: javascript

    mupdfView.getPageSize(1).then((size) => {
        console.log(`size width=${size.width}, height=${size.height}`);
    });



``getPageLinks``
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. method:: getPageLinks(pageNumber)

  Returns a Promise_.


  :arg pageNumber: ``Number``.
  :return: ``Promise`` The result delivered by the promise is an array of objects (or ``null`` if there are no links on the page). An object in the array represents a page link as follows:

    .. list-table::
         :header-rows: 1

         * - **Property**
           - **Type**
         * - ``x``
           - ``Number``
         * - ``y``
           - ``Number``
         * - ``w``
           - ``Number``
         * - ``h``
           - ``Number``
         * - ``href``
           - ``String``


    **Example**

    .. code-block:: javascript

      mupdfView.getPageLinks(281).then((links) => {

        for (let link of links) {
          console.log(`x=${link.x}, y=${link.y}, w=${link.w}, h=${link.h}, href=${link.href}`);
        }

      });





``getPageText``
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. method:: getPageText(pageNumber)

  Returns a Promise_.

  :arg pageNumber: ``Number``.
  :return: ``Promise`` The result delivered by the promise is an object representing the page text in the :ref:`Structured Text<mupdf_api_sTextPage_class>` :title:`JSON` format.

  **Example**

    .. code-block:: javascript

      mupdfView.getPageText(1).then((obj) => {
          let str = JSON.stringify(obj);
          console.log(`str=${str}`);
      });



``search``
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. method:: search(pageNumber, needle)

  Returns a Promise_.

  :arg pageNumber: ``Number``.
  :arg needle: ``String`` Case in-sensitive search term.
  :return: ``Promise`` The result delivered by the promise is an array representing the search results. An object in the array represents the coordinate and metric results for the text instance as follows:

    .. list-table::
         :header-rows: 1

         * - **Property**
           - **Type**
         * - ``x``
           - ``Number``
         * - ``y``
           - ``Number``
         * - ``w``
           - ``Number``
         * - ``h``
           - ``Number``

  **Example**

    .. code-block:: javascript

      mupdfView.search(2, "the").then((results) => {
          for (let result of results) {
            console.log(`x=${result.x}, y=${result.y}, w=${result.w}, h=${result.h}`);
          }
      });


``drawPageAsPNG``
~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO

``drawPageAsPixmap``
~~~~~~~~~~~~~~~~~~~~~~~~~~

``drawPageContentsAsPixmap``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


drawPageAnnotsAsPixmap

drawPageWidgetsAsPixmap


``mouseDownOnPage``
~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO


``mouseDragOnPage``
~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO


``mouseMoveOnPage``
~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO


``mouseUpOnPage``
~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO



``terminate``
~~~~~~~~~~~~~~~~~~~~~~~~~~

TODO


``getPageAnnotations``
~~~~~~~~~~~~~~~~~~~~~~~~~~


``setEditionTool``
~~~~~~~~~~~~~~~~~~~~


.. External URLS

.. _array buffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

.. _Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise


