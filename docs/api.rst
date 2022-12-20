.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title:: API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm


API
===============================


There are four JavaScript APIs to consider:

- The UI level :ref:`"MuPDF Document Viewer" API<api_mupdf_document_viewer_api>`.
- The high level :ref:`"View" API<api_view_api>`.
- The middle level :ref:`"Mu PDF" API<api_mupdf_api>`.
- The low level :ref:`"Fitz" API<api_fitz_api>`.

See: :ref:`The MuPDF WASM structure diagram<mupdf-wasm-structure>` for where these API layers are found.


.. note::

  - If you work at the :title:`Document Viewer API` level, you don't need to understand the :title:`View API` level.

  - If you work at the :title:`View API` level, you don't need to understand the :title:`MuPDF API` or :title:`Fitz API` levels.

  - You should pick which API to use based upon what you want to do, and the environment in which you are working. You probably only need to be working with one of these APIs in any given project.


----------



.. _api_mupdf_document_viewer_api:


.. toctree::

  MuPDFDocumentViewerAPI.rst


.. _api_view_api:


.. toctree::

  ViewAPI.rst


.. _api_mupdf_api:



.. toctree::

  MuPDFAPI.rst


.. _api_fitz_api:



.. toctree::

  FitzAPI.rst






