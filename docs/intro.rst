.. meta::
   :description: MuPDF WASM documentation
   :keywords: WASM, MuPDF


Introduction
===============================

With `WebAssembly`_ (WASM), developers are now able to write applications to display and manipulate PDF documents for a web-based environment.

:title:`MuPDF WASM` provides a vanilla JavaScript API to acheive common PDF functionality with **no** third-party dependencies.


Building :title:`MuPDF WASM`
--------------------------------

Assuming you have checked out the main MuPDF repository you need to ensure that `Emscripten`_ is installed on your system. :title:`Emscripten` is the C to WASM compiler and is required to create the :title:`MuPDF WASM` library.


Running the Makefile
~~~~~~~~~~~~~~~~~~~~

Within the top level folder there is a ``Makefile`` which assumes that the :title:`Emscripten` SDK is installed in ``/opt/emsdk``. If you have installed it elsewhere, you will need to edit the script to point to the appropriate location.

Once :title:`Emscripten` has been installed, run the make file from the command line to build the :title:`WebAssembly` library:

.. code-block:: shell
   :name: mafefile

   make

.. note::

      The ``Makefile`` assumes that you are building with BASH. If, however, you are building with ZSH by default (for instance on :title:`Mac OS`) you should comment out all the following instances of ``BASH_SOURCE=$(EMSDK_DIR)/emsdk_env.sh`` within the file to avoid build errors.



The results of the build are the following files placed in ``platform/wasm/``:


- ``mupdf-wasm.js``
- ``mupdf-wasm.wasm``
- ``mupdf-wasm-singlethread.js``
- ``mupdf-wasm-singlethread.wasm``
- ``mupdf-wasm.worker.js``



In order to build a web application based on :title:`MuPDF`, you will need to copy these files and make them available to your page.


.. note::

   The ``mupdf-wasm.wasm`` binary is quite large, because it contains not only the :title:`MuPDF` library code, but also the 14 core PDF fonts, various CJK mapping resources, and ICC profiles. In order to keep it as small as possible, it is built with a minimal set of features that does not include things like CJK fonts or EPUB support.



..
   External links

.. _WebAssembly:
.. _WASM: https://webassembly.org
.. _Emscripten: https://emscripten.org/docs/getting_started/downloads.html




