.. meta::
   :description: MuPDF WASM documentation
   :keywords: WASM, MuPDF





PDF Viewing
===============================


Depending on your application you will require UI controls for both file operations & document manipulation. Let's start with how to open a file and present the result to your webpage.

.. note::
   Coding samples & guides within this documentation will be using the "View API" as outlined in :ref:`The View API.<view_api>`



Opening a File
--------------------------


Consider the following in your DOM:


.. code-block:: html

   <input type="file" accept=".pdf,.xps,application/pdf" onchange="openFile(event.target.files[0])">


When the user presses on the ``input`` element a dialog for file selection will appear. When a file has been chosen by the user (note: limited to PDF & XPS files only) then a :title:`JavaScript` ``openFile`` method will trigger with the ``File`` object passed in as the only parameter.

.. note::
   We will return to what happens on the ``openFile`` method later.



The Document Area
--------------------------


There should be a dedicated area in your :title:`DOM` dedicated to the rendering of any loaded PDF document pages.


This dedicated area should have any associated :title:`CSS` for the layout of that area defined to suit your requirements.


For example consider an :title:`HTML` element as follows:

.. code-block:: html

   <div id="pages"></div>


With associated CSS:


.. code-block:: css

   #pages {
      margin: 0 auto;
   }

   #pages div.page {
      position:relative;
      background-color:white;
      margin:16px auto;
      box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.2);
   }


This would create a dedicated document area with white drop-shadow pages with top and bottom margins for their spacing. These pages will not be visible until the document is rendered.


.. note::
   Later, when a document has loaded, this dedicated ``#pages div`` will append additional ``.page divs`` representing each page of your document. But we will come to that later.


:title:`JavaScript` setup
---------------------------------


There is a fair amount of :title:`JavaScript` knowledge required for your :title:`WASM` application and intermediate or advanced knowledge is recommended. :title:`JavaScript` beginners beware!



The :title:`JavaScript` dependencies and SDK file structure can be see here:


.. _mupdf-wasm-structure:

.. image:: images/mupdf-wasm-structure.svg
  :width: 800px
  :alt: MuPDF WASM structure

*Fig.1 : MuPDF WASM structure*


Your solution should mirror this structure with your main HTML file importing ``mupdf-view.js`` directly:


.. code-block:: html

   <script src="mupdf-view.js"></script>



.. _wasm_the_mupdf_view:



The :title:`MuPDF` view
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Your HTML should create a container object for your web worker with any required wrapped methods and your web worker will import the :title:`MuPDF WASM` library. In the sample code file ``mupdf-view.js`` we have an object called ``mupdfView`` which is responsible for this setup as follows:


.. code-block:: javascript
   :emphasize-lines: 1
   :caption: mupdf-view.js

   var mupdfView = {};

   const worker = new Worker("mupdf-view-worker.js");
   const messagePromises = new Map();
   let lastPromiseId = 0;

   mupdfView.ready = new Promise((resolve, reject) => {
      worker.onmessage = function (event) {
         let type = event.data[0];
         if (type === "READY") {
            mupdfView.wasmMemory = event.data[1];
            let methodNames = event.data[2];
            for (let method of methodNames)
               mupdfView[method] = wrap(method);
            worker.onmessage = onWorkerMessage;
            resolve();
         } else if (type === "ERROR") {
            let error = event.data[1];
            reject(new Error(error));
         } else {
            reject(new Error(`Unexpected first message: ${event.data}`));
         }
      };
   });

   function onWorkerMessage(event) {
      let [ type, id, result ] = event.data;
      if (type === "RESULT")
         messagePromises.get(id).resolve(result);
      else if (type === "READY")
         messagePromises.get(id).reject(new Error("Unexpected READY message"));
      else if (type === "ERROR") {
         let error = new Error(result.message);
         error.name = result.name;
         error.stack = result.stack;
         messagePromises.get(id).reject(error);
      }
      else
         messagePromises.get(id).reject(new Error(`Unexpected result type '${type}'`));

      messagePromises.delete(id);
   }

   function wrap(func) {
      return function(...args) {
         return new Promise(function (resolve, reject) {
            let id = lastPromiseId++;
            messagePromises.set(id, { resolve, reject });
            if (args[0] instanceof ArrayBuffer)
               worker.postMessage([func, id, args], [args[0]]);
            else
               worker.postMessage([func, id, args]);
         });
      };
   }

   mupdfView.setLogFilters = wrap("setLogFilters");

   const wrap_openStreamFromUrl = wrap("openStreamFromUrl");
   const wrap_openDocumentFromStream = wrap("openDocumentFromStream");

   mupdfView.openDocumentFromUrl = async function (url, contentLength, progressive, prefetch, magic) {
      await wrap_openStreamFromUrl(url, contentLength, progressive, prefetch);
      return await wrap_openDocumentFromStream(magic);
   };

   mupdfView.terminate = function () { worker.terminate(); };





The corresponding web worker in this case ``mupdf-view-worker.js`` is responsible for interfacing directly with the autogenerated :title:`MuPDF WASM` library file (see: Fig.1 ) & methods are triggered via :title:`JavaScript` promises which return results (or failures) as appropriate.




``openFile``
~~~~~~~~~~~~

Earlier, we referenced a method called ``openFile`` when the user choses a file. Let's explore this further.


As a minimum implementation the code requires to validate that the method's parameter is indeed of type ``File`` , then, using a :title:`JavaScript` promise we need to await the results of a method call to the :title:`View API` :ref:`openDocumentFromBuffer<wasm_view_api_openDocumentFromBuffer>` method before initializing the document.

.. code-block:: javascript

   async function openFile(file) {
      if (file instanceof File) {
         try {
            await mupdfView.openDocumentFromBuffer(await file.arrayBuffer(), file.name);
            initDocument(file.name);
         } catch (error) {
            MupdfDocumentViewer.showDocumentError("openFile", error, document.getElementById("pages"));
         }
      }
   }


Considering that the ``openDocumentFromBuffer`` call was successful, internally within our worker we should now have a pointer to a :title:`MuPDF` ``Document`` object. The ``initDocument`` method will be responisble for rendering this document and any other housekeeping that is required.


..
   External links


.. _Using Promises: https://developer.mozilla.org/en-US/docs/Web/javascript/Guide/Using_promises





