.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title:: API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm


API
===============================


There are three JavaScript APIs to consider:


- The high level :ref:`JavaScript "View" API<view_api>`
- The middle level :ref:`JavaScript "MuPDF" API<mupdf_api>`
- The low level :ref:`JavaScript "Fitz" API<fitz_api>`

See: :ref:`The MuPDF WASM structure diagram<mupdf-wasm-structure>` for where these API layers are found.


.. note::

  If you work at the View API level, you don't need to understand the MuPDF API or Fitz API levels.

  You should pick which API to use based upon what you want to do, and the environment in which you are working. You probably only need to be working with one of these APIs in any given project.


----------


.. _view_api:


.. toctree::

  ViewAPI.rst


.. _mupdf_api:



.. toctree::

  MuPDFAPI.rst


.. _fitz_api:



.. toctree::

  FitzAPI.rst






