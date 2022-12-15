This class is responsible for creating, editing and deleting PDF annotations.


constructor
""""""""""""

Constructor with an annotation pointer sourced from :ref:`Fitz API Annotation functions<fitz_api_pdf_annot_funcs>`.


.. code-block:: javascript

  /**
  * @param {Object} pointer
  */
  constructor(pointer)


active
"""""""""""""""""""""""

Returns if the :ref:`Annotation<mupdf_api_annotation_class>` is active or not.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  active()


setActive
"""""""""""""""""""""""

Sets the active state of the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @param {Boolean} active
  */
  setActive(active)


hot
"""""""""""""""""""""""

Returns if the :ref:`Annotation<mupdf_api_annotation_class>` is "hot" or not. If an annotation is "hot" then the mouse pointer is on top of the annotation.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  hot()


setHot
"""""""""""""""""""""""

Sets whether the :ref:`Annotation<mupdf_api_annotation_class>` is "hot" or not.

.. code-block:: javascript

  /**
  * @param {Boolean} hot
  */
  setHot(hot)


getTransform
"""""""""""""""""""""""

Returns the transform :ref:`Matrix<mupdf_api_matrix_class>` of the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {Matrix}
  */
  getTransform()


page
"""""""""""""""""""""""

TODO

.. code-block:: javascript

  /**
  *
  */
  page()


bound
"""""""""""""""""""""""

Returns the :ref:`Annotation<mupdf_api_annotation_class>` rectangle in terms of PDF document space.

.. code-block:: javascript

  /**
  * @return {Rect}
  */
  bound()


needsResynthesis
"""""""""""""""""""""""

When an :ref:`Annotation<mupdf_api_annotation_class>` changes any property which affects its visual appearance, it "needs resynthesis". This flag is used to detect when to recreate the appearance stream.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  needsResynthesis()


setResynthesised
"""""""""""""""""""""""

Sets the :ref:`Annotation<mupdf_api_annotation_class>` to being resynthesised.

.. code-block:: javascript

  setResynthesised()


dirty
"""""""""""""""""""""""

Sets the :ref:`Annotation<mupdf_api_annotation_class>` to "dirty" (i.e. modified).

.. code-block:: javascript

  dirty()


setPopup
"""""""""""""""""""""""

Sets the :ref:`Annotation<mupdf_api_annotation_class>` popup :ref:`Rect<mupdf_api_rect_class>`.

.. code-block:: javascript

  /**
  * @param {Rect} rect
  */
  setPopup(rect)



popup
"""""""""""""""""""""""

Returns the :ref:`Annotation<mupdf_api_annotation_class>` popup :ref:`Rect<mupdf_api_rect_class>`.


.. code-block:: javascript

  /**
  * @return {Rect}
  */
  popup()


delete
"""""""""""""""""""""""

Deletes the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  delete()


typeString
"""""""""""""""""""""""

Returns the :ref:`Annotation<mupdf_api_annotation_class>` type as a string.

.. code-block:: javascript

  /**
  * @return {String}
  */
  typeString()


flags
"""""""""""""""""""""""

Returns any flags against the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  flags()



setFlags
"""""""""""""""""""""""

Sets any flags against the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @param {Number} flags
  */
  setFlags(flags)


rect
"""""""""""""""""""""""


Returns the :ref:`Annotation<mupdf_api_annotation_class>` rectangle in terms of MuPDF's page space.

.. code-block:: javascript

  /**
  * @return {Rect}
  */
  rect()


setRect
"""""""""""""""""""""""

Sets the :ref:`Rect<mupdf_api_rectclass>` for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @param {Rect} rect
  */
  setRect(rect)



contents
"""""""""""""""""""""""

Returns the text contents for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {String}
  */
  contents()



setContents
"""""""""""""""""""""""

Sets the text contents for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @param {String} text
  */
  setContents(text)


hasOpen
"""""""""""""""""""""""

Check to see if the :ref:`Annotation<mupdf_api_annotation_class>` has an open action.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  hasOpen()


isOpen
"""""""""""""""""""""""

Returns whether the :ref:`Annotation<mupdf_api_annotation_class>` is open or not.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  isOpen()


setIsOpen
"""""""""""""""""""""""

Sets whether the :ref:`Annotation<mupdf_api_annotation_class>` is open or not.

.. code-block:: javascript

  /**
  * @param {Boolean} isOpen
  */
  setIsOpen(isOpen)


hasIconName
"""""""""""""""""""""""

Check to see if the :ref:`Annotation<mupdf_api_annotation_class>` has an icon name.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  hasIconName()


iconName
"""""""""""""""""""""""

Returns the icon name for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {String}
  */
  iconName()


setIconName
"""""""""""""""""""""""

Sets the icon name for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @param {String} name
  */
  setIconName(name)


border
"""""""""""""""""""""""

Get the border width for the :ref:`Annotation<mupdf_api_annotation_class>` in points.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  border()


setBorder
"""""""""""""""""""""""

Set the border width for the :ref:`Annotation<mupdf_api_annotation_class>` in points.

.. code-block:: javascript

  /**
  * @param {Number} width
  */
  setBorder(width)


language
"""""""""""""""""""""""

Get the :ref:`Annotation<mupdf_api_annotation_class>` text language.

.. code-block:: javascript

  /**
  * @return {String}
  */
  language()


setLanguage
"""""""""""""""""""""""

Set the :ref:`Annotation<mupdf_api_annotation_class>` text language.

.. code-block:: javascript

  /**
  * @param {String} lang
  */
  setLanguage(lang)


opacity
"""""""""""""""""""""""

Get the :ref:`Annotation<mupdf_api_annotation_class>` opacity (float between 0-1).

.. code-block:: javascript

  /**
  * @return {Number}
  */
  opacity()


setOpacity
"""""""""""""""""""""""

Set the :ref:`Annotation<mupdf_api_annotation_class>` opacity (float between 0-1).

.. code-block:: javascript

  /**
  * @param {Number} opacity
  */
  setOpacity(opacity)


hasLine
"""""""""""""""""""""""

Check to see if the :ref:`Annotation<mupdf_api_annotation_class>` has line data.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  hasLine()


line
"""""""""""""""""""""""

Returns an array containing the start :ref:`Point<mupdf_api_point_class>` and end :ref:`Point<mupdf_api_point_class>` for the line.

.. code-block:: javascript

  /**
  * @return {[Point, Point]}
  */
  line()


setLine
"""""""""""""""""""""""

Creates a line with a start :ref:`Point<mupdf_api_point_class>` and end :ref:`Point<mupdf_api_point_class>`.

.. code-block:: javascript

  /**
  * @param {Point} point0
  * @param {Point} point1
  */
  setLine(point0, point1)


hasVertices
"""""""""""""""""""""""

Check to see if the :ref:`Annotation<mupdf_api_annotation_class>` has vertices.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  hasVertices()



vertexCount
"""""""""""""""""""""""

Returns the vertex count for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  vertexCount()


vertex
"""""""""""""""""""""""

Returns a :ref:`Point<mupdf_api_point_class>` for a vertex index.

.. code-block:: javascript

  /**
  * @param {Number} i
  * @return {Point}
  */
  vertex(i)


clearVertices
"""""""""""""""""""""""

Clears the :ref:`Annotation<mupdf_api_annotation_class>` vertices.

.. code-block:: javascript

  clearVertices()


addVertex
"""""""""""""""""""""""

Adds a vertex to the :ref:`Annotation<mupdf_api_annotation_class>` vertices stack.

.. code-block:: javascript

  /**
  * @param {Point} point
  */
  addVertex(point)


setVertex
"""""""""""""""""""""""

Sets a vertex at a given index.

.. code-block:: javascript

  /**
  * @param {Number} i
  * @param {Point} point
  */
  setVertex(i, point)



modificationDate
"""""""""""""""""""""""

Returns a JavaScript Date_ object for the modification date.

.. code-block:: javascript

  /**
  * @return {Date}
  */
  modificationDate()


creationDate
"""""""""""""""""""""""

Returns a JavaScript Date_ object for the creation date.

.. code-block:: javascript

  /**
  * @return {Date}
  */
  creationDate()



setModificationDate
"""""""""""""""""""""""

Sets the modification date.

.. code-block:: javascript

  /**
  * @param {Date} date
  */
  setModificationDate(date)


setCreationDate
"""""""""""""""""""""""

Sets the creation date.

.. code-block:: javascript

  /**
  * @param {Date} date
  */
  setCreationDate(date)


hasAuthor
"""""""""""""""""""""""

Returns whether the :ref:`Annotation<mupdf_api_annotation_class>` has an author.

.. code-block:: javascript

  /**
  * @return {Boolean}
  */
  hasAuthor()


author
"""""""""""""""""""""""

Gets the author name for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {String}
  */
  author()


setAuthor
"""""""""""""""""""""""

Sets the author name for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @param {String} name
  */
  setAuthor(name)


fieldFlags
"""""""""""""""""""""""

Returns the field flags for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {Number}
  */
  fieldFlags()


fieldValue
"""""""""""""""""""""""

Returns the field value for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {String}
  */
  fieldValue()


fieldLabel
"""""""""""""""""""""""

Returns the field label for the :ref:`Annotation<mupdf_api_annotation_class>`.

.. code-block:: javascript

  /**
  * @return {String}
  */
  fieldLabel()



.. external links:


.. _Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

