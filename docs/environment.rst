.. Copyright (C) 2001-2022 Artifex Software, Inc.
.. All Rights Reserved.

.. title:: API

.. meta::
   :description: MuPDF WASM documentation
   :keywords: MuPDF, wasm



Development Environment
===============================


Browser setup
--------------------------

If you developing a :title:`WASM` webpage it is important to note the following pre-requisites for local development:

- You should run the webpage in a localhost environment, or:
- Run the webpage locally in a browser which allows for a less strict origin policy allowing for local file loads - see below for how to do this in :title:`Firefox`.


:title:`Firefox` - enabling local files loads
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


If you are not running in a local host environment then this is required for local JS files to load & execute into the webpage without hindrance. It also allows for local PDF files to be chosen and loaded via the `File`_ JS interface.

:title:`Artifex` recommends :title:`Firefox` as the browser of choice for local development due to its feature set of highly configurable developer options.



By default :title:`Firefox` is set to *not* allow local files to be loaded into the browser environment.

You can enable local file loads in :title:`Firefox` by setting ``security.fileuri.strict_origin_policy`` in the ``about:config`` menu to ``false``.

Steps to do this:

- Type ``about:config`` into a :title:`Firefox` tab.
- Search for ``security.fileuri.strict_origin_policy``.
- Click on the value to toggle it to ``false``.

.. note::

   If you do this you should probably use an entirely separate browser for development use - e.g. `Firefox Developer Edition`_. Or reset the origin policy back to default at a later time.




JavaScript methodology
--------------------------

Due to the asynchronous nature of a :title:`WASM` web application :title:`Web Workers` and :title:`Promises` should be used within your application to handle the lifecycle and document events.


:title:`Web Workers`
~~~~~~~~~~~~~~~~~~~~~~~~

By utilizing :title:`Web Workers` your webpage will be able to run scripts on background threads which will not interfere with the user interface. As there may be a fair amount of file I/O and page rendering occuring the :title:`Web Worker` solution will allow for this whilst not hanging or slowing down (or seemingly crashing) your webpage.

See :title:`Mozilla's` page on `Using Web Workers`_ for more.


:title:`Promises`
~~~~~~~~~~~~~~~~~~~~~

By utilizing :title:`Promises` your :title:`JavaScript` code will be better equipped to manage asynchronous operations. Code should be easier to follow and maintain as you develop your :title:`WASM` application.


See Mozilla's page on `Using Promises`_ for more.



Conclusion
--------------------------

Sample code and development discussion will assume an environment running with the correct browser setup and with programmatic solutions which utilize the :title:`JavaScript` methodology as outlined above.

Therefore the coding samples within this documentation will be using the APIs as outlined in the :ref:`Document Viewer API<api_mupdf_document_viewer_api>` and :ref:`The View API<api_view_api>`.






..
   External links


.. _Disable CSP: https://stackoverflow.com/questions/27323631/how-to-override-content-security-policy-while-including-script-in-browser-js-con
.. _Disable CORS: https://stackoverflow.com/questions/17711924/disable-cross-domain-web-security-in-firefox
.. _File: https://developer.mozilla.org/en-US/docs/Web/API/File
.. _Using Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
.. _Using Promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
.. _Firefox Developer Edition: https://www.mozilla.org/en-GB/firefox/developer/




