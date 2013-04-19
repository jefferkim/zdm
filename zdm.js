/* Zepto v1.0rc1 - polyfill zepto event detect fx ajax form touch - zeptojs.com/license */

;(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError()
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
      if(typeof fun != 'function') throw new TypeError()
      if(len == 0 && arguments.length == 1) throw new TypeError()

      if(arguments.length >= 2)
       accumulator = arguments[1]
      else
        do{
          if(k in t){
            accumulator = t[k++]
            break
          }
          if(++k >= len) throw new TypeError()
        } while (true)

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
        k++
      }
      return accumulator
    }

})()
var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,

    // Used by `$.zepto.init` to wrap elements, text/comment nodes, document,
    // and document fragment node types.
    elementTypes = [1, 3, 8, 9, 11],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]+)$/,
    tagSelectorRE = /^[\w-]+$/,
    toString = ({}).toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function isFunction(value) { return toString.call(value) == "[object Function]" }
  function isObject(value) { return value instanceof Object }
  function isPlainObject(value) {
    var key, ctor
    if (toString.call(value) !== "[object Object]") return false
    ctor = (isFunction(value.constructor) && value.constructor.prototype)
    if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) return false
    for (key in value);
    return key === undefined || hasOwnProperty.call(value, key)
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array) { return array.length > 0 ? [].concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return array.filter(function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name) {
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    if (!(name in containers)) name = '*'
    var container = containers[name]
    container.innerHTML = '' + html
    return $.each(slice.call(container.childNodes), function(){
      container.removeChild(this)
    })
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = arguments.callee.prototype
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // if a JavaScript object is given, return a copy of it
      // this is a somewhat peculiar option, but supported by
      // jQuery so we'll do it, too
      else if (isPlainObject(selector))
        dom = [$.extend({}, selector)], selector = null
      // wrap stuff like `document` or `window`
      else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, whichs makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    slice.call(arguments, 1).forEach(function(source) {
      for (key in source)
        if (source[key] !== undefined)
          target[key] = source[key]
    })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (element === document && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : emptyArray ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? emptyArray :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }

  function funcArg(context, arg, idx, payload) {
   return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  $.isFunction = isFunction
  $.isObject = isObject
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.trim = function(str) { return str.trim() }

  // plugin compatibility
  $.uuid = 0

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $.map(this, function(el, i){ return fn.call(el, i, el) })
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) })
      return this
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result
      if (this.length == 1) result = zepto.qsa(this[0], selector)
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return $(result)
    },
    closest: function(selector, context){
      var node = this[0]
      while (node && !zepto.matches(node, selector))
        node = node !== context && node !== document && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return slice.call(this.children) }), selector)
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return this.map(function(){ return this[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = null)
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(newContent){
      return this.each(function(){
        $(this).wrapAll($(newContent)[0].cloneNode(false))
      })
    },
    wrapAll: function(newContent){
      if (this[0]) {
        $(this[0]).before(newContent = $(newContent))
        newContent.append(this)
      }
      return this
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return $(this.map(function(){ return this.cloneNode(true) }))
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide()
    },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ if (this.nodeType === 1) this.removeAttribute(name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] ? this[0][name] : undefined) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? data : undefined
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : undefined) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(){
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: obj.width,
        height: obj.height
      }
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string')
        return (
          this.length == 0
            ? undefined
            : this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

      var css = ''
      for (key in property)
        if(typeof property[key] == 'string' && property[key] == '')
          this.each(function(){ this.style.removeProperty(dasherize(key)) })
        else
          css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'

      if (typeof property == 'string')
        if (value == '')
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (this.length < 1) return false
      else return classRE(name).test(this[0].className)
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = this.className, newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined)
          return this.className = ''
        classList = this.className
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        this.className = classList.trim()
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var newName = funcArg(this, name, idx, this.className)
        ;(when === undefined ? !$(this).hasClass(newName) : when) ?
          $(this).addClass(newName) : $(this).removeClass(newName)
      })
    }
  }

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value){
      var offset, Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
      if (value === undefined) return this[0] == window ? window['inner' + Dimension] :
        this[0] == document ? document.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        var el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function insert(operator, target, node) {
    var parent = (operator % 2) ? target : target.parentNode
    parent ? parent.insertBefore(node,
      !operator ? target.nextSibling :      // after
      operator == 1 ? parent.firstChild :   // prepend
      operator == 2 ? target :              // before
      null) :                               // append
      $(node).remove()
  }

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(key, operator) {
    $.fn[key] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var nodes = $.map(arguments, function(n){ return isObject(n) ? n : zepto.fragment(n) })
      if (nodes.length < 1) return this
      var size = this.length, copyByClone = size > 1, inReverse = operator < 2

      return this.each(function(index, target){
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[inReverse ? nodes.length-i-1 : i]
          traverseNode(node, function(node){
            if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || node.type === 'text/javascript'))
              window['eval'].call(window, node.innerHTML)
          })
          if (copyByClone && index < size - 1) node = node.cloneNode(true)
          insert(operator, target, node)
        }
      })
    }

    $.fn[(operator % 2) ? key+'To' : 'insert'+(operator ? 'Before' : 'After')] = function(html){
      $(html)[key](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.camelize = camelize
  zepto.uniq = uniq
  $.zepto = zepto

  return $
})()

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto
'$' in window || (window.$ = Zepto)
;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={}

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.isObject(events)) $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function add(element, events, fn, selector, getDelegate, capture){
    capture = !!capture
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var delegate = getDelegate && getDelegate(fn, event),
        callback = delegate || fn
      var proxyfn = function (event) {
        var result = callback.apply(element, [event].concat(event.data))
        if (result === false) event.preventDefault()
        return result
      }
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length})
      set.push(handler)
      element.addEventListener(handler.e, proxyfn, capture)
    })
  }
  function remove(element, events, fn, selector){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(handler.e, handler.proxy, false)
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event)
    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    var capture = false
    if(event == 'blur' || event == 'focus'){
      if($.iswebkit)
        event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event
      else
        capture = true
    }

    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      }, capture)
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return selector == undefined || $.isFunction(selector) ?
      this.bind(event, selector) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return selector == undefined || $.isFunction(selector) ?
      this.unbind(event, selector) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string') event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback){ return this.bind(event, callback) }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else if (this.length) try { this.get(0)[name]() } catch(e){}
      return this
    }
  })

  $.Event = function(type, props) {
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    return event
  }

})(Zepto)
;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)

    // todo clean this up with a better OS/browser
    // separation. we need to discern between multiple
    // browsers on android, and decide if kindle fire in
    // silk mode is android or not

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)
;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    clearProperties = {}

  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-'
      eventPrefix = event
      return false
    }
  })

  clearProperties[prefix + 'transition-property'] =
  clearProperties[prefix + 'transition-duration'] =
  clearProperties[prefix + 'transition-timing-function'] =
  clearProperties[prefix + 'animation-name'] =
  clearProperties[prefix + 'animation-duration'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration
    if (duration) duration = duration / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd
    if (duration === undefined) duration = 0.4
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssProperties[prefix + 'animation-name'] = properties
      cssProperties[prefix + 'animation-duration'] = duration + 's'
      endEvent = $.fx.animationEnd
    } else {
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) {
          transforms || (transforms = [])
          transforms.push(key + '(' + properties[key] + ')')
        }
        else cssProperties[key] = properties[key]

      if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ')
      if (!$.fx.off && typeof properties === 'object') {
        cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(', ')
        cssProperties[prefix + 'transition-duration'] = duration + 's'
        cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, arguments.callee)
      }
      $(this).css(clearProperties)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    setTimeout(function() {
      that.css(cssProperties)
      if (duration <= 0) setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) })
      }, 0)
    }, 0)

    return this
  }

  testEl = null
})(Zepto)
;(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      abort = function(){
        $(script).remove()
        if (callbackName in window) window[callbackName] = empty
        ajaxComplete('abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (options.error) script.onerror = function() {
      xhr.abort()
      options.error()
    }

    window[callbackName] = function(data){
      clearTimeout(abortTimeout)
      $(script).remove()
      delete window[callbackName]
      ajaxSuccess(data, xhr, options)
    }

    serializeData(options)
    script.src = options.url.replace(/=\?/, '=' + callbackName)
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.abort()
        ajaxComplete('timeout', xhr, options)
      }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0
  }

  function mimeToDataType(mime) {
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (isObject(options.data)) options.data = $.param(options.data)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
      return $.ajaxJSONP(settings)
    }

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = $.ajaxSettings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(null, 'error', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  $.get = function(url, success){ return $.ajax({ url: url, success: success }) }

  $.post = function(url, data, success, dataType){
    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null
    return $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType })
  }

  $.getJSON = function(url, success){
    return $.ajax({ url: url, success: success, dataType: 'json' })
  }

  $.fn.load = function(url, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector
    if (parts.length > 1) url = parts[0], selector = parts[1]
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response.replace(rscript, "")).find(selector).html()
        : response)
      success && success.call(self)
    })
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var array = $.isArray(obj)
    $.each(obj, function(key, value) {
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (traditional ? $.isArray(value) : isObject(value))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace('%20', '+')
  }
})(Zepto)
;(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function () {
    var result = []
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
    })
    return result.join('&')
  }

  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)
;(function($){
  var touch = {}, touchTimeout

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2){
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  var longTapDelay = 750, longTapTimeout

  function longTap(){
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap(){
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  $(document).ready(function(){
    var now, delta

    $(document.body).bind('touchstart', function(e){
      now = Date.now()
      delta = now - (touch.last || now)
      touch.el = $(parentIfText(e.touches[0].target))
      touchTimeout && clearTimeout(touchTimeout)
      touch.x1 = e.touches[0].pageX
      touch.y1 = e.touches[0].pageY
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true
      touch.last = now
      longTapTimeout = setTimeout(longTap, longTapDelay)
    }).bind('touchmove', function(e){
      cancelLongTap()
      touch.x2 = e.touches[0].pageX
      touch.y2 = e.touches[0].pageY
    }).bind('touchend', function(e){
       cancelLongTap()

      // double tap (tapped twice within 250ms)
      if (touch.isDoubleTap) {
        touch.el.trigger('doubleTap')
        touch = {}

      // swipe
      } else if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                 (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
        touch.el.trigger('swipe') &&
          touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
        touch = {}

      // normal tap
      } else if ('last' in touch) {
        touch.el.trigger('tap')

        touchTimeout = setTimeout(function(){
          touchTimeout = null
          touch.el.trigger('singleTap')
          touch = {}
        }, 250)
      }
    }).bind('touchcancel', function(){
      if (touchTimeout) clearTimeout(touchTimeout)
      if (longTapTimeout) clearTimeout(longTapTimeout)
      longTapTimeout = touchTimeout = null
      touch = {}
    })
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  })
})(Zepto)
;
//     Underscore.js 1.4.2
//     http://underscorejs.org
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.4.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return arguments.length > 2 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // with specific `key:value` pairs.
  _.where = function(obj, attrs) {
    if (_.isEmpty(attrs)) return [];
    return _.filter(obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (obj.length === +obj.length) return slice.call(obj);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) {
          result = func.apply(context, args);
        }
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        throttling = true;
        result = func.apply(context, args);
      }
      whenDone();
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (0 | Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });
      source +=
        escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" :
        interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" :
        evaluate ? "';\n" + evaluate + "\n__p+='" : '';
      index = offset + match.length;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
/**
* @fileOverview get fun with CommonJS!
* @author zhuxun.jb@taobao.com
*/

(function(win, doc, undef) {
    if (win["define"]) return;
    var NS_SEP = "/", ID_REG_PREFIX = /^#/, ID_REG_POSTFIX = /\.js$/i, modules = win["modules"] || (win["modules"] = {}), scope = modules, cjs = win, head = win.head || doc.head, basePath = "", aliasReg = [], aliasRep = [], resolvedId = {};
    function parseId(id, useAlias) {
        if (resolvedId[id]) {
            return resolvedId[id];
        }
        var _id = id.replace(ID_REG_PREFIX, "").replace(ID_REG_POSTFIX, "");
        if (useAlias) {
            aliasReg.forEach(function(reg, i) {
                _id = _id.replace(reg, aliasRep[i]);
            });
        }
        return resolvedId[id] = _id;
    }
    function defineNS(ns, name) {
        return ns[name] || (ns[name] = {});
    }
    function findNS(ns, name) {
        return ns[name];
    }
    function buildRequire(moduleId, dependencies) {
        var moduleIdPath = moduleId.split(NS_SEP);
        moduleIdPath.pop();
        dependencies.forEach(function(depsId) {
            var depsIdPath, resolvedPath, resolvedDepsId, path;
            depsId = parseId(depsId, true);
            if (depsId.indexOf(".") === 0) {
                depsIdPath = depsId.split(NS_SEP);
                resolvedPath = moduleIdPath.slice();
                while (path = depsIdPath.shift()) {
                    if (path === "..") {
                        resolvedPath.pop();
                    } else if (path !== ".") {
                        resolvedPath.push(path);
                    }
                }
                resolvedDepsId = resolvedPath.join(NS_SEP);
            }
            if (resolvedDepsId && depsId !== resolvedDepsId) {
                resolvedId[depsId] = resolvedDepsId;
            }
            if (!findNS(scope, resolvedDepsId || depsId)) {
                throw new Error('require a undefined module "' + (resolvedDepsId || depsId) + '" in "' + moduleId + '"');
            }
        });
        return function(id) {
            return require(id);
        };
    }
    function define(moduleId, dependencies, factory) {
        var require, module, exports;
        moduleId = parseId(moduleId);
        module = defineNS(scope, moduleId);
        exports = module.exports;
        if (exports) {
            throw new Error(moduleId + " has already defined");
        } else {
            module.id = moduleId;
            exports = module.exports = {};
        }
        require = buildRequire(moduleId, dependencies);
        if (typeof factory === "function") {
            module.executed = false;
            module.factory = factory;
            module.exports = function() {
                var module = this, factory = module.factory;
                module.exports = factory(require, module.exports, module) || module.exports;
                module.executed = true;
                delete module.factory;
                return module.exports;
            };
        } else {
            module.executed = true;
            module.exports = factory;
        }
    }
    function require(moduleId) {
        moduleId = parseId(moduleId, true);
        var module = findNS(scope, moduleId);
        if (module && module.exports) {
            return module.executed ? module.exports : module.exports();
        } else {
            throw new Error(moduleId + " has not defined");
        }
    }
    // function load(url, callback) {
    // 	var script = doc.createElement('script')
    // 		;
    // 	if (url.indexOf('http') < 0) {
    // 		url = basePath + url;
    // 	}
    // 	script.loaded = false;
    // 	script.type = 'text/javascript';
    // 	script.async = true;
    // 	script.onload = script.onreadystatechange  = function() {
    // 		if (!script.loaded) {
    // 			script.loaded = true;
    // 			callback && callback();
    // 		}
    // 	}
    // 	script.src = url;
    // 	head.appendChild(script);
    // }
    // function use(dependencies, callback) {
    // 	var args = [];
    // 	if (typeof dependencies === 'string') {
    // 		dependencies = [dependencies];
    // 	}
    // 	dependencies.forEach(function(id) {
    // 		args.push(require(id));
    // 	});
    // 	callback && callback.apply(win, args);
    // }
    // function alias(opt) {
    // 	basePath = opt.basePath;
    // 	if (opt.alias) {
    // 		for (var name in opt.alias) {
    // 			var value = opt.alias[name]
    // 				;
    // 			aliasReg.push(new RegExp('^' + name, 'i'));
    // 			aliasRep.push(value);
    // 		}
    // 	}
    // }
    cjs.define = define;
    cjs.require = require;
})(window, window.document);
define("#mix/core/0.3.0/base/reset-debug", [], function(require, exports, module) {
    var undef, toString = Object.prototype.toString, hasOwnProperty = Object.prototype.hasOwnProperty, slice = Array.prototype.slice;
    //
    // Object
    //
    if (!Object.keys) {
        Object.keys = function(object) {
            var keys = [], i = 0;
            for (var name in object) {
                if (hasOwnProperty.call(object, name)) {
                    keys[i++] = name;
                }
            }
            return keys;
        };
    }
    if (!Object.each) {
        Object.each = function(object, callback, context) {
            if (object == null) return;
            if (hasOwnProperty.call(object, "length")) {
                Array.prototype.forEach.call(object, callback, context);
            } else if (typeof object === "object") {
                for (var name in object) {
                    if (hasOwnProperty.call(object, name)) {
                        callback.call(context, object[name], name, object);
                    }
                }
            }
        };
    }
    if (!Object.clone) {
        Object.clone = function(value, deeply) {
            if (Object.isTypeof(value, "array")) {
                if (deeply) {
                    return arr.map(function(v) {
                        return Object.clone(v, deeply);
                    });
                } else {
                    return value.slice();
                }
            } else if (typeof value === "object") {
                return Object.extend({}, value, deeply);
            } else {
                return value;
            }
        };
    }
    if (!Object.extend) {
        Object.extend = function(src, target, deeply) {
            var args = Array.make(arguments), src = args.shift(), deeply = args.pop();
            if (!Object.isTypeof(deeply, "boolean")) {
                args.push(deeply);
                deeply = undef;
            }
            Object.each(args, function(target) {
                Object.each(target, function(value, name) {
                    src[name] = deeply ? Object.clone(value) : value;
                });
            });
            return src;
        };
    }
    if (!Object.isTypeof) {
        var TYPE_REGEXP = /^\[object\s\s*(\w\w*)\s*\]$/;
        Object.isTypeof = function(value, istype) {
            var str = toString.call(value).toLowerCase(), matched = TYPE_REGEXP.exec(str), type;
            if (!matched) return;
            type = matched[1];
            if (istype) {
                return type === istype.toLowerCase();
            } else {
                return type;
            }
        };
    }
    //
    // Array
    //
    if (!Array.make && !Array.from) {
        Array.from = Array.make = function(object) {
            if (hasOwnProperty.call(object, "length")) {
                return slice.call(object);
            }
        };
    }
    if (!Array.equal) {
        Array.equal = function(a1, a2) {
            if (a1.length == a2.length) {
                for (var i = 0; i < a1.length; i++) {
                    if (a1[i] !== a2[i]) return false;
                }
                return true;
            } else {
                return false;
            }
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, context) {
            var arr = this, len = arr.length;
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    callback.call(context, arr[i], i, arr);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, context) {
            var arr = this, len = arr.length, newArr = new Array(len);
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    newArr[i] = callback.call(context, arr[i], i, arr);
                }
            }
            return newArr;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(callback, context) {
            var arr = this, len = arr.length, newArr = [], value;
            for (var i = 0; i < len; i++) {
                value = arr[i];
                if (callback.call(context, value, i, arr)) {
                    newArr.push(value);
                }
            }
            return newArr;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(value, fromIndex) {
            var arr = this, len = arr.length, i = fromIndex || 0;
            if (!len || i >= len) return -1;
            if (i < 0) i += len;
            for (;i < length; i++) {
                if (hasOwnProperty.call(arr, i)) {
                    if (value === arr[i]) return i;
                }
            }
            return -1;
        };
    }
    //
    // String
    //
    if (!String.prototype.trim) {
        var LEFT_TRIM = /^\s\s*/, RIGHT_TRIM = /\s\s*$/;
        String.prototype.trim = function() {
            return this.replace(LEFT_TRIM, "").replace(RIGHT_TRIM, "");
        };
    }
    //
    // Function
    //
    if (!Function.prototype.bind) {
        var ctor = function() {};
        Function.prototype.bind = function(context) {
            var func = this, //protoBind = Function.prototype.bind,
            args = Array.make(arguments), bound;
            // if (func.bind === protoBind && protoBind) 
            //     return protoBind.apply(func, slice.call(arguments, 1));
            if (!Object.isTypeof(func, "function")) throw new TypeError();
            args = args.slice(1);
            return bound = function() {
                var _args = Array.make(arguments);
                if (!(this instanceof bound)) return func.apply(context, args.concat(_args));
                ctor.prototype = func.prototype;
                var self = new ctor();
                var result = func.apply(self, args.concat(_args));
                if (Object(result) === result) return result;
                return self;
            };
        };
    }
});

// --------------------------------
// Thanks to:
//  - https://github.com/alipay/arale/blob/master/lib/class/docs/competitors.md
//  - http://ejohn.org/blog/simple-javascript-inheritance/
//  - https://github.com/alipay/arale/blob/master/lib/class/src/class.js
//  - http://mootools.net/docs/core/Class/Class
//  - http://ejohn.org/blog/simple-javascript-inheritance/
//  - https://github.com/ded/klass
//  - http://documentcloud.github.com/backbone/#Model-extend
//  - https://github.com/joyent/node/blob/master/lib/util.js
//  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js
//
// --------------------------------
// TODO: 
//  - 测试typeof和toString的性能
// The base Class implementation.
define("#mix/core/0.3.0/base/class-debug", [], function(require, exports, module) {
    function Class(o) {
        // Convert existed function to Class.
        if (!(this instanceof Class) && Object.isTypeof(o, "function")) {
            return classify(o);
        }
    }
    Class.create = function(parent, properties) {
        if (!Object.isTypeof(parent, "function")) {
            properties = parent;
            parent = null;
        }
        properties || (properties = {});
        parent || (parent = properties.Extends || Class);
        properties.Extends = parent;
        // The created class constructor
        function Klass() {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === Klass && this.initialize) {
                this.initialize.apply(this, arguments);
            }
        }
        // Inherit class (static) properties from parent.
        if (parent !== Class) {
            Object.extend(Klass, parent);
        }
        // Add instance properties to the klass.
        implement.call(Klass, properties);
        // Make klass extendable.
        return classify(Klass);
    };
    // Create a new Class that inherits from this class
    Class.extend = function(properties) {
        properties || (properties = {});
        properties.Extends = this;
        return Class.create(properties);
    };
    // Mutators define special properties.
    Class.Mutators = {
        Extends: function(parent) {
            var existed = this.prototype;
            var proto = createProto(parent.prototype);
            // Keep existed properties.
            Object.extend(proto, existed);
            // Enforce the constructor to be what we expect.
            proto.constructor = this;
            // Set the prototype chain to inherit from `parent`.
            this.prototype = proto;
            // Set a convenience property in case the parent's prototype is
            // needed later.
            this.superclass = parent.prototype;
        },
        Implements: function(items) {
            Object.isTypeof(items, "array") || (items = [ items ]);
            var proto = this.prototype, item, constructor = proto.constructor;
            while (item = items.shift()) {
                Object.extend(proto, item.prototype || item);
            }
            proto.constructor = constructor;
        },
        Statics: function(staticProperties) {
            Object.extend(this, staticProperties);
        }
    };
    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {}
    // See: http://jsperf.com/object-create-vs-new-ctor
    if (Object.__proto__) {
        function createProto(proto) {
            return {
                __proto__: proto
            };
        }
    } else {
        function Ctor() {}
        function createProto(proto) {
            Ctor.prototype = proto;
            return new Ctor();
        }
    }
    function implement(properties) {
        var key, value;
        for (key in properties) {
            value = properties[key];
            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }
    module.exports = Class;
});

// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js
define("#mix/core/0.3.0/base/message-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug"), SPLITER_REG = /\s+/, // Regular expression used to split event strings
    AT_REG = /^\@([^:]+)\:/, // Regular expression used to @message
    AT_SPLITER = ":", msgId = 0;
    function getEventList(cache, event) {
        var list, matches, at;
        if ((matches = event.match(AT_REG)) && matches[1] === "*") {
            list = [];
            at = new RegExp("^(@[^\\:]+\\:)?" + event + "$");
            Object.each(cache, function(eventList, eventName) {
                if (at.test(eventName)) {
                    list = list.concat(eventList);
                }
            });
        } else {
            list = cache[event];
        }
        return list;
    }
    var Message = Class.create({
        initialize: function(name, id, defaultContext) {
            var that = this;
            that.__msgObj = {
                name: name || "anonymous",
                id: id || msgId++,
                cache: {},
                defaultContext: defaultContext || that
            };
        },
        // Bind one or more space separated events, `events`, to a `callback`
        // function. Passing `"all"` will bind the callback to all events fired.
        on: function(events, callback, context) {
            var that = this, cache = that.__msgObj.cache, defaultContext = that.__msgObj.defaultContext, matches, event, list;
            if (!callback) return that;
            if (events && (matches = events.match(AT_REG))) {
                events = events.split(AT_SPLITER)[1];
            } else {
                matches = [ "" ];
            }
            events = events.split(SPLITER_REG);
            while (event = events.shift()) {
                event = matches[0] + event;
                list = cache[event] || (cache[event] = []);
                list.push(callback, context || defaultContext);
            }
            return that;
        },
        // Remove one or many callbacks. If `context` is null, removes all callbacks
        // with that function. If `callback` is null, removes all callbacks for the
        // event. If `events` is null, removes all bound callbacks for all events.
        off: function(events, callback, context) {
            var that = this, cache = that.__msgObj.cache, matches = "", event, list, i, len;
            // No events, or removing *all* events.
            if (!(events || callback || context)) {
                delete that.__msgObj.events;
                return that;
            }
            if (events && (matches = events.match(AT_REG))) {
                events = events.split(AT_SPLITER)[1].split(SPLITER_REG);
            } else {
                events = events ? events.split(SPLITER_REG) : Object.keys(cache);
                matches = [ "" ];
            }
            // Loop through the callback list, splicing where appropriate.
            while (event = events.shift()) {
                event = matches[0] + event;
                list = cache[event];
                if (!list) continue;
                if (!(callback || context)) {
                    delete cache[event];
                    continue;
                }
                for (i = list.length - 2; i >= 0; i -= 2) {
                    if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                        list.splice(i, 2);
                    }
                }
            }
            return that;
        },
        has: function(event, callback, context) {
            var that = this, cache = that.__msgObj.cache, list = getEventList(cache, event), i;
            if (!list) return false;
            if (!(callback || context)) return true;
            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    return true;
                }
            }
            return false;
        },
        once: function(events, callback, context) {
            var that = this;
            function onceHandler() {
                callback.apply(this, arguments);
                that.off(events, onceHandler, context);
            }
            that.on(events, onceHandler, context);
        },
        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function(events) {
            var that = this, cache = that.__msgObj.cache, defaultContext = that.__msgObj.defaultContext, event, all, list, i, len, rest = [], args;
            events = events.split(SPLITER_REG);
            // Using loop is more efficient than `slice.call(arguments, 1)`
            for (i = 1, len = arguments.length; i < len; i++) {
                rest[i - 1] = arguments[i];
            }
            // For each event, walk through the list of callbacks twice, first to
            // trigger the event, then to trigger any `"all"` callbacks.
            while (event = events.shift()) {
                that.log(event + ":(" + rest.join(",") + ")");
                // Copy callback lists to prevent modification.
                if (all = cache.all) all = all.slice();
                if (list = getEventList(cache, event)) list = list.slice();
                // Execute event callbacks.
                if (list) {
                    for (i = 0, len = list.length; i < len; i += 2) {
                        list[i].apply(list[i + 1] || defaultContext, rest);
                    }
                }
                // Execute "all" callbacks.
                if (all) {
                    args = [ event ].concat(rest);
                    for (i = 0, len = all.length; i < len; i += 2) {
                        all[i].apply(all[i + 1] || defaultContext, args);
                    }
                }
            }
            return that;
        },
        log: function(msg) {
            var that = this;
            console.log("[(" + that.__msgObj.id + ")" + that.__msgObj.name + "]", {
                id: that.__msgObj.id,
                name: that.__msgObj.name,
                msg: msg
            });
        }
    });
    // Mix `Message` to object instance or Class function.
    Message.SPLITER_REG = SPLITER_REG;
    Message.AT_REG = AT_REG;
    Message.singleton = new Message("global");
    module.exports = Message;
});

define("#mix/core/0.3.0/base/util-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug");
    // List of HTML entities for escaping.
    var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;"
    }, isNumber = /^[-+]?\d\d*\.?\d\d*/;
    // Regex containing the keys listed immediately above.
    var htmlEscaper = /[&<>"'\/]/g;
    var Util = Class.create({
        initialize: function() {},
        // Escape a string for HTML interpolation.
        escape: function(string) {
            return ("" + string).replace(htmlEscaper, function(match) {
                return htmlEscapes[match];
            });
        },
        str2val: function(str) {
            if (str == null || str == undefined || str == NaN) {
                return str;
            }
            str += "";
            if (str === "true" || str === "false") {
                return str === "true" ? true : false;
            } else if (isNumber.test(str)) {
                return parseFloat(str);
            } else {
                return str;
            }
        }
    });
    Util.singleton = new Util();
    module.exports = Util;
});

// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/url/router-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/base/message-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug"), Message = require("mix/core/0.3.0/base/message-debug"), win = window, doc = win.document, loc = win.location;
    var Router = Class.create({
        Implements: Message,
        initialize: function() {
            var that = this;
            Message.prototype.initialize.call(that, "router");
            that._handlers = [];
            that._options = {};
            that._changeHanlder = that._changeHanlder.bind(that);
        },
        _getHash: function() {
            return loc.hash.slice(1) || "";
        },
        _setHash: function(fragment) {
            loc.hash = fragment;
        },
        _resetHandler: function() {
            var that = this, handlers = that._handlers;
            Object.each(handlers, function(handler) {
                handler.matched = false;
            });
        },
        _changeHanlder: function() {
            var that = this;
            that._resetHandler();
            that.match();
        },
        start: function(options) {
            var that = this, fragment;
            if (Router.started) return false;
            Router.started = true;
            win.addEventListener("hashchange", that._changeHanlder, false);
            options = Object.extend(that._options, options || {});
            if (options.firstMatch !== false) {
                that.match();
            }
            return true;
        },
        stop: function() {
            var that = this;
            if (!Router.started) return false;
            win.removeEventListener("hashchange", that._changeHanlder, false);
            Router.started = false;
            that._options = {};
            that._handlers = [];
            that._fragment = null;
            return true;
        },
        match: function() {
            var that = this, options = that._options, handlers = that._handlers, handler, fragment, unmatched = true;
            if (!Router.started) return;
            fragment = that._fragment = that._getHash();
            for (var i = 0; i < handlers.length; i++) {
                handler = handlers[i];
                if (!handler.matched && handler.route.test(fragment)) {
                    unmatched = false;
                    handler.matched = true;
                    handler.callback(fragment);
                    if (handler.last) break;
                }
            }
            unmatched && that.trigger("unmatched", fragment);
        },
        add: function(route, callback, last) {
            var that = this, handlers = that._handlers;
            handlers.push({
                route: route,
                callback: callback,
                matched: false,
                last: !!last
            });
        },
        remove: function(route, callback) {
            var that = this, handlers = that._handlers;
            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                if (handler.route.source === route.source && (!callback || handler.callback === callback)) {
                    return handlers.splice(i, 1);
                }
            }
        },
        navigate: function(fragment) {
            var that = this, fragment;
            if (!Router.started) return;
            fragment || (fragment = "");
            if (that._fragment !== fragment) {
                that._setHash(fragment);
            }
        }
    });
    Router.started = false;
    Router.singleton = new Router();
    module.exports = Router;
});

// --------------------------------
// Thanks to:
//	-http://backbonejs.org
//	-http://underscorejs.org
define("#mix/core/0.3.0/url/navigate-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/base/message-debug", "mix/core/0.3.0/url/router-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var Class = require("mix/core/0.3.0/base/class-debug"), Message = require("mix/core/0.3.0/base/message-debug"), Router = require("mix/core/0.3.0/url/router-debug"), NAMED_REGEXP = /\:(\w\w*)/g, SPLAT_REGEXP = /\*(\w\w*)/g, PERL_REGEXP = /P\<(\w\w*?)\>/g, ARGS_SPLITER = "!", //escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g,
    //routeRegExp = /^([^!]*?)(![^!]*?)?$/,
    win = window, doc = win.document, his = win.history, loc = win.location;
    var Navigate = Class.create({
        Implements: Message,
        initialize: function(options) {
            var that = this;
            Message.prototype.initialize.call(that, "navigate");
            that._move = null;
            that._datas = null;
            that._routes = {};
            that._states = [];
            that._stateIdx = 0;
            that._stateLimit = options.stateLimit || 100;
            that._router = options.useRouter;
        },
        _convertParams: function(routeText) {
            return routeText.replace(NAMED_REGEXP, "(P<$1>[^\\/]*?)").replace(SPLAT_REGEXP, "(P<$1>.*?)");
        },
        _extractNames: function(routeText) {
            var matched = routeText.match(PERL_REGEXP), names = {};
            matched && Object.each(matched, function(name, i) {
                names[name.replace(PERL_REGEXP, "$1")] = i;
            });
            return names;
        },
        _extractArgs: function(args) {
            var split = args.split("&");
            args = {};
            Object.each(split, function(pair) {
                if (pair) {
                    var s = pair.split("=");
                    args[s[0]] = s[1];
                }
            });
            return args;
        },
        _parseRoute: function(routeText) {
            routeText = routeText.replace(PERL_REGEXP, "");
            return new RegExp("^(" + routeText + ")(" + ARGS_SPLITER + ".*?)?$");
        },
        _stateEquals: function(state1, state2) {
            if (!state1 || !state2) return false;
            if (state1.name !== state2.name || state1.fragment !== state2.fragment) return false;
            return true;
        },
        _pushState: function(name, fragment, params, args) {
            var that = this, states = that._states, stateIdx = that._stateIdx, stateLimit = that._stateLimit, stateLen = states.length, move = that._move, transition = that._transition, datas = that._datas, prev = states[stateIdx - 1], next = states[stateIdx + 1], cur = {
                name: name,
                fragment: fragment,
                params: params,
                args: args
            };
            if (move == null) {
                if (!datas && that._stateEquals(prev, cur)) {
                    transition = move = "backward";
                } else {
                    transition = move = "forward";
                }
            }
            if (move === "backward") {
                if (stateIdx === 0 && stateLen > 0) {
                    states.unshift(cur);
                } else if (stateIdx > 0) {
                    stateIdx--;
                    cur = prev;
                }
            } else if (move === "forward") {
                if (stateIdx === stateLimit - 1) {
                    states.shift();
                    states.push(cur);
                } else if (stateIdx === 0 && stateLen === 0) {
                    states.push(cur);
                } else if (!datas && that._stateEquals(next, cur)) {
                    stateIdx++;
                    cur = next;
                } else {
                    stateIdx++;
                    states.splice(stateIdx);
                    states.push(cur);
                }
            }
            cur.move = move;
            cur.transition = transition;
            datas && (cur.datas = datas);
            that._move = null;
            that._datas = null;
            that._stateIdx = stateIdx;
            that.trigger(move, cur);
            return cur;
        },
        getState: function() {
            var that = this;
            return that._states[that._stateIdx];
        },
        getStateIndex: function() {
            var that = this;
            return that._stateIdx;
        },
        addRoute: function(name, routeText, options) {
            var that = this, callback, routeNames, routeReg;
            if (arguments.length === 1) {
                options = arguments[0];
                name = null;
                routeText = null;
            }
            options || (options = {});
            if (options["default"]) {
                that._router.on("unmatched", function(fragment) {
                    var state = that._pushState(name, fragment);
                    options.callback && options.callback(state);
                });
            } else if (name && routeText) {
                routeText = that._convertParams(routeText);
                routeNames = that._extractNames(routeText);
                routeReg = that._parseRoute(routeText);
                that._routes[name] = routeReg;
                that._router.add(routeReg, function(fragment) {
                    var matched = fragment.match(routeReg).slice(2), args = that._extractArgs(matched.pop() || ""), params = {}, state;
                    Object.each(routeNames, function(index, key) {
                        params[key] = matched[index];
                    });
                    state = that._pushState(name, fragment, params, args);
                    options.callback && options.callback(state);
                }, options.last);
            }
        },
        removeRoute: function(name) {
            var that = this, routeReg = that._routes[name];
            routeReg && that._router.remove(routeReg);
        },
        forward: function(fragment, options) {
            var that = this, states = that._states, stateIdx = that._stateIdx, cur = states[stateIdx] || {}, args = [];
            that._move = "forward";
            that._transition = "forward";
            options || (options = {});
            if (fragment) {
                if (options.datas || cur.fragment !== fragment) {
                    if (options.args) {
                        Object.each(options.args, function(value, key) {
                            args.push(key + "=" + value);
                        });
                    }
                    if (options.datas) {
                        that._datas = Object.clone(options.datas);
                    }
                    if (options.transition === "backward") {
                        that._transition = "backward";
                    }
                    that._router.navigate(fragment + (args.length ? ARGS_SPLITER + args.join("&") : ""));
                }
            } else {
                his.forward();
            }
        },
        backward: function(options) {
            var that = this, stateIdx = that._stateIdx;
            if (stateIdx === 0) return;
            that._move = "backward";
            that._transition = "backward";
            options || (options = {});
            if (options.transition === "forward") {
                that._transition = "forward";
            }
            his.back();
        }
    });
    Navigate.singleton = new Navigate({
        useRouter: Router.singleton
    });
    module.exports = Navigate;
});
define("#mix/sln/0.3.0/modules/gesture-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var win = window, doc = win.document, events = [ "screenX", "screenY", "clientX", "clientY", "pageX", "pageY" ], Class = require("mix/core/0.3.0/base/class-debug");
    function calc(x1, y1, x2, y2, x3, y3, x4, y4) {
        var rotate = Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y2 - y1, x2 - x1), scale = Math.sqrt((Math.pow(y4 - y3, 2) + Math.pow(x4 - x3, 2)) / (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))), translate = [ x3 - scale * x1 * Math.cos(rotate) + scale * y1 * Math.sin(rotate), y3 - scale * y1 * Math.cos(rotate) - scale * x1 * Math.sin(rotate) ];
        return {
            rotate: rotate,
            scale: scale,
            translate: translate,
            matrix: [ [ scale * Math.cos(rotate), -scale * Math.sin(rotate), translate[0] ], [ scale * Math.sin(rotate), scale * Math.cos(rotate), translate[1] ], [ 0, 0, 1 ] ]
        };
    }
    function copyEvents(type, src, copies) {
        var ev = document.createEvent("HTMLEvents");
        ev.initEvent(type, true, true);
        if (src) {
            if (copies) {
                Object.each(copies, function(p) {
                    ev[p] = src[p];
                });
            } else {
                Object.extend(ev, src);
            }
        }
        return ev;
    }
    var Gestrue = Class.create({
        initialize: function(element) {
            var that = this;
            that._el = element;
            that._myGestures = {};
            that._lastTapTime = NaN;
            that._onStart = that._onStart.bind(that);
            that._onDoing = that._onDoing.bind(that);
            that._onEnd = that._onEnd.bind(that);
            that._onTap = that._onTap.bind(that);
        },
        getElement: function() {
            return that._el;
        },
        enable: function() {
            var that = this, el = that._el;
            el.addEventListener("touchstart", that._onStart, false);
            el.addEventListener("tap", that._onTap, false);
        },
        disable: function() {
            var that = this, el = that._el;
            el.removeEventListener("touchstart", that._onStart, false);
            el.removeEventListener("tap", that._onTap, false);
        },
        _onStart: function(e) {
            var that = this, el = that._el, myGestures = that._myGestures;
            if (Object.keys(myGestures).length === 0) {
                doc.body.addEventListener("touchmove", that._onDoing, false);
                doc.body.addEventListener("touchend", that._onEnd, false);
            }
            Object.each(e.changedTouches, function(touch) {
                var touchRecord = {};
                for (var p in touch) touchRecord[p] = touch[p];
                var gesture = {
                    startTouch: touchRecord,
                    startTime: Date.now(),
                    status: "tapping",
                    pressingHandler: setTimeout(function() {
                        if (gesture.status === "tapping") {
                            gesture.status = "pressing";
                            var ev = copyEvents("press", touchRecord);
                            el.dispatchEvent(ev);
                        }
                        clearTimeout(gesture.pressingHandler);
                        gesture.pressingHandler = null;
                    }, 500)
                };
                myGestures[touch.identifier] = gesture;
            });
            if (Object.keys(myGestures).length == 2) {
                var ev = copyEvents("dualtouchstart");
                ev.touches = JSON.parse(JSON.stringify(e.touches));
                el.dispatchEvent(ev);
            }
        },
        _onDoing: function(e) {
            var that = this, el = that._el, myGestures = that._myGestures;
            Object.each(e.changedTouches, function(touch) {
                var gesture = myGestures[touch.identifier], displacementX, displacementY, distance, ev;
                if (!gesture) return;
                displacementX = touch.clientX - gesture.startTouch.clientX;
                displacementY = touch.clientY - gesture.startTouch.clientY;
                distance = Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2));
                // magic number 10: moving 10px means pan, not tap
                if (gesture.status == "tapping" && distance > 10) {
                    gesture.status = "panning";
                    ev = copyEvents("panstart", touch, events);
                    el.dispatchEvent(ev);
                }
                if (gesture.status == "panning") {
                    ev = copyEvents("pan", touch, events);
                    ev.displacementX = displacementX;
                    ev.displacementY = displacementY;
                    el.dispatchEvent(ev);
                }
            });
            if (Object.keys(myGestures).length == 2) {
                var position = [], current = [], transform, ev;
                Object.each(e.touchs, function(touch) {
                    var gesture;
                    if (gesture = myGestures[touch.identifier]) {
                        position.push([ gesture.startTouch.clientX, gesture.startTouch.clientY ]);
                        current.push([ touch.clientX, touch.clientY ]);
                    }
                });
                transform = calc(position[0][0], position[0][1], position[1][0], position[1][1], current[0][0], current[0][1], current[1][0], current[1][1]);
                ev = copyEvents("dualtouch", transform);
                ev.touches = JSON.parse(JSON.stringify(e.touches));
                el.dispatchEvent(ev);
            }
        },
        _onEnd: function(e) {
            var that = this, el = that._el, myGestures = that._myGestures, ev;
            if (Object.keys(myGestures).length == 2) {
                ev = copyEvents("dualtouchend");
                ev.touches = JSON.parse(JSON.stringify(e.touches));
                el.dispatchEvent(ev);
            }
            for (var i = 0; i < e.changedTouches.length; i++) {
                var touch = e.changedTouches[i], id = touch.identifier, gesture = myGestures[id];
                if (!gesture) continue;
                if (gesture.pressingHandler) {
                    clearTimeout(gesture.pressingHandler);
                    gesture.pressingHandler = null;
                }
                if (gesture.status === "tapping") {
                    ev = copyEvents("tap", touch, events);
                    el.dispatchEvent(ev);
                }
                if (gesture.status === "panning") {
                    ev = copyEvents("panend", touch, events);
                    el.dispatchEvent(ev);
                    var duration = Date.now() - gesture.startTime;
                    if (duration < 300) {
                        ev = copyEvents("flick", touch, events);
                        ev.duration = duration;
                        ev.valocityX = (touch.clientX - gesture.startTouch.clientX) / duration;
                        ev.valocityY = (touch.clientY - gesture.startTouch.clientY) / duration;
                        ev.displacementX = touch.clientX - gesture.startTouch.clientX;
                        ev.displacementY = touch.clientY - gesture.startTouch.clientY;
                        el.dispatchEvent(ev);
                    }
                }
                if (gesture.status === "pressing") {
                    ev = copyEvents("pressend", touch, events);
                    el.dispatchEvent(ev);
                }
                delete myGestures[id];
            }
            if (Object.keys(myGestures).length == 0) {
                doc.body.removeEventListener("touchend", that._onEnd);
                doc.body.removeEventListener("touchmove", that._onDoing);
            }
        },
        _onTap: function(e) {
            var that = this, el = that._el, lastTapTime = that._lastTapTime;
            if (Date.now() - lastTapTime < 500) {
                var ev = document.createEvent("HTMLEvents");
                ev.initEvent("doubletap", true, true);
                Object.each(events, function(p) {
                    ev[p] = e[p];
                });
                el.dispatchEvent(ev);
            }
            that._lastTapTime = Date.now();
        }
    });
    return Gestrue;
});

define("#mix/sln/0.3.0/modules/transform-debug", [], function(require, exports, module) {
    var MATRIX3D_REG = /^matrix3d\(\d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, \d+, ([\d-]+), ([-\d]+), [\d-]+, \d+\)/, MATRIX_REG = /^matrix\(\d+, \d+, \d+, \d+, ([-\d]+), ([-\d]+)\)$/, TRANSITION_NAME = "-webkit-transform", appVersion = navigator.appVersion, isAndroid = /android/gi.test(appVersion), isIOS = /iphone|ipad/gi.test(appVersion), has3d = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix();
    function quadratic2cubicBezier(a, b) {
        return [ [ (a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a) ], [ (b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a) ] ];
    }
    function getTransformX(el) {
        var transform, matchs;
        transform = getComputedStyle(el).webkitTransform;
        if (transform !== "none") {
            if (matchs = transform.match(MATRIX3D_REG)) {
                return parseInt(matchs[1]) || 0;
            } else if (matchs = transform.match(MATRIX_REG)) {
                return parseInt(matchs[1]) || 0;
            }
        }
        return 0;
    }
    function getTransformY(el) {
        var transform, matchs;
        transform = getComputedStyle(el).webkitTransform;
        if (transform !== "none") {
            if (matchs = transform.match(MATRIX3D_REG)) {
                return parseInt(matchs[2]) || 0;
            } else if (matchs = transform.match(MATRIX_REG)) {
                return parseInt(matchs[2]) || 0;
            }
        }
        return 0;
    }
    function getTranslate(x, y) {
        x += "";
        y += "";
        if (x.indexOf("%") < 0 && x !== "0") {
            x += "px";
        }
        if (y.indexOf("%") < 0 && y !== "0") {
            y += "px";
        }
        if (isIOS && has3d) {
            return "translate3d(" + x + ", " + y + ", 0)";
        } else {
            return "translate(" + x + ", " + y + ")";
        }
    }
    function waitTransition(el, time, callback) {
        var isEnd = false;
        function transitionEnd(e) {
            if (isEnd || e && (e.srcElement !== el || e.propertyName !== TRANSITION_NAME)) {
                return;
            }
            isEnd = true;
            el.style.webkitTransition = "none";
            el.removeEventListener("webkitTransitionEnd", transitionEnd, false);
            callback && setTimeout(callback, 50);
        }
        el.addEventListener("webkitTransitionEnd", transitionEnd, false);
    }
    function startTransition(el, time, timeFunction, delay, x, y, callback) {
        waitTransition(el, time, callback);
        el.style.webkitTransition = [ TRANSITION_NAME, time, timeFunction, delay ].join(" ");
        el.style.webkitTransform = getTranslate(x, y);
    }
    exports.getY = getTransformY;
    exports.getX = getTransformX;
    exports.getTranslate = getTranslate;
    exports.getBezier = quadratic2cubicBezier;
    exports.start = startTransition;
});

define("#mix/sln/0.3.0/modules/scroll-debug", [ "./gesture-debug", "./transform-debug", "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var win = window, doc = win.document, navigator = win.navigator, Class = require("mix/core/0.3.0/base/class-debug"), Gesture = require("./gesture-debug"), Transform = require("./transform-debug"), prevented = false;
    function getMaxScrollTop(el) {
        var parentEl = el.parentNode, parentStyle = getComputedStyle(parentEl);
        var maxTop = 0 - el.scrollHeight + parentEl.offsetHeight - parseInt(parentStyle.paddingTop) - parseInt(parentStyle.paddingBottom);
        if (maxTop > 0) maxTop = 0;
        return maxTop;
    }
    var Scroll = Class.create({
        initialize: function(element) {
            var that = this;
            that._wrap = element;
            that._scroller = element.children[0];
            that._gesture = new Gesture(that._scroller);
            that._originalY = null;
            that._currentY = null;
            that._scrollHeight = null;
            that._scrollEndHandler = null;
            that._scrollEndCancel = false;
            that._refreshed = false;
            that._preventBodyTouch = that._preventBodyTouch.bind(that);
            that._onTouchStart = that._onTouchStart.bind(that);
            that._onPanStart = that._onPanStart.bind(that);
            that._onPan = that._onPan.bind(that);
            that._onPanEnd = that._onPanEnd.bind(that);
            that._onFlick = that._onFlick.bind(that);
            that._onScrollEnd = that._onScrollEnd.bind(that);
        },
        enable: function() {
            var that = this, scroller = that._scroller;
            that._gesture.enable();
            scroller.addEventListener("touchstart", that._onTouchStart, false);
            scroller.addEventListener("panstart", that._onPanStart, false);
            scroller.addEventListener("pan", that._onPan, false);
            scroller.addEventListener("panend", that._onPanEnd, false);
            scroller.addEventListener("flick", that._onFlick, false);
            if (!prevented) {
                prevented = true;
                doc.body.addEventListener("touchmove", that._preventBodyTouch, false);
            }
        },
        disable: function() {
            var that = this, scroller = that._scroller;
            that._gesture.disable();
            scroller.removeEventListener("touchstart", that._onTouchStart, false);
            scroller.removeEventListener("panstart", that._onPanStart, false);
            scroller.removeEventListener("pan", that._onPan, false);
            scroller.removeEventListener("panend", that._onPanEnd, false);
            scroller.removeEventListener("flick", that._onFlick, false);
            if (prevented) {
                prevented = false;
                doc.body.removeEventListener("touchmove", that._preventBodyTouch, false);
            }
        },
        refresh: function() {
            this._refreshed = true;
        },
        getHeight: function() {
            return this._scroller.offsetHeight;
        },
        getTop: function() {
            return -Transform.getY(this._scroller);
        },
        to: function(top) {
            var that = this, scroller = that._scroller, maxScrollTop = getMaxScrollTop(scroller);
            top = -top;
            if (top < maxScrollTop) {
                top = maxScrollTop;
            } else if (top > 0) {
                top = 0;
            }
            scroller.style.webkitTransform = Transform.getTranslate(0, top);
            that._onScrollEnd();
        },
        _preventBodyTouch: function(e) {
            e.preventDefault();
            return false;
        },
        _onTouchStart: function(e) {
            var that = this, scroller = that._scroller;
            scroller.style.webkitTransition = "none";
            scroller.style.webkitTransform = getComputedStyle(scroller).webkitTransform;
            if (that._refreshed) {
                that._refreshed = false;
                that._scrollHeight = scroller.offsetHeight;
                scroller.style.height = "auto";
                scroller.style.height = that._scrollHeight + "px";
            }
        },
        _onPanStart: function(e) {
            var that = this, scroller = that._scroller;
            that._originalY = Transform.getY(scroller);
        },
        _onPan: function(e) {
            var that = this, scroller = that._scroller, maxScrollTop = getMaxScrollTop(scroller), originalY = that._originalY, currentY = that._currentY = originalY + e.displacementY;
            if (currentY > 0) {
                scroller.style.webkitTransform = Transform.getTranslate(0, currentY / 2);
            } else if (currentY < maxScrollTop) {
                scroller.style.webkitTransform = Transform.getTranslate(0, (maxScrollTop - currentY) / 2 + currentY);
            } else {
                scroller.style.webkitTransform = Transform.getTranslate(0, currentY);
            }
        },
        _onPanEnd: function(e) {
            var that = this, scroller = that._scroller, currentY = that._currentY, maxScrollTop = getMaxScrollTop(scroller), translateY = null;
            if (currentY > 0) {
                translateY = 0;
            }
            if (currentY < maxScrollTop) {
                translateY = maxScrollTop;
            }
            if (translateY != null) {
                Transform.start(scroller, "0.4s", "ease-out", "0s", 0, translateY, that._onScrollEnd);
            } else {
                that._onScrollEnd();
            }
        },
        _onFlick: function(e) {
            var that = this, scroller = that._scroller, currentY = that._currentY, maxScrollTop = getMaxScrollTop(scroller);
            that._scrollEndCancel = true;
            if (currentY < maxScrollTop || currentY > 0) return;
            var s0 = Transform.getY(scroller), v0 = e.valocityY;
            if (v0 > 1.5) v0 = 1.5;
            if (v0 < -1.5) v0 = -1.5;
            var a = .0015 * (v0 / Math.abs(v0)), t = v0 / a, s = s0 + t * v0 / 2;
            if (s > 0 || s < maxScrollTop) {
                var sign = s > 0 ? 1 : -1, edge = s > 0 ? 0 : maxScrollTop;
                s = (s - edge) / 2 + edge;
                t = (sign * Math.sqrt(2 * a * (s - s0) + v0 * v0) - v0) / a;
                v = v0 - a * t;
                Transform.start(scroller, t.toFixed(0) + "ms", "cubic-bezier(" + Transform.getBezier(-v0 / a, -v0 / a + t) + ")", "0s", 0, s.toFixed(0), function() {
                    v0 = v;
                    s0 = s;
                    a = .0045 * (v0 / Math.abs(v0));
                    t = -v0 / a;
                    s = edge;
                    Transform.start(scroller, (0 - t).toFixed(0) + "ms", "cubic-bezier(" + Transform.getBezier(-t, 0) + ")", "0s", 0, s.toFixed(0), that._onScrollEnd);
                });
            } else {
                Transform.start(scroller, t.toFixed(0) + "ms", "cubic-bezier(" + Transform.getBezier(-t, 0) + ")", "0s", 0, s.toFixed(0), that._onScrollEnd);
            }
        },
        _onScrollEnd: function() {
            var that = this;
            that._scrollEndCancel = false;
            setTimeout(function() {
                if (!that._scrollEndCancel) {
                    that._scrollEndHandler && that._scrollEndHandler();
                }
            }, 10);
        }
    });
    return Scroll;
});

define("#mix/sln/0.3.0/modules/component-debug", [ "./scroll-debug", "./gesture-debug", "./transform-debug", "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/base/message-debug", "mix/core/0.3.0/url/navigate-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var win = window, doc = win.document, Class = require("mix/core/0.3.0/base/class-debug"), Message = require("mix/core/0.3.0/base/message-debug"), navigate = require("mix/core/0.3.0/url/navigate-debug").singleton, Scroll = require("./scroll-debug"), Transform = require("./transform-debug"), components = {}, emptyFunc = function() {}, extendFns = function(el, fns) {
        el.fn || (el.fn = {});
        Object.extend(el.fn, fns);
    }, Compontent = Class.create({
        Implements: Message,
        initialize: function() {
            Message.prototype.initialize.call(this, "component");
        },
        get: function(name) {
            return components[name];
        },
        initViewport: function(el) {
            components["viewport"] = el;
            if (!el.getAttribute("id")) el.setAttribute("id", "viewport-" + Date.now());
        },
        initTitlebar: function(el) {
            var viewport = components["viewport"];
            viewport.className += " enableTitlebar";
            components["titlebar"] = el;
            extendFns(el, {
                change: function(text, movement) {
                    var that = this, wrap = el.querySelector("ul"), title = wrap.querySelector("li:first-child");
                    function handler(e) {
                        wrap.className = "";
                        wrap.removeEventListener("webkitTransitionEnd", handler);
                    }
                    title.innerHTML = text;
                    wrap.className = movement;
                    setTimeout(function() {
                        wrap.className += " transition";
                        wrap.addEventListener("webkitTransitionEnd", handler, false);
                    }, 1);
                }
            });
        },
        initBtn: function(name, el) {
            components[name] = el;
            var that = this;
            extendFns(el, {
                setText: function(text) {
                    el.innerText = text;
                },
                show: function() {
                    el.style.visibility = "";
                },
                hide: function() {
                    el.style.visibility = "hidden";
                }
            });
            el.addEventListener("click", function(e) {
                that.trigger(name + "Click");
                e.preventDefault();
                return false;
            });
            return el;
        },
        initBackBtn: function(el) {
            this.initBtn("backBtn", el);
        },
        initFuncBtn: function(el) {
            this.initBtn("funcBtn", el);
        },
        initContent: function(el) {
            components["content"] = el;
            var active = el.querySelector("div > .active"), inactive = el.querySelector("div > .inactive");
            extendFns(el, {
                getActive: function() {
                    return active;
                },
                getInactive: function() {
                    return inactive;
                },
                switchActive: function() {
                    swap = inactive;
                    inactive = active;
                    active = swap;
                },
                setClass: function() {
                    inactive.className = "inactive";
                    active.className = "active";
                }
            });
        },
        getActiveContent: function() {
            return components["content"].fn.getActive();
        },
        initScroll: function(el) {
            components["scroll"] = el;
            var that = this, children = el.children[0], scroller = new Scroll(el), viewport = components["viewport"];
            viewport.className += " enableScroll";
            el.className += " scroll";
            scroller._scrollEndHandler = function() {
                that.trigger("scrollEnd");
            };
            scroller.enable();
            extendFns(el, {
                refresh: function() {
                    scroller.refresh();
                },
                getScrollHeight: function() {
                    return scroller.getHeight();
                },
                getScrollTop: function() {
                    return scroller.getTop();
                },
                scrollTo: function(top) {
                    scroller.to(top);
                }
            });
        },
        initTransition: function(el) {
            components["transition"] = el;
            var that = this, viewport = components["viewport"], content = components["content"];
            viewport.className += " enableTransition";
            el.className += " transition";
            function action(type) {
                var wrap = el.querySelector("div"), active, originX, originY;
                content.fn.switchActive();
                active = content.fn.getActive(), active.innerHTML = "";
                originY = Transform.getY(wrap);
                originX = (type === "forward" ? "-" : "") + "33.33%";
                Transform.start(wrap, "0.4s", "ease", 0, originX, originY, function() {
                    content.fn.setClass();
                    originY = Transform.getY(wrap);
                    wrap.style.webkitTransform = Transform.getTranslate(0, originY);
                    that.trigger(type + "TransitionEnd");
                });
            }
            extendFns(el, {
                forward: function() {
                    action("forward");
                },
                backward: function() {
                    action("backward");
                }
            });
        }
    });
    return new Compontent();
});

define("#mix/sln/0.3.0/modules/page-debug", [ "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/base/message-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var win = window, doc = win.document, Class = require("mix/core/0.3.0/base/class-debug"), Message = require("mix/core/0.3.0/base/message-debug"), STATUS = {
        UNKOWN: 0,
        UNLOADED: 0,
        READY: 1,
        COMPILED: 2
    }, pages = {}, Page = Class.create({
        Implements: Message,
        initialize: function() {
            var that = this, name = that.name;
            Message.prototype.initialize.call(that, "app." + name);
            that.status = STATUS.UNKOWN;
            that.ready = that.ready.bind(that);
            that.unload = that.unload.bind(that);
            that.on("ready", that.ready);
            that.on("unloaded", that.unload);
        },
        getTitle: function() {
            //can overrewite
            return this.title;
        },
        loadTemplate: function(url, callback) {
            // can overwrite
            var that = this;
            if (arguments.length === 1) {
                callback = arguments[0];
                url = that.template;
            }
            url && app.loadFile(url, callback);
        },
        compileTemplate: function(text, callback) {
            // can overwrite
            var that = this, engine = app.config.templateEngine;
            if (engine && Object.isTypeof(text, "string")) {
                callback(engine.compile(text));
            } else {
                callback(text);
            }
        },
        renderTemplate: function(datas, callback) {
            // can overwrite
            var that = this, engine = app.config.templateEngine, compiledTemplate = that.compiledTemplate, content = "";
            if (engine && Object.isTypeof(datas, "object")) {
                content = engine.render(compiledTemplate, datas);
            } else {
                content = compiledTemplate;
            }
            callback(content);
        },
        fill: function(datas, callback) {
            var that = this;
            function _fill() {
                that.renderTemplate(datas, function(content) {
                    that.trigger("rendered", content);
                    callback && callback();
                });
            }
            if (!that.compiledTemplate) {
                that.once("compiled", _fill);
            } else {
                _fill();
            }
        },
        ready: function(navigation) {},
        unload: function() {}
    });
    Page.STATUS = STATUS;
    Page.global = {};
    Page.fn = {};
    Page.define = function(properties) {
        var cPage = Page.extend(properties), page;
        cPage.implement(Page.fn);
        page = new cPage();
        Object.each(Page.global, function(val, name) {
            var type = Object.isTypeof(val);
            switch (type) {
              case "array":
                page[name] = val.slice(0).concat(page[name] || []);
                break;

              case "object":
                page[name] = Object.extend(val, page[name] || {});
                break;

              case "string":
              case "number":
                page[name] == null && (page[name] = val);
                break;
            }
        });
        return pages[page.name] = page;
    };
    Page.get = function(name) {
        return pages[name];
    };
    Page.each = function(callback) {
        Object.each(pages, callback);
    };
    return Page;
});

define("#mix/sln/0.3.0/modules/navigation-debug", [ "./page-debug", "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/url/navigate-debug", "mix/core/0.3.0/base/message-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var win = window, doc = win.document, Class = require("mix/core/0.3.0/base/class-debug"), navigate = require("mix/core/0.3.0/url/navigate-debug").singleton, Page = require("./page-debug"), STATUS = Page.STATUS, Navigation = Class.create({
        initialize: function(state) {
            var that = this, name = state.name.split(".");
            that.pageName = name[0];
            that.routeName = name[1];
            that.state = state;
        },
        ready: function() {
            var page = Page.get(this.pageName);
            if (page.status < STATUS.READY) {
                page.status = STATUS.READY;
                page.trigger("ready");
            }
        },
        compile: function() {
            var page = Page.get(this.pageName);
            function _compiled() {
                if (page.status < STATUS.COMPILED) {
                    page.status = STATUS.COMPILED;
                    page.trigger("compiled");
                }
            }
            if (!page.compiledTemplate) {
                page.loadTemplate(function(text) {
                    page.compileTemplate(text, function(compiled) {
                        page.compiledTemplate = compiled;
                        _compiled();
                    });
                });
            } else {
                _compiled();
            }
        },
        unload: function() {
            var that = this, page = Page.get(this.pageName);
            if (page.status > STATUS.UNLOADED) {
                page.status = STATUS.UNLOADED;
                page.trigger("unloaded");
            }
        }
    });
    Object.extend(Navigation, {
        _cur: null,
        getParameter: function(name) {
            if (!this._cur) return;
            return this._cur.state.params[name];
        },
        getArgument: function(name) {
            if (!this._cur) return;
            return this._cur.state.args[name];
        },
        getData: function(name) {
            if (!this._cur) return;
            return this._cur.state.datas[name];
        },
        getPageName: function() {
            if (!this._cur) return;
            return this._cur.pageName;
        },
        getRouteName: function() {
            if (!this._cur) return;
            return this._cur.routeName;
        },
        getState: function() {
            if (!this._cur) return;
            return this._cur.state;
        },
        push: function(fragment, options) {
            navigate.forward(fragment, options);
        },
        pop: function() {
            navigate.backward();
        }
    });
    return Navigation;
});

define("#mix/sln/0.3.0/app-debug", [ "./modules/page-debug", "./modules/component-debug", "./modules/scroll-debug", "./modules/gesture-debug", "./modules/transform-debug", "./modules/navigation-debug", "mix/core/0.3.0/base/reset-debug", "mix/core/0.3.0/base/class-debug", "mix/core/0.3.0/url/router-debug", "mix/core/0.3.0/url/navigate-debug", "mix/core/0.3.0/base/message-debug", "mix/sln/0.3.0/app-debug" ], function(require, exports, module) {
    require("mix/core/0.3.0/base/reset-debug");
    var win = window, doc = win.document, Class = require("mix/core/0.3.0/base/class-debug"), router = require("mix/core/0.3.0/url/router-debug").singleton, navigate = require("mix/core/0.3.0/url/navigate-debug").singleton, Page = require("./modules/page-debug"), Component = require("./modules/component-debug"), Navigation = require("./modules/navigation-debug");
    app = {};
    function initComponent() {
        var viewport = app.config.viewport, titlebar = viewport.querySelector("header.titlebar"), backBtn = titlebar.querySelector("li:nth-child(2) button"), funcBtn = titlebar.querySelector("li:nth-child(3) button");
        content = viewport.querySelector("section.content"), toolbar = viewport.querySelector("footer.toolbar");
        Component.initViewport(viewport);
        if (app.config.enableTitlebar) {
            Component.initTitlebar(titlebar);
            Component.initBackBtn(backBtn);
            Component.initFuncBtn(funcBtn);
        }
        Component.initContent(content);
        if (app.config.enableScroll) {
            Component.initScroll(content);
        }
        if (app.config.enableTransition) {
            Component.initTransition(content);
        }
        if (app.config.enableToolbar) {
            Component.initToolbar();
        }
    }
    function initNavigation() {
        var titlebar = Component.get("titlebar"), backBtn = Component.get("backBtn"), funcBtn = Component.get("funcBtn"), backBtnHandler = null, funcBtnHandler = null, content = Component.get("content"), transition = Component.get("transition");
        Component.on("backBtnClick", function() {
            if (backBtnHandler) {
                backBtnHandler();
            } else {
                navigate.backward();
            }
        });
        Component.on("funcBtnClick", function() {
            funcBtnHandler && funcBtnHandler();
        });
        function setButtons(navigation) {
            var pageName = navigation.pageName, page = Page.get(pageName), buttons = page.buttons;
            backBtn.fn.hide();
            funcBtn.fn.hide();
            buttons && Object.each(buttons, function(item) {
                var type = item.type, isShow = false;
                switch (type) {
                  case "back":
                    backBtn.fn.setText(item.text);
                    backBtnHandler = item.handler;
                    if (item.autoHide === false || navigate.getStateIndex() >= 1) {
                        backBtn.fn.show();
                        isShow = true;
                    }
                    break;

                  case "func":
                    funcBtn.fn.setText(item.text);
                    funcBtnHandler = item.handler;
                    funcBtn.fn.show();
                    isShow = true;
                    break;

                  default:
                    break;
                }
                if (isShow && item.onshow) {
                    item.onshow.call(backBtn);
                }
            });
        }
        function setTitlebar(navigation) {
            var pageName = navigation.pageName, transition = navigation.state.transition, page = Page.get(pageName), title = page.getTitle();
            titlebar.fn.change(title, transition);
        }
        function switchNavigation(navigation) {
            if (app.config.enableTransition) {
                transition.fn[navigation.state.transition]();
            } else {
                content.fn.switchActive();
                content.fn.setClass();
            }
            if (app.navigation._cur) {
                app.navigation._cur.unload();
            }
            app.navigation._cur = navigation;
            navigation.ready();
            navigation.compile();
        }
        navigate.on("forward backward", function(state) {
            var navigation = new Navigation(state);
            switchNavigation(navigation);
            if (app.config.enableTitlebar) {
                setButtons(navigation);
                setTitlebar(navigation);
            }
        });
        Page.each(function(page) {
            var name = page.name, route = page.route;
            if (!route) {
                route = {
                    name: "default",
                    "default": true
                };
            } else if (Object.isTypeof(route, "string")) {
                route = {
                    name: "anonymous",
                    text: route
                };
            }
            navigate.addRoute(name + "." + route.name, route.text, route);
            page.on("rendered", function(html) {
                var scroll = Component.get("scroll"), active = Component.getActiveContent();
                active && (active.innerHTML = html);
                scroll && scroll.fn.refresh();
            });
        });
    }
    Object.extend(app, {
        config: {
            viewport: null,
            theme: "iOS",
            routePrefix: 0,
            // 0 - no prefix, 1 - use app.name, 'any string' - use 'any string'
            routePrefixSep: "/",
            enableTitlebar: false,
            enableScroll: false,
            enableTransition: false,
            enableToolbar: false,
            templateEngine: null
        },
        page: Page,
        component: Component,
        navigation: Navigation,
        plugin: {},
        loadFile: function(url, callback) {
            var xhr = new win.XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) {
                    callback(xhr.responseText);
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        },
        start: function() {
            initComponent();
            initNavigation();
            app.plugin.init && app.plugin.init();
            router.start();
        }
    });
    win["app"] = app;
});

require("mix/sln/0.3.0/app-debug");
/**
* global configuration
*
* @sysType : check system type , m or wapa or waptest
*
* @author  : yanyuan
* @date	   : 2012-03-16
*/

function Config(){

    var exports = {};

	// loading
	{
		var _checkSysType = 'm';
		if(window.location.host=='localhost' || window.location.host.match('.*\\waptest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')){
			_checkSysType = 'waptest';
		} else if (window.location.host.match('.*\\wapa\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*'))
		{
			_checkSysType = 'wapa';
		}
		 else if (window.location.host.match('.*\\m\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*'))
        {
            _checkSysType = 'm';
        }
	}
	// _checkSysType = 'waptest';
	// [auto check]system type , m or wapa or waptest
     exports.sysType = _checkSysType || 'm';

     //need remove flow code

	// [need config]index page
	exports.indexPage = 'http://fav.' + exports.sysType + '.taobao.com/h5proxy-midFav.htm';
	// [need config]error page
	exports.errorPage = 'http://fav.' + exports.sysType + '.taobao.com/fav_error.htm';

    return exports;
}
;
/**
 * cookie get、del
 *
 */


    /**
     * 判断浏览器是否能使用cookie
     */


function h5Cookie(){

    var exports = {};

    exports.isCookieEnable = function() {
      if(!window.navigator.cookieEnabled)
            return false;
        var key = '_s_cookie_';
        this.setCookie(key,'1');
        var v = this.getCookie(key);
        if(v == '1') {
            this.delCookie(key);
            return true;
        }
        return false;
    }
    /**
     * get cookieVauel
     */
    exports.getCookieVal = function(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if(endstr == -1)
            endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr));
    }
    /**
     * getCookie
     * if not exist ,return null
     */
    exports.getCookie = function(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while(i < clen) {
            var j = i + alen;
            if(document.cookie.substring(i, j) == arg)
                return this.getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if(i == 0)
                break;
        }
        return null;
    }
    /**
     * 将cookie设置到taobao域下
     */
    exports.setCookie = function(key, value) {
        var host = window.location.host;
        var index = host.indexOf(".");
        var subDomain = host.substring(0, index);
        if(subDomain != 'waptest' && subDomain != 'wapa' && subDomain != 'm' && (host.indexOf("taobao") > -1 || host.indexOf("tmall") > -1)) {
            host = host.substr(index + 1);
        }
        var expires = (arguments.length > 2) ? arguments[2] : null;
        if(expires == null) {
            document.cookie = key + "=" + escape(value) + ";path=/;domain=" + host;
        } else {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + (expires * 1000 ));
            document.cookie = key + "=" + escape(value) + ";path=/;domain=" + host + ";expires=" + expdate.toGMTString();
        }

    }

    exports.delCookie = function(name)
    //删除Cookie
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    }


    return exports;

}

    


;
/**
 * 一些通用工具方法
 * 1、判断空
 * 2、MD5
 * 
 * 
 */


function h5_utils(){
   var exports = {};

/**
 * 判断是否为空
 * null、undefined、空格 都返回true
 */
  exports.isBlank   = function(str){
      if(str == null || typeof(str) == 'undefined' || $.trim(str) == ''){
                return true;
            }
            return false;
  }
  
  exports.wrapColsure = function(o) {
            $.each(o, function(f) {
                if (typeof o[f] == 'function') {
                    o[f] = _.bind(o[f], o);
                }
            });
            return o;
        }
        
        
 // ~~~ md5 method begin ~~~
  exports.MD5 = function (string) {
     
        function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }
     
        function AddUnsigned(lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
     
        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }
     
        function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };
     
        function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        };
     
        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
     
            for (var n = 0; n < string.length; n++) {
     
                var c = string.charCodeAt(n);
     
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
     
            }
     
            return utftext;
        };
     
        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;
     
        string = Utf8Encode(string);
     
        x = ConvertToWordArray(string);
     
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
     
        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
        }
     
        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
     
        return temp.toLowerCase();
    }    

    return exports;
 

}

;
/**
* @Module : URI_MODULE
* @Desc	  : generate url in html(for <a/>), contains two parts:
*			 - common uri, used for generate normal url, just like login, logout ,register eg.
*			 - tool uri, used for generate url with parameters, can be used for generating any url. 
* 
*		  - configure exp.uri{} , set sysType (m or wapa or wpatest) from SYS_MODULE_CONFIG.sysType, 
			  it will be used for generate url sub domain.
*			  like : m.taobao.com or wapa.taobao.com or waptest.taobao.com
*		  - encode : if your value need be encoded , use encode(value) method.
* @author : yanyuan
* @date	  : 2012-03-16
*/



function h5Uri(){


		
		var config = Config();
		var tbh5   = h5_base();
		var exports = {};
	
		// configure options for M\WAPA\WAPTEST
		exports.uri = {
			protocol		: 'http://',
			sysType			: config.sysType || 'm',
			defaultDomain	: 'taobao'
		};
		
		var _domainWhiteList = ['taobao', 'tmall', 'etao', 'alibaba', 'alipay'];
		var _Domainholder = '${_serverDomain}';
		var _appendParams =['ttid','sprefer']; //续传参数key
		// waptest/wapa/m/wap.${_serverDomain}.com
		exports._serverHost	 = exports.uri.sysType + '.' + _Domainholder + '.com';
		
		// sub uri , can be extended
		exports.subUri = {
			index : exports.uri.protocol + exports._serverHost,
			// you can add ur uri here
		};
		
		// sid & tt & default url query str
		exports.ttQueryStr = "";
		
		// load 
		try {
		//	var defaultParams = JSON.parse(tbh5.get(tbh5.userInfoKey) || '{}') || {};
		//	var sid = defaultParams.sid;
		//	if (null != sid && '' != sid)
		//	{
		//		exports.ttQueryStr += ('sid=' + sid);
		//	}
		
		    //兼容老的代码保留
			var paramKeyValues = JSON.parse(tbh5.get(tbh5.paramKey) || '{}') || {};
			if (paramKeyValues.ttid && '' != paramKeyValues.ttid)
			{
				exports.ttQueryStr += ("&ttid=" + paramKeyValues.ttid);
			}
			//add ttid、sprefer
			for(i in _appendParams)
			{
			    var key = _appendParams[i];
			    var value =  tbh5.getQueryString(key);
			    if(value && value !='')
			    {
			     exports.ttQueryStr += ("&"+key+"=" + value);   
			    }
			}

	//		console.log(exports.ttQueryStr);
		} catch (e) {
			// do nothing
		}

		// ~~~ exportsort function begin ~~~
		
		/**
		* render tool: sub uri
		* @uri		[must]exports.subUri, you can add new configuration or extends this module to define new subUri
		* @target	[optional]pageName, just like 'index.htm'
		* @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
		* @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3' 
		* @domain	[optional]domainName, just like 'tmall', default is ${exports.uri.defaultDomain}
		*
		* you can use like :
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688},'shop','tmall');
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688},'shop');
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688});
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm');
			- URI_MODULE.renderURI(URI_MODULE.subUri.shopHost);
		*
		* error : URI_MODULE.renderURI();
		*/
		exports.renderURI = function (uri, target, param, path, domain) {
			return _render(buildUrl(_getServerHost(uri, domain), target, param, path));
		}
		
		/**
		* render tool: domain
		* @target	[optional]pageName, just like 'index.htm'
		* @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
		* @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3' 
		* @domain	[optional]domainName, just like 'tmall', default is ${exports.uri.defaultDomain}
		*
		* you can use like :
			- URI_MODULE.renderDomain('a.htm',{'a':3},'subPath','etao');
			- URI_MODULE.renderDomain('a.htm',{'a':3},'subPath');
			- URI_MODULE.renderDomain('a.htm',{'a':3});
			- URI_MODULE.renderDomain('a.htm'));
			- URI_MODULE.renderDomain();
		*/
		exports.renderDomain = function(target, param, path, domain) {
			return _render(buildUrl(_getServerHost(exports.subUri.index, domain), target, param, path));
		}
		
		/**
		* render tool: server
		* @target	[optional]pageName, just like 'index.htm'
		* @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
		* @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3' 
		* @server	[must]base url, like 'http://www.taobao.com/juhuasuan'
		* 
		* you can use like :
			- URI_MODULE.renderServer('detail.htm',{'id':3},'s1/s2','http://m.etao.com');
			- URI_MODULE.renderServer('detail.htm',{'id':3},'','http://m.etao.com/s1/s2');
			- URI_MODULE.renderServer('detail.htm',{},'','http://m.etao.com');
			- URI_MODULE.renderServer('',{},'','http://m.etao.com');
		*
		* error : URI_MODULE.renderServer('detail.htm',{'id':3},'s1/s2');
		*/
		exports.renderServer = function(target, param, path, server) {
			return _render(buildUrl(server, target, param, path));
		}
		
		// encode
		exports.encode = function(v) { return encodeURI(v); }
		
		// getStrParamFromJson
		exports.getStrParamFromJson = function (j) { return _getJsonStr(j); }
		
		// createURI for extends
		exports.createURI = function(name) {
			if (name === 'home') {
				return exports.uri.protocol + exports._serverHost;
			}else{
				return exports.uri.protocol + name + '.' + exports._serverHost;
			}
		}

		// ~~~ exportsort function end ~~~ //

		// --- private _method begin ---

		// add default queryString to url
		function _render (url) {
			if (null != exports.ttQueryStr && '' != exports.ttQueryStr)
			{
				var m = url.match("\\.[a-zA-Z]+\\?");
				if (null != m && 0 < m.length)
				{
					if (url.indexOf('?') == (url.length-1))
					{	
						url = url + exports.ttQueryStr;
					} else {
						url = url + '&' + exports.ttQueryStr;
					}
				} else {
					url = url + '?' + exports.ttQueryStr;
				}

				//console.log("render:",url);
			}

			return url;
		}

		// build url
		function buildUrl (base, target, param, folder) {
			if (!_checkIsBlank(folder)) {
				base += ('/' + folder);
			}
			
			if (!_checkIsBlank(target))
			{
				base += ('/' + target);
			}
			
			var havParam = false;
			if (null != param)
			{
				for (var k in param)
				{
					if (null != param[k])
					{
						havParam = true;
						break;
					}
				}
			}

			if (havParam)
			{
				base += ('?' + _getJsonStr(param));
			}
			return base;
		}

		// check domain is ok or not
		function _checkDomain (domain) {
			if (_checkIsBlank(domain))
			{
				return false;
			}

			for (var i=0;i<_domainWhiteList.length;i++)
			{
				if (_domainWhiteList[i].toLowerCase() == domain.toLowerCase())
				{
					return true;
				}
			}

			return false;
		}

		function _checkIsBlank(s) {
			return tbh5.checkIsBlank(s);
		}

		// get server host, replace ${PlaceHolder} with domain
		function _getServerHost(host, domain) {
			return host.replace(_Domainholder, function(){
				if (!_checkDomain(domain))
				{
					return exports.uri.defaultDomain;
				} else {
					return domain;
				}
			});
		}
		
		// change json object to json string
		function _getJsonStr (j) {
			var s = '';
			if (null == j)
			{
				return s;
			}

			for (var k in j)
			{
				if (null !=j[k] && ''!= j[k])
				{
					s += (k + '=' + encodeURIComponent(j[k]) + '&');
				}
			}
			
			if (''!=s && (s.length-1) == s.lastIndexOf('&'))
			{
				s = s.substr(0, s.length-1);
			}

			return s;
		}
		
		// --- private method end --- //

        return exports;

}
;
function uriBroker(){

	var uri =  h5Uri();
	var tbh5 = h5_base();

	var uriBroker1 = {};

	uriBroker1.URL_CONSTANTS = URL_CONSTANTS = {
		//可以继续定义一些通用的规则...
		path: {
			home: 'index.htm',
			home_wuliu: 'trade/bought_item_lists.htm',
			home_kehu: 'channel/act/other/kehufuwu.xhtml',
			home_anquan: 'channel/act/other/jiaoyianquan.xhtml',
			home_tiantiantejia: 'channel/act/sale/tiantiantejia.html',
			home_taojinbi: 'channel/act/taojinbi.html',
			home_help: 'channel/act/other/help.xhtml',
			home_msg: 'index_header_ajax.htm',
			my: 'myTaobao.htm',
			my_deliver: 'deliver/wap_deliver_address_list.htm',
			my_alipay: 'myAlipay.htm',
			my_bindalipay : 'alipay_modify.htm',
			my_viewitems:'view_items.htm',
			a: 'iITEM_ID.htm',
			a_td:'tdORDER_ID.htm',
			s: 'search.htm',
			s_history: 'history.htm',
			im: 'ww/ad_ww_lately_contacts.htm',
			im_icon:'ww/status.do',
			shop: 'shop/shop_index.htm',
			shop_search: 'shop/shop_auction_search.htm',
			login: 'login.htm',
			login_out: 'logout.htm',
			u_reg: 'reg/newUser.htm',
			fav: 'h5proxy-mid_fav.htm',
			auction1_cart: 'cart/my_cart.htm',

			info_jianyi: 'help/report.htm',
			h5_ww :'ww/index.htm',
			h5_myhome :'my/index.htm',
            h5_allspark :'we/index.htm',
            h5_mycart :'cart/index.htm',
			d:'my_bag.htm',
			triph5_order : 'myorder.html',
			caipiao_order : 'lottery/wap/user/my_lottery.htm',
			tm_pay:'order/baobeiPay.htm',
			auction1_refund:'refund/fill_refund.htm',
			tm_cancelOrder:'order/order_cancel.htm'
		},
		dps: {},
		app_param_key: tbh5.paramKey
	}

	/**
	 * module：对应于 URL_CONSTANTS 中的key，如果一个模块下面有多个功能名，那么module为模块名 + 功能名。
	 *   模块名的取名规则很简单
	 *     如 http://shop.m.taobao.com/shop/shop_index.htm?shop_id=****
	 *    那么模块名就位 shop , 对应与域名 shop.m.taobao.com.
	 *
	 *     如果店铺下面有2个功能模块，比如： http://shop.m.taobao.com/shop/shop_auction_search.htm
	 *    host依然为shop，但是为了区分各自不同的path，对应于URL_CONSTANTS.path , 我们可以把module定义为 shop_search
	 *
	 * param对应于对象，用于各个业务链接的参数
	 *    如：详情的 : {itemId:123456}
	 *        店铺的 : {shopId:123456}
     *
	 *       指向tmall域名的 {domain:'tmall'}
	 *       api 参数的 ：{
	 'method'		: 'queryColPromoGood',
	 'currentPage'	: currentPage,
	 'pageSize'		: pageSize,
	 'startRow'		: startRow
	 }
	 *
	 */
	uriBroker1.getUrl = function(module, param) {
		module = module.toLowerCase();
		param = param || {};
		var domain = param.domain;
		if (domain) {
			delete param.domain;
		} else {
			domain = "taobao";
		}

		var _modules = module.split("_");
		var host = uri.createURI(_modules[0]);
		if (!host) {
			throw "module param is not current,can't match any host";
		};

		var path = '';
		var dps = _getDps(module, param);
		switch (_modules[0]) {
		case "api":
			var _param = {};
			_param.data = JSON.stringify(param);
			//TODO  可以在此细分api的名字
			_.extend(_param, this.defaultMtopParam);
			param = _param;
			path = _getPath(module);
			break;
		default:
			//TODO multi path
			path = _getPath(module);
			path = _rebuildPath(path, param);
		}
		dps && (param['pds'] = dps);
		//encode url参数
		// for(key in param){
		// param[key] = encodeURIComponent(param[key]);
		// }
		return uri.renderURI(host, '', param, path, domain);

	}

	function _getPath(module) {
		if (URL_CONSTANTS.path[module]) {
			return URL_CONSTANTS.path[module];
		}
		var lastIndex_ = module.lastIndexOf('_');
		if (lastIndex_ < 0) {
			return "";
		};
		return _getPath(module.substring(0, lastIndex_));
	}

	//do special path


	function _rebuildPath(path, params) {
		//detail相关
		if (path == URL_CONSTANTS.path['a']) {
			path = path.replace("ITEM_ID", function() {
				var itemId = params.itemId;
				delete params.itemId;
				return itemId;
			});
		};
		if (path == URL_CONSTANTS.path['a_td']) {
			path = path.replace("ORDER_ID", function() {				
				var tradeId = params.tradeId;			
				delete params.tradeId;
				return tradeId;
			});
		};
		return (path || '');
	}

	uriBroker1.getDps = _getDps = function(module, param) {
		if (param['dps']) {
			return param['dps'];
		}

		var dps_key = module;
		var method = param.method;

		if (method) {
			dps_key += ("_" + method.toLowerCase());
		}
		//3级
		if (param._3th) {
			dps_key += "_3th";
			delete param._3th;
		}
		if (param.trigerType) {
			dps_key += ("_" + param.trigerType);
			delete param.trigerType;
		};

		return _getDpsParam(dps_key);
	}

	function _getDpsParam(module) {
		var dps = URL_CONSTANTS.dps[module];
		if (_.isString(dps)) {
			return dps;
		}
		//对象
		if (_.isObject(dps)) {
			var cacheName = dps.cache;
			if (dps.dps) {
				URL_CONSTANTS[cacheName] = dps.dps;
				return dps.dps;
			} else {
				if (cacheName) {
					return URL_CONSTANTS[cacheName];
				};
			}
		}
		if (!module || module.lastIndexOf("_") < 0) {
			return "";
		};
		module = module.substring(0, module.lastIndexOf("_"));
		return _getDpsParam(module);
	}

	return uriBroker1;

   
}
;
var win = $(window),

    T_float = [
        '<div class="c-float-popWrap msgMode hide">',
        '<div class="c-float-modePop">',
        '<div class="warnMsg"></div>',
        '<div class="content"></div>',
        '</div>',
        '</div>'
    ].join(''),

    E_float = $(T_float),
    E_floatMsg = E_float.find('.warnMsg'),
    E_floatContent = E_float.find('.content'),

    initDom = false,
    domContainer = '#tbh5v0',
    flashTimeoutId
    ;

function ModePop(options) {
    this._options = $.extend({
        mode:'msg',
        text:'网页提示',
        useTap:false
    }, options || {});

    this._init();
}

$.extend(ModePop.prototype, {
    _init:function () {
        var that = this,
            opt = that._options,
            mode = opt.mode,
            text = opt.text,
            content = opt.content,
            callback = opt.callback,
            background = opt.background,
            clickEvent = opt.useTap ? 'tap' : 'click';
        ;

        // set mode
        var classTxt = E_float.attr('class');
        classTxt = classTxt.replace(/(msg|alert|confirm)Mode/i, mode + 'Mode');
        E_float.attr('class', classTxt);

        // set background
        background && E_float.css('background', background);

        // set text & content
        text && E_floatMsg.html(text);
        content && E_floatContent.html(content);


        if (!initDom) {
            initDom = true;
            $(domContainer).append(E_float);            
            win.on('resize', function () {
                setTimeout(function () {
                    that._pos();
                }, 500);
            });
        }
    },

    _pos:function () {
        var that = this,
            doc = document,
            docEl = doc.documentElement,
            body = doc.body,
            top, left, cW, cH, eW, eH
            ;

        if (!that.isHide()) {
            top = body.scrollTop;
            left = body.scrollLeft;
            cW = docEl.clientWidth;
            cH = docEl.clientHeight;
            eW = E_float.width();
            eH = E_float.height();

            E_float.css({
                top:top + (cH - eH) / 2,
                left:left + (cW - eW) / 2
            });
        }
    },

    isShow:function () {
        return E_float.hasClass('show');
    },

    isHide:function () {
        return E_float.hasClass('hide');
    },

    _cbShow:function () {
        var that = this,
            opt = that._options,
            onShow = opt.onShow
            ;

        E_float.css('opacity', '1').addClass('show');
        onShow && onShow.call(that);
    },


    show:function () {
        var that = this
            ;

        if (flashTimeoutId) {
            clearTimeout(flashTimeoutId);
            flashTimeoutId = undefined;
        }

        if (!that.isShow()) {

            E_float.css('opacity', '0').removeClass('hide');
            that._pos();

            setTimeout(function () {
                that._cbShow();
            }, 300);
            setTimeout(function () {
                E_float.animate({'opacity':'1'}, 300, 'linear');
            }, 1);

        } else {
            that._cbShow();
        }
    },

    _cbHide:function () {
        var that = this,
            opt = that._options,
            onHide = opt.onHide
            ;

        E_float.css('opacity', '0').addClass('hide');
        onHide && onHide.call(that);
    },

    hide:function () {
        var that = this
            ;

        if (!that.isHide()) {
            E_float.css('opacity', '1').removeClass('show');

            setTimeout(function () {
                that._cbHide();
            }, 300);
            setTimeout(function () {
                E_float.animate({'opacity':'0'}, 300, 'linear');
            }, 1);

        } else {
            that._cbHide();
        }
    },

    flash:function (timeout) {
        var that = this
        opt = that._options
        ;

        opt.onShow = function () {
            flashTimeoutId = setTimeout(function () {
                if (flashTimeoutId) {
                    that.hide();
                }
            }, timeout);
        }

        that.show();
    }
});

window.notification = new function () {

    this.flash = function (text, bg, timeout) {
        if (arguments.length == 2) {
            if (typeof arguments[1] == 'number') {
                timeout = arguments[1];
                bg = undefined;
            }
        }

        var pop = new ModePop({
            mode:'msg',
            text:text,
            background:bg
        });

        pop.flash(timeout || 2000);
        return pop;
    }


};
/**
 * 一些通用方法，如跳转到登录页面
 * 
 * 
 * 
 */

function h5_common(){

    var exports = {};

    var uriBroker1    =  uriBroker();
    var    tbh5         =  h5_base(),
        tbcookie     = h5Cookie();

    /**
     * redirect to login
     * targetPath is configied at uriBroker
     * e.g:
     * toLogin('fav')
     *
     */
    var toLogin   =   function(targetPath){
        var redirectURL = uriBroker1.getUrl(targetPath);
        window.location.href = uriBroker1.getUrl('login',{'tpl_redirect_url':redirectURL});
    }

    var toTarget = function(targetPath) {
        if(targetPath && targetPath!='undefined')
        {
            window.location.href = uriBroker1.getUrl(targetPath);
        }
        window.location.href = 'http://m.taobao.com';
    }

    /**
     * deal common response
     * if back success ,callback seccussHandle
     *
     */
    exports.dealResponse = function(resp,seccussHandle,bizErrorHandle,targetPath,defaultPath,orginalResp)
    {
        var ret = resp.ret.toString().toUpperCase();

        if(ret.indexOf('SUCCESS::') > -1)
        {
            seccussHandle(resp);
        }
        //need login
        else
        {
            //set href hash to localStoary
            tbh5.set(tbh5.hrefHash,window.location.hash);
            //判断是否需要登录
            if(ret.indexOf('FAIL_SYS_SESSION_EXPIRED') > -1 || ret.indexOf('NEED_LOGIN::') > -1 || ret.indexOf('-100::') > -1 || ret.indexOf('NOT_FOUNT_USER::') > -1 || ret.indexOf('ERR_SID_INVALID::') > -1  || ret.indexOf('SID_ERROR::') > -1  )
            {
                //
                if(targetPath)
                {
                    toLogin(targetPath) ;
                }
                //redirect index
                else{
                    toLogin('home') ;
                }
            }
            else if(ret.indexOf('ILLEGAL_REQUEST::') > -1 || ret.indexOf('ILLEGAL_SIGN::') > -1) {
                if(!addRequestFailedTimes()) {
                    toTarget(defaultPath) ;
                }
                else if(bizErrorHandle)
                {
                    bizErrorHandle(orginalResp ? resp : ret);
                }
            }
            else if(bizErrorHandle)
            {
                bizErrorHandle(orginalResp ? resp : ret);
            }
        }
    }

    var addRequestFailedTimes = function () {
        var times = parseInt(tbh5.get(tbh5.appRequestFailed) || '0');
        if (3 <= times) {
            window.location.href = 'http://m.taobao.com?t=3';
            return true;
        }
        times += 1;
        tbh5.set(tbh5.appRequestFailed, times);
        return false;
    }

    /**
     * decide wether support my h5 application
     * currently,just determine localStorage and applicationCache
     * e.g:
     * isSupportH5
     */
    exports.isSupportH5   = function(){
        if(window.localStorage == 'undefined')
        {
            return false;
        }
        else if(window.applicationCache == 'undefined')
        {
            return false;
        }
        return true;
    }

    /**
     * 从cookie中获取用户nick
     *  未登录时返回空
     */
    exports.getNickFromCookie  = function(){
        var userNick = tbcookie.getCookie('_w_tb_nick');
        if (userNick && userNick.length > 2  && userNick != 'null')
        {
            return userNick;
        }
        return '';
    }

    /**
     * 从隐藏域获取nick
     * @return {*}
     */
    exports.getNickFromHidden  = function(){
        var userNick =$('#J_user_nick').val();
        if (userNick)
        {
            return userNick;
        }
        return '';
    }

    /**
     * 判断用户是否登录
     * 通过cookie中的标示判断
     */
    exports.isLogin  = function(){

        var imewweoriw = tbcookie.getCookie('imewweoriw');

        return imewweoriw && decodeURIComponent(imewweoriw).length > 32 ;

        /**
         var userNick = this.getNickFromCookie() ;
         if(userNick && userNick != '')
         {
         return true;
         }
         else
         {
         return false;
         }
         **/
    }

    /**
     * 跳转登录
     * @param targetPath
     */
    exports.goLogin   =   function(targetPath){

        targetPath = targetPath || 'home';
        toLogin(targetPath) ;
    }
    exports.isSuppWebp = function(){
        return 'true' == tbcookie.getCookie('supportWebp') ;
    }


    return exports;
}

;
//h5 api
/**
 * localstoary 的一些操作
 */



function h5_base(){



    var exports = {};

    //paramKey
    exports.paramKey = 'h5_paramKey';
    exports.targetUrl = 'h5_targetUrl';
    //userinfoKey
    exports.userInfoKey = 'h5_userInfoKey';
    //href hash
    exports.hrefHash = '_hash';
    //last href hash
    exports.lastHash = '_lastHash';
    // for token
    exports.appKey = 'h5_app_key';
    exports.appToken = 'h5_app_token';
    exports.appRefreshToken = 'h5_app_ref_token';
    exports.appTokenExpired = 'h5_app_token_expired';
    exports.appTokenBetween = 'h5_app_token_between';
    exports.appTokenSaveTime = 'h5_app_token_save_time'; //存储localstoary time
    exports.appRequestFailed = 'h5_app_request_failed_tag';

    // Extend a given object with all the properties in passed-in object(s).
    function extend(obj) {
        var args = Array.prototype.slice.call(arguments, 1);
        for(var i = 0, len = args.length; i < len; i++) {
            for(var prop in args[i]) {
                obj[prop] = args[i][prop];
            }
        }
        return obj;
    };
     //类似于map的set方法，如果value不是string对象，会用JSON.stringify转化为string，存储到本地
    exports.set = function(key, value) {
        if(this.isSuppLocalStorage()) {
            if( typeof (value) != "string") {
                value = JSON.stringify(value);
                // JSON.parse
            };
            try{
            window.localStorage.setItem(key, value);
            return true;
            }
            catch(e)
            {

            }
        }
        return false;
    }

    exports.add = function(key, value) {
        if(this.isSuppLocalStorage()) {
            if( typeof (value) == "string") {
                value = JSON.parse(value);
            } else {
                // JSON.parse
                try {
                    extend(value, JSON.parse(getValue(key)));
                } catch(e) {
                  //  console.log(e);
                }
                value = JSON.stringify(value);
            }
            window.localStorage.setItem(key, value);
            return true;
        }
        return false;
    }
    //简单的做了一个window.localStorage.getItem 映射
    exports.get = getValue = function(key) {
        if(this.isSuppLocalStorage()) {
            return window.localStorage.getItem(key);
        }
        return null;
    }
    //简单的做了一个window.localStorage.getItem 映射
    exports.removeValue = function(key) {
        if(this.isSuppLocalStorage()) {
            return window.localStorage.removeItem(key);
        }
    }
    //清除所有localStorage
    exports.clearAll = function() {
        if(this.isSuppLocalStorage()) {
            return window.localStorage.clear();
        }
    }
    /**
     * 判断是否从cache中取hash
     * 如果当前请求没有hash则从localstoary中取，否则如果请求带hash保存当前hash到localstoray中
     */
    exports.userCacheHash = function(webappName) {
        //如果没有hash，从localStoray中取上一次的hash
        var key = webappName || 'h5';
        var lastKey = key + this.lastHash;
        var hashkey = key + this.hrefHash;

        if(!location.hash && this.get(hashkey)) {
            location.hash = this.get(hashkey);
            return true;
        }
        //save current hash to cache
        else if(location.hash) {
            //记录上一个hash
            if(this.get(hashkey) != location.hash)
            this.set(lastKey,this.get(hashkey) || '');
            this.set(hashkey, location.hash);
        }
        return false;
    }
    /**
     * 返回上一个hash
     */
    exports.getLastHash = function(webappName,defaultHash) {
        return this.get((webappName || 'h5') + this.lastHash) || defaultHash || '';
    }

    //获取指定参数值
    exports.getParamFromStorage = function(key) {
        try {
            return JSON.parse(this.get(this.paramKey))[key];
        } catch(ex) {
            //
        }
        return null;

    }
    //获取指定参数值
    exports.getUserProFromStorage = function(pro) {
        try {
            return JSON.parse(this.get(this.userInfoKey))[pro];
        } catch(ex) {
            //
        }
        return null;
    }
    //当前时间与服务器当前时间比较
    //如果不传系统时间则返回缓存中的时间差
    exports.getBetweenTime = function(currentSeverTime) {
        if(currentSeverTime)
        {
        var betTime = (new Date()).getTime() - currentSeverTime;
        this.set(this.appTokenBetween,betTime);
        return betTime;
        }
        else
        {
        return parseInt(this.get(this.appTokenBetween) || 0 );
        }
    }

    exports.checkIsBlank = function(s) {
        return null == s || '' == s;
    }
    //判断是否登录
	/**以废弃，用h5_common 中的isLogin**/
    exports.isLogin = function() {
        var nick = this.getUserProFromStorage('nick');

        if(nick == '' || nick == null) {
            return false;
        } else {
            return true;
        }
    }

    //删除token
    exports.removeToken = function () {
            try {
                this.removeValue(this.appToken);
                this.removeValue(this.appRefreshToken);
                this.removeValue(this.appTokenExpired);
                this.removeValue(this.appTokenBetween);
                this.removeValue(this.appTokenSaveTime);
                } catch (e) {

            }

    }
    //获取Url参数,不传key返回所有参数
    exports.getQueryString = function(paramKey){
       var paramStr=location.search;
       if(paramStr.length < 1 )
       {
         return "";
       }
       paramStr=paramStr.substr(1);
       var params = paramStr.split('&');
       var queryString={};
       for(i in params)
       {
         var aparam = params[i].split('=');
         queryString[decodeURIComponent(aparam[0])] = decodeURIComponent(aparam[1]) ;
       }

       if (paramKey)
       {
           return queryString[paramKey];
       }
       else
       {
           return queryString;
       }

    }

	  /***
	  *判断是否客户端请求
	  * 目前判断标准是是否含有ttid参数并且参数中包含'@'字符
	  * return true or false
	  ***/
	 exports.isClient = function(){
		var ttid = this.getQueryString('ttid');

		 return ttid && ttid.indexOf('@') > -1 ;

	 }

     exports.isAndroidClient = function() {
        var ttid = this.getQueryString('ttid')
        return ttid && ttid.toLowerCase().indexOf('android') > -1
     }

    /**
     * 判断是否支持localStorage，并且开启
     * 否则返回false
     */
    exports.isSuppLocalStorage= function(){
        try
        {
        if(window.localStorage == 'undefined')
        {
            return false;
        }
        else{
            var key = 'testSupportKey';
            window.localStorage.setItem(key,'1');
            var value =  window.localStorage.getItem(key);
            window.localStorage.removeItem(key);
            return '1' == value;
        }
        }
        catch(e)
        {}
        return false;
     }

     

     return exports;
}
;

 function mtop_h5_chunk(){

    // require module
    var  h5comm = h5_common();
    var exports = {};

    var _supported;
    exports.isXhr2 = function () {
        if (undefined === _supported) {
            _supported = $.ajaxSettings.xhr().upload;
        }
        return _supported;
    }

    exports.appPath = undefined;
    exports.chunkAjax = function (options, path) {
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]
        var xhr = $.ajaxSettings.xhr(),
            abortTimeout,
            abort = function () {
                xhr.abort();
                abortTimeout && clearTimeout(abortTimeout);
            },
            processedIndex = 0,
            locked = false,
        //有并发的风险
            chunkProcess = function (txt) {
                if (locked) {
                    return
                }
                var processingTxt = txt.substr(processedIndex);
                var lenIndex = processingTxt.search(/\d+/);
                if (lenIndex < 0) {
                    return
                }
                var lenStr = processingTxt.match(/\d+/)[0];
                var chunkLength = (lenStr.length + parseInt(lenStr) + lenIndex);

                if (processingTxt.length >= chunkLength) {
                    locked = true;
                    var chunkPart = processingTxt.substr(lenStr.length + lenIndex, parseInt(lenStr));
                    //TODO bussiness!
                    var data, error;
                    try {
                        data = JSON.parse(chunkPart);
                    } catch (e) {
                        error = e
                    }
                    var context = settings.context;
                    if (error) {
                        abort();
                        settings.error.call(this, error);
                    } else {
                        //处理正常的返回
                        h5comm.dealResponse(data, function (result) {
                                settings.success.call(context, result);
                            }, function (result) {
                                settings.error.call(this, result);
                            },
                            exports.appPath, '', true
                        );
                    }
                    processedIndex += chunkLength;
                    locked = false;
                }
                if (xhr.responseText.length >= processedIndex) {
                    chunkProcess(xhr.responseText);
                }
            };
        if (!xhr.upload) {
            console.log("un support xhr2");
            return false;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    chunkProcess(xhr.responseText, true);
                } else {
                    abort();
                }
            } else if (xhr.readyState == 3) {
                chunkProcess(xhr.responseText);
            }
        };
        xhr.open(settings.type, settings.url, true);
        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
        if (settings.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = function () {
            };
            xhr.abort();
        }, settings.timeout);
        xhr.send(settings.data ? settings.data : null);
        return xhr
    }

     return exports;

 }
;
/**
 * 简化 h5APi 的调用
 * 前提：
 *   调用之前当前文档必须包含一个J_app_key的AppKey隐藏字段
 * 一般直接调用
 * getApi(
 *     api, 如：mtop.logistic.getlogisticbyorder
 *      v, 1.0
 *      data,  {'orderId':148697349962715}
 *  extParam,  {'pds':'seeflow#order'}
 *  callback,
 *  errorback
 * );
 *
 */



function mtop_h5api(){

    // require module
    var exports = {},
        cookie = h5Cookie(),
        utils = h5_utils(),
        h5base = h5_base(),
        uri = h5Uri(),
        app_key_id = 'J_app_key',
       apiType = 'h5ApiUpdate.do',     /// why
    //    apiType = 'h5Api.do'
        tokenKey = "_m_h5_tk",
        mtopH5Chunk = mtop_h5_chunk(),
        chunkApiType = 'bigPipe.do',
        failTimes = 0,
        maxFailTimes = 5,
        isOnExcute = false;
        callQue=[];
    // ~~~ public method begin ~~~
   /**
     *H5 mtop 接口
     * 主流程：
     * 1、如果业务接口调用失败，返回token为空或失效会在发送一次请求，同时失败次数增加1次，最大失败5次，成功后清理
    *  2、
     *
     */
    exports.getApi = function (api, v, data, extParam, callback, errorback) {
        var isChunk = ( data && !!data.apis);
        //chunk request,add by wuzhong +2013.2.27
        if (isChunk) {
            extParam.entrance = "h5";
            extParam.apis = typeof (data.apis) == "string" ? data.apis : JSON.stringify(data.apis);
        } else {
            extParam.api = api;
            extParam.v = v || "*";
            extParam.data = typeof (data) == "string" ? data : JSON.stringify(data);
        }
        var url = uri.renderURI(uri.createURI('api'), isChunk ? chunkApiType : apiType, extParam, 'rest');
        //目前对于非客户端请求统一用h5的ttid，等服务端修改后删除这个
        /**********************start*********************/
        var ttid = h5base.getQueryString('ttid');
        if (ttid && ttid.indexOf('@') == -1 )
        {
            url = url.replace(/ttid=[^&]+/,'ttid=taobao_h5_1.0.0') ;
        }
        else if(!ttid)
        {
            url = url + '&ttid=taobao_h5_1.0.0'  ;
        }
        /**********************end*********************/


        //线上要走9999端口
        ( 0 == url.indexOf("http://api.m.taobao.com" && isChunk)) && (url = url.replace("taobao.com", "taobao.com:9999"));
        var app_key = document.getElementById(app_key_id).value;
         callQue.push({url:url, app_key:app_key, data:extParam.data,callback:callback,errorback:errorback});
         if(!isOnExcute)
         {
          isOnExcute=true;
          exceutCall();
         }
    }


    /**
     * 发送业务请求
     * 1、如果返回超时会清楚localStoary
     *
     */
    var _send = function (url, app_key, data, callback, errorback) {
        var app_token = (cookie.getCookie(tokenKey) || '').split('_')[0];
     //   console.log(cookie.getCookie(tokenKey) + "|"+cookie.getCookie(tokenKey+"_enc"));
      //   app_token ='cf84fac3e1bd03f673e5436461607e8e';

        var sendUrl = _createSignUrl(url, app_key, app_token, data);
        //		console.log('use token send : ' + app_token+";url="+url);
        var options = {
            type:'GET',
            url:sendUrl,
            timeout:20000,
            success:function (result) {
                // if token is expired, low percent event.
                var ret = (result.ret ? result.ret : "").toString();
                //如果是token过期重新发送请求
                //如果成功failTimes为0
                if(-1 != ret.indexOf('SUCCESS::'))
                {
                    failTimes = 0;
                }
                else
                {
                if(-1 != ret.indexOf('TOKEN_EMPTY::')  || -1 != ret.indexOf('TOKEN_EXOIRED::')) {
                  if(failTimes < maxFailTimes)
                    {
                      _send(url, app_key,  data, callback, errorback);
                      return ;
                    }
                    else
                    {
                        cookie.delCookie(tokenKey);
                        console.log('try exceed times');
                    }
                }
                }
                if (callback) {
                    callback(result);
                }
                exceutCall();

            },
            error:function (error) {
                if (errorback) {
                    errorback(error);
                }
                exceutCall();
            },
            complete:function (xhr, status) {
                if (status != 'success' && errorback) {
                    errorback(status);
                }
                exceutCall();
            }
        };
        (isBigPipeRequest(url) ) ? mtopH5Chunk.chunkAjax(options) : $.ajax(options);
    }

    /**
     *执行队列方法
     */
    var exceutCall = function(){
        if(callQue.length > 0 )
        {
            var param = callQue.pop(0);
            _send(param.url, param.app_key,  param.data, param.callback, param.errorback);
        }
        else
      {
       isOnExcute=false;
      }

    }

    var _createSignUrl = function (url, app_key, app_token, data) {
        var t = (new Date()).getTime();
        return _addJsonParam(url) + '&appKey=' + app_key + '&sign=' + _sign(app_key, app_token, t, data)+  '&t=' + t;
    }

    var _addJsonParam = function (url) {
        if (-1 == url.indexOf('callback=') && !isBigPipeRequest(url)) {
            var index = url.indexOf('?');
            return url.substr(0, index) + '?callback=?&type=jsonp&' + url.substr(index + 1, url.length);
        }
        else {
            return url;
        }
    }

    var _sign = function (app_key, app_token, t, data) {
       /**
        app_token='1a28b3ff2654ed91e22f9184c25f2b89'
        t=1362568219069;
        app_key=4272;
        data='{"curPage":1,"pageSize":5,"order":"fans"}';
        **/
        var signTemp = app_token + '&' + t + "&" + app_key + "&" + data;
       //  console.log('原串：'+signTemp);
        signTemp = utils.MD5(signTemp);
       // console.log('签名串：'+signTemp);
         return signTemp;
    }

    exports.addApi = function (api, v, data, extParam, callback, errorback) {
        var ApiReq = {
            apis:[
                {api:api, v:v, data:data}
            ],
            succ:{}, error:{},
            addApi:function (api, v, data, extParam, callback, errorback) {
                this.apis.push({api:api, v:v, data:data});
                this.succ[api] = callback;
                this.error[api] = errorback;
                return this;
            },
            execute:function (xhr2) {
         //       console.log(this);
                function jsonpApi(oneApi) {
                    exports.getApi(oneApi.api, oneApi.v, oneApi.data, {}, this.succ[oneApi.api], this.error[oneApi.api]);
                }

                //如果是xhr2
                if (xhr2 && mtopH5Chunk.isXhr2()) {
                    if (1 == this.apis.length) {
                        jsonpApi.call(this, this.apis[0]);
                    } else {
                        var self = this;
                        exports.getApi("", "", {apis : self.apis}, {}, function (result) {
                            result.api && self.error[result.api] && self.error[result.api].call(this, result);
                        }, function (result) {
                            result.api && self.error[result.api] && self.error[result.api].call(this, result);
                        });
                    }
                } else {
                    //走老的api方式!
                    var self = this;
                    this.apis.forEach(function (oneApi) {
                        jsonpApi.call(self, oneApi);
                    });
                }

            }
        };
        ApiReq.succ[api] = callback;
        ApiReq.error[api] = errorback;
        return ApiReq;
    }
    // ~~~ public method end ~~~
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---//
    function isBigPipeRequest(url) {
        return url.indexOf("bigPipe.do?") > 0;
    }

    return exports;


}



(function(app,undefined){

    app.mtopH5Api = mtop_h5api();

})(window['app']);



(function (app, undef) {

    var win = window,
        isAndroid = (/android/gi).test(navigator.appVersion),
        resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    app.Util = {

        Events:function (el, events) {
            var self = this;
            $(el).unbind();
            for (var key in events) {
                var method = this[events[key]];
                if (!method) throw new Error('Event "' + events[key] + '" does not exist');
                var match = key.match(/^(\S+)\s*(.*)$/);
                var eventName = match[1], selector = match[2];
                if (selector === '') {
                    return;
                } else {
                    $(el).on(eventName, selector, (function(method) {
                        return function(e) {
                            method.call(self, e , this);
                        }
                    })(method));
                }
            }
        },

        getWebpImg : function(url,size){  //处理图片后缀
            if(!url) return;
            size = ['_' , (size || '300x300') , '.jpg'].join('');
            /*var arr = url.split('_.'),
             src = arr[0].replace(/_\d+x\d+\.jpg?/g,''),  //去掉存在的后缀_100x100.jpg
             suffix = arr[1],
             isWebp = suffix && suffix.toLowerCase() == 'webp';
             src += size;
             return isWebp && (src + '_.webp') || src;*/
            var arr = url.lastIndexOf('_.'),  //查找最后一个，url中可能存在_.
                last = arr != -1 ? url.slice(arr+2) : null,  //取到_.后的字符串
                isWebp = last && last.toLowerCase() == 'webp' ? true : false,  //是否webp
                newurl = isWebp ? url.slice(0,arr) : url,
                src = newurl.replace(/_\d+x\d+\.jpg?/g,'');  //去掉存在的后缀_100x100.jpg
            src += size;
            return isWebp && (src + '_.webp') || src;
        },


        timeout : 30000,
        resize : function(callback){  //旋转
            win.addEventListener(resize,function(){
                setTimeout(function(){
                    callback();
                },isAndroid ? 200 : 0);
            },false);
        },
        getActualSize : function(el,callback){  //获取el真实宽高
            el.css({'position':'absolute','width':'100%','left':-20000,'top':-20000}).removeClass('none');
            callback();
            el.css({'position':'static','width':'auto','left':0,'top':0}).addClass('none');
        },
        encode : function(str){
            return encodeURIComponent(str);
        },
        sendPoint : function(pds){  //埋点
            /*var beacon = new Image();
             beacon.src = logURL + '?pds=' + pds;
             beacon.onload = beacon.onerror = function(){
             beacon.onload = beacon.onerror = null;
             beacon = null;
             }*/
            var host = this.fetchHost(),
                logURL = 'http://a.'+host+'.taobao.com/ajax/pds.do';
            $.ajax({
                url : logURL,
                type : "get",
                dataType : 'jsonp',
                data : { pds : pds , t:new Date().getTime()}
            });
        },


        storage : {
            get : function(key){
                try{
                    return localStorage.getItem(key);

                }catch(e){
                    return null;
                }
            },
            set : function(key,value){
                try{
                    localStorage.setItem(key,value);
                }catch(e){
                    console.log('localstorage异常');
                }
            }
        },
        pointJudge : function(str){  //宝贝积分判断
            if(!str) return str;
            var tarr = str.split('-');
            return (tarr.length > 1 && tarr[0] == tarr[1]) ? tarr[0] : str;
        }


    }

    app.ZDMData = {};
    app.ZDMDetail = {}; //global data for zdm detail
    app.helper = {};

})(window['app']);



    var PageNav = function Page(options) {
        this.init(options);
    }

    PageNav.prototype = {
        setIndex:function (pageIndex) {
            var _self = this;
            pageIndex = Number(pageIndex);
            if (isNaN(pageIndex)) {
                pageIndex = 1;
            }
            if (pageIndex > _self.pageCount) {
                pageIndex = _self.pageCount;
            }
            if (pageIndex <= 0) {
                pageIndex = 1;
            }
            _self.index = pageIndex;
            _self.renderPage();
        },
        init:function (options) {
            if (!this.$container) {
                this.$container = $(options.id);
            }
            this.index = Number(options.index ? options.index : 1);
            this.pageCount = Number(options.pageCount ? options.pageCount : 1);
            this.preFix = options.preFix ? options.preFix : '!page/';
            this.objId = options.objId ? options.objId : 'Z';    //单页面单控件显示'Z'
            this.disableHash = options.disableHash//hash不变功能支持
            this.oldIndex = -1;                 //避免部分android机器select相同选择也会触发change事件
            var length = this.preFix.toString().length;
            if (this.preFix[length - 1] != '/') {
                this.preFix += '/';
            }

            if (isNaN(this.index)) {
                this.index = 1;
            }
            if (this.index > this.pageCount) {
                this.index = this.pageCount;
            }
            if (this.index <= 0) {
                this.index = 1;
            }
            this.createDom();
            this.eventAttach();
            this.parseHash();
            this.renderPage();

        },
        parseHash:function () {
            //获取hash(一个页面多个分页控件)
            var _self = this,
                hashValue = location.hash,
                currHash = hashValue.substr(hashValue.lastIndexOf('/') + 1),
                hashArr = [],
                index = 0,
                mixArr = [];

            hashArr = currHash.split('-');

            for (var i = 0; i < hashArr.length; i++) {
                mixArr = hashArr[i].split('');
                var objId = mixArr.shift();
                if (objId == this.objId) {
                    index = Number(mixArr.join(''));
                    if (isNaN(index) || index <= 0) {
                        _self.index = 1;
                    }
                    if (index > _self.pageCount) {
                        _self.index = _self.pageCount;
                    }

                    _self.index = index;
                }
            }
        },
        setContainer:function (containerId) {
            this.$container = $(containerId);
        },
        getObjId:function () {
            return this.objId;
        },
        changeHash:function () {
            var _self = this,
                hashVal = location.hash;
            if (hashVal == '') {
                location.hash = _self.preFix + '-' + _self.objId + _self.index;
            }
            else {
                var begin = hashVal.lastIndexOf(_self.objId),
                    end = begin;
                if (begin == -1) {
                    location.hash += '-' + _self.objId + _self.index;
                }
                else {
                    while (true) {
                        end++;
                        if (hashVal[end] == '-' || !hashVal[end]) break;
                    }
                    hashVal = hashVal.replace(hashVal.substring(begin, end), _self.objId + _self.index);
                    location.hash = hashVal;
                }
            }
        },
        createDom:function () {

            var _self = this;
            _self.$container.empty();
            var htmlArr = [
                '<section class="c-p-sec">',
                '<div class="c-p-pre">',
                '<span class="c-p-p">',
                '<em></em>',
                '</span><a>上一页</a>',
                '</div>',
                '<div class="c-p-cur">',
                '<div class="c-p-arrow c-p-down"><span></span><span></span></div>',
                '<select class="c-p-select">',
                '</select></div>',
                '<div class="c-p-next">',
                '<a>下一页</a><span class="c-p-p">',
                '<em></em>',
                '</span>',
                '</div>',
                '</section>'
            ];
            _self.$container.html(htmlArr.join(''));

            $('select', _self.$container).empty();
            htmlArr = [];
            for (var index = 1; index <= _self.pageCount; index++) {
                htmlArr[index - 1] = '<option>第' + index + '页</option>';
            }
            $('select', _self.$container).append(htmlArr.join(''));

        },
        renderPage:function () {
            var _self = this,
                selectLen = $('option', _self.$container).length ,
                $lastPage = $('.c-p-pre', _self.$container),
                $nextPage = $('.c-p-next', _self.$container);

            if (selectLen <= 1) {
                $lastPage.addClass('c-p-grey');
                $nextPage.addClass('c-p-grey');
                selectLen = 1;
            }
            else {
                if (_self.index == 1) {
                    $lastPage.addClass('c-p-grey');
                    if (selectLen > 1) {
                        $nextPage.removeClass('c-p-grey');
                    }
                }
                else if (_self.index == selectLen) {
                    $nextPage.addClass('c-p-grey');
                    if (selectLen > 1) {
                        $lastPage.removeClass('c-p-grey');
                    }
                }
                else {
                    if (_self.index > 1 && _self.index < selectLen) {
                        $lastPage.removeClass('c-p-grey');
                        $nextPage.removeClass('c-p-grey');
                    }
                }
            }

            var pageText = _self.index + '/' + selectLen;
            $('.c-p-arrow span:first-child', _self.$container).text(pageText);
            $('select', _self.$container).get(0).selectedIndex = this.index - 1;

            $lastPage = null;
            $nextPage = null;
        },
        //解绑定完全可以有更优雅的方式，涉及应用有点多，挫了。。。
        eventDetach:function () {
            var _self = this,
                $$container = $(_self.$container);
            //Modify arrow.
            $$container.undelegate('select', 'mousedown', _self.modifyArr);

            $$container.undelegate('select', 'blur', _self.blur);

            //last page
            //此种方式修改为了修复ios下的焦点反馈变大问题。改动最小。。
            $$container.find('.c-p-pre').undelegate('a', 'click', _self.lastPage);

            //next page
            $$container.find('.c-p-next').undelegate('a', 'click', _self.nextPage);

            //select change.
            $$container.undelegate('select', 'change', _self.selectChange);

            $$container = null;
        },
        eventAttach:function () {
            var _self = this,
                $$container = $(_self.$container);
            //Modify arrow.
            $$container.delegate('select', 'mousedown', _self.modifyArr = function (e) {
                //修改箭头
                $('.c-p-arrow', _self.$container).removeClass('c-p-down').addClass('c-p-up');
            });

            $$container.delegate('select', 'blur', _self.blur = function (e) {
                //修改箭头
                $('.c-p-arrow', _self.$container).removeClass('c-p-up').addClass('c-p-down');
            });

            //last page
            $$container.find('.c-p-pre').delegate('a', 'click', _self.lastPage = function (e) {
                e.preventDefault();

                if ($(this).parent().hasClass('c-p-grey')) {
                    return false;
                }
                else {
                    _self.index--;
                    _self.renderPage();

                    if (!_self.disableHash) {
                        //锚点
                        _self.changeHash();
                    }
                    else {
                        _self.$container.trigger('P:switchPage', {index:_self.index,type:'pre'});
                    }
                }

                _self.oldIndex = _self.index;

            });

            //next page
            $$container.find('.c-p-next').delegate('a','click', _self.nextPage = function (e) {
                e.preventDefault();

                if ($(this).parent().hasClass('c-p-grey')) {
                    return false;
                }
                else {
                    _self.index++;
                    _self.renderPage();


                    if (!_self.disableHash) {
                        //锚点
                        _self.changeHash();
                    }
                    else {
                        _self.$container.trigger('P:switchPage', {index:_self.index,type:'next'});
                    }
                }
                _self.oldIndex = _self.index;
            });

            //select change.
            $$container.delegate('select', 'change', _self.selectChange = function () {
                _self.index = $(this).get(0).selectedIndex + 1;
                if (_self.oldIndex == _self.index) {
                    return;
                }
                _self.renderPage();
                //修改箭头
                $('.c-p-arrow', _self.$container).removeClass('c-p-up').addClass('c-p-down');

                if (!_self.disableHash) {
                    //锚点
                    _self.changeHash();
                }
                else {
                    _self.$container.trigger('P:switchPage', {index:_self.index,type:'select'});
                }

                _self.oldIndex = _self.index;
            });
        },
        pContainer:function () {
            return this.$container;
        }
    };

/*
 * Swipe 1.0
 *
 * Brad Birdsall, Prime
 * Copyright 2011, Licensed GPL & MIT
 *
*/


window.Swipe = function(element, options) {

  // return immediately if element doesn't exist
  if (!element) return null;

  var _this = this;

  // retreive options
  this.options = options || {};
  this.index = this.options.startSlide || 0;
  this.speed = this.options.speed || 300;
  this.callback = this.options.callback || function() {};
  this.delay = this.options.auto || 0;
  this.vertical = !!this.options.vertical;
  this.preload = this.options.preload;
  this.lazyloadClass = this.options.lazyloadClass || 'lazy';
  this.lazyloadDataAttr = this.options.lazyloadDataAttr || 'src';
  this.fixWidth = this.options.fixWidth;  //not to calculate the container width

  // reference dom elements
  this.container = element;
  this.element = this.container.children[0]; // the slide pane

  // static css
  this.container.style.overflow = 'hidden';
  this.element.style.listStyle = 'none';
  this.element.style.marginLeft = "58px";

  // trigger slider initialization
  this.setup();

  // begin auto slideshow
  this.begin();

  // add event listeners
  if (this.element.addEventListener) {
    this.element.addEventListener('touchstart', this, false);
    this.element.addEventListener('touchmove', this, false);
    this.element.addEventListener('touchend', this, false);
    this.element.addEventListener('webkitTransitionEnd', this, false);
    this.element.addEventListener('msTransitionEnd', this, false);
    this.element.addEventListener('oTransitionEnd', this, false);
    this.element.addEventListener('transitionend', this, false);
    window.addEventListener('resize', this, false);
  }

};

Swipe.prototype = {

  setup: function() {

    // get and measure amt of slides
    this.slides = this.element.children;
    this.length = this.slides.length;

    // return immediately if their are less than two slides
    if (this.length < 2) return null;

    // determine width of each slide

    this.width = this.fixWidth || (Math.ceil(("getBoundingClientRect" in this.container) ? this.container.getBoundingClientRect().width : this.container.offsetWidth));

    // return immediately if measurement fails
    if (!this.width) return null;

    // hide slider element but keep positioning during setup
    this.container.style.visibility = 'hidden';

    // dynamic css
    if (this.vertical) {
      this.element.style.height = Math.ceil(this.slides.length * 60) + 'px';
    } else {
      this.element.style.width = Math.ceil(this.slides.length * this.width) + 'px';
      var index = this.slides.length;
      while (index--) {
        var el = this.slides[index];
        el.style.width = this.width + 'px';
        el.style.display = 'table-cell';
        el.style.verticalAlign = 'top';
      }
    }


    // set start position and force translate to remove initial flickering
    this.slide(this.index, 0);

    // show slider element
    this.container.style.visibility = 'visible';

  },

  slide: function(index, duration) {

    var style = this.element.style;

    // fallback to default speed
    if (duration == undefined) {
        duration = this.speed;
    }

    // set duration speed (0 represents 1-to-1 scrolling)
    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';

    // translate to given index position
    if (this.vertical) {
      style.MozTransform = style.webkitTransform = 'translate3d(0, ' + -(index * 60) + 'px,0)';
      //style.msTransform = style.OTransform = 'translateX(' + -(index * this.width) + 'px)';
    } else {
      style.MozTransform = style.webkitTransform = 'translate3d(' + -(index * this.width) + 'px,0,0)';
      style.msTransform = style.OTransform = 'translateX(' + -(index * this.width) + 'px)';
    }

    // set new index to allow for expression arguments
    this.index = index;

    if (this.vertical) {
      if (this.index < 0) this.index = 0;
      if (this.index > this.length - 4) this.index = this.length - 4;
      style.MozTransform = style.webkitTransform = 'translate3d(0, ' + -(this.index * 60) + 'px,0)';
    }

  },

  getPos: function() {

    // return current index position
    return this.index;

  },

  prev: function(delay) {

    // cancel next scheduled automatic transition, if any
    this.delay = delay || 0;
    clearTimeout(this.interval);

    // if not at first slide
    if (this.index) this.slide(this.index-1, this.speed);

  },

  next: function(delay) {

    // cancel next scheduled automatic transition, if any
    this.delay = delay || 0;
    clearTimeout(this.interval);

    if (this.index < this.length - 1) this.slide(this.index+1, this.speed); // if not last slide
    else this.slide(0, this.speed); //if last slide return to start

  },

  begin: function() {

    var _this = this;

    this.interval = (this.delay)
      ? setTimeout(function() {
        _this.next(_this.delay);
      }, this.delay)
      : 0;

  },

  stop: function() {
    this.delay = 0;
    clearTimeout(this.interval);
  },

  resume: function() {
    this.delay = this.options.auto || 0;
    this.begin();
  },

  load: function() {
    if (!this.preload) return;
    var self = this;

    for (var i = 0; i < this.preload; i++) {
      (function() {
        if (self.index + i < self.length) {
          var slide = self.slides[self.index + i];
          if (!slide.getAttribute('loaded')) self._loadImages(slide);
        }
      })()
    }
  },

  _loadImages: function(slide) {
    var images = slide.querySelectorAll('img.' + this.lazyloadClass);
    for (var i = 0; i < images.length; i++) {
      (function() {
        var j = i, img = new Image;
        img.onload = function() {
          images[j].src = this.src;
          slide.setAttribute('loaded', true);
        };
        // TODO img.onerror for 404s
        img.src = images[i].getAttribute('data-' + this.lazyloadDataAttr);
      }).call(this);
    }
  },

  handleEvent: function(e) {
    switch (e.type) {
      case 'touchstart': this.onTouchStart(e); break;
      case 'touchmove': this.onTouchMove(e); break;
      case 'touchend': this.onTouchEnd(e); break;
      case 'webkitTransitionEnd':
      case 'msTransitionEnd':
      case 'oTransitionEnd':
      case 'transitionend': this.transitionEnd(e); break;
      case 'resize': this.setup(); break;
    }
  },

  transitionEnd: function(e) {

    if (this.preload) this.load();

    if (this.delay) this.begin();

    this.callback(e, this.index, this.slides[this.index]);

  },

  onTouchStart: function(e) {

    this.start = {

      // get touch coordinates for delta calculations in onTouchMove
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY,

      // set initial timestamp of touch sequence
      time: Number( new Date() )

    };

    // used for testing first onTouchMove event
    this.isScrolling = undefined;

    // reset deltaX
    this.deltaX = 0;
    this.deltaY = 0;

    // set transition time to 0 for 1-to-1 touch movement
    this.element.style.MozTransitionDuration = this.element.style.webkitTransitionDuration = 0;

    e.stopPropagation();
  },

  onTouchMove: function(e) {

    // ensure swiping with one touch and not pinching
    if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

    this.deltaX = e.touches[0].pageX - this.start.pageX;
    this.deltaY = e.touches[0].pageY - this.start.pageY;

    // determine if scrolling test has run - one time test
    if ( typeof this.isScrolling == 'undefined') {
      this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(e.touches[0].pageY - this.start.pageY) );
    }

    // if user is not trying to scroll vertically
    if (!this.isScrolling && !this.vertical) {

      // prevent native scrolling
      e.preventDefault();

      // cancel slideshow
      clearTimeout(this.interval);

      // increase resistance if first or last slide
      this.deltaX =
        this.deltaX /
          ( (!this.index && this.deltaX > 0               // if first slide and sliding left
            || this.index == this.length - 1              // or if last slide and sliding right
            && this.deltaX < 0                            // and if sliding at all
          ) ?
          ( Math.abs(this.deltaX) / this.width + 1 )      // determine resistance level
          : 1 );                                          // no resistance if false

      // translate immediately 1-to-1
      this.element.style.MozTransform = this.element.style.webkitTransform = 'translate3d(' + (this.deltaX - this.index * this.width) + 'px,0,0)';

      e.stopPropagation();

    }

    if (this.vertical) {

      e.preventDefault();

      clearTimeout(this.interval);

      this.deltaY =
        this.deltaY /
          ( (!this.index && this.deltaY > 0               // if first slide and sliding left
            || this.index == this.length - 4              // or if last slide and sliding right
            && this.deltaY < 0                           // and if sliding at all
          ) ?
          ( Math.abs(this.deltaY) / 60 + 1 )      // determine resistance level
          : 1 );                                          // no resistance if false

      // translate immediately 1-to-1
      this.element.style.MozTransform = this.element.style.webkitTransform = 'translate3d(0, ' + (this.deltaY - this.index * 60) + 'px,0)';

      e.stopPropagation();
    }

  },

  onTouchEnd: function(e) {

    // determine if slide attempt triggers next/prev slide
    var isValidSlide =
          Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
          && Math.abs(this.deltaX) > 20                   // and if slide amt is greater than 20px
          || Math.abs(this.deltaX) > this.width/2,        // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
        isPastBounds =
          !this.index && this.deltaX > 0                          // if first slide and slide amt is greater than 0
          || this.index == this.length - 1 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

    if (this.vertical) {
      isValidSlide = Number(new Date()) - this.start.time < 250
          && Math.abs(this.deltaY) > 20
          || Math.abs(this.deltaY) > this.width/2;

      isPastBounds =
          !this.index && this.deltaY > 0
          || this.index == this.length - 4 && this.deltaY < 0;
    }

    // if not scrolling vertically
    if (!this.isScrolling && !this.vertical) {

      // call slide function with slide end value based on isValidSlide and isPastBounds tests
      this.slide( this.index + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed );

    }

    if (this.vertical) {

      var deltai = Math.ceil(Math.abs(this.deltaY) / 60);
      this.slide( this.index + ( isValidSlide && !isPastBounds ? (this.deltaY < 0 ? deltai : -deltai) : 0 ), this.speed );

    }

    e.stopPropagation();
  },

  destroy:function(){
        this.element.removeEventListener('touchstart', this);
        this.element.removeEventListener('touchmove', this);
        this.element.removeEventListener('touchend', this);
        this.element.removeEventListener('webkitTransitionEnd', this);
        this.element.removeEventListener('msTransitionEnd', this);
        this.element.removeEventListener('oTransitionEnd', this);
        this.element.removeEventListener('transitionend', this);
  }

};
(function() {
  this.JST || (this.JST = {});
  this.JST["template/add_pic"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="J-uploader">\n    <div class="add-pic" id="J-addPicWrap">\n        <div id="J-uploaderTrigger">\n          <a href="#" id="J-addPicBtn" class="add-pic-btn"></a>\n         <span class="tip">这里可以添加照片，只有上传照片才可以写评论哦~~</span>\n        </div>\n        <div id="J-uploaded" class="uploader-file" style="display:none;">\n          <form action="http://wo.wapa.taobao.com/uploadPicture.htm" method="post" enctype="multipart/form-data">\n              <input type="file" name="picture"  id="J-upload" class="upload-input" multiple/>\n              <input type="hidden" name="ratedUid" id="J-ratedUid" value=""/> <!--被评价的uid-->\n              <input type="hidden" name="itemId" id="J-itemId" value=""/> <!--itemId-->\n              <input type="hidden" name="tradeId" id="J-tradeId" value=""/>  <!---orderId-->\n              <input type="submit" name="" value="上传"/>\n          </form>\n        </div>\n    </div>\n    <div class="comment-area">\n        <em class="arrow"></em>\n        <em class="num"><span id="J-num">0</span>/140</em>\n        <div class="cm-textarea">\n          <textarea name="" id="J_CommentPoster"></textarea>\n        </div>\n    </div>\n\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/comment"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<section class="c-comm">\n\n    <div id="J_commcont" class="cc-cont">\n        ');  if(items && items.length){ ; __p.push('\n        <ul>\n            ');  for (var i = 0; i < items.length; i ++) { ; __p.push('\n            <li>\n                <p>',  items[i].text ,'</p>\n                ');  if(items[i].reply){ ; __p.push('\n                <div class="reply"><strong>卖家回复：</strong>', items[i].reply,'</div>\n                ');  } ; __p.push('\n                <p>',  items[i].deal ,'</p>\n                <p>',  items[i].buyer ,'<em>',  app.helper.rank(items[i].credit),'</em>',  items[i].date ,'</p>\n            </li>\n            ');  } ; __p.push('\n        </ul>\n        ');  } ; __p.push('\n    </div>\n    <div id="J_listload" class="c-loading dc-load none">\n        <span></span>\n    </div>\n    <div id="J_dcpage" class="c-pnav-con"></div>\n</section>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/comment_item"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(''); _.each(comments,function(comment){; __p.push('\n    <li class="z-mod">\n        <div class="hd">\n           <img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=', comment.raterUid,'&width=40&height=40&type=sns"/>\n        </div>\n        <div class="bd">\n            <h3>',  comment.raterUserNick,'</h3>\n\n            <p>',  _.escape(comment.feedback),'</p>\n            <ul class="pic-desc">\n                '); _.each(comment.feedItemPicDOList,function(pic){; __p.push('\n                  <li><img src="pic.path"/></li>\n                '); }); __p.push('\n            </ul>\n        </div>\n    </li>\n');  }); __p.push('\n\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_comment"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="ds-action">\n    <a href="#" class="ds-coma ww">\n        <img src="http://im.m.taobao.com/ww/status.do?_input_charset=utf-8&amp;nick=%E5%A5%A5%E6%84%8F%E7%8E%9B%E6%97%97%E8%88%B0%E5%BA%97&amp;sid=a43dc100fd92d4d3f446405857471d10" alt="联系卖家">\n    </a>\n    <a href="#" class="ds-coma fav">收藏</a>\n\n\n    ');  if(item.soldout == 'false'){ ; __p.push('\n    ');  if(trade.buySupport && trade.buySupport == 'true'){ ; __p.push('<a href="#" class="immbuy');  if(seller.type == 'B'){ ; __p.push(' c-btn-tmall-buy');  } else{ ; __p.push(' c-btn-oran');  } ; __p.push('"><span>立即购买</span></a>');  } ; __p.push('\n    ');  if(trade.cartSupport && trade.cartSupport == 'true'){ ; __p.push('<a href="#" class="c-btn-blue addcart"><span>加入购物车</span></a>');  } ; __p.push('\n    ');  } else { ; __p.push('\n    <b class="ds-coma ds-bs"><span>宝贝不能购买</span></b>\n    ');  } ; __p.push('\n\n\n    <form id="order-form" name="orderForm" style="display: none;" action="http://b.m.taobao.com/buy.htm?sid=fa5ef1c3e6848fa9433c0ebf894b1e5a&amp;pds=buynow%23h%23detail" method="post">\n        <input type="hidden" name="_input_charset" value="utf-8"/>\n        <input type="hidden" name="item_id" value="4846668057"/>\n        <input type="hidden" name="item_num_id" value="4846668057"/>\n        <input type="hidden" name="tks" value="" />\n        <input type="hidden" id="sku-id" name="skuId" value=""/>\n        <input type="hidden" name="buyNow" value="true" />\n    </form>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_extra"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="ds-action">\n    <a href="#" class="ds-coma ww">\n        <img src="http://im.m.taobao.com/ww/status.do?_input_charset=utf-8&amp;nick=%E5%A5%A5%E6%84%8F%E7%8E%9B%E6%97%97%E8%88%B0%E5%BA%97&amp;sid=a43dc100fd92d4d3f446405857471d10" alt="联系卖家">\n    </a>\n    <a href="#" class="ds-coma fav">收藏</a>\n\n\n    ');  if(item.soldout == 'false'){ ; __p.push('\n    ');  if(trade.buySupport && trade.buySupport == 'true'){ ; __p.push('<a href="#" class="immbuy');  if(seller.type == 'B'){ ; __p.push(' c-btn-tmall-buy');  } else{ ; __p.push(' c-btn-oran');  } ; __p.push('"><span>立即购买</span></a>');  } ; __p.push('\n    ');  if(trade.cartSupport && trade.cartSupport == 'true'){ ; __p.push('<a href="#" class="c-btn-blue addcart"><span>加入购物车</span></a>');  } ; __p.push('\n    ');  } else { ; __p.push('\n    <b class="ds-coma ds-bs"><span>宝贝不能购买</span></b>\n    ');  } ; __p.push('\n\n\n    <form id="order-form" name="orderForm" style="display: none;" action="http://b.m.taobao.com/buy.htm?sid=fa5ef1c3e6848fa9433c0ebf894b1e5a&amp;pds=buynow%23h%23detail" method="post">\n        <input type="hidden" name="_input_charset" value="utf-8"/>\n        <input type="hidden" name="item_id" value="4846668057"/>\n        <input type="hidden" name="item_num_id" value="4846668057"/>\n        <input type="hidden" name="tks" value="" />\n        <input type="hidden" id="sku-id" name="skuId" value=""/>\n        <input type="hidden" name="buyNow" value="true" />\n    </form>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_info"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<section class="d-info">\n    <h1 class="title" id="J-desc"></h1>\n    <ul class="d-cul">\n\t  <li><label>价格:</label><ins class="red dc-origin">￥',  info.price ,'</ins></li>\n\n');  if(info.delivery.deliveryFeeType != 0){ ; __p.push('\n\t  <li class="dc-area"><label>运费:</label>\n      ');  if(info.delivery.deliveryFeeType == 2){; __p.push('\n          ',  info.delivery.title ,'\n      '); } else if(info.delivery.deliveryFeeType == 1){; __p.push('\n\t\t<span class="dc-delivery"> ',  _.map(info.delivery.deliveryFees,function(item){return item.title}).join(' ') ,'</span>\n      '); }; __p.push('\n\n      ');  if(mallInfo && mallInfo.allAreaSold == false){ ; __p.push('\n            <span class="font12 di-gy di-adsxg"><span class="dia-city" c="areaId">',  info.delivery.destination ,'</span><b class="aw down"></b></span>\n         '); } else if(info.delivery.deliveryFeeType != 2){ ; __p.push('\n            <span class="font12"> 至 <span class="di-gy">',  info.delivery.destination,'</span></span>\n      '); }; __p.push('\n      </li>\n      '); if(mallInfo && mallInfo.allAreaSold == false){; __p.push('\n        <li class="di-area none"> <div class="c-loading"><span></span></div></li>\n      '); }; __p.push('\n\n\n'); }; __p.push('\n\t    <li><label>月销:</label>',  info.totalSoldQuantity ,'件</li>\n    </ul>\n</section>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_info2"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="tbh5v0">\n<section id="J_detailCont" class="innercontent">\n    <section id="J_slide">\n\n    </section>\n    <section class="d-info">\n        <h1><em class="red">[1111购物狂欢节]</em>ForeverKid 秋装新款韩国奢华金线刺绣气质全网纱蕾丝双排扣风衣</h1>\n        <ul class="d-cul">\n            <li class="dic-fli">\n                <label>促销:</label><ins class="red dc-promo">￥249.00 </ins><span class="gray12"><span class="di-org">1212淘你喜欢</span></span><!--<img src="http://a.tbcdn.cn/mw/app/detail/wap/images/chuxiao-49-17.png" width="49" height="17" /><ins class="red dc-promo">￥9999999.00 - ￥9999999.00</ins><span class="gray12"><span class="di-org">限时打折</span>  剩余19小时25分钟</span>-->\n            </li>\n            <li>\n                <label>原价:</label><span class="gray12"><del class="dc-origin">￥358.00</del>每个id限购1件</span>\n            </li>\n\n\n            <li class="dc-area">\n                <label>快递:</label><span class="dc-delivery">￥6.00</span> <span class="font12 di-gy di-adsxg"><span class="dia-city" c="330100">杭州</span><b class="aw down"></b></span>\n            </li><!--不是地区限购html "<span class="font12">从 <span class="di-gy">海外美国</span> 至 <sp1an class="di-gy">浙江杭州</span></span>"-->\n            <li class="di-area none">\n                <div class="c-loading">\n                    <span></span>\n                </div>\n            </li>\n            <!--<li class="di-area">\n                <p class="red">以下地区有售</p>\n                <div class="di-arealist">\n                    <i>北京</a><i>天津</i><i>新疆</i><i>河北</i><i>黑龙江</i><i>吉林</i><i>内蒙古</i><i>江苏</i><i class="sel">浙江</i><span class="di-alinsert"><b class="sel">杭州</b><b>宁波</b><b>温州</b><b>嘉兴</b><b>绍兴</b><b>舟山</b><b>丽水</b><b>衢州</b><b>金华</b></span><i>湖南</i><i>湖北</i><i>西藏</i>\n                </div>\n                <div class="dsm-f"><a href="#" class="dsmf-a"><b class="aw up"></b></a></div>\n            </li>-->\n            <li><label>月销:</label>3568 件 <span id="J_integral" class="gray12">单件送200积分</span></li>\n        </ul>\n\n\n\n\n    </section>\n    <section class="d-sku d-tmall"><!--天猫增加d-tmall-->\n        <!--<p class="dst-sep">特色服务：<span class="gray12">冰箱食物补偿金</span><em class="red">商家赠送</em></p>-->\n        <p class="ds-props" id="sku-limit"><span class="ds-skup">尺码</span>:　<span class="gray12">M　L　XL　XXL　颜色: 半身渐变蓝 全身黑 半身紫</span><b class="aw down"></b></p>\n        <div class="ds-main none" id="sku-all">\n            <!--<p class="dsm-s">请选择 <span class="red">尺码/颜色</span></p>\n            <div class="dsm-p">\n                <p class="dsmp-n">尺码:</p>\n                <div class="dsmp-v">\n                    <i class="a sel" data-id="" data-img="">S</i><i class="a" data-id="" data-img="">M</i><i class="a" data-id="" data-img="">L</i><i class="a" data-id="" data-img="">XL</i><i class="a" data-id="" data-img="">XXL</i>\n                </div>\n            </div>\n            <div class="dsm-p">\n                <p class="dsmp-n">颜色分类:</p>\n                <div class="dsmp-v">\n                    <i data-id="" class="b" data-img="">红色</i><i class="b" data-id="" data-img="">橙色</i><i class="b" data-id="" data-img="">黄色</i><i class="b" data-id="" data-img="">灰色</i><i class="b" data-id="" data-img="">黑色</i><i class="b" data-id="" data-img="">货色</i><i data-id="" class="b" data-img="">货色</i><i class="b" data-id="" data-img="">货色</i><i data-id="" class="b" data-img="">货色</i><i class="b" data-id="" data-img="">货色</i>\n                </div>\n            </div>\n            <p class="dsm-sel">已选："红色" 还未选 <em class="red">尺码</em></p>\n            <p class="dst-sep">特色服务：<span class="gray12">冰箱食物补偿金</span></p>\n            <p class="dsm-lap">促销：<em class="red">￥249.00</em>(库存10件)</p>\n            <div class="dsm-f"><a id="sku-drow" href="#" class="dsmf-a"><b class="aw up"></b></a></div>-->\n        </div>\n    </section>\n    <section class="d-sure">\n        <div class="ds-action">\n            <a href="#" class="ds-coma ww">\n                <img src="http://im.m.taobao.com/ww/status.do?_input_charset=utf-8&amp;nick=%E5%A5%A5%E6%84%8F%E7%8E%9B%E6%97%97%E8%88%B0%E5%BA%97&amp;sid=a43dc100fd92d4d3f446405857471d10" alt="联系卖家">\n            </a>\n            <a href="#" class="ds-coma fav">收藏</a>\n            <a href="#" class="c-btn-oran immbuy"><span>立即购买</span></a>\n            <a href="#" class="c-btn-blue addcart"><span>加入购物车</span></a>\n            <!--<b id="J_NoArea" class="ds-coma ds-bs"><span>商品不在销售区域内</span></b><b class="ds-coma ds-bs ds-bs12"><span><em class="red">还有机会</em> 我们会逐步取消未支付订单</span></b><a class="ds-coma ds-rh" href="#"><img src="images/refresh.png" />刷新</a>--><!--天猫样式c-btn-tmall-buy-->\n            <!-- 拇指斗价按钮 -->\n            <!--<a href="#" class="mz-btn mz-buy">立刻购买</a>\n            <a href="#" class="mz-btn mz-join">参与斗价</a>\n            <a href="#" class="mz-btn mz-ended">已经结束</a>\n            <a href="#" class="mz-btn mz-soldout">卖光了</a>\n            <a href="#" class="mz-btn mz-success">已成功抢购</a>\n            <a href="#" class="mz-btn mz-topay">待付款</a>\n            <a href="#" class="mz-btn mz-chance">还有机会</a>\n            <a href="#" class="mz-btn mz-tostart">即将开始</a>\n            <a href="#" class="mz-btn mz-closed">交易关闭</a>-->\n\n            <form id="order-form" name="orderForm" style="display: none;" action="http://b.m.taobao.com/buy.htm?sid=fa5ef1c3e6848fa9433c0ebf894b1e5a&amp;pds=buynow%23h%23detail" method="post">\n                <input type="hidden" name="_input_charset" value="utf-8"/>\n                <input type="hidden" name="item_id" value="4846668057"/>\n                <input type="hidden" name="item_num_id" value="4846668057"/>\n                <input type="hidden" name="tks" value="" />\n                <input type="hidden" id="sku-id" name="skuId" value=""/>\n                <input type="hidden" name="buyNow" value="true" />\n            </form>\n        </div>\n\n\n\n    </section>\n\n    <!--值得买区块-->\n\n\n\n    <section class="d-master">\n\n        <div id="zdm-comment" class="zdm-comment">\n           <h2>用户评论</h2>\n           <ul class="zdm-comment-block">\n               <li class="z-mod">\n                  <div class="hd">\n                    <img src="http://img04.taobaocdn.com/tps/i4/T12.4VXwpbXXbe.mPe-40-40.png"/>\n                  </div>\n                  <div class="bd">\n                     <h3><a href="#">小猪LULU</a></h3>\n                     <p>颜色特别美，做工特别好，潘领好可爱。。设计感很足。好喜欢。。我穿已经在膝盖了。。囧···哈哈。。但还是爱不释手啊。。</p>\n                     <ul class="pic-desc">\n                          <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                          <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                          <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                          <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                          <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                     </ul>\n                  </div>\n               </li>\n               <li class="z-mod">\n                 <div class="hd">\n                   <img src="http://img04.taobaocdn.com/tps/i4/T12.4VXwpbXXbe.mPe-40-40.png"/>\n                 </div>\n                 <div class="bd">\n                    <h3><a href="#">小猪LULU</a></h3>\n                    <p>颜色特别美，做工特别好，潘领好可爱。。设计感很足。好喜欢。。我穿已经在膝盖了。。囧···哈哈。。但还是爱不释手啊。。</p>\n                    <ul class="pic-desc">\n                         <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                         <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                         <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                         <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                         <li><img src="http://img04.taobaocdn.com/tps/i4/T1mNFVXxlcXXXeF16k-62-62.png"/></li>\n                    </ul>\n                 </div>\n              </li>\n              <li class="z-mod">\n                   <div class="hd">\n                     <img src="http://img04.taobaocdn.com/tps/i4/T12.4VXwpbXXbe.mPe-40-40.png"/>\n                   </div>\n                   <div class="bd">\n                      <h3><a href="#">小猪LULU</a></h3>\n                      <p>颜色特别美，做工特别好，潘领好可爱。。设计感很足。好喜欢。。我穿已经在膝盖了。。囧···哈哈。。但还是爱不释手啊。。</p>\n\n                   </div>\n               </li>\n           </ul>\n\n        </div><!--值得买评论区块-->\n\n\n        <p class="dm-cp"><a href="#!comment">用户评论（8586）</a><b class="aw right"></b></p>\n        <p class="dm-cp"><a href="#!imaget">图文详情（总12页）</a><b class="aw right"></b></p>\n        <div class="dm-cdiv">\n            <em class="di-org">满就送</em>\n            <p class="dh-fsp">满158元 ，免运费 (不免邮地区:海南;甘肃;青海;宁夏;新疆;四川;贵州;云南;西藏;香港)；满268元 ，减5元；满378元 ，减10元。</p>\n        </div>\n        <ul class="d-cul">\n            <li class="dmf-li"><label>卖家:</label><span class="dm-name">新博来珀珈琬之娜迪欧新博来珀珈琬之娜迪欧</span><img src="http://a.tbcdn.cn/mw/s/hi/tbtouch/icons/rank/b_2_4.gif" alt=""></li>\n            <li><label>地点:</label><span class="gray12">浙江 杭州</span></li>\n            <li><label>动态:</label><span class="gray12">描述 <i class="red">4.7</i> 服务 <i class="red">4.8</i> 物流 <i class="red">4.6</i>　好评率 98.7%</span></li>\n            <li><label>保障:</label><img src="http://a.tbcdn.cn/mw/s/hi/tbtouch/icons/trade/xb_quality_item.png"><img src="http://a.tbcdn.cn/mw/s/hi/tbtouch/icons/trade/xb_sevenday_return.png"><img src="http://a.tbcdn.cn/mw/s/hi/tbtouch/icons/trade/xb_truth.png"></li>\n        </ul>\n        <p class="dm-enter dm-five"><a href="#">进入店铺</a></p>\n    </section>\n    <section class="d-hot">\n        <ul>\n            <li><em>Hot</em><a href="#">七夕节店铺大优惠</a></li>\n            <li><em>Hot</em><a href="#">五一西湖的雨，全场5折，单品包邮</a></li>\n        </ul>\n    </section>\n    <section id="J_recommend" class="d-tj">\n        <!--<div class="dt-header none">\n            <h3>本店推荐宝贝</h3>\n            <a href="#">更多</a>\n        </div>\n        <div id="tjSlider" class="tjSlider none">\n            <div class="tjSlider-outer">\n                <ul>\n                    <li>\n                        <a href="#">\n                            <img src="http://a.tbcdn.cn/mw/webapp/fav/img/grey.gif" dataimg="images/tj1.jpg" />\n                            <span>爱丽缇2012夏装新款明星同款白色款白色款白色</span>\n                            <p><ins class="red">￥249.00</ins></p>\n                            <p class="font12">原价:<del>￥358.00</del></p>\n                        </a>\n                    </li>\n                    <li>\n                        <a href="#">\n                            <img src="http://a.tbcdn.cn/mw/webapp/fav/img/grey.gif" dataimg="images/tj2.jpg" />\n                            <span>爱丽缇2012夏装新款明星同款白色款白色款白色</span>\n                            <p><ins class="red">￥243419.00</ins></p>\n                            <p class="font12">原价:<del>￥358.00</del></p>\n                        </a>\n                    </li>\n                    <li>\n                        <a href="#">\n                            <img src="http://a.tbcdn.cn/mw/webapp/fav/img/grey.gif" dataimg="images/tj1.jpg" />\n                            <span>爱丽缇2012夏装新款明星同款白色款白色款白色</span>\n                            <p><ins class="red">￥249.00</ins></p>\n                            <p class="font12">原价:<del>￥358.00</del></p>\n                        </a>\n                    </li>\n                    <li>\n                        <a href="#">\n                            <img src="http://a.tbcdn.cn/mw/webapp/fav/img/grey.gif" dataimg="images/tj2.jpg" />\n                            <span>爱丽缇2012夏装新款明星同款白色款白色款白色</span>\n                            <p><ins class="red">￥243419.00</ins></p>\n                            <p class="font12">原价:<del>￥358.00</del></p>\n                        </a>\n                    </li>\n                </ul>\n            </div>\n            <b class="aw left prev">上一个</b>\n            <b class="aw right next">下一个</b>\n        </div>-->\n    </section>\n    <section class="d-search">\n        <form action="http://s.waptest.taobao.com/search.htm?v=0&amp;sid=adf3a2909bff87c3&amp;pds=search%23h%23detail" method="get" name="qsearch">\n            <input name="atype" type="hidden" value="b">\n            <input type="hidden" value="3" name="searchfrom">\n            <input type="text" name="q" placeholder="请输入宝贝关键字" class="bton-keyword" value="">\n            <input class="bton-search" name="search-bton" type="submit" value="">\n        </form>\n        <!--<input type="text" name="q" class="bton-keyword" value="" /><input class="bton-search" name="search-bton" type="submit" value="">-->\n    </section>\n </section>\n\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_layout"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<section id="J_detailCont" class="innercontent">\n\n\n       <section id="J_slide"><div class="loading"></div></section>\n\n       <section id="J-dInfo" class="fold"></section>\n\n       <section id="J-dSKU"> </section>\n\n\n       <section class="d-sure" id="J-orderNow"> </section>\n\n       <section class="d-master">\n\n           <div id="zdm-comment" class="zdm-comment"><div class="loading"></div></div><!--值得买评论区块-->\n\n           <div id="J-merchant"> </div>  <!--merchant info-->\n\n       </section>\n\n\n       <section class="d-search">\n           <form action="http://s.waptest.taobao.com/search.htm?v=0&amp;sid=adf3a2909bff87c3&amp;pds=search%23h%23detail" method="get" name="qsearch">\n               <input name="atype" type="hidden" value="b">\n               <input type="hidden" value="3" name="searchfrom">\n               <input type="text" name="q" placeholder="请输入宝贝关键字" class="bton-keyword" value="">\n               <input class="bton-search" name="search-bton" type="submit" value="">\n           </form>\n           <!--<input type="text" name="q" class="bton-keyword" value="" /><input class="bton-search" name="search-bton" type="submit" value="">-->\n       </section>\n   </section>\n</section>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_merchant"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<p class="dm-cp"><a href="#comment/',  itemId,'">用户评论</a><b class="aw right"></b></p>\n<p class="dm-cp"><a href="#imaglet/',  itemId,'">图文详情</a><b class="aw right"></b></p>\n\n<ul class="d-cul">\n    <li class="dmf-li"><label>卖家:</label><span class="dm-name">',  seller.nick ,'</span><img src="',  app.helper.convertCredit(seller.credit.level) ,'"/></li>\n    <li><label>地点:</label><span class="gray12">',  seller.location,'</span></li>\n    <li><label>动态:</label><span class="gray12">\n        '); if(seller.evaluateInfo && seller.evaluateInfo.length == 3){ ; __p.push('\n         描述 <i class="red">',  seller.evaluateInfo[2].score ,'</i> 服务 <i class="red">',  seller.evaluateInfo[1].score,'</i> 物流 <i class="red">',  seller.evaluateInfo[0].score ,'</i>　\n        '); }; __p.push('好评率 ',  seller.goodRatePercentage ,'\n    </span></li>\n    ');  if(guarantees && guarantees.length){ ; __p.push('\n    <li><label>保障:</label>');  _.each(guarantees,function(guarantee){ ; __p.push('\n    <img src="',  guarantee.icon,'_16x16.jpg" />\n    ');  }) } ; __p.push('</li>\n</ul>\n<p class="dm-enter dm-five"><a href="http://shop.',  app.helper.fetchHost(),'.taobao.com/shop/shopIndex.htm?user_id=',  seller.userNumId,'">进入店铺</a></p>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_sku"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');  if(item.sku == 'true'){ ; __p.push('\n<section class="d-sku');  if(seller.type == 'B'){ ; __p.push(' d-tmall');  } ; __p.push('">\n   <p class="ds-props" id="sku-limit">\n       <span class="gray12">\n           ', _.map(sku.skuProps,function(item){
                var tempa = _.map(item.values,function(el){
                      return el.valueAlias || el.name;
                 });
                 tempa.unshift(item.name+': ');
                 return tempa.join(' ');}).join(' ')
             ,'</span>\n       <b class="aw down"></b>\n   </p>\n   <div class="ds-main none" id="sku-all"></div>\n</section>\n');  } ; __p.push('\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/detail_slider"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="sliderWrap" class="dSlider">\n    <div class="js-bton">\n        <a href="#" class="jsb-back">返 回</a>\n        <a href="#" class="jsb-ori">原 图</a>\n    </div>\n    <div class="goods-slider" id="J-sliderShow">\n        <ul>\n            ');  _.each(sliders,function(slider){ ; __p.push('\n              <li><img src="http://a.tbcdn.cn/mw/webapp/fav/img/grey.gif"  class="lazy" data-src="',  app.Util.getWebpImg(slider,'180x180'),'" /></li>\n            '); }); __p.push('\n        </ul>\n    </div>\n    <div class="price-f"><span class="p">￥',  info.price ,'</span></div>\n    <b class="prev">上一个</b>\n    <b class="next">下一个</b>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/error_no_item"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="c-msg">\n   <div class="c-msg-img error"></div>\n   <div class="c-msg-info">\n    <p>温馨提示</p>\n    <p><br/>很抱歉，您查看的宝贝不存在，可能已下架或被转移<br/></p>\n   </div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/error_no_order"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="c-msg">\n   <div class="c-msg-img error"></div>\n   <div class="c-msg-info">\n    <p>温馨提示</p>\n    <p><br/>很抱歉，您当前没有任何商品订单<br/></p>\n   </div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/good_commentItem"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');  if(comment){; __p.push('\n<div class="comment-item">\n    <div class="hd">\n        <img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=', comment.raterUid,'&width=40&height=40&type=sns"/>\n    </div>\n    <div class="bd">\n        <h3>',  comment.raterUserNick ,'</h3>\n        <p>',  _.escape(comment.feedback) ,'</p>\n        <ul class="pic-desc">\n            '); _.each(comment.feedItemPicDOList,function(pic){; __p.push('\n               <li><img src="',  pic.path,'_60x60.jpg"/></li>\n            '); }); __p.push('\n        </ul>\n    </div>\n</div>\n'); }; __p.push('\n<div class="ft comment-ft">'); if(comment){; __p.push('<a class="fn view-comments" href="#">查看全部评论<em></em></a>'); }else{; __p.push('<a href="#" class="fn J-addPic" onclick="">添加图片及评论<em></em></a>'); }; __p.push('</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/good_item"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(''); _.each(goods,function(good){; __p.push('\n    ');  _.each(good.orderInfo.orderCell,function(boughtItem){; __p.push('\n    <li class="z-mod" id="J-commentItem-',  good.orderInfo.bizOrderId ,'-',  boughtItem.itemId,'" data-orderId="',  good.orderInfo.bizOrderId,'" data-id="',  good.orderInfo.bizOrderId ,'-',  boughtItem.itemId ,'" data-ratedUid="',  good.sellerInfo.sellerId ,'" data-itemId="',  boughtItem.itemId ,'"    data-tradeId="',  good.orderInfo.bizOrderId ,'" data-parentTradeId="',  good.orderInfo.bizOrderId ,'">\n        <div class="good-item">\n            <div class="hd good-hd">\n                <a href="#detail/',  boughtItem.itemId,'"><img src="',  boughtItem.pic ,'"/></a>\n            </div>\n            <div class="bd good-bd">\n                 <p><a href="#detail/',  boughtItem.itemId,'">',  _.escape(boughtItem.title) ,'</a></p>\n                 <div class="price">￥',  boughtItem.sPrice ,'</div>\n            </div>\n        </div>\n        <div id="J-comment-',  good.orderInfo.bizOrderId ,'-',  boughtItem.itemId ,'"> </div>\n    </li>\n    ');  }); __p.push('\n'); }); __p.push('\n\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/good_layout"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="J-myGood" style="height:300px;">\n\n    <ul class="good-block" id="J-goodList">\n\n        <div class="loading"></div>\n\n    </ul>\n\n    <div id="J-goodsPage" class="c-pnav-con"></div>\n\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/imaglet"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<section class="innercontent">\n    <div id="J_imagetCont">\n        <div id="J_imagetCont_ic" class="it-cont"></div>\n        <div id="J_icpage" class="c-pnav-con"></div>\n    </div>\n    <div id="J_param" class="it-param none">\n        <div id="J_paload" class="c-loading dc-load">\n            <span></span>\n        </div>\n   </div>\n</section>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["template/viewall_layout"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="good-section">\n    <div class="z-mod">\n        <div class="good-item">\n            <div class="hd good-hd">\n                <a href="#detail/',  good.aucNumId,'"><img src="',  good.auctionPicUrl ,'"/></a>\n            </div>\n            <div class="bd good-bd">\n                <p><a href="#detail/',  good.aucNumId,'">',  good.auctionTitle ,'</a></p>\n                <div class="price">￥',  good.auctionPrice ,'</div>\n            </div>\n        </div>\n    </div>\n</div>\n<p class="comments-num"><em></em><a href="#" id="J-gotoMy">发表你的购物体验，赢取奖励!</a></p>\n<div class="comment-section" id="zdm-comment">\n    <ul>\n    '); _.each(comments,function(comment){; __p.push('\n    <li class="z-mod">\n        <div class="hd">\n            <img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=', comment.raterUid,'&width=40&height=40&type=sns"/>\n        </div>\n        <div class="bd">\n            <h3>',  comment.raterUserNick,'</h3>\n            <p>',  comment.feedback,'</p>\n            <ul class="pic-desc">\n                '); _.each(comment.feedItemPicDOList,function(pic){; __p.push('\n                <li><img src="',  pic.path ,'_60x60.jpg"/></li>\n                '); }); __p.push('\n            </ul>\n        </div>\n    </li>\n\n    ');  }); __p.push('\n    </ul>\n</div>\n<div id="J-allComments" class="c-pnav-con"></div>\n');}return __p.join('');};
}).call(this);
(function (app, undef) {

    var detail = app.page.define({
        name:"detail",
        title:'宝贝详情', //title bar的文案
        route:"detail\/(P<id>\\d+)",
        templates:{
            "layout":JST['template/detail_layout'],
            "slider":JST['template/detail_slider'],
            "orderNow":JST['template/detail_extra'],
            "info":JST['template/detail_info'],
            "comments":JST['template/comment_item'],
            "merchant":JST['template/detail_merchant'],
            "item_non_existent":JST['template/error_no_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],

        ready:function () {
            var self = this;
            var content = $(app.component.getActiveContent());
            content.html(self.templates["layout"]());

            //delegate events
            app.Util.Events.call(this, "#tbh5v0", this.events);

            this.queryData();
        },


        events:{
            'click .goods-slider':'fullscreen1',
            'click .dc-delivery':'recover',
            'click .jsb-ori':'original'
        },

        fullscreen1:function () {
            alert("fff");
        },

        recover:function () {
            alert("fsss");
        },

        original:function () {


        },

        //请求详情页信息
        queryData:function () {

            var self = this;
            var el = $(app.component.getActiveContent()).find("#J_detailCont");
            this.itemQid = id = app.navigation.getParameter("id");

            app.mtopH5Api.getApi('mtop.wdetail.getItemDetail', '3.0', {'itemNumId':id}, {}, function (result) {

                // success callback
                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {

                    var item = result.data.item;

                    if (item && item.h5Common && item.h5Common == 'true') {
                        self.render(result);
                    } else {
                        console.log("本应用暂不支持该宝贝");//模板暂时不支持
                        self.render(result);
                    }
                } else if (result.ret[0].indexOf("ERRCODE_QUERY_DETAIL_FAIL") > -1) { //宝贝不存在
                    el.html(self.templates['item_non_existent']());
                }

            }, function () {
                notification.flash("请求失败，请重试").show();
            });

        },

        queryDesc:function () {



            app.mtopH5Api.getApi('mtop.gene.feedCenter.getConfigByItemId', '1.0', {"aucNumId":this.itemQid}, {}, function (result) {
                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    $("#J-desc").html(result.data.result);

                }
            })
        },

        render:function (json) {
            var data = json.data;
            app.helper._parseDetailJson(data);
            var detailData = app.ZDMDetail;

            //good slider
            var sliderHtml = this.templates['slider']({sliders:detailData.images, info:detailData.info});
            $("#J_slide").html(sliderHtml);


            //good info
            var infoHtml = this.templates['info']({info:detailData.info, mallInfo:detailData.mallInfo});
            $("#J-dInfo").html(infoHtml);

            // merchant info
            var merchantInfo = this.templates['merchant']({evaluateCount:detailData.info.evaluateCount, itemId:detailData.itemId, seller:detailData.seller, guarantees:detailData.guarantees});
            $("#J-merchant").html(merchantInfo);


            var orderNow = this.templates['orderNow']({item:detailData.info, trade:detailData.trade, seller:detailData.seller});
            $("#J-orderNow").html(orderNow);

            this.detailSlider = new Swipe($('#J-sliderShow')[0], {"fixWidth":200, "preload":4});
            this.detailSlider.load();

            this.queryDesc();

            app.sku.init(detailData);


            //query comment
            this.queryComment(detailData.seller.userNumId);

        },


        queryComment:function (ratedId) {

           var self = this;
            var data = {"ratedUid":ratedId, "tradeId":"0", "itemIds":this.itemQid, "pageSize":"5", "pageIndex":"1"};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (result) {

                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    var comments = result.data.dataList;

                    var html = self.templates['comments']({comments:comments});

                    $(app.component.getActiveContent()).find("#zdm-comment").html('<h2>用户晒单</h2><ul class="zdm-comment-block">' + html + '</ul>');
                } else {
                    notification.flash("评论请求失败，请重试").show();
                }
            });
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);
(function (app, undef) {



    Object.extend(app.helper,{

        fetchHost:function () {  //获取当前环境
            var host = location.host;
            var http = 'm';
            if (!host.match('m.(taobao|tmall|etao|alibaba|alipay|aliyun)')) {
               //if (host == '127.0.0.1' || host == 'localhost' || host.match('(?:.*\\.)?waptest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
                if (host == '127.0.0.1' || host == 'localhost') {
                    http = 'm';
                }else if(host.match('(?:.*\\.)?waptest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')){
                    http = 'waptest';

                }else if (host.match('(?:.*\\.)?wapa\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
                    http = 'wapa';
                }
            }
            return http;
        },

        _parseDetailJson:function (data) {

            //document : http://dev.wireless.taobao.net/mediawiki/index.php?title=Mtop.wdetail.getItemDetail_3.0

            var newJson = {};
            var host = this.fetchHost();
            var item = data.item;
            var pricep = data.priceUnits;

            newJson.item = item;
            //商品属性：
            newJson.itemId = item.itemNumId;

            //图片:图片区域
            newJson.images = item.picsPath;

            //商品信息:
            newJson.info = {
                 "price":pricep ? pricep[0].price : data.item.price, //价格：值得买不需要输出原先的原价什么的，直接输出最终价格
                 "delivery":data.delivery,  //运费相关:
                 "totalSoldQuantity":item.totalSoldQuantity, //总销量:
                 "soldout":item.soldout, //是否售完:
                 "evaluateCount":item.evaluateCount
            };

            newJson.trade = data.trade;
            //商家信息:
            newJson.seller = data.seller;

            //保障:
            newJson.guarantees = data.guarantees;


            newJson.tmall = data.seller.type == 'B';	//是否tmall
            newJson.taoPlus = true;   					//wap淘加true
            newJson.isIpad = false;   					//是否ipad,目前直接false
            newJson.hasProps = data.item.sku == 'true';			//是否有sku
            newJson.taoPlus = true;  //是否显示淘加



            var numid = newJson.itemId;
            //newJson.logAjaxUrl = 'http://a.'+host+'.taobao.com/ajax/pds.do';
            newJson.loginUrl = 'http://login.' + host + '.taobao.com/login.htm';
            //newJson.descAjaxUrl = 'http://a.m.taobao.com/ajax/desc_list.do?item_id='+numid+'&ps=800';
            //newJson.reviewAjaxUrl = 'http://a.m.taobao.com/ajax/rate_list.do?item_id='+numid;
            //newJson.paramAjaxUrl = 'http://a.m.tmall.com/ajax/param.do?item_id='+numid;
            newJson.recommendAjaxUrl = 'http://a.' + host + '.taobao.com/ajax/wap_recommend.do?item_id=' + numid;
            newJson.shopAuctionSearchUrl = 'http://shop.' + host + '.taobao.com/shop/shop_auction_search.htm?suid=' + data.seller.userNumId;
            newJson.tmallChangeLocationAjaxUrl = 'http://a.' + host + '.taobao.com/ajax/tmall_change_location.do?item_id=' + numid;

            newJson.addFavUrl = 'http://fav.' + host + '.taobao.com/favorite/to_collection.htm?itemNumId=' + numid + '&xid=0db2&pds=addfav%23h%23detail';
            //newJson.addCartUrl = 'http://d.'+host+'.taobao.com/ajax.do?fun=add&item_id='+numid+'&pds=addcart%23h%23detail';
            newJson.cleannowUrl = 'http://d.' + host + '.taobao.com/my_cart.htm?pds=cleannow%23h%23cart';
            newJson.myCartUrl = 'http://d.' + host + '.taobao.com/my_bag.htm?pds=gotocart%23h%23detail';


            newJson.mallInfo = data.mallInfo;

            if (data.mallInfo) {
                newJson.soldAreas = data.mallInfo.soldAreas;
            }

            if (newJson.hasProps) {    //sku对象，存在才转换
                var skuData = {};
                skuData.skuProps = [];
                var props = data.sku.props,
                    propsid, propsv, tempobj, tempobj1;
                for (var i = 0, len = props.length; i < len; i++) {  //sku属性
                    propsid = props[i].propId;
                    propsv = props[i].values;
                    tempobj = {};
                    tempobj.name = props[i].propName;
                    tempobj.values = [];
                    for (var j = 0, lenj = propsv.length; j < lenj; j++) {
                        tempobj1 = {}
                        tempobj1.id = [propsid , ':' , propsv[j].valueId].join('');
                        tempobj1.txt = propsv[j].valueAlias || propsv[j].name;
                        propsv[j].imgUrl && (tempobj1.img = propsv[j].imgUrl);
                        tempobj.values[j] = tempobj1;
                    }
                    skuData.skuProps[i] = tempobj;
                }
                var skus = data.sku.skus,
                    tempskus = {},
                    singskus;
                for (var k = 0, lenk = skus.length; k < lenk; k++) {  //sku逻辑
                    if (skus[k].quantity > 0) {
                        singskus = {};
                        singskus.quantity = skus[k].quantity;  //库存
                        singskus.skuId = skus[k].skuId;  //传到后台的id
                        if (skus[k].priceUnits) {
                            if (skus[k].priceUnits.length > 1) {
                                singskus.promoPrice = skus[k].priceUnits[0].price;
                                singskus.price = skus[k].priceUnits[1].price;
                            }
                            else {
                                singskus.price = skus[k].priceUnits[0].price;
                            }
                        }
                        else {
                            singskus.price = skus[k].price || '';
                        }
                        tempskus[skus[k].ppath] = singskus;
                    }
                }
                skuData.availSKUs = tempskus;
                newJson.skuData = skuData;
            }



            app.ZDMDetail = newJson; //cache the detail data

        },

        convertCredit:function(n){
            var src = 'http://a.tbcdn.cn/mw/s/hi/tbtouch/icons/rank/b_';
            src += Math.ceil(n/5);
            src += '_';
            src += (n%5 || 5);  //整除则认为是5
            src += '.gif';
            return src;
        }


    });


})(window['app']);
(function (app, undef) {

   app.sku = {
       init:function(data){


           console.log(data);
          // var data = $.TBDetail || {};
           //this.url = data.propsAjaxUrl;
           this.isIpad = data.isIpad;  //ipad客户端
           this.isJu = null;//TBDetail.jhsData;  //聚划算


           this.el = $(".d-sku");



           this.template = JST['template/detail_sku'];

           $("#J-dSKU").html(this.template({item:data.item,seller:data.seller,sku:data.skuData}));

           //定义常用变量，避免重复操作DOM
           this.skuId = $('#sku-id');
           this.skuLimit =  $('#sku-limit');
           this.skuAll =  $('#sku-all');
           this.porigin = $('.dc-origin');
           var ppromo = $('.dc-promo');  //促销
           this.ppromo = ppromo.length && ppromo || null;
           ppromo = this.ppromo;
           var ppromotjb = ppromo && ppromo.find('.coins');  //是否有淘金币
           this.tjbText = ppromotjb && ppromotjb.length && ' ' + ppromotjb.text() || '';

           this.priceori = this.porigin.html();
           this.priceomo = ppromo && ppromo.html();
           this.promoTxt = ppromo && ppromo.prev() && ppromo.prev().text().slice(0,-1) || '价格';
           this.firstLoad = true;


           //数据
           var skudata = data.skuData || {};
           this.skuProps = skudata.skuProps || [];
           this.availSKUs = skudata.availSKUs || {};




           app.Util.Events.call(this,"#tbh5v0",this.events);


           if(this.skuProps.length){
               this.render();
           }
           else{
               // this.$el.hide();
           }

       },



       events: {
           'click #sku-drow' : 'fold',
           'click #sku-limit' : 'unfold',
           'click .dsmp-v i' : 'select'
       },

       resize : function(callback){
           var that = this,
               skuAll = that.skuAll,
               skuFuc = function(){
                   that.width = skuAll.width() + 10;
                   callback && callback.call(that);  //确定width
                   that.height = skuAll.height();
               };
           if(skuAll.hasClass('none')){
               app.Util.getActualSize(skuAll,skuFuc);
               /*skuAll.css({'position':'absolute','width':'100%','left':-2000,'top':-2000}).removeClass('none');  //obtain element actual height
                skuFuc();
                skuAll.css({'position':'static','width':'auto','left':0,'top':0}).addClass('none');*/
           }
           else{
               skuFuc();
           }
       },
       contract : function(){
           var that = this,
               skuLimit = this.skuLimit,
               skuAll = that.skuAll;
           //定义sku常用dom
           that.skuSel = $('.dsm-sel');
           that.skuLap = $('.dsm-lap');
           that.skuSep = $('.dst-sep');

           /*that.$('#sku-limit').on('touchstart',function(e){
            that.unfold.call(that,e);
            });
            that.$('#sku-drow').on('touchstart',function(e){
            that.fold.call(that,e);
            });*/
           that.resize(that.adjust);
           //旋转
           app.Util.resize(function(){
               if(skuAll.hasClass('none')){
                   that.resize(that.setImgEle);
               }
               else{
                   that.height = skuAll.height();
                   that.width = skuAll.width() + 10;
                   that.setImgEle();
               }
           });
           //window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize',,false);
       },
       unfold : function(str){
           var that = this,
               isScroll = str && typeof str == 'string' && str == 'noScroll',  //是否需要置顶，ipad不需要
               skuLimit = that.skuLimit,
               skuAll = that.skuAll,
               height = that.height;
           if(skuLimit.hasClass('none')){return;}

           !isScroll && scrollTo(0,skuLimit.offset().top - 58);
           $("#J-dInfo").removeClass("fold");
           skuLimit.addClass('none');
           /*skuAll.removeClass('none');
            !isScroll && utils.sendPoint('showsku%23h%23detail');*/
           skuAll.css('height',28).removeClass('none').animate({'height':height},500,'ease-out',function(){
               skuAll.css('height','auto');
            //   !isScroll && app.Util.sendPoint('showsku#h#detail');
           });
       },
       fold : function(e){
           e.preventDefault();
           var that = this,
               skuLimit = that.skuLimit,
               skuAll = that.skuAll,
               height = that.height;
           $("#J-dInfo").addClass("fold");
           setTimeout(function(){
               scrollTo(0,skuAll.offset().top - 58);
           },200);


           /*skuLimit.removeClass('none');
            skuAll.addClass('none');
            utils.sendPoint('hidesku%23h%23detail');*/
           skuAll.css('height',height).animate({'height':28},500,'ease-out',function(){
               skuLimit.removeClass('none');
               skuAll.addClass('none').css('height','auto');
           //    app.Util.sendPoint('hidesku#h#detail');
           });
       },
       showImg : function(obj){
           function getNext(o){
               var no = o.next();
               if(no.length == 0) return null;
               else return no.hasClass('last') ? no : arguments.callee(no);
           }
           var nextObj;
           if(obj.hasClass('last')) nextObj = obj;
           else nextObj = getNext(obj);
           if(!nextObj){return;}

           var src = obj.attr('data-img'),
               dsInsert = obj.parent().find('.ds-insert'),
               img = dsInsert && dsInsert.find('img'),
               dsSpan = dsInsert && dsInsert.find('span');
           if(src){
               src += '_120x120.jpg';
           }
           else{
               dsInsert.hide();return;
           }
           dsSpan && dsSpan.removeClass('none');
           if(dsInsert.length == 0){
               nextObj.after('<span class="ds-insert c-loading"><span></span><img src="'+src+'" /></span>');
               dsInsert = nextObj.next();
               img = dsInsert.find('img');
               dsSpan = dsInsert.find('span');
               img[0].onload = function(){
                   $(this).animate({'opacity':1},200,'linear');
                   dsSpan.addClass('none');
               }
           }
           else{
               nextObj.after(dsInsert);
               dsInsert.show();
               img.attr('src' , src);
           }
           if(this.cacheSrc != src){  // Won't trigger load if src unchanged
               img.css({'opacity':0});
               this.cacheSrc = src;
           }
           else{
               dsSpan.addClass('none');
           }
       },
       select : function(e){
           e.preventDefault();
           var that = this;
           $target = $(e.target);
           if($target.hasClass('disabled')) return;
           that.skuId.val('');
           if($target.hasClass('sel')){
               $target.removeClass('sel');
               $target.parent().find('.ds-insert').hide();
           }
           else{
               $target.addClass('sel');
               $target.siblings().removeClass('sel');
               that.showImg($target);
           }
           that.notice();
           that.disable();
       },
       notice : function(){
           var sels = $('.sel'),
               len = sels.length,
               allLen = this.skuProps.length,
               skuSel = this.skuSel,
               skuSep = this.skuSep,
               skuLap = this.skuLap,
               skuAll = this.skuAll;
           var chosenPropNames  = [],
               chosenPropValues = [],
               noselProp;
           sels.each(function(i,s){
               chosenPropNames.push($(s).parent().prev().text().replace(':',''));
               chosenPropValues.push($(s).text());
           });
           noselProp = _.difference(this.propsName,chosenPropNames);
           var seltxt = '',
               promotxt = '',
               priceor = this.priceori,
               pricepo = this.priceomo,
               tjbText = this.tjbText;
           if(len == 0){  // no select
               skuSel.addClass('none');
           }
           else if(len == allLen){  // all select
               seltxt = '已选：'+_.map(chosenPropValues,function(n){return '"'+n+'"';}).join(' ');
               var temp = _.map(sels,function(n){return n.getAttribute('data-id')}),
                   tempobj = this.availSKUs[temp.join(';')];
               promotxt = this.promoTxt+'：<em class="red">￥'+(tempobj.promoPrice || tempobj.price) + tjbText +'</em>'+ (!this.isJu && '(库存'+tempobj.quantity+'件)' || '');
               priceor = '￥' + tempobj.price;
               pricepo = tempobj.promoPrice && ('￥' + tempobj.promoPrice) || priceor;
               pricepo += tjbText;
               /*if(tempobj.tmall){  //天猫特色服务
                skuSep.find('span').html(tempobj.tmall);
                skuSep.removeClass('none');
                }*/
               skuLap.removeClass('none');
               this.skuId.val(tempobj.skuId);
           }
           else{
               seltxt = '已选："'+chosenPropValues.join(' ')+'" 还未选 <em class="red">'+noselProp.join(' ')+'</em>';
               skuSel.removeClass('none');
               skuSep.addClass('none');
               skuLap.addClass('none');
           }
           skuSel.html(seltxt);
           skuLap.html(promotxt);
           this.porigin.html(priceor);  //cost price
           this.ppromo && this.ppromo.html(pricepo);  //promo price
           this.height = skuAll.height();
       },
       disable : function(){
           var that = this;
           $props.removeClass('disabled');
           var $sels = $('.sel');
           if ($sels.length == 0) return;
           if ($('.dsmp-v').length == 1) return;    // just one property, no need to disable values
           $props.each(function() {
               var $this = $(this);
               if ($this.hasClass('sel')) {
                   var $others = $this.parent().parent().siblings().find('i');  // values of other properties
                   $others.each(function(i, e) {
                       var available = false;
                       for ( var key in that.availSKUs ) {
                           if ( key.search( $this.attr('data-id') ) > -1 && key.search( $others.eq(i).attr('data-id') ) > -1 ) {
                               available = true;
                               break;
                           }
                       }
                       if ( !available ) $others.eq(i).addClass('disabled');
                   });
               }
           });
       },
       setImgEle : function(){
           var width = this.width,
               outerArr = this.skuAll.find('.dsmp-v'),
               arr,tempw,$prev,$this;
           outerArr.each(function(){   //每行的最后一个标识
               arr = $(this).find('i');
               tempw = 0;
               for(var i=0,len=arr.length;i<len;i++){
                   $this = $(arr[i]);
                   tempw += ($this.width() + 10);
                   $this.removeClass('last');
                   if(tempw > width){
                       $prev = $this.prev();
                       $prev = $prev.hasClass('ds-insert') && $prev.prev() || $prev;  //排除插入的span元素
                       $prev.addClass('last');
                       tempw = ($this.width() + 10);
                   }
               }
               arr.last().addClass('last');  // increase 'last' if it's this last
           });
       },
       adjust : function(){
           $props =  $('.dsmp-v i');
           var $this,width;
           $props.each(function() {
               $this = $(this);
               width = $this.width();
               if ( width < 32 ) { $this.addClass('a');}
               else if ( width < 80 )  { $this.addClass('b');}
               else if ( width < 138 ) { $this.addClass('c');}
               else { $this.addClass('d');}
           });
           this.setImgEle();
       },
       render : function(){

           var that = this,
               skuProps = that.skuProps;
           //console.log(skuProps);
           if(skuProps.length) this.el.show();
           else this.el.hide();
           var content = that.outputHtml(skuProps);
           console.log(that.skuAll);
           console.log(content);

           that.skuAll.html(content);

           if(that.firstLoad){
               that.contract();
               //that.options.action.previousAction(that.availSKUs,that);
               that.isIpad && that.unfold('noScroll');
               that.firstLoad = null;
           }
           else{
               that.resize(that.adjust);
           }
       },
       outputHtml : function(json){
           var props = this.propsName = _.pluck(json,'name'),
               content = ['<p class="dsm-s">请选择 <em class="red">'+props.join('/')+'</em></p>'];
           for(var i=0,len=json.length;i<len;i++){
               content.push('<div class="dsm-p"><p class="dsmp-n">'+json[i].name+':</p><div class="dsmp-v">');
               _.each(json[i].values,function(item){
                   content.push('<i data-id="'+item.id+'" '+(item.img && "data-img="+item.img+"" || "")+'>'+item.txt+'</i>');
               });
               content.push('</div></div>');
           }
           content.push('<p class="dsm-sel none"></p><p class="dst-sep none">特色服务：<span class="gray12"></span></p><p class="dsm-lap none"></p>');
           content.push('<div class="dsm-f"><a id="sku-drow" href="#" class="dsmf-a"><b class="aw up"></b></a></div>');
           return content.join('');
       },
       destroy : function(){
           //this.undelegateEvents(); //清除events内的事件
           this.skuId = this.skuLimit = this.skuAll = this.porigin = this.ppromo = this.skuSel = this.skuLap = this.skuSep = $props = null;
           this.remove();
       }
   }


})(window['app']);
(function (app, undef) {

    var myGood = app.page.define({
        name:"myGood",
        title:'我的商品', //title bar的文案
        route:"my\/p(P<pageNo>\\d+)",
        templates:{
            "layout":JST['template/good_layout'],
            "commentItem":JST['template/good_commentItem'],
            "goodItem":JST['template/good_item'],
            "no_order":JST['template/error_no_order']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],


        events:{
            "click .J-addPic":"triggerUploader",
            "click .view-comments":"gotoViewAll"
        },


        gotoViewAll:function (e) {
            e.preventDefault();
            var mod = $(e.currentTarget).parents(".z-mod");
            var itemId = mod.attr("data-itemid");
            var ratedUid = mod.attr("data-rateduid");
            app.navigation.push("viewAll/" + itemId + "/" + ratedUid + "/p1");

        },


        _queryComments:function (ids, itemIdForBind, orderIdArr) {

            var self = this;


            var data = {"ratedUid":"0", "itemIds":ids.join(","), "pageSize":"150", "pageIndex":"1"};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (resp) {

                if (resp.ret && resp.ret[0] == 'SUCCESS::调用成功' && resp.data) {

                    var list = resp.data.dataList;

                    console.log(ids);

                    _.each(ids, function (id, index) {

                        var t = _.where(list, {"aucNumId":id, "parentTradeId":orderIdArr[index]});

                        var comment1 = t.length > 0 ? t[0] : false;

                        $("#J-comment-" + itemIdForBind[index]).html(self.templates['commentItem']({comment:comment1}));

                    })
                } else {
                    notification.flash("请求商品评论失败，请刷新");
                }
            }, function (error) {
                notification.flash("网络出错，请稍后再试!").show();
            });

        },
        // load good list
        loadGoodList:function () {

            var self = this;
            var navigation = app.navigation;
            var pageNo = navigation.getParameter("pageNo");
            var itemIdsArr = [];
            var itemIdForBind = [];
            var orderIdArr = [];


            var data = {"fromIndex":"0", "toIndex":"4"};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryOrderList', '1.0', data, {}, function (resp) {

                var content = $(app.component.getActiveContent()).find("#J-goodList");
                var ret = resp.ret[0];
                if (resp.ret && resp.ret[0] == 'SUCCESS::调用成功' && resp.data) {

                    //TODO:write a parse function to flatten the child order
                    var goodList = resp.data.result;

                    console.log(goodList);

                    content.html(self.templates['goodItem']({goods:goodList}));

                    $(".z-mod").each(function (index, node) {
                        itemIdsArr.push($(node).attr("data-itemId"));
                        itemIdForBind.push($(node).attr("data-id"));
                        orderIdArr.push($(node).attr("data-orderId"));
                    });

                    self._queryComments(itemIdsArr, itemIdForBind, orderIdArr);

                    self.pageNav = new PageNav({'id':'#J-goodsPage', 'index':1, 'pageCount':Math.ceil(resp.data.total / 10), 'objId':'p'});

                } else if (resp.data) {
                    content.html(self.templates['no_order']());
                } else {
                    notification.flash(ret.split("::")[1]).show();
                }

            }, function (error) {
                notification.flash("网络出错，请稍后再试!").show();
            });

        },


        _testCanUpload:function () {
            var canUpload;
            if (navigator.userAgent.indexOf("OS") > -1) {
                var ua = navigator.userAgent;
                var c = ua.charAt(ua.indexOf("OS") + 3);
                canUpload = c >= 6;
            } else {
                canUpload = false;
            }


            canUpload = true;

            return canUpload;
        },


        triggerUploader:function (e) {
            e.preventDefault();

            var currentTarget = e.currentTarget;
            var item = $(currentTarget).parents(".z-mod");
            var canUpload = this._testCanUpload();

            if (!canUpload) {
                alert("抱歉！您的手机浏览器暂不支持网页上传图片功能。");
            }

            app.ZDMData.ratedUid = item.attr("data-rateduid");
            console.log(app.ZDMData.ratedUid);
            app.ZDMData.tradeId = item.attr("data-tradeid");
            app.ZDMData.parentTradeId = item.attr("data-parentTradeId");
            app.ZDMData.aucNumId = item.attr("data-itemId");


            app.navigation.push("upload", {datas:{"canUpload":canUpload}});


        },

        ready:function () {
            // implement super.ready
            var self = this;
            var content = $(app.component.getActiveContent());
            var navigation = app.navigation;

            content.html(self.templates['layout']());

            //delegate events
            app.Util.Events.call(this, "#tbh5v0", this.events);


            this.loadGoodList();
        },

        unload:function () {
            // implement super.unload

        }

    });


})(window['app']);
(function (app, undef) {

    var viewAll = app.page.define({
        name:"viewAll",
        title:'所有评论', //title bar的文案
        route:"viewAll\/(P<itemId>\\d+)\/(P<ratedUid>\\d+)\/p(P<pageNo>\\d+)",
        templates:{
            "layout":JST['template/viewall_layout']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],


        _queryComments:function () {

            var self = this;

            var pageNo = app.navigation.getParameter("pageNo");
            var data = {"ratedUid":this.ratedUid, "tradeId":"0", "itemIds":this.itemId, "pageSize":"10", "pageIndex":pageNo || 1};
            var totalPage = 1;
            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (result) {

                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    var comments = result.data.dataList;
                    var html = self.templates['layout']({good:result.data.data, comments:comments});


                    $(app.component.getActiveContent()).find("#J_viewAllLayout").html(html);

                    var totalSize = result.data.total;
                    if (totalSize < 10) {
                        totalPage = 1;
                    } else if (totalSize == 10 && result.data.hasNext == "true") {
                        totalPage = 50;
                    } else if (totalSize <= 10 && result.data.hasNext == "false") {
                        totalPage = 1;
                    }

                    var pageInstance = self.pageNav = new PageNav({'id':'#J-allComments', 'index':1, 'pageCount':totalPage, 'objId':'p'});

                } else {
                    notification.flash("评论请求失败，请重试").show();
                }

            });

        },


        events:{
            "click #J-gotoMy":"gotoMyGood"

        },

        gotoMyGood:function (e) {
            e.preventDefault();
            app.navigation.push("my/p1");

        },


        triggerUploader:function (e) {
            e.preventDefault();
            $("#J-upload").trigger("click");

            $("#J-upload").on("change", function () {
                app.navigation.push("upload", {datas:{"picInput":$("#J-upload")}});
            });

        },

        ready:function () {
            // implement super.ready
            var self = this;
            var content = $(app.component.getActiveContent());
            var navigation = app.navigation;

            this.itemId = navigation.getParameter("itemId");
            this.ratedUid = navigation.getParameter("ratedUid");

            content.html('<section id="J_viewAllLayout" class="innercontent"></section>');

            //delegate events
            app.Util.Events.call(this, "#J_viewAllLayout", this.events);

            this._queryComments();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);
(function (app, undef) {

    var upload = app.page.define({
        name:"upload",
        title:'', //title bar的文案
        route:"upload",
        templates:{
            "layout":JST['template/add_pic'],
            "commentItem":JST['template/comment_item'],
            "goodItem":JST['template/good_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            },
            {
                type:"func",
                text:"上传图片",
                handler:function () {
                    $("#J-imgForm").submit();
                }
            }
        ],

        events:{
            "click #J-addPicBtn":"triggerUploader"
        },

        triggerUploader:function (e) {
            e.preventDefault();
            $("#J-upload").trigger("click");




        },

        ready:function () {
            // implement super.ready
            var self = this;
            var content = $(app.component.getActiveContent());
            var navigation = app.navigation;

            content.html(this.templates['layout']());


            //delegate events
            app.Util.Events.call(this, "#J-uploader", this.events);

            if (app.navigation._cur.state.datas) {
                var canUpload = app.navigation.getData("canUpload");
                if(!canUpload){
                    $("#J-addPicWrap").hide();
                }
                $("#J-ratedUid").val(app.ZDMData.ratedUid);
                $("#J-tradeId").val(app.ZDMData.tradeId);
                $("#J-itemId").val(app.ZDMData.aucNumId);
            }

            $("#J_CommentPoster").keyup(function () {
                var val = $(this).val(),
                    valCount = val.replace("/[^/x00-/xff]/g", "**").length;
                $("#J-num").text(valCount);
                if (valCount >= 140) {
                    $(this).val(val.substr(0, 140));
                }
            });

            $("#J-upload").on("change",function(){
                $("#J-uploaderTrigger").hide();
                $("#J-uploaded").show();
            });


        },

        unload:function () {
            // implement super.unload
        }

    });

})(window['app']);
(function (app, undef) {

    var comment = app.page.define({
        name:"comment",
        title:'评论', //title bar的文案
        route:"comment\/(P<id>\\d+)",
        templates:JST['template/comment'],
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'宝贝详情'
            }
        ],


        ready:function () {
            // implement super.ready
            var self = this;

            this.itemId = app.navigation.getParameter("id");

            var content = $(app.component.getActiveContent());
            var id = app.navigation.getParameter("id");
            var pageNo = app.navigation.getParameter("pageNo");
            var host = app.helper.fetchHost();

            content.html('<section id="J_commentCont" class="innercontent"><div class="loading"></div></section>');

            //delegate events
            app.Util.Events.call(this, "#J_commentCont", this.events);

            this.typeg = 'good';
            this.url = 'http://a.' + host + '.taobao.com/ajax/rate_list.do';
            this.isFirst = true;
            this.tabCache = {
                "good":{first:true, second:1, page:1, total:0, sel:null, list:[]}, //second由于评论接口总页数出现问题，需要二次请求才正确
                "ok":{first:true, second:1, page:1, total:0, sel:null, list:[]},
                "bad":{first:true, second:1, page:1, total:0, sel:null, list:[]},
                "addto":{first:true, second:1, page:1, total:0, sel:null, list:[]}
            };

            this.fetch(id, pageNo);
        },


        events:{
            'click #J_commtab li':'tabClick'
        },

        typeMap:{
            "good":"1",
            "ok":"0",
            "bad":"-1",
            "addto":"2"
        },

        typePonit:{  //埋点数据
            "good":"saygood#h#detail",
            "ok":"saynormal#h#detail",
            "bad":"saybad#h#detail",
            "addto":"addsay#h#detail"
        },

        tabClick:function (e) {

            e.preventDefault();

            scrollTo(0, 0);
            var that = this,
                target = $(e.currentTarget);

            if (target.hasClass('cur')) {
                return;
            }
            that.curLi || (that.curLi = target.parent().find('li.cur'));
            target.addClass('cur');
            that.curLi.removeClass('cur');
            that.curLi = target;
            var tabCache = that.tabCache[that.typeg],
                tsel = tabCache.sel;
            tsel && tsel.addClass('none');

            that.typeg = target.attr('s');
            var curCache = that.tabCache[that.typeg];
            curCache.total && that.pagebar.removeClass('none') || that.pagebar.addClass('none');  //页码显示和隐藏
            curCache.first = true;
            that.getData();
            utils.sendPoint(that.typePonit[that.typeg]);
            //});
        },
        render:function (json, n) {
            var that = this,
                cache = that.tabCache[that.typeg],
                htmldom = that.templates(json),
                $htmldom = $(htmldom),
                ul = json.items && json.items.length && $htmldom.find('#J_commcont ul') || $('<p class="itc-p">无评论</p>');

            if (that.isFirst) {  //only once

                $("#J_commentCont").html($htmldom);
                that.contbar || (that.contbar = $('#J_commcont'));
                that.loading || (that.loading = $('#J_listload'));
                that.pagebar || (that.pagebar = $('#J_dcpage'));
                json.items && json.items.length || that.contbar.append(ul);
                //  open.loadHide();
            }
            cache.sel && cache.sel.addClass('none');
            cache.list[n] = ul;
            cache.sel = ul;
            that.loading.addClass('none');
            that.isFirst || that.contbar.append(ul);
        },

        fetch:function (id, page) {

            var that = this;
            if (!id) {
                return;
            }
            that.itemId = id;
            that.xhr && that.xhr.abort();
            page = page || 1;
            var url = that.url;
            var isContainMark = url.indexOf('?') != -1;

            url += that.isFirst && (isContainMark && '&first=1' || '?first=1') || '';
            url += [url.indexOf('?') != -1 && '&' || '?', 't=' + Date.now()].join('');
            that.xhr = $.ajax({
                url:url,
                data:{item_id:id, rateRs:that.typeMap[that.typeg], p:page, ps:10},
                dataType:'jsonp',
                success:function (data) {
                    if (data && typeof data == 'string') {
                        data = data.replace(//gi, "");
                        data = JSON.parse(data);
                    }
                    that.fetchAfter(data, page);
                    that.xhr = null;
                },
                error:function () {
                   // tip(message.errorMessage);
                    that.xhr = null;
                    that.loading.addClass('none');
                }
            });
        },

        fetchAfter:function (data, page) {
            var that = this;
            if (data && data.items && data.items.length) {
                var cache = that.tabCache[that.typeg];
                that.render(data, page);
                if (!that.pageNav) {
                    var pageInstance = that.pageNav = new PageNav({'id':'#J_dcpage', 'index':1, 'pageCount':data.total, 'disableHash':true});
                    pageInstance.$container.on('P:switchPage', function (e, page) {
                        that.getData(page.index);
                        that.tabCache[that.typeg].page = page.index;
                        if (page.type == 'next') { // 下一页埋点
                            //     utils.sendPoint('nextpage#h#detail');暂时不设置埋点
                        }
                    });
                    cache.total = data.total;
                    cache.first = null;
                }
                if (cache.first) {  //Only initialize in first
                    cache.first = null;
                    cache.total = data.total;
                    var pageInstance = that.pageNav;
                    pageInstance.eventDetach();
                    pageInstance.init({'index':page, 'pageCount':data.total, 'disableHash':true});
                }
                if (cache.second > 1) { //评论接口总页数出现问题，需要二次请求才正确，需要再次实例pagenav
                    if (cache.second == 2) {
                        cache.total = data.total;
                        var pageInstance = that.pageNav;
                        pageInstance.eventDetach();
                        pageInstance.init({'index':page, 'pageCount':data.total, 'disableHash':true});
                        cache.second += 1;
                    }
                }
                else {
                    cache.second += 1;
                }
                that.pagebar.removeClass('none');
            }
            else if (data) {
                that.render(data, page);
            }
            /*if(that.isFirst && !that.tmall){  //第一次且不是tmall
             var arr = ["feedGoodCount","allNormalCount","allBadCount","allAppendCount"],
             ems = that.tabar.find('em');
             ems.each(function(index,item){
             item.innerHTML = ['(',data[arr[index]],')'].join(' ');
             });
             }*/
            that.isFirst = null;
            that.loading.addClass('none');
        },
        getData:function (n) {
            var that = this,
                type = that.typeg,
                cache = that.tabCache[type],
                list = cache.list,
                page = n || cache['page'];
            n && scrollTo(0, 0);
            cache.sel && cache.sel.addClass('none');
            if (list[page]) {
                list[page].removeClass('none');
                cache.sel = list[page];
                if (cache.first) {  //Only initialize in first
                    cache.first = null;
                    var pageInstance = that.pageNav;
                    if (!pageInstance) {
                        return;
                    }
                    pageInstance.eventDetach();
                    pageInstance.init({'index':page, 'pageCount':cache.total, 'disableHash':true});
                }
            }
            else {
                that.pagebar.addClass('none');
                that.loading.removeClass('none');
                that.fetch(that.itemId, n);
            }
        },
        destroy:function () {
            this.pageNav && this.pageNav.eventDetach();
            this.undelegateEvents();
            this.$el.html('');
            this.$el = null;
        },


        unload:function () {
            // implement super.unload
        }
    });


})(window['app']);
(function (app, undef) {


    Object.extend(app.helper,{

        commentCreditToRank:function (credit) {
            var rank = 0;
            if (credit >= 4 && credit <= 10) {
                rank = 1;
            } else if (credit >= 11 && credit <= 40) {
                rank = 2;
            } else if (credit >= 41 && credit <= 90) {
                rank = 3;
            } else if (credit >= 91 && credit <= 150) {
                rank = 4;
            } else if (credit >= 151 && credit <= 250) {
                rank = 5;
            } else if (credit >= 251 && credit <= 500) {
                rank = 6;
            } else if (credit >= 501 && credit <= 1000) {
                rank = 7;
            } else if (credit >= 1001 && credit <= 2000) {
                rank = 8;
            } else if (credit >= 2001 && credit <= 5000) {
                rank = 9;
            } else if (credit >= 5001 && credit <= 10000) {
                rank = 10;
            } else if (credit >= 10001 && credit <= 20000) {
                rank = 11;
            } else if (credit >= 20001 && credit <= 50000) {
                rank = 12;
            } else if (credit >= 50001 && credit <= 100000) {
                rank = 13;
            } else if (credit >= 100001 && credit <= 200000) {
                rank = 14;
            } else if (credit >= 200001 && credit <= 500000) {
                rank = 15;
            } else if (credit >= 500001 && credit <= 1000000) {
                rank = 16;
            } else if (credit >= 1000001 && credit <= 2000000) {
                rank = 17;
            } else if (credit >= 2000001 && credit <= 5000000) {
                rank = 18;
            } else if (credit >= 5000001 && credit <= 10000000) {
                rank = 19;
            } else if (credit >= 10000001) {
                rank = 20;
            }
            return rank;
        },

        rank:function (credit) {
            var rank = this.commentCreditToRank(credit),
                ranks = [ '', '颗心', '颗黄钻', '金冠', '紫冠' ],
                r = Math.ceil(rank / 5),
                n = ( rank - 5 * ( r - 1 ) ) % 6;
            return rank ? ( n + ' ' + ranks[ r ] ) : "";
        }

    })


})(window['app']);
(function (app, undef) {


    Object.extend(app.helper,{

        commentCreditToRank:function (credit) {
            var rank = 0;
            if (credit >= 4 && credit <= 10) {
                rank = 1;
            } else if (credit >= 11 && credit <= 40) {
                rank = 2;
            } else if (credit >= 41 && credit <= 90) {
                rank = 3;
            } else if (credit >= 91 && credit <= 150) {
                rank = 4;
            } else if (credit >= 151 && credit <= 250) {
                rank = 5;
            } else if (credit >= 251 && credit <= 500) {
                rank = 6;
            } else if (credit >= 501 && credit <= 1000) {
                rank = 7;
            } else if (credit >= 1001 && credit <= 2000) {
                rank = 8;
            } else if (credit >= 2001 && credit <= 5000) {
                rank = 9;
            } else if (credit >= 5001 && credit <= 10000) {
                rank = 10;
            } else if (credit >= 10001 && credit <= 20000) {
                rank = 11;
            } else if (credit >= 20001 && credit <= 50000) {
                rank = 12;
            } else if (credit >= 50001 && credit <= 100000) {
                rank = 13;
            } else if (credit >= 100001 && credit <= 200000) {
                rank = 14;
            } else if (credit >= 200001 && credit <= 500000) {
                rank = 15;
            } else if (credit >= 500001 && credit <= 1000000) {
                rank = 16;
            } else if (credit >= 1000001 && credit <= 2000000) {
                rank = 17;
            } else if (credit >= 2000001 && credit <= 5000000) {
                rank = 18;
            } else if (credit >= 5000001 && credit <= 10000000) {
                rank = 19;
            } else if (credit >= 10000001) {
                rank = 20;
            }
            return rank;
        },

        rank:function (credit) {
            var rank = this.commentCreditToRank(credit),
                ranks = [ '', '颗心', '颗黄钻', '金冠', '紫冠' ],
                r = Math.ceil(rank / 5),
                n = ( rank - 5 * ( r - 1 ) ) % 6;
            return rank ? ( n + ' ' + ranks[ r ] ) : "";
        }

    })


})(window['app']);
(function (app, undef) {

    var imaglet = app.page.define({
        name:"imaglet",
        title:'<div class="headerTab"><span class="h-tab">图文详情</span><span class="h-tab">产品参数</span></div>', //title bar的文案
        route:"imaglet\/(P<id>\\d+)",
        templates:JST['template/imaglet'],
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'宝贝详情'
            }
        ],

        events:{
            //'click #J_commtab li':'tabClick'


        },

        _formatImg:function(str){
            var f = '300x300';
             var content = str.replace(/<img[^>]+taobao[^>]+jpg[^>]*>/ig, function(img) {
                    if(img.search(/\d+x\d+\.jpg/) > -1 || img.match(/jpg/g).length > 1)  return img;
                    var s = img.indexOf('"') + 1,
                        e = img.lastIndexOf('"'),
                        src = img.slice(s,e);
                    return img.slice(0,s) + app.Util.getWebpImg(src,f) + img.slice(e);
                });
            return content;
        },



        ready:function () {
            // implement super.ready
            var that = this;

            var id = this.itemId  = app.navigation.getParameter("id");
            var content = $(app.component.getActiveContent());
            content.html(this.templates());


            this.el = content;



            var host = app.helper.fetchHost();
            //this.url = 'json/desc.json';
            this.url = 'http://a.' + host + '.taobao.com/ajax/desc_list.do';
            //this.loading = this.$('#J_icload');
            //this.contbar = this.$('#J_imagetCont_ic');
            this.imgSize = '300x300';
            this.isFirst = true;
            this.cachePages = [];




            //delegate events
            app.Util.Events.call(this, "#J-myGood", this.events);


            this.fetch(id);

        },


        imaget: function(e) {
            var t = this;
            t.toSlide("imaget", 3, function() {
                t.allRun();
                var n = r(".headers .imaget .main");
                if (t.isIF)
                    t.imagetViewInstance = new c({el: "#imaget"}), t.imagetViewInstance.fetch(e), t.iItem = e, t.isIF = !1, t.isParamFirst = !0, n.on("click", function(i) {
                        i.preventDefault();
                        var o = r(i.target);
                        if (o.hasClass("highlight"))
                            return;
                        var u = n.find("a.highlight"), a = "#J_";
                        a += o.attr("s"), curdiv = r(a);
                        if (!curdiv.length)
                            return;
                        u.removeClass("highlight"), o.addClass("highlight"), r("#J_" + u.attr("s")).addClass("none"), curdiv.removeClass("none"), a == "#J_param" && t.isParamFirst && (t.imagetViewInstance.fetchParam(e), t.isParamFirst = null), s.sendPoint(a != "#J_param" ? "picdetail#h#detail" : "pddetail#h#detail")
                    });
                else if (t.iItem != e) {
                    t.imagetViewInstance && t.imagetViewInstance.destroy(), t.isParamFirst = !0;
                    var i = n.children()[0];
                    i.className != "highlight" && (i.className = "highlight", n.children()[1].className = ""), t.imagetViewInstance = new c({el: "#imaget"}), t.imagetViewInstance.fetch(e), t.iItem = e
                } else
                    d.loadHide()
            }), t.calcelFullScreen()
        },

        unload:function () {
            // implement super.unload
        },


        template : function($data){
            /*var that=this;
             $.ajax({
             url : './js/template/imaget.html',
             type : "get",
             dataType : "html",
             success : function(html){
             console.log(template.compile('imaget',html))
             if(that.imagetTmpl){
             template.compile('imaget',html)
             }
             }
             });*/
            var $helpers=this,$out='';
            $out+='<section class=\"innercontent\">\r\n	<div id=\"J_imagetCont\">\r\n		<div id=\"J_imagetCont_ic\" class=\"it-cont\"></div>\r\n		<div id=\"J_icpage\" class=\"c-pnav-con\"></div>\r\n	</div>\r\n	<div id=\"J_param\" class=\"it-param none\">\r\n		<div id=\"J_paload\" class=\"c-loading dc-load\">\r\n			<span></span>\r\n		</div>\r\n	</div>\r\n</section>\r\n';
            return $out;
        },

        format : function(str){
            var f = this.imgSize,
                content = str.replace(/<img[^>]+taobao[^>]+jpg[^>]*>/ig, function(img) {
                    if(img.search(/\d+x\d+\.jpg/) > -1 || img.match(/jpg/g).length > 1)  return img;
                    var s = img.indexOf('"') + 1,
                        e = img.lastIndexOf('"'),
                        src = img.slice(s,e);
                    return img.slice(0,s) + app.Util.getWebpImg(src,f) + img.slice(e);
                });
            return content;
        },
        render: function(n){
            scrollTo(0,0);
            n = n || 1;
            var that = this,
                datas;
            if(that.cachePages[n-1]){
                datas = that.cachePages[n-1];
            }
            else{
                datas = that.format(that.list[n-1]);
                that.cachePages[n-1] = datas;
            }
            if(that.isFirst){
                that.el.html(that.template());
                that.contbar || (that.contbar = $('#J_imagetCont_ic'));
                that.isFirst = null;
            }
            that.isFirst || that.contbar.html(datas);
            //that.loading.addClass('none');
        },
        fetch : function(id){
            var that = this;
            //that.loading.removeClass('none');
            $.ajax({
                url: that.url,
                dataType: 'jsonp',
                data : {item_id : id},
                success: function(data){
                    if(data && data.pages && data.pages.length){
                        that.list = data.pages;
                        that.images = that.images;
                        that.render();
                        if(!that.pageNav){
                            var pageInstance = that.pageNav = new PageNav({'id':'#J_icpage','index':1,'pageCount':data.pages.length,'disableHash':true});
                            pageInstance.$container.on('P:switchPage',function(e,page){
                                that.render(page.index);
                                if(page.type == 'next'){ // 下一页埋点
                                    //utils.sendPoint('nextpage2#h#detail');
                                }
                            });
                        }
                    }
                    else{
                        that.list = ['<p class="itc-p">无图文详情</p>'];
                        that.render();
                        //that.loading.addClass('none');
                    }
                   // open.loadHide();
                },
                error: function(){
                    that.el.html('<p class="itc-p">' + message.errorMessage + '</p>');
                   // open.loadHide();
                    //that.loading.addClass('none');
                }
            });
        },
        fetchParam : function(id){
            this.paramInstance = new paramView({el : '#J_param'});
            this.paramInstance.getData(id);
        },
        destroy : function(){
            this.paramInstance && this.paramInstance.destroy();
            this.pageNav && this.pageNav.eventDetach();
            this.el.html('');
            this.el = null;
        }









    });


})(window['app']);

































