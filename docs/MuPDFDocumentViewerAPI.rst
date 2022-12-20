.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title::The MuPDF DocumentViewer API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm


.. _mupdfDocumentViewerAPI:

MuPDF Document Viewer API
==============================

This API is built on top of the :ref:`View API<api_view_api>`.

The :title:`MuPDF DocumentViewer API` provides methods for handling a view on a document handled by :title:`MuPDF` in a browser. If you want to write a document viewer on the web, this is probably the interface you want to use as it will vastly simplify your integration.


Associated file: ``mupdf-view-page.js``.


Dependencies on the DOM
----------------------------

If using this API then there is an assumption that the following ``div`` elements by ``id`` exist in the DOM:


- ``placeholder``
- ``grid-menubar``
- ``grid-sidebar``
- ``grid-main``
- ``pages``
- ``search-dialog``
- ``outline``
- ``search-status``

These will be used as part of the default UI to view and interact with documents.





.. External URLS

.. _array buffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

.. _Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise


