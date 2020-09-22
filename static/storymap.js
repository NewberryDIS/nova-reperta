/* storymapjs - v0.7.5 - 2020-06-18
 * Copyright (c) 2020 Northwestern University Knight Lab
 */
(function(root) {
  root.VCO = { VERSION: "0.1", _originalL: root.VCO };
})(this);
VCO.debug = true;
VCO.Bind = function(fn, obj) {
  return function() {
    return fn.apply(obj, arguments);
  };
};
trace = function(msg) {
  if (VCO.debug) {
    if (window.console) {
      console.log(msg);
    } else if (typeof jsTrace != "undefined") {
      jsTrace.send(msg);
    } else {
    }
  }
};
VCO.Util = {
  extend: function(dest) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var j = 0, len = sources.length, src; j < len; j++) {
      src = sources[j] || {};
      for (var i in src) {
        if (src.hasOwnProperty(i)) {
          dest[i] = src[i];
        }
      }
    }
    return dest;
  },
  setOptions: function(obj, options) {
    obj.options = VCO.Util.extend({}, obj.options, options);
    if (obj.options.uniqueid === "") {
      obj.options.uniqueid = VCO.Util.unique_ID(6);
    }
  },
  findArrayNumberByUniqueID: function(id, array, prop) {
    var _n = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i].data[prop] == id) {
        trace(array[i].data[prop]);
        _n = i;
      }
    }
    return _n;
  },
  convertUnixTime: function(str) {
    var pattern = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/;
    if (str.match(pattern)) {
      var date_parts = str.match(pattern).slice(1);
    }
    var date_array = [];
    for (var i = 0; i < date_parts.length; i++) {
      var val = parseInt(date_parts[i]);
      if (i == 1) {
        val = val - 1;
      }
      date_array.push(val);
    }
    date = new Date(
      date_array[0],
      date_array[1],
      date_array[2],
      date_array[3],
      date_array[4],
      date_array[5]
    );
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    year = date.getFullYear();
    month = months[date.getMonth()];
    day = date.getDate();
    time = month + ", " + day + " " + year;
    return time;
  },
  setData: function(obj, data) {
    obj.data = VCO.Util.extend({}, obj.data, data);
    if (obj.data.uniqueid === "") {
      obj.data.uniqueid = VCO.Util.unique_ID(6);
    }
  },
  mergeData: function(data_main, data_to_merge) {
    var x;
    for (x in data_to_merge) {
      if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
        data_main[x] = data_to_merge[x];
      }
    }
    return data_main;
  },
  updateData: function(data_main, data_to_merge) {
    var x;
    for (x in data_main) {
      if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
        data_main[x] = data_to_merge[x];
      }
    }
    return data_main;
  },
  stamp: (function() {
    var lastId = 0,
      key = "_vco_id";
    return function(obj) {
      obj[key] = obj[key] || ++lastId;
      return obj[key];
    };
  })(),
  isArray: (function() {
    if (Array.isArray) {
      return Array.isArray;
    }
    var objectToStringFn = Object.prototype.toString,
      arrayToStringResult = objectToStringFn.call([]);
    return function(subject) {
      return objectToStringFn.call(subject) === arrayToStringResult;
    };
  })(),
  unique_ID: function(size, prefix) {
    var getRandomNumber = function(range) {
      return Math.floor(Math.random() * range);
    };
    var getRandomChar = function() {
      var chars = "abcdefghijklmnopqurstuvwxyz";
      return chars.substr(getRandomNumber(32), 1);
    };
    var randomID = function(size) {
      var str = "";
      for (var i = 0; i < size; i++) {
        str += getRandomChar();
      }
      return str;
    };
    if (prefix) {
      return prefix + "-" + randomID(size);
    } else {
      return "vco-" + randomID(size);
    }
  },
  htmlify: function(str) {
    if (VCO.Browser.chrome) {
      str = VCO.Emoji(str);
    }
    if (str.match(/<p>[\s\S]*?<\/p>/)) {
      return str;
    } else {
      return "<p>" + str + "</p>";
    }
  },
  getParamString: function(obj) {
    var params = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        params.push(i + "=" + obj[i]);
      }
    }
    return "?" + params.join("&");
  },
  formatNum: function(num, digits) {
    var pow = Math.pow(10, digits || 5);
    return Math.round(num * pow) / pow;
  },
  falseFn: function() {
    return false;
  },
  requestAnimFrame: (function() {
    function timeoutDefer(callback) {
      window.setTimeout(callback, 1e3 / 60);
    }
    var requestFn =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      timeoutDefer;
    return function(callback, context, immediate, contextEl) {
      callback = context ? VCO.Util.bind(callback, context) : callback;
      if (immediate && requestFn === timeoutDefer) {
        callback();
      } else {
        requestFn(callback, contextEl);
      }
    };
  })(),
  bind: function(fn, obj) {
    return function() {
      return fn.apply(obj, arguments);
    };
  },
  template: function(str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function(str, key) {
      var value = data[key];
      if (!data.hasOwnProperty(key)) {
        throw new Error("No value provided for variable " + str);
      }
      return value;
    });
  },
  hexToRgb: function(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },
  ratio: {
    square: function(size) {
      var s = { w: 0, h: 0 };
      if (size.w > size.h && size.h > 0) {
        s.h = size.h;
        s.w = size.h;
      } else {
        s.w = size.w;
        s.h = size.w;
      }
      return s;
    },
    r16_9: function(size) {
      if (size.w !== null && size.w !== "") {
        return Math.round((size.w / 16) * 9);
      } else if (size.h !== null && size.h !== "") {
        return Math.round((size.h / 9) * 16);
      } else {
        return 0;
      }
    },
    r4_3: function(size) {
      if (size.w !== null && size.w !== "") {
        return Math.round((size.w / 4) * 3);
      } else if (size.h !== null && size.h !== "") {
        return Math.round((size.h / 3) * 4);
      }
    },
  },
  getObjectAttributeByIndex: function(obj, index) {
    if (typeof obj != "undefined") {
      var i = 0;
      for (var attr in obj) {
        if (index === i) {
          return obj[attr];
        }
        i++;
      }
      return "";
    } else {
      return "";
    }
  },
  urljoin: function(base_url, path) {
    if (base_url.length && base_url[base_url.length - 1] == "/") {
      base_url = base_url.substring(0, base_url.length - 1);
    }
    if (path.length && path[0] == "/") {
      path = path.substring(1);
    }
    var url1 = base_url.split("/");
    var url2 = path.split("/");
    var url3 = [];
    for (var i = 0, l = url1.length; i < l; i++) {
      if (url1[i] == "..") {
        url3.pop();
      } else if (url1[i] == ".") {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }
    for (var i = 0, l = url2.length; i < l; i++) {
      if (url2[i] == "..") {
        url3.pop();
      } else if (url2[i] == ".") {
        continue;
      } else {
        url3.push(url2[i]);
      }
    }
    return url3.join("/");
  },
  getUrlVars: function(string) {
    var str,
      vars = [],
      hash,
      hashes;
    str = string.toString();
    if (str.match("&#038;")) {
      str = str.replace("&#038;", "&");
    } else if (str.match("&#38;")) {
      str = str.replace("&#38;", "&");
    } else if (str.match("&amp;")) {
      str = str.replace("&amp;", "&");
    }
    hashes = str.slice(str.indexOf("?") + 1).split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
};
(function(VCO) {
  var Zepto = (function() {
    var undefined,
      key,
      $,
      classList,
      emptyArray = [],
      slice = emptyArray.slice,
      filter = emptyArray.filter,
      document = window.document,
      elementDisplay = {},
      classCache = {},
      cssNumber = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1,
      },
      fragmentRE = /^\s*<(\w+|!)[^>]*>/,
      singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      rootNodeRE = /^(?:body|html)$/i,
      capitalRE = /([A-Z])/g,
      methodAttributes = [
        "val",
        "css",
        "html",
        "text",
        "data",
        "width",
        "height",
        "offset",
      ],
      adjacencyOperators = ["after", "prepend", "before", "append"],
      table = document.createElement("table"),
      tableRow = document.createElement("tr"),
      containers = {
        tr: document.createElement("tbody"),
        tbody: table,
        thead: table,
        tfoot: table,
        td: tableRow,
        th: tableRow,
        "*": document.createElement("div"),
      },
      readyRE = /complete|loaded|interactive/,
      classSelectorRE = /^\.([\w-]+)$/,
      idSelectorRE = /^#([\w-]*)$/,
      simpleSelectorRE = /^[\w-]*$/,
      class2type = {},
      toString = class2type.toString,
      zepto = {},
      camelize,
      uniq,
      tempParent = document.createElement("div"),
      propMap = {
        tabindex: "tabIndex",
        readonly: "readOnly",
        for: "htmlFor",
        class: "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable",
      },
      isArray =
        Array.isArray ||
        function(object) {
          return object instanceof Array;
        };
    zepto.matches = function(element, selector) {
      if (!selector || !element || element.nodeType !== 1) return false;
      var matchesSelector =
        element.webkitMatchesSelector ||
        element.mozMatchesSelector ||
        element.oMatchesSelector ||
        element.matchesSelector;
      if (matchesSelector) return matchesSelector.call(element, selector);
      var match,
        parent = element.parentNode,
        temp = !parent;
      if (temp) (parent = tempParent).appendChild(element);
      match = ~zepto.qsa(parent, selector).indexOf(element);
      temp && tempParent.removeChild(element);
      return match;
    };
    function type(obj) {
      return obj == null
        ? String(obj)
        : class2type[toString.call(obj)] || "object";
    }
    function isFunction(value) {
      return type(value) == "function";
    }
    function isWindow(obj) {
      return obj != null && obj == obj.window;
    }
    function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }
    function isObject(obj) {
      return type(obj) == "object";
    }
    function isPlainObject(obj) {
      return (
        isObject(obj) &&
        !isWindow(obj) &&
        Object.getPrototypeOf(obj) == Object.prototype
      );
    }
    function likeArray(obj) {
      return typeof obj.length == "number";
    }
    function compact(array) {
      return filter.call(array, function(item) {
        return item != null;
      });
    }
    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }
    camelize = function(str) {
      return str.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : "";
      });
    };
    function dasherize(str) {
      return str
        .replace(/::/g, "/")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
        .replace(/([a-z\d])([A-Z])/g, "$1_$2")
        .replace(/_/g, "-")
        .toLowerCase();
    }
    uniq = function(array) {
      return filter.call(array, function(item, idx) {
        return array.indexOf(item) == idx;
      });
    };
    function classRE(name) {
      return name in classCache
        ? classCache[name]
        : (classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)"));
    }
    function maybeAddPx(name, value) {
      return typeof value == "number" && !cssNumber[dasherize(name)]
        ? value + "px"
        : value;
    }
    function defaultDisplay(nodeName) {
      var element, display;
      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, "").getPropertyValue("display");
        element.parentNode.removeChild(element);
        display == "none" && (display = "block");
        elementDisplay[nodeName] = display;
      }
      return elementDisplay[nodeName];
    }
    function children(element) {
      return "children" in element
        ? slice.call(element.children)
        : $.map(element.childNodes, function(node) {
            if (node.nodeType == 1) return node;
          });
    }
    zepto.fragment = function(html, name, properties) {
      var dom, nodes, container;
      if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
      if (!dom) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers)) name = "*";
        container = containers[name];
        container.innerHTML = "" + html;
        dom = $.each(slice.call(container.childNodes), function() {
          container.removeChild(this);
        });
      }
      if (isPlainObject(properties)) {
        nodes = $(dom);
        $.each(properties, function(key, value) {
          if (methodAttributes.indexOf(key) > -1) nodes[key](value);
          else nodes.attr(key, value);
        });
      }
      return dom;
    };
    zepto.Z = function(dom, selector) {
      dom = dom || [];
      dom.__proto__ = $.fn;
      dom.selector = selector || "";
      return dom;
    };
    zepto.isZ = function(object) {
      return object instanceof zepto.Z;
    };
    zepto.init = function(selector, context) {
      var dom;
      if (!selector) return zepto.Z();
      else if (typeof selector == "string") {
        selector = selector.trim();
        if (selector[0] == "<" && fragmentRE.test(selector))
          (dom = zepto.fragment(selector, RegExp.$1, context)),
            (selector = null);
        else if (context !== undefined) return $(context).find(selector);
        else dom = zepto.qsa(document, selector);
      } else if (isFunction(selector)) return $(document).ready(selector);
      else if (zepto.isZ(selector)) return selector;
      else {
        if (isArray(selector)) dom = compact(selector);
        else if (isObject(selector)) (dom = [selector]), (selector = null);
        else if (fragmentRE.test(selector))
          (dom = zepto.fragment(selector.trim(), RegExp.$1, context)),
            (selector = null);
        else if (context !== undefined) return $(context).find(selector);
        else dom = zepto.qsa(document, selector);
      }
      return zepto.Z(dom, selector);
    };
    $ = function(selector, context) {
      return zepto.init(selector, context);
    };
    function extend(target, source, deep) {
      for (key in source)
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key]))
            target[key] = {};
          if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
          extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) target[key] = source[key];
    }
    $.extend = function(target) {
      var deep,
        args = slice.call(arguments, 1);
      if (typeof target == "boolean") {
        deep = target;
        target = args.shift();
      }
      args.forEach(function(arg) {
        extend(target, arg, deep);
      });
      return target;
    };
    zepto.qsa = function(element, selector) {
      var found,
        maybeID = selector[0] == "#",
        maybeClass = !maybeID && selector[0] == ".",
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
        isSimple = simpleSelectorRE.test(nameOnly);
      return isDocument(element) && isSimple && maybeID
        ? (found = element.getElementById(nameOnly))
          ? [found]
          : []
        : element.nodeType !== 1 && element.nodeType !== 9
        ? []
        : slice.call(
            isSimple && !maybeID
              ? maybeClass
                ? element.getElementsByClassName(nameOnly)
                : element.getElementsByTagName(selector)
              : element.querySelectorAll(selector)
          );
    };
    function filtered(nodes, selector) {
      return selector == null ? $(nodes) : $(nodes).filter(selector);
    }
    $.contains = function(parent, node) {
      return parent !== node && parent.contains(node);
    };
    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    function setAttribute(node, name, value) {
      value == null
        ? node.removeAttribute(name)
        : node.setAttribute(name, value);
    }
    function className(node, value) {
      var klass = node.className,
        svg = klass && klass.baseVal !== undefined;
      if (value === undefined) return svg ? klass.baseVal : klass;
      svg ? (klass.baseVal = value) : (node.className = value);
    }
    function deserializeValue(value) {
      var num;
      try {
        return value
          ? value == "true" ||
              (value == "false"
                ? false
                : value == "null"
                ? null
                : !/^0/.test(value) && !isNaN((num = Number(value)))
                ? num
                : /^[\[\{]/.test(value)
                ? $.parseJSON(value)
                : value)
          : value;
      } catch (e) {
        return value;
      }
    }
    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;
    $.isEmptyObject = function(obj) {
      var name;
      for (name in obj) return false;
      return true;
    };
    $.inArray = function(elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i);
    };
    $.camelCase = camelize;
    $.trim = function(str) {
      return str == null ? "" : String.prototype.trim.call(str);
    };
    $.uuid = 0;
    $.support = {};
    $.expr = {};
    $.map = function(elements, callback) {
      var value,
        values = [],
        i,
        key;
      if (likeArray(elements))
        for (i = 0; i < elements.length; i++) {
          value = callback(elements[i], i);
          if (value != null) values.push(value);
        }
      else
        for (key in elements) {
          value = callback(elements[key], key);
          if (value != null) values.push(value);
        }
      return flatten(values);
    };
    $.each = function(elements, callback) {
      var i, key;
      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++)
          if (callback.call(elements[i], i, elements[i]) === false)
            return elements;
      } else {
        for (key in elements)
          if (callback.call(elements[key], key, elements[key]) === false)
            return elements;
      }
      return elements;
    };
    $.grep = function(elements, callback) {
      return filter.call(elements, callback);
    };
    if (window.JSON) $.parseJSON = JSON.parse;
    $.each(
      "Boolean Number String Function Array Date RegExp Object Error".split(
        " "
      ),
      function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
      }
    );
    $.fn = {
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      sort: emptyArray.sort,
      indexOf: emptyArray.indexOf,
      concat: emptyArray.concat,
      map: function(fn) {
        return $(
          $.map(this, function(el, i) {
            return fn.call(el, i, el);
          })
        );
      },
      slice: function() {
        return $(slice.apply(this, arguments));
      },
      ready: function(callback) {
        if (readyRE.test(document.readyState) && document.body) callback($);
        else
          document.addEventListener(
            "DOMContentLoaded",
            function() {
              callback($);
            },
            false
          );
        return this;
      },
      get: function(idx) {
        return idx === undefined
          ? slice.call(this)
          : this[idx >= 0 ? idx : idx + this.length];
      },
      toArray: function() {
        return this.get();
      },
      size: function() {
        return this.length;
      },
      remove: function() {
        return this.each(function() {
          if (this.parentNode != null) this.parentNode.removeChild(this);
        });
      },
      each: function(callback) {
        emptyArray.every.call(this, function(el, idx) {
          return callback.call(el, idx, el) !== false;
        });
        return this;
      },
      filter: function(selector) {
        if (isFunction(selector)) return this.not(this.not(selector));
        return $(
          filter.call(this, function(element) {
            return zepto.matches(element, selector);
          })
        );
      },
      add: function(selector, context) {
        return $(uniq(this.concat($(selector, context))));
      },
      is: function(selector) {
        return this.length > 0 && zepto.matches(this[0], selector);
      },
      not: function(selector) {
        var nodes = [];
        if (isFunction(selector) && selector.call !== undefined)
          this.each(function(idx) {
            if (!selector.call(this, idx)) nodes.push(this);
          });
        else {
          var excludes =
            typeof selector == "string"
              ? this.filter(selector)
              : likeArray(selector) && isFunction(selector.item)
              ? slice.call(selector)
              : $(selector);
          this.forEach(function(el) {
            if (excludes.indexOf(el) < 0) nodes.push(el);
          });
        }
        return $(nodes);
      },
      has: function(selector) {
        return this.filter(function() {
          return isObject(selector)
            ? $.contains(this, selector)
            : $(this)
                .find(selector)
                .size();
        });
      },
      eq: function(idx) {
        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
      },
      first: function() {
        var el = this[0];
        return el && !isObject(el) ? el : $(el);
      },
      last: function() {
        var el = this[this.length - 1];
        return el && !isObject(el) ? el : $(el);
      },
      find: function(selector) {
        var result,
          $this = this;
        if (typeof selector == "object")
          result = $(selector).filter(function() {
            var node = this;
            return emptyArray.some.call($this, function(parent) {
              return $.contains(parent, node);
            });
          });
        else if (this.length == 1) result = $(zepto.qsa(this[0], selector));
        else
          result = this.map(function() {
            return zepto.qsa(this, selector);
          });
        return result;
      },
      closest: function(selector, context) {
        var node = this[0],
          collection = false;
        if (typeof selector == "object") collection = $(selector);
        while (
          node &&
          !(collection
            ? collection.indexOf(node) >= 0
            : zepto.matches(node, selector))
        )
          node = node !== context && !isDocument(node) && node.parentNode;
        return $(node);
      },
      parents: function(selector) {
        var ancestors = [],
          nodes = this;
        while (nodes.length > 0)
          nodes = $.map(nodes, function(node) {
            if (
              (node = node.parentNode) &&
              !isDocument(node) &&
              ancestors.indexOf(node) < 0
            ) {
              ancestors.push(node);
              return node;
            }
          });
        return filtered(ancestors, selector);
      },
      parent: function(selector) {
        return filtered(uniq(this.pluck("parentNode")), selector);
      },
      children: function(selector) {
        return filtered(
          this.map(function() {
            return children(this);
          }),
          selector
        );
      },
      contents: function() {
        return this.map(function() {
          return slice.call(this.childNodes);
        });
      },
      siblings: function(selector) {
        return filtered(
          this.map(function(i, el) {
            return filter.call(children(el.parentNode), function(child) {
              return child !== el;
            });
          }),
          selector
        );
      },
      empty: function() {
        return this.each(function() {
          this.innerHTML = "";
        });
      },
      pluck: function(property) {
        return $.map(this, function(el) {
          return el[property];
        });
      },
      show: function() {
        return this.each(function() {
          this.style.display == "none" && (this.style.display = "");
          if (getComputedStyle(this, "").getPropertyValue("display") == "none")
            this.style.display = defaultDisplay(this.nodeName);
        });
      },
      replaceWith: function(newContent) {
        return this.before(newContent).remove();
      },
      wrap: function(structure) {
        var func = isFunction(structure);
        if (this[0] && !func)
          var dom = $(structure).get(0),
            clone = dom.parentNode || this.length > 1;
        return this.each(function(index) {
          $(this).wrapAll(
            func
              ? structure.call(this, index)
              : clone
              ? dom.cloneNode(true)
              : dom
          );
        });
      },
      wrapAll: function(structure) {
        if (this[0]) {
          $(this[0]).before((structure = $(structure)));
          var children;
          while ((children = structure.children()).length)
            structure = children.first();
          $(structure).append(this);
        }
        return this;
      },
      wrapInner: function(structure) {
        var func = isFunction(structure);
        return this.each(function(index) {
          var self = $(this),
            contents = self.contents(),
            dom = func ? structure.call(this, index) : structure;
          contents.length ? contents.wrapAll(dom) : self.append(dom);
        });
      },
      unwrap: function() {
        this.parent().each(function() {
          $(this).replaceWith($(this).children());
        });
        return this;
      },
      clone: function() {
        return this.map(function() {
          return this.cloneNode(true);
        });
      },
      hide: function() {
        return this.css("display", "none");
      },
      toggle: function(setting) {
        return this.each(function() {
          var el = $(this);
          (setting === undefined
          ? el.css("display") == "none"
          : setting)
            ? el.show()
            : el.hide();
        });
      },
      prev: function(selector) {
        return $(this.pluck("previousElementSibling")).filter(selector || "*");
      },
      next: function(selector) {
        return $(this.pluck("nextElementSibling")).filter(selector || "*");
      },
      html: function(html) {
        return arguments.length === 0
          ? this.length > 0
            ? this[0].innerHTML
            : null
          : this.each(function(idx) {
              var originHtml = this.innerHTML;
              $(this)
                .empty()
                .append(funcArg(this, html, idx, originHtml));
            });
      },
      text: function(text) {
        return arguments.length === 0
          ? this.length > 0
            ? this[0].textContent
            : null
          : this.each(function() {
              this.textContent = text === undefined ? "" : "" + text;
            });
      },
      attr: function(name, value) {
        var result;
        return typeof name == "string" && value === undefined
          ? this.length == 0 || this[0].nodeType !== 1
            ? undefined
            : name == "value" && this[0].nodeName == "INPUT"
            ? this.val()
            : !(result = this[0].getAttribute(name)) && name in this[0]
            ? this[0][name]
            : result
          : this.each(function(idx) {
              if (this.nodeType !== 1) return;
              if (isObject(name))
                for (key in name) setAttribute(this, key, name[key]);
              else
                setAttribute(
                  this,
                  name,
                  funcArg(this, value, idx, this.getAttribute(name))
                );
            });
      },
      removeAttr: function(name) {
        return this.each(function() {
          this.nodeType === 1 && setAttribute(this, name);
        });
      },
      prop: function(name, value) {
        name = propMap[name] || name;
        return value === undefined
          ? this[0] && this[0][name]
          : this.each(function(idx) {
              this[name] = funcArg(this, value, idx, this[name]);
            });
      },
      data: function(name, value) {
        var data = this.attr(
          "data-" + name.replace(capitalRE, "-$1").toLowerCase(),
          value
        );
        return data !== null ? deserializeValue(data) : undefined;
      },
      val: function(value) {
        return arguments.length === 0
          ? this[0] &&
              (this[0].multiple
                ? $(this[0])
                    .find("option")
                    .filter(function() {
                      return this.selected;
                    })
                    .pluck("value")
                : this[0].value)
          : this.each(function(idx) {
              this.value = funcArg(this, value, idx, this.value);
            });
      },
      offset: function(coordinates) {
        if (coordinates)
          return this.each(function(index) {
            var $this = $(this),
              coords = funcArg(this, coordinates, index, $this.offset()),
              parentOffset = $this.offsetParent().offset(),
              props = {
                top: coords.top - parentOffset.top,
                left: coords.left - parentOffset.left,
              };
            if ($this.css("position") == "static")
              props["position"] = "relative";
            $this.css(props);
          });
        if (this.length == 0) return null;
        var obj = this[0].getBoundingClientRect();
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: Math.round(obj.width),
          height: Math.round(obj.height),
        };
      },
      css: function(property, value) {
        if (arguments.length < 2) {
          var element = this[0],
            computedStyle = getComputedStyle(element, "");
          if (!element) return;
          if (typeof property == "string")
            return (
              element.style[camelize(property)] ||
              computedStyle.getPropertyValue(property)
            );
          else if (isArray(property)) {
            var props = {};
            $.each(isArray(property) ? property : [property], function(
              _,
              prop
            ) {
              props[prop] =
                element.style[camelize(prop)] ||
                computedStyle.getPropertyValue(prop);
            });
            return props;
          }
        }
        var css = "";
        if (type(property) == "string") {
          if (!value && value !== 0)
            this.each(function() {
              this.style.removeProperty(dasherize(property));
            });
          else css = dasherize(property) + ":" + maybeAddPx(property, value);
        } else {
          for (key in property)
            if (!property[key] && property[key] !== 0)
              this.each(function() {
                this.style.removeProperty(dasherize(key));
              });
            else
              css +=
                dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
        }
        return this.each(function() {
          this.style.cssText += ";" + css;
        });
      },
      index: function(element) {
        return element
          ? this.indexOf($(element)[0])
          : this.parent()
              .children()
              .indexOf(this[0]);
      },
      hasClass: function(name) {
        if (!name) return false;
        return emptyArray.some.call(
          this,
          function(el) {
            return this.test(className(el));
          },
          classRE(name)
        );
      },
      addClass: function(name) {
        if (!name) return this;
        return this.each(function(idx) {
          classList = [];
          var cls = className(this),
            newName = funcArg(this, name, idx, cls);
          newName.split(/\s+/g).forEach(function(klass) {
            if (!$(this).hasClass(klass)) classList.push(klass);
          }, this);
          classList.length &&
            className(this, cls + (cls ? " " : "") + classList.join(" "));
        });
      },
      removeClass: function(name) {
        return this.each(function(idx) {
          if (name === undefined) return className(this, "");
          classList = className(this);
          funcArg(this, name, idx, classList)
            .split(/\s+/g)
            .forEach(function(klass) {
              classList = classList.replace(classRE(klass), " ");
            });
          className(this, classList.trim());
        });
      },
      toggleClass: function(name, when) {
        if (!name) return this;
        return this.each(function(idx) {
          var $this = $(this),
            names = funcArg(this, name, idx, className(this));
          names.split(/\s+/g).forEach(function(klass) {
            (when === undefined
            ? !$this.hasClass(klass)
            : when)
              ? $this.addClass(klass)
              : $this.removeClass(klass);
          });
        });
      },
      scrollTop: function(value) {
        if (!this.length) return;
        var hasScrollTop = "scrollTop" in this[0];
        if (value === undefined)
          return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
        return this.each(
          hasScrollTop
            ? function() {
                this.scrollTop = value;
              }
            : function() {
                this.scrollTo(this.scrollX, value);
              }
        );
      },
      scrollLeft: function(value) {
        if (!this.length) return;
        var hasScrollLeft = "scrollLeft" in this[0];
        if (value === undefined)
          return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
        return this.each(
          hasScrollLeft
            ? function() {
                this.scrollLeft = value;
              }
            : function() {
                this.scrollTo(value, this.scrollY);
              }
        );
      },
      position: function() {
        if (!this.length) return;
        var elem = this[0],
          offsetParent = this.offsetParent(),
          offset = this.offset(),
          parentOffset = rootNodeRE.test(offsetParent[0].nodeName)
            ? { top: 0, left: 0 }
            : offsetParent.offset();
        offset.top -= parseFloat($(elem).css("margin-top")) || 0;
        offset.left -= parseFloat($(elem).css("margin-left")) || 0;
        parentOffset.top +=
          parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
        parentOffset.left +=
          parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
        return {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left,
        };
      },
      offsetParent: function() {
        return this.map(function() {
          var parent = this.offsetParent || document.body;
          while (
            parent &&
            !rootNodeRE.test(parent.nodeName) &&
            $(parent).css("position") == "static"
          )
            parent = parent.offsetParent;
          return parent;
        });
      },
    };
    $.fn.detach = $.fn.remove;
    ["width", "height"].forEach(function(dimension) {
      var dimensionProperty = dimension.replace(/./, function(m) {
        return m[0].toUpperCase();
      });
      $.fn[dimension] = function(value) {
        var offset,
          el = this[0];
        if (value === undefined)
          return isWindow(el)
            ? el["inner" + dimensionProperty]
            : isDocument(el)
            ? el.documentElement["scroll" + dimensionProperty]
            : (offset = this.offset()) && offset[dimension];
        else
          return this.each(function(idx) {
            el = $(this);
            el.css(dimension, funcArg(this, value, idx, el[dimension]()));
          });
      };
    });
    function traverseNode(node, fun) {
      fun(node);
      for (var key in node.childNodes) traverseNode(node.childNodes[key], fun);
    }
    adjacencyOperators.forEach(function(operator, operatorIndex) {
      var inside = operatorIndex % 2;
      $.fn[operator] = function() {
        var argType,
          nodes = $.map(arguments, function(arg) {
            argType = type(arg);
            return argType == "object" || argType == "array" || arg == null
              ? arg
              : zepto.fragment(arg);
          }),
          parent,
          copyByClone = this.length > 1;
        if (nodes.length < 1) return this;
        return this.each(function(_, target) {
          parent = inside ? target : target.parentNode;
          target =
            operatorIndex == 0
              ? target.nextSibling
              : operatorIndex == 1
              ? target.firstChild
              : operatorIndex == 2
              ? target
              : null;
          nodes.forEach(function(node) {
            if (copyByClone) node = node.cloneNode(true);
            else if (!parent) return $(node).remove();
            traverseNode(parent.insertBefore(node, target), function(el) {
              if (
                el.nodeName != null &&
                el.nodeName.toUpperCase() === "SCRIPT" &&
                (!el.type || el.type === "text/javascript") &&
                !el.src
              )
                window["eval"].call(window, el.innerHTML);
            });
          });
        });
      };
      $.fn[
        inside
          ? operator + "To"
          : "insert" + (operatorIndex ? "Before" : "After")
      ] = function(html) {
        $(html)[operator](this);
        return this;
      };
    });
    zepto.Z.prototype = $.fn;
    zepto.uniq = uniq;
    zepto.deserializeValue = deserializeValue;
    $.zepto = zepto;
    return $;
  })();
  window.Zepto = Zepto;
  window.$ === undefined && (window.$ = Zepto);
  (function($) {
    var $$ = $.zepto.qsa,
      _zid = 1,
      undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj) {
        return typeof obj == "string";
      },
      handlers = {},
      specialEvents = {},
      focusinSupported = "onfocusin" in window,
      focus = { focus: "focusin", blur: "focusout" },
      hover = { mouseenter: "mouseover", mouseleave: "mouseout" };
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove =
      "MouseEvents";
    function zid(element) {
      return element._zid || (element._zid = _zid++);
    }
    function findHandlers(element, event, fn, selector) {
      event = parse(event);
      if (event.ns) var matcher = matcherFor(event.ns);
      return (handlers[zid(element)] || []).filter(function(handler) {
        return (
          handler &&
          (!event.e || handler.e == event.e) &&
          (!event.ns || matcher.test(handler.ns)) &&
          (!fn || zid(handler.fn) === zid(fn)) &&
          (!selector || handler.sel == selector)
        );
      });
    }
    function parse(event) {
      var parts = ("" + event).split(".");
      return {
        e: parts[0],
        ns: parts
          .slice(1)
          .sort()
          .join(" "),
      };
    }
    function matcherFor(ns) {
      return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
    }
    function eventCapture(handler, captureSetting) {
      return (
        (handler.del && !focusinSupported && handler.e in focus) ||
        !!captureSetting
      );
    }
    function realEvent(type) {
      return hover[type] || (focusinSupported && focus[type]) || type;
    }
    function add(element, events, fn, data, selector, delegator, capture) {
      var id = zid(element),
        set = handlers[id] || (handlers[id] = []);
      events.split(/\s/).forEach(function(event) {
        if (event == "ready") return $(document).ready(fn);
        var handler = parse(event);
        handler.fn = fn;
        handler.sel = selector;
        if (handler.e in hover)
          fn = function(e) {
            var related = e.relatedTarget;
            if (!related || (related !== this && !$.contains(this, related)))
              return handler.fn.apply(this, arguments);
          };
        handler.del = delegator;
        var callback = delegator || fn;
        handler.proxy = function(e) {
          e = compatible(e);
          if (e.isImmediatePropagationStopped()) return;
          e.data = data;
          var result = callback.apply(
            element,
            e._args == undefined ? [e] : [e].concat(e._args)
          );
          if (result === false) e.preventDefault(), e.stopPropagation();
          return result;
        };
        handler.i = set.length;
        set.push(handler);
        if ("addEventListener" in element)
          element.addEventListener(
            realEvent(handler.e),
            handler.proxy,
            eventCapture(handler, capture)
          );
      });
    }
    function remove(element, events, fn, selector, capture) {
      var id = zid(element);
      (events || "").split(/\s/).forEach(function(event) {
        findHandlers(element, event, fn, selector).forEach(function(handler) {
          delete handlers[id][handler.i];
          if ("removeEventListener" in element)
            element.removeEventListener(
              realEvent(handler.e),
              handler.proxy,
              eventCapture(handler, capture)
            );
        });
      });
    }
    $.event = { add: add, remove: remove };
    $.proxy = function(fn, context) {
      if (isFunction(fn)) {
        var proxyFn = function() {
          return fn.apply(context, arguments);
        };
        proxyFn._zid = zid(fn);
        return proxyFn;
      } else if (isString(context)) {
        return $.proxy(fn[context], fn);
      } else {
        throw new TypeError("expected function");
      }
    };
    $.fn.bind = function(event, data, callback) {
      return this.on(event, data, callback);
    };
    $.fn.unbind = function(event, callback) {
      return this.off(event, callback);
    };
    $.fn.one = function(event, selector, data, callback) {
      return this.on(event, selector, data, callback, 1);
    };
    var returnTrue = function() {
        return true;
      },
      returnFalse = function() {
        return false;
      },
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped",
      };
    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event);
        $.each(eventMethods, function(name, predicate) {
          var sourceMethod = source[name];
          event[name] = function() {
            this[predicate] = returnTrue;
            return sourceMethod && sourceMethod.apply(source, arguments);
          };
          event[predicate] = returnFalse;
        });
        if (
          source.defaultPrevented !== undefined
            ? source.defaultPrevented
            : "returnValue" in source
            ? source.returnValue === false
            : source.getPreventDefault && source.getPreventDefault()
        )
          event.isDefaultPrevented = returnTrue;
      }
      return event;
    }
    function createProxy(event) {
      var key,
        proxy = { originalEvent: event };
      for (key in event)
        if (!ignoreProperties.test(key) && event[key] !== undefined)
          proxy[key] = event[key];
      return compatible(proxy, event);
    }
    $.fn.delegate = function(selector, event, callback) {
      return this.on(event, selector, callback);
    };
    $.fn.undelegate = function(selector, event, callback) {
      return this.off(event, selector, callback);
    };
    $.fn.live = function(event, callback) {
      $(document.body).delegate(this.selector, event, callback);
      return this;
    };
    $.fn.die = function(event, callback) {
      $(document.body).undelegate(this.selector, event, callback);
      return this;
    };
    $.fn.on = function(event, selector, data, callback, one) {
      var autoRemove,
        delegator,
        $this = this;
      if (event && !isString(event)) {
        $.each(event, function(type, fn) {
          $this.on(type, selector, data, fn, one);
        });
        return $this;
      }
      if (!isString(selector) && !isFunction(callback) && callback !== false)
        (callback = data), (data = selector), (selector = undefined);
      if (isFunction(data) || data === false)
        (callback = data), (data = undefined);
      if (callback === false) callback = returnFalse;
      return $this.each(function(_, element) {
        if (one)
          autoRemove = function(e) {
            remove(element, e.type, callback);
            return callback.apply(this, arguments);
          };
        if (selector)
          delegator = function(e) {
            var evt,
              match = $(e.target)
                .closest(selector, element)
                .get(0);
            if (match && match !== element) {
              evt = $.extend(createProxy(e), {
                currentTarget: match,
                liveFired: element,
              });
              return (autoRemove || callback).apply(
                match,
                [evt].concat(slice.call(arguments, 1))
              );
            }
          };
        add(element, event, callback, data, selector, delegator || autoRemove);
      });
    };
    $.fn.off = function(event, selector, callback) {
      var $this = this;
      if (event && !isString(event)) {
        $.each(event, function(type, fn) {
          $this.off(type, selector, fn);
        });
        return $this;
      }
      if (!isString(selector) && !isFunction(callback) && callback !== false)
        (callback = selector), (selector = undefined);
      if (callback === false) callback = returnFalse;
      return $this.each(function() {
        remove(this, event, callback, selector);
      });
    };
    $.fn.trigger = function(event, args) {
      event =
        isString(event) || $.isPlainObject(event)
          ? $.Event(event)
          : compatible(event);
      event._args = args;
      return this.each(function() {
        if ("dispatchEvent" in this) this.dispatchEvent(event);
        else $(this).triggerHandler(event, args);
      });
    };
    $.fn.triggerHandler = function(event, args) {
      var e, result;
      this.each(function(i, element) {
        e = createProxy(isString(event) ? $.Event(event) : event);
        e._args = args;
        e.target = element;
        $.each(findHandlers(element, event.type || event), function(
          i,
          handler
        ) {
          result = handler.proxy(e);
          if (e.isImmediatePropagationStopped()) return false;
        });
      });
      return result;
    };
    (
      "focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select keydown keypress keyup error"
    )
      .split(" ")
      .forEach(function(event) {
        $.fn[event] = function(callback) {
          return callback ? this.bind(event, callback) : this.trigger(event);
        };
      });
    ["focus", "blur"].forEach(function(name) {
      $.fn[name] = function(callback) {
        if (callback) this.bind(name, callback);
        else
          this.each(function() {
            try {
              this[name]();
            } catch (e) {}
          });
        return this;
      };
    });
    $.Event = function(type, props) {
      if (!isString(type)) (props = type), (type = props.type);
      var event = document.createEvent(specialEvents[type] || "Events"),
        bubbles = true;
      if (props)
        for (var name in props)
          name == "bubbles"
            ? (bubbles = !!props[name])
            : (event[name] = props[name]);
      event.initEvent(type, bubbles, true);
      return compatible(event);
    };
  })(Zepto);
  (function($) {
    var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = "application/json",
      htmlType = "text/html",
      blankRE = /^\s*$/;
    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName);
      $(context).trigger(event, data);
      return !event.isDefaultPrevented();
    }
    function triggerGlobal(settings, context, eventName, data) {
      if (settings.global)
        return triggerAndReturn(context || document, eventName, data);
    }
    $.active = 0;
    function ajaxStart(settings) {
      if (settings.global && $.active++ === 0)
        triggerGlobal(settings, null, "ajaxStart");
    }
    function ajaxStop(settings) {
      if (settings.global && !--$.active)
        triggerGlobal(settings, null, "ajaxStop");
    }
    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context;
      if (
        settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) ===
          false
      )
        return false;
      triggerGlobal(settings, context, "ajaxSend", [xhr, settings]);
    }
    function ajaxSuccess(data, xhr, settings, deferred) {
      var context = settings.context,
        status = "success";
      settings.success.call(context, data, status, xhr);
      if (deferred) deferred.resolveWith(context, [data, status, xhr]);
      triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
      ajaxComplete(status, xhr, settings);
    }
    function ajaxError(error, type, xhr, settings, deferred) {
      var context = settings.context;
      settings.error.call(context, xhr, type, error);
      if (deferred) deferred.rejectWith(context, [xhr, type, error]);
      triggerGlobal(settings, context, "ajaxError", [
        xhr,
        settings,
        error || type,
      ]);
      ajaxComplete(type, xhr, settings);
    }
    function ajaxComplete(status, xhr, settings) {
      var context = settings.context;
      settings.complete.call(context, xhr, status);
      triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
      ajaxStop(settings);
    }
    function empty() {}
    $.ajaxJSONP = function(options, deferred) {
      if (!("type" in options)) return $.ajax(options);
      var _callbackName = options.jsonpCallback,
        callbackName =
          ($.isFunction(_callbackName) ? _callbackName() : _callbackName) ||
          "jsonp" + ++jsonpID,
        script = document.createElement("script"),
        originalCallback = window[callbackName],
        responseData,
        abort = function(errorType) {
          $(script).triggerHandler("error", errorType || "abort");
        },
        xhr = { abort: abort },
        abortTimeout;
      if (deferred) deferred.promise(xhr);
      $(script).on("load error", function(e, errorType) {
        clearTimeout(abortTimeout);
        $(script)
          .off()
          .remove();
        if (e.type == "error" || !responseData) {
          ajaxError(null, errorType || "error", xhr, options, deferred);
        } else {
          ajaxSuccess(responseData[0], xhr, options, deferred);
        }
        window[callbackName] = originalCallback;
        if (responseData && $.isFunction(originalCallback))
          originalCallback(responseData[0]);
        originalCallback = responseData = undefined;
      });
      if (ajaxBeforeSend(xhr, options) === false) {
        abort("abort");
        return xhr;
      }
      window[callbackName] = function() {
        responseData = arguments;
      };
      script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName);
      document.head.appendChild(script);
      if (options.timeout > 0)
        abortTimeout = setTimeout(function() {
          abort("timeout");
        }, options.timeout);
      return xhr;
    };
    $.ajaxSettings = {
      type: "GET",
      beforeSend: empty,
      success: empty,
      error: empty,
      complete: empty,
      context: null,
      global: true,
      xhr: function() {
        return new window.XMLHttpRequest();
      },
      accepts: {
        script:
          "text/javascript, application/javascript, application/x-javascript",
        json: jsonType,
        xml: "application/xml, text/xml",
        html: htmlType,
        text: "text/plain",
      },
      crossDomain: false,
      timeout: 0,
      processData: true,
      cache: true,
    };
    function mimeToDataType(mime) {
      if (mime) mime = mime.split(";", 2)[0];
      return (
        (mime &&
          (mime == htmlType
            ? "html"
            : mime == jsonType
            ? "json"
            : scriptTypeRE.test(mime)
            ? "script"
            : xmlTypeRE.test(mime) && "xml")) ||
        "text"
      );
    }
    function appendQuery(url, query) {
      if (query == "") return url;
      return (url + "&" + query).replace(/[&?]{1,2}/, "?");
    }
    function serializeData(options) {
      if (
        options.processData &&
        options.data &&
        $.type(options.data) != "string"
      )
        options.data = $.param(options.data, options.traditional);
      if (
        options.data &&
        (!options.type || options.type.toUpperCase() == "GET")
      )
        (options.url = appendQuery(options.url, options.data)),
          (options.data = undefined);
    }
    $.ajax = function(options) {
      var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred();
      for (key in $.ajaxSettings)
        if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
      ajaxStart(settings);
      if (!settings.crossDomain)
        settings.crossDomain =
          /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
          RegExp.$2 != window.location.host;
      if (!settings.url) settings.url = window.location.toString();
      serializeData(settings);
      if (settings.cache === false)
        settings.url = appendQuery(settings.url, "_=" + Date.now());
      var dataType = settings.dataType,
        hasPlaceholder = /\?.+=\?/.test(settings.url);
      if (dataType == "jsonp" || hasPlaceholder) {
        if (!hasPlaceholder)
          settings.url = appendQuery(
            settings.url,
            settings.jsonp
              ? settings.jsonp + "=?"
              : settings.jsonp === false
              ? ""
              : "callback=?"
          );
        return $.ajaxJSONP(settings, deferred);
      }
      var mime = settings.accepts[dataType],
        headers = {},
        setHeader = function(name, value) {
          headers[name.toLowerCase()] = [name, value];
        },
        protocol = /^([\w-]+:)\/\//.test(settings.url)
          ? RegExp.$1
          : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout;
      if (deferred) deferred.promise(xhr);
      if (!settings.crossDomain)
        setHeader("X-Requested-With", "XMLHttpRequest");
      setHeader("Accept", mime || "*/*");
      if ((mime = settings.mimeType || mime)) {
        if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
        xhr.overrideMimeType && xhr.overrideMimeType(mime);
      }
      if (
        settings.contentType ||
        (settings.contentType !== false &&
          settings.data &&
          settings.type.toUpperCase() != "GET")
      )
        setHeader(
          "Content-Type",
          settings.contentType || "application/x-www-form-urlencoded"
        );
      if (settings.headers)
        for (name in settings.headers) setHeader(name, settings.headers[name]);
      xhr.setRequestHeader = setHeader;
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty;
          clearTimeout(abortTimeout);
          var result,
            error = false;
          if (
            (xhr.status >= 200 && xhr.status < 300) ||
            xhr.status == 304 ||
            (xhr.status == 0 && protocol == "file:")
          ) {
            dataType =
              dataType ||
              mimeToDataType(
                settings.mimeType || xhr.getResponseHeader("content-type")
              );
            result = xhr.responseText;
            try {
              if (dataType == "script") (1, eval)(result);
              else if (dataType == "xml") result = xhr.responseXML;
              else if (dataType == "json")
                result = blankRE.test(result) ? null : $.parseJSON(result);
            } catch (e) {
              error = e;
            }
            if (error) ajaxError(error, "parsererror", xhr, settings, deferred);
            else ajaxSuccess(result, xhr, settings, deferred);
          } else {
            ajaxError(
              xhr.statusText || null,
              xhr.status ? "error" : "abort",
              xhr,
              settings,
              deferred
            );
          }
        }
      };
      if (ajaxBeforeSend(xhr, settings) === false) {
        xhr.abort();
        ajaxError(null, "abort", xhr, settings, deferred);
        return xhr;
      }
      if (settings.xhrFields)
        for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name];
      var async = "async" in settings ? settings.async : true;
      xhr.open(
        settings.type,
        settings.url,
        async,
        settings.username,
        settings.password
      );
      for (name in headers) nativeSetHeader.apply(xhr, headers[name]);
      if (settings.timeout > 0)
        abortTimeout = setTimeout(function() {
          xhr.onreadystatechange = empty;
          xhr.abort();
          ajaxError(null, "timeout", xhr, settings, deferred);
        }, settings.timeout);
      xhr.send(settings.data ? settings.data : null);
      return xhr;
    };
    function parseArguments(url, data, success, dataType) {
      var hasData = !$.isFunction(data);
      return {
        url: url,
        data: hasData ? data : undefined,
        success: !hasData ? data : $.isFunction(success) ? success : undefined,
        dataType: hasData ? dataType || success : success,
      };
    }
    $.get = function(url, data, success, dataType) {
      return $.ajax(parseArguments.apply(null, arguments));
    };
    $.post = function(url, data, success, dataType) {
      var options = parseArguments.apply(null, arguments);
      options.type = "POST";
      return $.ajax(options);
    };
    $.getJSON = function(url, data, success) {
      var options = parseArguments.apply(null, arguments);
      options.dataType = "json";
      return $.ajax(options);
    };
    $.fn.load = function(url, data, success) {
      if (!this.length) return this;
      var self = this,
        parts = url.split(/\s/),
        selector,
        options = parseArguments(url, data, success),
        callback = options.success;
      if (parts.length > 1) (options.url = parts[0]), (selector = parts[1]);
      options.success = function(response) {
        self.html(
          selector
            ? $("<div>")
                .html(response.replace(rscript, ""))
                .find(selector)
            : response
        );
        callback && callback.apply(self, arguments);
      };
      $.ajax(options);
      return this;
    };
    var escape = encodeURIComponent;
    function serialize(params, obj, traditional, scope) {
      var type,
        array = $.isArray(obj),
        hash = $.isPlainObject(obj);
      $.each(obj, function(key, value) {
        type = $.type(value);
        if (scope)
          key = traditional
            ? scope
            : scope +
              "[" +
              (hash || type == "object" || type == "array" ? key : "") +
              "]";
        if (!scope && array) params.add(value.name, value.value);
        else if (type == "array" || (!traditional && type == "object"))
          serialize(params, value, traditional, key);
        else params.add(key, value);
      });
    }
    $.param = function(obj, traditional) {
      var params = [];
      params.add = function(k, v) {
        this.push(escape(k) + "=" + escape(v));
      };
      serialize(params, obj, traditional);
      return params.join("&").replace(/%20/g, "+");
    };
  })(Zepto);
  (function($) {
    $.fn.serializeArray = function() {
      var result = [],
        el;
      $([].slice.call(this.get(0).elements)).each(function() {
        el = $(this);
        var type = el.attr("type");
        if (
          this.nodeName.toLowerCase() != "fieldset" &&
          !this.disabled &&
          type != "submit" &&
          type != "reset" &&
          type != "button" &&
          ((type != "radio" && type != "checkbox") || this.checked)
        )
          result.push({ name: el.attr("name"), value: el.val() });
      });
      return result;
    };
    $.fn.serialize = function() {
      var result = [];
      this.serializeArray().forEach(function(elm) {
        result.push(
          encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value)
        );
      });
      return result.join("&");
    };
    $.fn.submit = function(callback) {
      if (callback) this.bind("submit", callback);
      else if (this.length) {
        var event = $.Event("submit");
        this.eq(0).trigger(event);
        if (!event.isDefaultPrevented()) this.get(0).submit();
      }
      return this;
    };
  })(Zepto);
  (function($) {
    if (!("__proto__" in {})) {
      $.extend($.zepto, {
        Z: function(dom, selector) {
          dom = dom || [];
          $.extend(dom, $.fn);
          dom.selector = selector || "";
          dom.__Z = true;
          return dom;
        },
        isZ: function(object) {
          return $.type(object) === "array" && "__Z" in object;
        },
      });
    }
    try {
      getComputedStyle(undefined);
    } catch (e) {
      var nativeGetComputedStyle = getComputedStyle;
      window.getComputedStyle = function(element) {
        try {
          return nativeGetComputedStyle(element);
        } catch (e) {
          return null;
        }
      };
    }
  })(Zepto);
  VCO.getJSON = Zepto.getJSON;
  VCO.ajax = Zepto.ajax;
})(VCO);
VCO.Class = function() {};
VCO.Class.extend = function(props) {
  var NewClass = function() {
    if (this.initialize) {
      this.initialize.apply(this, arguments);
    }
  };
  var F = function() {};
  F.prototype = this.prototype;
  var proto = new F();
  proto.constructor = NewClass;
  NewClass.prototype = proto;
  NewClass.superclass = this.prototype;
  for (var i in this) {
    if (this.hasOwnProperty(i) && i !== "prototype" && i !== "superclass") {
      NewClass[i] = this[i];
    }
  }
  if (props.statics) {
    VCO.Util.extend(NewClass, props.statics);
    delete props.statics;
  }
  if (props.includes) {
    VCO.Util.extend.apply(null, [proto].concat(props.includes));
    delete props.includes;
  }
  if (props.options && proto.options) {
    props.options = VCO.Util.extend({}, proto.options, props.options);
  }
  VCO.Util.extend(proto, props);
  NewClass.extend = VCO.Class.extend;
  NewClass.include = function(props) {
    VCO.Util.extend(this.prototype, props);
  };
  return NewClass;
};
VCO.Events = {
  addEventListener: function(type, fn, context) {
    var events = (this._vco_events = this._vco_events || {});
    events[type] = events[type] || [];
    events[type].push({ action: fn, context: context || this });
    return this;
  },
  hasEventListeners: function(type) {
    var k = "_vco_events";
    return k in this && type in this[k] && this[k][type].length > 0;
  },
  removeEventListener: function(type, fn, context) {
    if (!this.hasEventListeners(type)) {
      return this;
    }
    for (
      var i = 0, events = this._vco_events, len = events[type].length;
      i < len;
      i++
    ) {
      if (
        events[type][i].action === fn &&
        (!context || events[type][i].context === context)
      ) {
        events[type].splice(i, 1);
        return this;
      }
    }
    return this;
  },
  fireEvent: function(type, data) {
    if (!this.hasEventListeners(type)) {
      return this;
    }
    var event = VCO.Util.extend({ type: type, target: this }, data);
    var listeners = this._vco_events[type].slice();
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].action.call(listeners[i].context || this, event);
    }
    return this;
  },
};
VCO.Events.on = VCO.Events.addEventListener;
VCO.Events.off = VCO.Events.removeEventListener;
VCO.Events.fire = VCO.Events.fireEvent;
(function() {
  var ua = navigator.userAgent.toLowerCase(),
    doc = document.documentElement,
    ie = "ActiveXObject" in window,
    webkit = ua.indexOf("webkit") !== -1,
    phantomjs = ua.indexOf("phantom") !== -1,
    android23 = ua.search("android [23]") !== -1,
    mobile = typeof orientation !== "undefined",
    msPointer =
      navigator.msPointerEnabled &&
      navigator.msMaxTouchPoints &&
      !window.PointerEvent,
    pointer =
      (window.PointerEvent &&
        navigator.pointerEnabled &&
        navigator.maxTouchPoints) ||
      msPointer,
    ie3d = ie && "transition" in doc.style,
    webkit3d =
      "WebKitCSSMatrix" in window &&
      "m11" in new window.WebKitCSSMatrix() &&
      !android23,
    gecko3d = "MozPerspective" in doc.style,
    opera3d = "OTransition" in doc.style,
    opera = window.opera;
  var retina = "devicePixelRatio" in window && window.devicePixelRatio > 1;
  if (!retina && "matchMedia" in window) {
    var matches = window.matchMedia("(min-resolution:144dpi)");
    retina = matches && matches.matches;
  }
  var touch =
    !window.L_NO_TOUCH &&
    !phantomjs &&
    (pointer ||
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch));
  VCO.Browser = {
    ie: ie,
    ielt9: ie && !document.addEventListener,
    webkit: webkit,
    firefox: ua.indexOf("gecko") !== -1 && !webkit && !window.opera && !ie,
    android: ua.indexOf("android") !== -1,
    android23: android23,
    chrome: ua.indexOf("chrome") !== -1,
    ie3d: ie3d,
    webkit3d: webkit3d,
    gecko3d: gecko3d,
    opera3d: opera3d,
    any3d:
      !window.L_DISABLE_3D &&
      (ie3d || webkit3d || gecko3d || opera3d) &&
      !phantomjs,
    mobile: mobile,
    mobileWebkit: mobile && webkit,
    mobileWebkit3d: mobile && webkit3d,
    mobileOpera: mobile && window.opera,
    touch: !!touch,
    msPointer: !!msPointer,
    pointer: !!pointer,
    retina: !!retina,
    orientation: function() {
      var w = window.innerWidth,
        h = window.innerHeight,
        _orientation = "portrait";
      if (w > h) {
        _orientation = "landscape";
      }
      if (Math.abs(window.orientation) == 90) {
      }
      trace(_orientation);
      return _orientation;
    },
  };
})();
VCO.Load = (function(doc) {
  var loaded = [];
  function isLoaded(url) {
    var i = 0,
      has_loaded = false;
    for (i = 0; i < loaded.length; i++) {
      if (loaded[i] == url) {
        has_loaded = true;
      }
    }
    if (has_loaded) {
      return true;
    } else {
      loaded.push(url);
      return false;
    }
  }
  return {
    css: function(urls, callback, obj, context) {
      if (!isLoaded(urls)) {
        VCO.LoadIt.css(urls, callback, obj, context);
      } else {
        callback();
      }
    },
    js: function(urls, callback, obj, context) {
      if (!isLoaded(urls)) {
        VCO.LoadIt.js(urls, callback, obj, context);
      } else {
        callback();
      }
    },
  };
})(this.document);
VCO.LoadIt = (function(doc) {
  var env,
    head,
    pending = {},
    pollCount = 0,
    queue = { css: [], js: [] },
    styleSheets = doc.styleSheets;
  function createNode(name, attrs) {
    var node = doc.createElement(name),
      attr;
    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }
    return node;
  }
  function finish(type) {
    var p = pending[type],
      callback,
      urls;
    if (p) {
      callback = p.callback;
      urls = p.urls;
      urls.shift();
      pollCount = 0;
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }
  function getEnv() {
    var ua = navigator.userAgent;
    env = { async: doc.createElement("script").async === true };
    (env.webkit = /AppleWebKit\//.test(ua)) ||
      (env.ie = /MSIE/.test(ua)) ||
      (env.opera = /Opera/.test(ua)) ||
      (env.gecko = /Gecko\//.test(ua)) ||
      (env.unknown = true);
  }
  function load(type, urls, callback, obj, context) {
    var _finish = function() {
        finish(type);
      },
      isCSS = type === "css",
      nodes = [],
      i,
      len,
      node,
      p,
      pendingUrls,
      url;
    env || getEnv();
    if (urls) {
      urls = typeof urls === "string" ? [urls] : urls.concat();
      if (isCSS || env.async || env.gecko || env.opera) {
        queue[type].push({
          urls: urls,
          callback: callback,
          obj: obj,
          context: context,
        });
      } else {
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls: [urls[i]],
            callback: i === len - 1 ? callback : null,
            obj: obj,
            context: context,
          });
        }
      }
    }
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }
    head || (head = doc.head || doc.getElementsByTagName("head")[0]);
    pendingUrls = p.urls;
    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];
      if (isCSS) {
        node = env.gecko
          ? createNode("style")
          : createNode("link", { href: url, rel: "stylesheet" });
      } else {
        node = createNode("script", { src: url });
        node.async = false;
      }
      node.className = "lazyload";
      node.setAttribute("charset", "utf-8");
      if (env.ie && !isCSS) {
        node.onreadystatechange = function() {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        if (env.webkit) {
          p.urls[i] = node.href;
          pollWebKit();
        } else {
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }
      nodes.push(node);
    }
    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }
  function pollGecko(node) {
    var hasRules;
    try {
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      pollCount += 1;
      if (pollCount < 200) {
        setTimeout(function() {
          pollGecko(node);
        }, 50);
      } else {
        hasRules && finish("css");
      }
      return;
    }
    finish("css");
  }
  function pollWebKit() {
    var css = pending.css,
      i;
    if (css) {
      i = styleSheets.length;
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish("css");
          break;
        }
      }
      pollCount += 1;
      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          finish("css");
        }
      }
    }
  }
  return {
    css: function(urls, callback, obj, context) {
      load("css", urls, callback, obj, context);
    },
    js: function(urls, callback, obj, context) {
      load("js", urls, callback, obj, context);
    },
  };
})(this.document);
VCO.Language = {
  name: "English",
  lang: "en",
  messages: {
    loading: "Loading",
    wikipedia: "From Wikipedia, the free encyclopedia",
    start: "Start Exploring",
  },
  buttons: {
    map_overview: "Map Overview",
    overview: "Overview",
    backtostart: "Back To Beginning",
    collapse_toggle: "Hide Map",
    uncollapse_toggle: "Show Map",
    swipe_to_navigate:
      "Swipe to Navigate<br><span class='vco-button'>OK</span>",
  },
};
VCO.Emoji = function(str) {
  var emoji = {
    "😄": 0,
    "😃": 1,
    "😀": 2,
    "😊": 3,
    "☺️": 4,
    "😉": 5,
    "😍": 6,
    "😘": 7,
    "😚": 8,
    "😗": 9,
    "😙": 10,
    "😜": 11,
    "😝": 12,
    "😛": 13,
    "😳": 14,
    "😁": 15,
    "😔": 16,
    "😌": 17,
    "😒": 18,
    "😞": 19,
    "😣": 20,
    "😢": 21,
    "😂": 22,
    "😭": 23,
    "😪": 24,
    "😥": 25,
    "😰": 26,
    "😅": 27,
    "😓": 28,
    "😩": 29,
    "😫": 30,
    "😨": 31,
    "😱": 32,
    "😠": 33,
    "😡": 34,
    "😤": 35,
    "😖": 36,
    "😆": 37,
    "😋": 38,
    "😷": 39,
    "😎": 40,
    "😴": 41,
    "😵": 42,
    "😲": 43,
    "😟": 44,
    "😦": 45,
    "😧": 46,
    "😈": 47,
    "👿": 48,
    "😮": 49,
    "😬": 50,
    "😐": 51,
    "😕": 52,
    "😯": 53,
    "😶": 54,
    "😇": 55,
    "😏": 56,
    "😑": 57,
    "👲": 58,
    "👳": 59,
    "👮": 60,
    "👷": 61,
    "💂": 62,
    "👶": 63,
    "👦": 64,
    "👧": 65,
    "👨": 66,
    "👩": 67,
    "👴": 68,
    "👵": 69,
    "👱": 70,
    "👼": 71,
    "👸": 72,
    "😺": 73,
    "😸": 74,
    "😻": 75,
    "😽": 76,
    "😼": 77,
    "🙀": 78,
    "😿": 79,
    "😹": 80,
    "😾": 81,
    "👹": 82,
    "👺": 83,
    "🙈": 84,
    "🙉": 85,
    "🙊": 86,
    "💀": 87,
    "👽": 88,
    "💩": 89,
    "🔥": 90,
    "✨": 91,
    "🌟": 92,
    "💫": 93,
    "💥": 94,
    "💢": 95,
    "💦": 96,
    "💧": 97,
    "💤": 98,
    "💨": 99,
    "👂": 100,
    "👀": 101,
    "👃": 102,
    "👅": 103,
    "👄": 104,
    "👍": 105,
    "👎": 106,
    "👌": 107,
    "👊": 108,
    "✊": 109,
    "✌️": 110,
    "👋": 111,
    "✋": 112,
    "👐": 113,
    "👆": 114,
    "👇": 115,
    "👉": 116,
    "👈": 117,
    "🙌": 118,
    "🙏": 119,
    "☝️": 120,
    "👏": 121,
    "💪": 122,
    "🚶": 123,
    "🏃": 124,
    "💃": 125,
    "👫": 126,
    "👪": 127,
    "👬": 128,
    "👭": 129,
    "💏": 130,
    "💑": 131,
    "👯": 132,
    "🙆": 133,
    "🙅": 134,
    "💁": 135,
    "🙋": 136,
    "💆": 137,
    "💇": 138,
    "💅": 139,
    "👰": 140,
    "🙎": 141,
    "🙍": 142,
    "🙇": 143,
    "🎩": 144,
    "👑": 145,
    "👒": 146,
    "👟": 147,
    "👞": 148,
    "👡": 149,
    "👠": 150,
    "👢": 151,
    "👕": 152,
    "👔": 153,
    "👚": 154,
    "👗": 155,
    "🎽": 156,
    "👖": 157,
    "👘": 158,
    "👙": 159,
    "💼": 160,
    "👜": 161,
    "👝": 162,
    "👛": 163,
    "👓": 164,
    "🎀": 165,
    "🌂": 166,
    "💄": 167,
    "💛": 168,
    "💙": 169,
    "💜": 170,
    "💚": 171,
    "❤️": 172,
    "💔": 173,
    "💗": 174,
    "💓": 175,
    "💕": 176,
    "💖": 177,
    "💞": 178,
    "💘": 179,
    "💌": 180,
    "💋": 181,
    "💍": 182,
    "💎": 183,
    "👤": 184,
    "👥": 185,
    "💬": 186,
    "👣": 187,
    "💭": 188,
    "🐶": 189,
    "🐺": 190,
    "🐱": 191,
    "🐭": 192,
    "🐹": 193,
    "🐰": 194,
    "🐸": 195,
    "🐯": 196,
    "🐨": 197,
    "🐻": 198,
    "🐷": 199,
    "🐽": 200,
    "🐮": 201,
    "🐗": 202,
    "🐵": 203,
    "🐒": 204,
    "🐴": 205,
    "🐑": 206,
    "🐘": 207,
    "🐼": 208,
    "🐧": 209,
    "🐦": 210,
    "🐤": 211,
    "🐥": 212,
    "🐣": 213,
    "🐔": 214,
    "🐍": 215,
    "🐢": 216,
    "🐛": 217,
    "🐝": 218,
    "🐜": 219,
    "🐞": 220,
    "🐌": 221,
    "🐙": 222,
    "🐚": 223,
    "🐠": 224,
    "🐟": 225,
    "🐬": 226,
    "🐳": 227,
    "🐋": 228,
    "🐄": 229,
    "🐏": 230,
    "🐀": 231,
    "🐃": 232,
    "🐅": 233,
    "🐇": 234,
    "🐉": 235,
    "🐎": 236,
    "🐐": 237,
    "🐓": 238,
    "🐕": 239,
    "🐖": 240,
    "🐁": 241,
    "🐂": 242,
    "🐲": 243,
    "🐡": 244,
    "🐊": 245,
    "🐫": 246,
    "🐪": 247,
    "🐆": 248,
    "🐈": 249,
    "🐩": 250,
    "🐾": 251,
    "💐": 252,
    "🌸": 253,
    "🌷": 254,
    "🍀": 255,
    "🌹": 256,
    "🌻": 257,
    "🌺": 258,
    "🍁": 259,
    "🍃": 260,
    "🍂": 261,
    "🌿": 262,
    "🌾": 263,
    "🍄": 264,
    "🌵": 265,
    "🌴": 266,
    "🌲": 267,
    "🌳": 268,
    "🌰": 269,
    "🌱": 270,
    "🌼": 271,
    "🌐": 272,
    "🌞": 273,
    "🌝": 274,
    "🌚": 275,
    "🌑": 276,
    "🌒": 277,
    "🌓": 278,
    "🌔": 279,
    "🌕": 280,
    "🌖": 281,
    "🌗": 282,
    "🌘": 283,
    "🌜": 284,
    "🌛": 285,
    "🌙": 286,
    "🌍": 287,
    "🌎": 288,
    "🌏": 289,
    "🌋": 290,
    "🌌": 291,
    "🌠": 292,
    "⭐️": 293,
    "☀️": 294,
    "⛅️": 295,
    "☁️": 296,
    "⚡️": 297,
    "☔️": 298,
    "❄️": 299,
    "⛄️": 300,
    "🌀": 301,
    "🌁": 302,
    "🌈": 303,
    "🌊": 304,
    "🎍": 305,
    "💝": 306,
    "🎎": 307,
    "🎒": 308,
    "🎓": 309,
    "🎏": 310,
    "🎆": 311,
    "🎇": 312,
    "🎐": 313,
    "🎑": 314,
    "🎃": 315,
    "👻": 316,
    "🎅": 317,
    "🎄": 318,
    "🎁": 319,
    "🎋": 320,
    "🎉": 321,
    "🎊": 322,
    "🎈": 323,
    "🎌": 324,
    "🔮": 325,
    "🎥": 326,
    "📷": 327,
    "📹": 328,
    "📼": 329,
    "💿": 330,
    "📀": 331,
    "💽": 332,
    "💾": 333,
    "💻": 334,
    "📱": 335,
    "☎️": 336,
    "📞": 337,
    "📟": 338,
    "📠": 339,
    "📡": 340,
    "📺": 341,
    "📻": 342,
    "🔊": 343,
    "🔉": 344,
    "🔈": 345,
    "🔇": 346,
    "🔔": 347,
    "🔕": 348,
    "📢": 349,
    "📣": 350,
    "⏳": 351,
    "⌛️": 352,
    "⏰": 353,
    "⌚️": 354,
    "🔓": 355,
    "🔒": 356,
    "🔏": 357,
    "🔐": 358,
    "🔑": 359,
    "🔎": 360,
    "💡": 361,
    "🔦": 362,
    "🔆": 363,
    "🔅": 364,
    "🔌": 365,
    "🔋": 366,
    "🔍": 367,
    "🛁": 368,
    "🛀": 369,
    "🚿": 370,
    "🚽": 371,
    "🔧": 372,
    "🔩": 373,
    "🔨": 374,
    "🚪": 375,
    "🚬": 376,
    "💣": 377,
    "🔫": 378,
    "🔪": 379,
    "💊": 380,
    "💉": 381,
    "💰": 382,
    "💴": 383,
    "💵": 384,
    "💷": 385,
    "💶": 386,
    "💳": 387,
    "💸": 388,
    "📲": 389,
    "📧": 390,
    "📥": 391,
    "📤": 392,
    "✉️": 393,
    "📩": 394,
    "📨": 395,
    "📯": 396,
    "📫": 397,
    "📪": 398,
    "📬": 399,
    "📭": 400,
    "📮": 401,
    "📦": 402,
    "📝": 403,
    "📄": 404,
    "📃": 405,
    "📑": 406,
    "📊": 407,
    "📈": 408,
    "📉": 409,
    "📜": 410,
    "📋": 411,
    "📅": 412,
    "📆": 413,
    "📇": 414,
    "📁": 415,
    "📂": 416,
    "✂️": 417,
    "📌": 418,
    "📎": 419,
    "✒️": 420,
    "✏️": 421,
    "📏": 422,
    "📐": 423,
    "📕": 424,
    "📗": 425,
    "📘": 426,
    "📙": 427,
    "📓": 428,
    "📔": 429,
    "📒": 430,
    "📚": 431,
    "📖": 432,
    "🔖": 433,
    "📛": 434,
    "🔬": 435,
    "🔭": 436,
    "📰": 437,
    "🎨": 438,
    "🎬": 439,
    "🎤": 440,
    "🎧": 441,
    "🎼": 442,
    "🎵": 443,
    "🎶": 444,
    "🎹": 445,
    "🎻": 446,
    "🎺": 447,
    "🎷": 448,
    "🎸": 449,
    "👾": 450,
    "🎮": 451,
    "🃏": 452,
    "🎴": 453,
    "🀄️": 454,
    "🎲": 455,
    "🎯": 456,
    "🏈": 457,
    "🏀": 458,
    "⚽️": 459,
    "⚾️": 460,
    "🎾": 461,
    "🎱": 462,
    "🏉": 463,
    "🎳": 464,
    "⛳️": 465,
    "🚵": 466,
    "🚴": 467,
    "🏁": 468,
    "🏇": 469,
    "🏆": 470,
    "🎿": 471,
    "🏂": 472,
    "🏊": 473,
    "🏄": 474,
    "🎣": 475,
    "☕️": 476,
    "🍵": 477,
    "🍶": 478,
    "🍼": 479,
    "🍺": 480,
    "🍻": 481,
    "🍸": 482,
    "🍹": 483,
    "🍷": 484,
    "🍴": 485,
    "🍕": 486,
    "🍔": 487,
    "🍟": 488,
    "🍗": 489,
    "🍖": 490,
    "🍝": 491,
    "🍛": 492,
    "🍤": 493,
    "🍱": 494,
    "🍣": 495,
    "🍥": 496,
    "🍙": 497,
    "🍘": 498,
    "🍚": 499,
    "🍜": 500,
    "🍲": 501,
    "🍢": 502,
    "🍡": 503,
    "🍳": 504,
    "🍞": 505,
    "🍩": 506,
    "🍮": 507,
    "🍦": 508,
    "🍨": 509,
    "🍧": 510,
    "🎂": 511,
    "🍰": 512,
    "🍪": 513,
    "🍫": 514,
    "🍬": 515,
    "🍭": 516,
    "🍯": 517,
    "🍎": 518,
    "🍏": 519,
    "🍊": 520,
    "🍋": 521,
    "🍒": 522,
    "🍇": 523,
    "🍉": 524,
    "🍓": 525,
    "🍑": 526,
    "🍈": 527,
    "🍌": 528,
    "🍐": 529,
    "🍍": 530,
    "🍠": 531,
    "🍆": 532,
    "🍅": 533,
    "🌽": 534,
    "🏠": 535,
    "🏡": 536,
    "🏫": 537,
    "🏢": 538,
    "🏣": 539,
    "🏥": 540,
    "🏦": 541,
    "🏪": 542,
    "🏩": 543,
    "🏨": 544,
    "💒": 545,
    "⛪️": 546,
    "🏬": 547,
    "🏤": 548,
    "🌇": 549,
    "🌆": 550,
    "🏯": 551,
    "🏰": 552,
    "⛺️": 553,
    "🏭": 554,
    "🗼": 555,
    "🗾": 556,
    "🗻": 557,
    "🌄": 558,
    "🌅": 559,
    "🌃": 560,
    "🗽": 561,
    "🌉": 562,
    "🎠": 563,
    "🎡": 564,
    "⛲️": 565,
    "🎢": 566,
    "🚢": 567,
    "⛵️": 568,
    "🚤": 569,
    "🚣": 570,
    "⚓️": 571,
    "🚀": 572,
    "✈️": 573,
    "💺": 574,
    "🚁": 575,
    "🚂": 576,
    "🚊": 577,
    "🚉": 578,
    "🚞": 579,
    "🚆": 580,
    "🚄": 581,
    "🚅": 582,
    "🚈": 583,
    "🚇": 584,
    "🚝": 585,
    "🚋": 586,
    "🚃": 587,
    "🚎": 588,
    "🚌": 589,
    "🚍": 590,
    "🚙": 591,
    "🚘": 592,
    "🚗": 593,
    "🚕": 594,
    "🚖": 595,
    "🚛": 596,
    "🚚": 597,
    "🚨": 598,
    "🚓": 599,
    "🚔": 600,
    "🚒": 601,
    "🚑": 602,
    "🚐": 603,
    "🚲": 604,
    "🚡": 605,
    "🚟": 606,
    "🚠": 607,
    "🚜": 608,
    "💈": 609,
    "🚏": 610,
    "🎫": 611,
    "🚦": 612,
    "🚥": 613,
    "⚠️": 614,
    "🚧": 615,
    "🔰": 616,
    "⛽️": 617,
    "🏮": 618,
    "🎰": 619,
    "♨️": 620,
    "🗿": 621,
    "🎪": 622,
    "🎭": 623,
    "📍": 624,
    "🚩": 625,
    "🇯🇵": 626,
    "🇰🇷": 627,
    "🇩🇪": 628,
    "🇨🇳": 629,
    "🇺🇸": 630,
    "🇫🇷": 631,
    "🇪🇸": 632,
    "🇮🇹": 633,
    "🇷🇺": 634,
    "🇬🇧": 635,
    "1⃣": 636,
    "2⃣": 637,
    "3⃣": 638,
    "4⃣": 639,
    "5⃣": 640,
    "6⃣": 641,
    "7⃣": 642,
    "8⃣": 643,
    "9⃣": 644,
    "0⃣": 645,
    "🔟": 646,
    "🔢": 647,
    "#⃣": 648,
    "🔣": 649,
    "⬆️": 650,
    "⬇️": 651,
    "⬅️": 652,
    "➡️": 653,
    "🔠": 654,
    "🔡": 655,
    "🔤": 656,
    "↗️": 657,
    "↖️": 658,
    "↘️": 659,
    "↙️": 660,
    "↔️": 661,
    "↕️": 662,
    "🔄": 663,
    "◀️": 664,
    "▶️": 665,
    "🔼": 666,
    "🔽": 667,
    "↩️": 668,
    "↪️": 669,
    "⏪": 671,
    "⏩": 672,
    "⏫": 673,
    "⏬": 674,
    "⤵️": 675,
    "⤴️": 676,
    "🆗": 677,
    "🔀": 678,
    "🔁": 679,
    "🔂": 680,
    "🆕": 681,
    "🆙": 682,
    "🆒": 683,
    "🆓": 684,
    "🆖": 685,
    "📶": 686,
    "🎦": 687,
    "🈁": 688,
    "🈯️": 689,
    "🈳": 690,
    "🈵": 691,
    "🈴": 692,
    "🈲": 693,
    "🉐": 694,
    "🈹": 695,
    "🈺": 696,
    "🈶": 697,
    "🈚️": 698,
    "🚻": 699,
    "🚹": 700,
    "🚺": 701,
    "🚼": 702,
    "🚾": 703,
    "🚰": 704,
    "🚮": 705,
    "🅿️": 706,
    "♿️": 707,
    "🚭": 708,
    "🈷": 709,
    "🈸": 710,
    "🈂": 711,
    "Ⓜ️": 712,
    "🛂": 713,
    "🛄": 714,
    "🛅": 715,
    "🛃": 716,
    "🉑": 717,
    "㊙️": 718,
    "㊗️": 719,
    "🆑": 720,
    "🆘": 721,
    "🆔": 722,
    "🚫": 723,
    "🔞": 724,
    "📵": 725,
    "🚯": 726,
    "🚱": 727,
    "🚳": 728,
    "🚷": 729,
    "🚸": 730,
    "⛔️": 731,
    "✳️": 732,
    "❇️": 733,
    "❎": 734,
    "✅": 735,
    "✴️": 736,
    "💟": 737,
    "🆚": 738,
    "📳": 739,
    "📴": 740,
    "🅰": 741,
    "🅱": 742,
    "🆎": 743,
    "🅾": 744,
    "💠": 745,
    "➿": 746,
    "♻️": 747,
    "♈️": 748,
    "♉️": 749,
    "♊️": 750,
    "♋️": 751,
    "♌️": 752,
    "♍️": 753,
    "♎️": 754,
    "♏️": 755,
    "♐️": 756,
    "♑️": 757,
    "♒️": 758,
    "♓️": 759,
    "⛎": 760,
    "🔯": 761,
    "🏧": 762,
    "💹": 763,
    "💲": 764,
    "💱": 765,
    "©": 766,
    "®": 767,
    "™": 768,
    "❌": 769,
    "‼️": 770,
    "⁉️": 771,
    "❗️": 772,
    "❓": 773,
    "❕": 774,
    "❔": 775,
    "⭕️": 776,
    "🔝": 777,
    "🔚": 778,
    "🔙": 779,
    "🔛": 780,
    "🔜": 781,
    "🔃": 782,
    "🕛": 783,
    "🕧": 784,
    "🕐": 785,
    "🕜": 786,
    "🕑": 787,
    "🕝": 788,
    "🕒": 789,
    "🕞": 790,
    "🕓": 791,
    "🕟": 792,
    "🕔": 793,
    "🕠": 794,
    "🕕": 795,
    "🕖": 796,
    "🕗": 797,
    "🕘": 798,
    "🕙": 799,
    "🕚": 800,
    "🕡": 801,
    "🕢": 802,
    "🕣": 803,
    "🕤": 804,
    "🕥": 805,
    "🕦": 806,
    "✖️": 807,
    "➕": 808,
    "➖": 809,
    "➗": 810,
    "♠️": 811,
    "♥️": 812,
    "♣️": 813,
    "♦️": 814,
    "💮": 815,
    "💯": 816,
    "✔️": 817,
    "☑️": 818,
    "🔘": 819,
    "🔗": 820,
    "➰": 821,
    "〰": 822,
    "〽️": 823,
    "🔱": 824,
    "◼️": 825,
    "◻️": 826,
    "◾️": 827,
    "◽️": 828,
    "▪️": 829,
    "▫️": 830,
    "🔺": 831,
    "🔲": 832,
    "🔳": 833,
    "⚫️": 834,
    "⚪️": 835,
    "🔴": 836,
    "🔵": 837,
    "🔻": 838,
    "⬜️": 839,
    "⬛️": 840,
    "🔶": 841,
    "🔷": 842,
    "🔸": 843,
    "🔹": 844,
    "☺": 4,
    "✌": 110,
    "☝": 120,
    "❤": 172,
    "⭐": 293,
    "☀": 294,
    "⛅": 295,
    "☁": 296,
    "⚡": 297,
    "☔": 298,
    "❄": 299,
    "⛄": 300,
    "☎": 336,
    "⌛": 352,
    "⌚": 354,
    "✉": 393,
    "✂": 417,
    "✒": 420,
    "✏": 421,
    "🀄": 454,
    "⚽": 459,
    "⚾": 460,
    "⛳": 465,
    "☕": 476,
    "⛪": 546,
    "⛺": 553,
    "⛲": 565,
    "⛵": 568,
    "⚓": 571,
    "✈": 573,
    "⚠": 614,
    "⛽": 617,
    "♨": 620,
    "⬆": 650,
    "⬇": 651,
    "⬅": 652,
    "➡": 653,
    "↗": 657,
    "↖": 658,
    "↘": 659,
    "↙": 660,
    "↔": 661,
    "↕": 662,
    "◀": 664,
    "▶": 665,
    "↩": 668,
    "↪": 669,
    "⤵": 675,
    "⤴": 676,
    "🈯": 689,
    "🈚": 698,
    "🅿": 706,
    "♿": 707,
    "Ⓜ": 712,
    "㊙": 718,
    "㊗": 719,
    "⛔": 731,
    "✳": 732,
    "❇": 733,
    "✴": 736,
    "♻": 747,
    "♈": 748,
    "♉": 749,
    "♊": 750,
    "♋": 751,
    "♌": 752,
    "♍": 753,
    "♎": 754,
    "♏": 755,
    "♐": 756,
    "♑": 757,
    "♒": 758,
    "♓": 759,
    "‼": 770,
    "⁉": 771,
    "❗": 772,
    "⭕": 776,
    "✖": 807,
    "♠": 811,
    "♥": 812,
    "♣": 813,
    "♦": 814,
    "✔": 817,
    "☑": 818,
    "〽": 823,
    "◼": 825,
    "◻": 826,
    "◾": 827,
    "◽": 828,
    "▪": 829,
    "▫": 830,
    "⚫": 834,
    "⚪": 835,
    "⬜": 839,
    "⬛": 840,
  };
  var regx_arr = [];
  for (var k in emoji) {
    regx_arr.push(k);
  }
  var regx = new RegExp("(" + regx_arr.join("|") + ")", "g");
  regx_arr = null;
  return str.replace(regx, function(a, b) {
    return '<span class="vco-emoji emj' + emoji[b] + '"></span>';
  });
};
VCO.Easings = {
  ease: [0.25, 0.1, 0.25, 1],
  linear: [0, 0, 1, 1],
  easein: [0.42, 0, 1, 1],
  easeout: [0, 0, 0.58, 1],
  easeinout: [0.42, 0, 0.58, 1],
};
VCO.Ease = {
  KeySpline: function(a) {
    this.get = function(aX) {
      if (a[0] == a[1] && a[2] == a[3]) return aX;
      return CalcBezier(GetTForX(aX), a[1], a[3]);
    };
    function A(aA1, aA2) {
      return 1 - 3 * aA2 + 3 * aA1;
    }
    function B(aA1, aA2) {
      return 3 * aA2 - 6 * aA1;
    }
    function C(aA1) {
      return 3 * aA1;
    }
    function CalcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }
    function GetSlope(aT, aA1, aA2) {
      return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
    }
    function GetTForX(aX) {
      var aGuessT = aX;
      for (var i = 0; i < 4; ++i) {
        var currentSlope = GetSlope(aGuessT, a[0], a[2]);
        if (currentSlope == 0) return aGuessT;
        var currentX = CalcBezier(aGuessT, a[0], a[2]) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }
  },
  easeInSpline: function(t) {
    var spline = new VCO.Ease.KeySpline(VCO.Easings.easein);
    return spline.get(t);
  },
  easeInOutExpo: function(t) {
    var spline = new VCO.Ease.KeySpline(VCO.Easings.easein);
    return spline.get(t);
  },
  easeOut: function(t) {
    return Math.sin((t * Math.PI) / 2);
  },
  easeOutStrong: function(t) {
    return t == 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },
  easeIn: function(t) {
    return t * t;
  },
  easeInStrong: function(t) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  },
  easeOutBounce: function(pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
    }
  },
  easeInBack: function(pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },
  easeOutBack: function(pos) {
    var s = 1.70158;
    return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
  },
  bounce: function(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }
    if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    }
    if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    }
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
  bouncePast: function(pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
    } else if (pos < 2.5 / 2.75) {
      return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
    } else {
      return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
    }
  },
  swingTo: function(pos) {
    var s = 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
  },
  swingFrom: function(pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },
  elastic: function(pos) {
    return (
      -1 *
        Math.pow(4, -8 * pos) *
        Math.sin(((pos * 6 - 1) * (2 * Math.PI)) / 2) +
      1
    );
  },
  spring: function(pos) {
    return 1 - Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6);
  },
  blink: function(pos, blinks) {
    return Math.round(pos * (blinks || 5)) % 2;
  },
  pulse: function(pos, pulses) {
    return -Math.cos(pos * ((pulses || 5) - 0.5) * 2 * Math.PI) / 2 + 0.5;
  },
  wobble: function(pos) {
    return -Math.cos(pos * Math.PI * (9 * pos)) / 2 + 0.5;
  },
  sinusoidal: function(pos) {
    return -Math.cos(pos * Math.PI) / 2 + 0.5;
  },
  flicker: function(pos) {
    var pos = pos + (Math.random() - 0.5) / 5;
    return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
  },
  mirror: function(pos) {
    if (pos < 0.5) return easings.sinusoidal(pos * 2);
    else return easings.sinusoidal(1 - (pos - 0.5) * 2);
  },
  easeInQuad: function(t) {
    return t * t;
  },
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic: function(t) {
    return t * t * t;
  },
  easeOutCubic: function(t) {
    return --t * t * t + 1;
  },
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  easeOutQuart: function(t) {
    return 1 - --t * t * t * t;
  },
  easeInOutQuart: function(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function(t) {
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint: function(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },
};
VCO.Animate = function(el, options) {
  var animation = new vcoanimate(el, options),
    webkit_timeout;
  return animation;
};
window.vcoanimate = (function() {
  var doc = document,
    win = window,
    perf = win.performance,
    perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
    now = perfNow
      ? function() {
          return perfNow.call(perf);
        }
      : function() {
          return +new Date();
        },
    html = doc.documentElement,
    fixTs = false,
    thousand = 1e3,
    rgbOhex = /^rgb\(|#/,
    relVal = /^([+\-])=([\d\.]+)/,
    numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,
    rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,
    scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
    skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,
    translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
    unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1 };
  var transform = (function() {
    var styles = doc.createElement("a").style,
      props = [
        "webkitTransform",
        "MozTransform",
        "OTransform",
        "msTransform",
        "Transform",
      ],
      i;
    for (i = 0; i < props.length; i++) {
      if (props[i] in styles) return props[i];
    }
  })();
  var opacity = (function() {
    return typeof doc.createElement("a").style.opacity !== "undefined";
  })();
  var getStyle =
    doc.defaultView && doc.defaultView.getComputedStyle
      ? function(el, property) {
          property = property == "transform" ? transform : property;
          property = camelize(property);
          var value = null,
            computed = doc.defaultView.getComputedStyle(el, "");
          computed && (value = computed[property]);
          return el.style[property] || value;
        }
      : html.currentStyle
      ? function(el, property) {
          property = camelize(property);
          if (property == "opacity") {
            var val = 100;
            try {
              val = el.filters["DXImageTransform.Microsoft.Alpha"].opacity;
            } catch (e1) {
              try {
                val = el.filters("alpha").opacity;
              } catch (e2) {}
            }
            return val / 100;
          }
          var value = el.currentStyle ? el.currentStyle[property] : null;
          return el.style[property] || value;
        }
      : function(el, property) {
          return el.style[camelize(property)];
        };
  var frame = (function() {
    return (
      win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.msRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      function(callback) {
        win.setTimeout(function() {
          callback(+new Date());
        }, 17);
      }
    );
  })();
  var children = [];
  frame(function(timestamp) {
    fixTs = timestamp > 1e12 != now() > 1e12;
  });
  function has(array, elem, i) {
    if (Array.prototype.indexOf) return array.indexOf(elem);
    for (i = 0; i < array.length; ++i) {
      if (array[i] === elem) return i;
    }
  }
  function render(timestamp) {
    var i,
      count = children.length;
    if (perfNow && timestamp > 1e12) timestamp = now();
    if (fixTs) timestamp = now();
    for (i = count; i--; ) {
      children[i](timestamp);
    }
    children.length && frame(render);
  }
  function live(f) {
    if (children.push(f) === 1) frame(render);
  }
  function die(f) {
    var rest,
      index = has(children, f);
    if (index >= 0) {
      rest = children.slice(index + 1);
      children.length = index;
      children = children.concat(rest);
    }
  }
  function parseTransform(style, base) {
    var values = {},
      m;
    if ((m = style.match(rotate)))
      values.rotate = by(m[1], base ? base.rotate : null);
    if ((m = style.match(scale)))
      values.scale = by(m[1], base ? base.scale : null);
    if ((m = style.match(skew))) {
      values.skewx = by(m[1], base ? base.skewx : null);
      values.skewy = by(m[3], base ? base.skewy : null);
    }
    if ((m = style.match(translate))) {
      values.translatex = by(m[1], base ? base.translatex : null);
      values.translatey = by(m[3], base ? base.translatey : null);
    }
    return values;
  }
  function formatTransform(v) {
    var s = "";
    if ("rotate" in v) s += "rotate(" + v.rotate + "deg) ";
    if ("scale" in v) s += "scale(" + v.scale + ") ";
    if ("translatex" in v)
      s += "translate(" + v.translatex + "px," + v.translatey + "px) ";
    if ("skewx" in v) s += "skew(" + v.skewx + "deg," + v.skewy + "deg)";
    return s;
  }
  function rgb(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return (m ? rgb(m[1], m[2], m[3]) : c).replace(
      /#(\w)(\w)(\w)$/,
      "#$1$1$2$2$3$3"
    );
  }
  function camelize(s) {
    return s.replace(/-(.)/g, function(m, m1) {
      return m1.toUpperCase();
    });
  }
  function fun(f) {
    return typeof f == "function";
  }
  function nativeTween(t) {
    return Math.sin((t * Math.PI) / 2);
  }
  function tween(duration, fn, done, ease, from, to) {
    ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween;
    var time = duration || thousand,
      self = this,
      diff = to - from,
      start = now(),
      stop = 0,
      end = 0;
    function run(t) {
      var delta = t - start;
      if (delta > time || stop) {
        to = isFinite(to) ? to : 1;
        stop ? end && fn(to) : fn(to);
        die(run);
        return done && done.apply(self);
      }
      isFinite(to)
        ? fn(diff * ease(delta / time) + from)
        : fn(ease(delta / time));
    }
    live(run);
    return {
      stop: function(jump) {
        stop = 1;
        end = jump;
        if (!jump) done = null;
      },
    };
  }
  function bezier(points, pos) {
    var n = points.length,
      r = [],
      i,
      j;
    for (i = 0; i < n; ++i) {
      r[i] = [points[i][0], points[i][1]];
    }
    for (j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0];
        r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1];
      }
    }
    return [r[0][0], r[0][1]];
  }
  function nextColor(pos, start, finish) {
    var r = [],
      i,
      e,
      from,
      to;
    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i), 16));
      to = Math.min(15, parseInt(finish.charAt(i), 16));
      e = Math.floor((to - from) * pos + from);
      e = e > 15 ? 15 : e < 0 ? 0 : e;
      r[i] = e.toString(16);
    }
    return "#" + r.join("");
  }
  function getTweenVal(pos, units, begin, end, k, i, v) {
    if (k == "transform") {
      v = {};
      for (var t in begin[i][k]) {
        v[t] =
          t in end[i][k]
            ? Math.round(
                ((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) *
                  thousand
              ) / thousand
            : begin[i][k][t];
      }
      return v;
    } else if (typeof begin[i][k] == "string") {
      return nextColor(pos, begin[i][k], end[i][k]);
    } else {
      v =
        Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) /
        thousand;
      if (!(k in unitless)) v += units[i][k] || "px";
      return v;
    }
  }
  function by(val, start, m, r, i) {
    return (m = relVal.exec(val))
      ? (i = parseFloat(m[2])) && start + (m[1] == "+" ? 1 : -1) * i
      : parseFloat(val);
  }
  function morpheus(elements, options) {
    var els = elements
        ? (els = isFinite(elements.length) ? elements : [elements])
        : [],
      i,
      complete = options.complete,
      duration = options.duration,
      ease = options.easing,
      points = options.bezier,
      begin = [],
      end = [],
      units = [],
      bez = [],
      originalLeft,
      originalTop;
    if (points) {
      originalLeft = options.left;
      originalTop = options.top;
      delete options.right;
      delete options.bottom;
      delete options.left;
      delete options.top;
    }
    for (i = els.length; i--; ) {
      begin[i] = {};
      end[i] = {};
      units[i] = {};
      if (points) {
        var left = getStyle(els[i], "left"),
          top = getStyle(els[i], "top"),
          xy = [
            by(
              fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0,
              parseFloat(left)
            ),
            by(
              fun(originalTop) ? originalTop(els[i]) : originalTop || 0,
              parseFloat(top)
            ),
          ];
        bez[i] = fun(points) ? points(els[i], xy) : points;
        bez[i].push(xy);
        bez[i].unshift([parseInt(left, 10), parseInt(top, 10)]);
      }
      for (var k in options) {
        switch (k) {
          case "complete":
          case "duration":
          case "easing":
          case "bezier":
            continue;
        }
        var v = getStyle(els[i], k),
          unit,
          tmp = fun(options[k]) ? options[k](els[i]) : options[k];
        if (typeof tmp == "string" && rgbOhex.test(tmp) && !rgbOhex.test(v)) {
          delete options[k];
          continue;
        }
        begin[i][k] =
          k == "transform"
            ? parseTransform(v)
            : typeof tmp == "string" && rgbOhex.test(tmp)
            ? toHex(v).slice(1)
            : parseFloat(v);
        end[i][k] =
          k == "transform"
            ? parseTransform(tmp, begin[i][k])
            : typeof tmp == "string" && tmp.charAt(0) == "#"
            ? toHex(tmp).slice(1)
            : by(tmp, parseFloat(v));
        typeof tmp == "string" &&
          (unit = tmp.match(numUnit)) &&
          (units[i][k] = unit[1]);
      }
    }
    return tween.apply(els, [
      duration,
      function(pos, v, xy) {
        for (i = els.length; i--; ) {
          if (points) {
            xy = bezier(bez[i], pos);
            els[i].style.left = xy[0] + "px";
            els[i].style.top = xy[1] + "px";
          }
          for (var k in options) {
            v = getTweenVal(pos, units, begin, end, k, i);
            k == "transform"
              ? (els[i].style[transform] = formatTransform(v))
              : k == "opacity" && !opacity
              ? (els[i].style.filter = "alpha(opacity=" + v * 100 + ")")
              : (els[i].style[camelize(k)] = v);
          }
        }
      },
      complete,
      ease,
    ]);
  }
  morpheus.tween = tween;
  morpheus.getStyle = getStyle;
  morpheus.bezier = bezier;
  morpheus.transform = transform;
  morpheus.parseTransform = parseTransform;
  morpheus.formatTransform = formatTransform;
  morpheus.easings = {};
  return morpheus;
})();
VCO.Point = function(x, y, round) {
  this.x = round ? Math.round(x) : x;
  this.y = round ? Math.round(y) : y;
};
VCO.Point.prototype = {
  add: function(point) {
    return this.clone()._add(point);
  },
  _add: function(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  },
  subtract: function(point) {
    return this.clone()._subtract(point);
  },
  _subtract: function(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  },
  divideBy: function(num, round) {
    return new VCO.Point(this.x / num, this.y / num, round);
  },
  multiplyBy: function(num) {
    return new VCO.Point(this.x * num, this.y * num);
  },
  distanceTo: function(point) {
    var x = point.x - this.x,
      y = point.y - this.y;
    return Math.sqrt(x * x + y * y);
  },
  round: function() {
    return this.clone()._round();
  },
  _round: function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  },
  clone: function() {
    return new VCO.Point(this.x, this.y);
  },
  toString: function() {
    return (
      "Point(" +
      VCO.Util.formatNum(this.x) +
      ", " +
      VCO.Util.formatNum(this.y) +
      ")"
    );
  },
};
VCO.DomMixins = {
  show: function(animate) {
    if (animate) {
    } else {
      this._el.container.style.display = "block";
    }
  },
  hide: function(animate) {
    this._el.container.style.display = "none";
  },
  addTo: function(container) {
    container.appendChild(this._el.container);
    this.onAdd();
  },
  removeFrom: function(container) {
    container.removeChild(this._el.container);
    this.onRemove();
  },
  animatePosition: function(pos, el, use_percent) {
    var ani = { duration: this.options.duration, easing: this.options.ease };
    for (var name in pos) {
      if (pos.hasOwnProperty(name)) {
        if (use_percent) {
          ani[name] = pos[name] + "%";
        } else {
          ani[name] = pos[name] + "px";
        }
      }
    }
    if (this.animator) {
      this.animator.stop();
    }
    this.animator = VCO.Animate(el, ani);
  },
  onLoaded: function() {
    this.fire("loaded", this.data);
  },
  onAdd: function() {
    this.fire("added", this.data);
  },
  onRemove: function() {
    this.fire("removed", this.data);
  },
  setPosition: function(pos, el) {
    for (var name in pos) {
      if (pos.hasOwnProperty(name)) {
        if (el) {
          el.style[name] = pos[name] + "px";
        } else {
          this._el.container.style[name] = pos[name] + "px";
        }
      }
    }
  },
  getPosition: function() {
    return VCO.Dom.getPosition(this._el.container);
  },
};
VCO.Dom = {
  get: function(id) {
    return typeof id === "string" ? document.getElementById(id) : id;
  },
  getByClass: function(id) {
    if (id) {
      return document.getElementsByClassName(id);
    }
  },
  create: function(tagName, className, container) {
    var el = document.createElement(tagName);
    el.className = className;
    if (container) {
      container.appendChild(el);
    }
    return el;
  },
  createText: function(content, container) {
    var el = document.createTextNode(content);
    if (container) {
      container.appendChild(el);
    }
    return el;
  },
  getTranslateString: function(point) {
    return (
      VCO.Dom.TRANSLATE_OPEN +
      point.x +
      "px," +
      point.y +
      "px" +
      VCO.Dom.TRANSLATE_CLOSE
    );
  },
  setPosition: function(el, point) {
    el._vco_pos = point;
    if (VCO.Browser.webkit3d) {
      el.style[VCO.Dom.TRANSFORM] = VCO.Dom.getTranslateString(point);
      if (VCO.Browser.android) {
        el.style["-webkit-perspective"] = "1000";
        el.style["-webkit-backface-visibility"] = "hidden";
      }
    } else {
      el.style.left = point.x + "px";
      el.style.top = point.y + "px";
    }
  },
  getPosition: function(el) {
    var pos = { x: 0, y: 0 };
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      pos.x += el.offsetLeft;
      pos.y += el.offsetTop;
      el = el.offsetParent;
    }
    return pos;
  },
  testProp: function(props) {
    var style = document.documentElement.style;
    for (var i = 0; i < props.length; i++) {
      if (props[i] in style) {
        return props[i];
      }
    }
    return false;
  },
};
VCO.Util.extend(VCO.Dom, {
  TRANSITION: VCO.Dom.testProp([
    "transition",
    "webkitTransition",
    "OTransition",
    "MozTransition",
    "msTransition",
  ]),
  TRANSFORM: VCO.Dom.testProp([
    "transformProperty",
    "WebkitTransform",
    "OTransform",
    "MozTransform",
    "msTransform",
  ]),
  TRANSLATE_OPEN: "translate" + (VCO.Browser.webkit3d ? "3d(" : "("),
  TRANSLATE_CLOSE: VCO.Browser.webkit3d ? ",0)" : ")",
});
VCO.DomUtil = {
  get: function(id) {
    return typeof id === "string" ? document.getElementById(id) : id;
  },
  getStyle: function(el, style) {
    var value = el.style[style];
    if (!value && el.currentStyle) {
      value = el.currentStyle[style];
    }
    if (!value || value === "auto") {
      var css = document.defaultView.getComputedStyle(el, null);
      value = css ? css[style] : null;
    }
    return value === "auto" ? null : value;
  },
  getViewportOffset: function(element) {
    var top = 0,
      left = 0,
      el = element,
      docBody = document.body;
    do {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      if (
        el.offsetParent === docBody &&
        VCO.DomUtil.getStyle(el, "position") === "absolute"
      ) {
        break;
      }
      el = el.offsetParent;
    } while (el);
    el = element;
    do {
      if (el === docBody) {
        break;
      }
      top -= el.scrollTop || 0;
      left -= el.scrollLeft || 0;
      el = el.parentNode;
    } while (el);
    return new VCO.Point(left, top);
  },
  create: function(tagName, className, container) {
    var el = document.createElement(tagName);
    el.className = className;
    if (container) {
      container.appendChild(el);
    }
    return el;
  },
  disableTextSelection: function() {
    if (document.selection && document.selection.empty) {
      document.selection.empty();
    }
    if (!this._onselectstart) {
      this._onselectstart = document.onselectstart;
      document.onselectstart = VCO.Util.falseFn;
    }
  },
  enableTextSelection: function() {
    document.onselectstart = this._onselectstart;
    this._onselectstart = null;
  },
  hasClass: function(el, name) {
    return (
      el.className.length > 0 &&
      new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className)
    );
  },
  addClass: function(el, name) {
    if (!VCO.DomUtil.hasClass(el, name)) {
      el.className += (el.className ? " " : "") + name;
    }
  },
  removeClass: function(el, name) {
    el.className = el.className
      .replace(/(\S+)\s*/g, function(w, match) {
        if (match === name) {
          return "";
        }
        return w;
      })
      .replace(/^\s+/, "");
  },
  setOpacity: function(el, value) {
    if (VCO.Browser.ie) {
      el.style.filter = "alpha(opacity=" + Math.round(value * 100) + ")";
    } else {
      el.style.opacity = value;
    }
  },
  testProp: function(props) {
    var style = document.documentElement.style;
    for (var i = 0; i < props.length; i++) {
      if (props[i] in style) {
        return props[i];
      }
    }
    return false;
  },
  getTranslateString: function(point) {
    return (
      VCO.DomUtil.TRANSLATE_OPEN +
      point.x +
      "px," +
      point.y +
      "px" +
      VCO.DomUtil.TRANSLATE_CLOSE
    );
  },
  getScaleString: function(scale, origin) {
    var preTranslateStr = VCO.DomUtil.getTranslateString(origin),
      scaleStr = " scale(" + scale + ") ",
      postTranslateStr = VCO.DomUtil.getTranslateString(origin.multiplyBy(-1));
    return preTranslateStr + scaleStr + postTranslateStr;
  },
  setPosition: function(el, point) {
    el._vco_pos = point;
    if (VCO.Browser.webkit3d) {
      el.style[VCO.DomUtil.TRANSFORM] = VCO.DomUtil.getTranslateString(point);
      if (VCO.Browser.android) {
        el.style["-webkit-perspective"] = "1000";
        el.style["-webkit-backface-visibility"] = "hidden";
      }
    } else {
      el.style.left = point.x + "px";
      el.style.top = point.y + "px";
    }
  },
  getPosition: function(el) {
    return el._vco_pos;
  },
};
VCO.DomEvent = {
  addListener: function(obj, type, fn, context) {
    var id = VCO.Util.stamp(fn),
      key = "_vco_" + type + id;
    if (obj[key]) {
      return;
    }
    var handler = function(e) {
      return fn.call(context || obj, e || VCO.DomEvent._getEvent());
    };
    if (VCO.Browser.touch && type === "dblclick" && this.addDoubleTapListener) {
      this.addDoubleTapListener(obj, handler, id);
    } else if ("addEventListener" in obj) {
      if (type === "mousewheel") {
        obj.addEventListener("DOMMouseScroll", handler, false);
        obj.addEventListener(type, handler, false);
      } else if (type === "mouseenter" || type === "mouseleave") {
        var originalHandler = handler,
          newType = type === "mouseenter" ? "mouseover" : "mouseout";
        handler = function(e) {
          if (!VCO.DomEvent._checkMouse(obj, e)) {
            return;
          }
          return originalHandler(e);
        };
        obj.addEventListener(newType, handler, false);
      } else {
        obj.addEventListener(type, handler, false);
      }
    } else if ("attachEvent" in obj) {
      obj.attachEvent("on" + type, handler);
    }
    obj[key] = handler;
  },
  removeListener: function(obj, type, fn) {
    var id = VCO.Util.stamp(fn),
      key = "_vco_" + type + id,
      handler = obj[key];
    if (!handler) {
      return;
    }
    if (
      VCO.Browser.touch &&
      type === "dblclick" &&
      this.removeDoubleTapListener
    ) {
      this.removeDoubleTapListener(obj, id);
    } else if ("removeEventListener" in obj) {
      if (type === "mousewheel") {
        obj.removeEventListener("DOMMouseScroll", handler, false);
        obj.removeEventListener(type, handler, false);
      } else if (type === "mouseenter" || type === "mouseleave") {
        obj.removeEventListener(
          type === "mouseenter" ? "mouseover" : "mouseout",
          handler,
          false
        );
      } else {
        obj.removeEventListener(type, handler, false);
      }
    } else if ("detachEvent" in obj) {
      obj.detachEvent("on" + type, handler);
    }
    obj[key] = null;
  },
  _checkMouse: function(el, e) {
    var related = e.relatedTarget;
    if (!related) {
      return true;
    }
    try {
      while (related && related !== el) {
        related = related.parentNode;
      }
    } catch (err) {
      return false;
    }
    return related !== el;
  },
  _getEvent: function() {
    var e = window.event;
    if (!e) {
      var caller = arguments.callee.caller;
      while (caller) {
        e = caller["arguments"][0];
        if (e && window.Event === e.constructor) {
          break;
        }
        caller = caller.caller;
      }
    }
    return e;
  },
  stopPropagation: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  },
  disableClickPropagation: function(el) {
    VCO.DomEvent.addListener(
      el,
      VCO.Draggable.START,
      VCO.DomEvent.stopPropagation
    );
    VCO.DomEvent.addListener(el, "click", VCO.DomEvent.stopPropagation);
    VCO.DomEvent.addListener(el, "dblclick", VCO.DomEvent.stopPropagation);
  },
  preventDefault: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  },
  stop: function(e) {
    VCO.DomEvent.preventDefault(e);
    VCO.DomEvent.stopPropagation(e);
  },
  getWheelDelta: function(e) {
    var delta = 0;
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
    }
    if (e.detail) {
      delta = -e.detail / 3;
    }
    return delta;
  },
};
VCO.Draggable = VCO.Class.extend({
  includes: VCO.Events,
  _el: {},
  mousedrag: {
    down: "mousedown",
    up: "mouseup",
    leave: "mouseleave",
    move: "mousemove",
  },
  touchdrag: {
    down: "touchstart",
    up: "touchend",
    leave: "mouseleave",
    move: "touchmove",
  },
  initialize: function(drag_elem, options, move_elem) {
    this._el = { drag: drag_elem, move: drag_elem };
    if (move_elem) {
      this._el.move = move_elem;
    }
    this.options = {
      enable: { x: true, y: true },
      constraint: { top: false, bottom: false, left: false, right: false },
      momentum_multiplier: 2e3,
      duration: 1e3,
      ease: VCO.Ease.easeInOutQuint,
    };
    this.animator = null;
    this.dragevent = this.mousedrag;
    if (VCO.Browser.touch) {
      this.dragevent = this.touchdrag;
    }
    this.data = {
      sliding: false,
      direction: "none",
      pagex: { start: 0, end: 0 },
      pagey: { start: 0, end: 0 },
      pos: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
      new_pos: { x: 0, y: 0 },
      new_pos_parent: { x: 0, y: 0 },
      time: { start: 0, end: 0 },
      touch: false,
    };
    VCO.Util.mergeData(this.options, options);
  },
  enable: function(e) {
    this.data.pos.start = 0;
    this._el.move.style.left = this.data.pos.start.x + "px";
    this._el.move.style.top = this.data.pos.start.y + "px";
    this._el.move.style.position = "absolute";
  },
  disable: function() {
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.down,
      this._onDragStart,
      this
    );
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.up,
      this._onDragEnd,
      this
    );
  },
  stopMomentum: function() {
    if (this.animator) {
      this.animator.stop();
    }
  },
  updateConstraint: function(c) {
    this.options.constraint = c;
  },
  _onDragStart: function(e) {
    if (VCO.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.start = e.originalEvent.touches[0].screenX;
        this.data.pagey.start = e.originalEvent.touches[0].screenY;
      } else {
        this.data.pagex.start = e.targetTouches[0].screenX;
        this.data.pagey.start = e.targetTouches[0].screenY;
      }
    } else {
      this.data.pagex.start = e.pageX;
      this.data.pagey.start = e.pageY;
    }
    if (this.options.enable.x) {
      this._el.move.style.left =
        this.data.pagex.start - this._el.move.offsetWidth / 2 + "px";
    }
    if (this.options.enable.y) {
      this._el.move.style.top =
        this.data.pagey.start - this._el.move.offsetHeight / 2 + "px";
    }
    this.data.pos.start = VCO.Dom.getPosition(this._el.drag);
    this.data.time.start = new Date().getTime();
    this.fire("dragstart", this.data);
    VCO.DomEvent.addListener(
      this._el.drag,
      this.dragevent.move,
      this._onDragMove,
      this
    );
    VCO.DomEvent.addListener(
      this._el.drag,
      this.dragevent.leave,
      this._onDragEnd,
      this
    );
  },
  _onDragEnd: function(e) {
    this.data.sliding = false;
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.move,
      this._onDragMove,
      this
    );
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.leave,
      this._onDragEnd,
      this
    );
    this.fire("dragend", this.data);
    this._momentum();
  },
  _onDragMove: function(e) {
    e.preventDefault();
    this.data.sliding = true;
    if (VCO.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.end = e.originalEvent.touches[0].screenX;
        this.data.pagey.end = e.originalEvent.touches[0].screenY;
      } else {
        this.data.pagex.end = e.targetTouches[0].screenX;
        this.data.pagey.end = e.targetTouches[0].screenY;
      }
    } else {
      this.data.pagex.end = e.pageX;
      this.data.pagey.end = e.pageY;
    }
    this.data.pos.end = VCO.Dom.getPosition(this._el.drag);
    this.data.new_pos.x = -(
      this.data.pagex.start -
      this.data.pagex.end -
      this.data.pos.start.x
    );
    this.data.new_pos.y = -(
      this.data.pagey.start -
      this.data.pagey.end -
      this.data.pos.start.y
    );
    if (this.options.enable.x) {
      this._el.move.style.left = this.data.new_pos.x + "px";
    }
    if (this.options.enable.y) {
      this._el.move.style.top = this.data.new_pos.y + "px";
    }
    this.fire("dragmove", this.data);
  },
  _momentum: function() {
    var pos_adjust = { x: 0, y: 0, time: 0 },
      pos_change = { x: 0, y: 0, time: 0 },
      swipe = false,
      swipe_direction = "";
    if (VCO.Browser.touch) {
    }
    pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.x =
      this.options.momentum_multiplier *
      (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
    pos_change.y =
      this.options.momentum_multiplier *
      (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
    pos_adjust.x = Math.round(pos_change.x / pos_change.time);
    pos_adjust.y = Math.round(pos_change.y / pos_change.time);
    this.data.new_pos.x = Math.min(this.data.pos.end.x + pos_adjust.x);
    this.data.new_pos.y = Math.min(this.data.pos.end.y + pos_adjust.y);
    if (!this.options.enable.x) {
      this.data.new_pos.x = this.data.pos.start.x;
    } else if (this.data.new_pos.x < 0) {
      this.data.new_pos.x = 0;
    }
    if (!this.options.enable.y) {
      this.data.new_pos.y = this.data.pos.start.y;
    } else if (this.data.new_pos.y < 0) {
      this.data.new_pos.y = 0;
    }
    if (pos_change.time < 3e3) {
      swipe = true;
    }
    if (Math.abs(pos_change.x) > 1e4) {
      this.data.direction = "left";
      if (pos_change.x > 0) {
        this.data.direction = "right";
      }
    }
    if (Math.abs(pos_change.y) > 1e4) {
      this.data.direction = "up";
      if (pos_change.y > 0) {
        this.data.direction = "down";
      }
    }
    this._animateMomentum();
    if (swipe) {
      this.fire("swipe_" + this.data.direction, this.data);
    }
  },
  _animateMomentum: function() {
    var pos = { x: this.data.new_pos.x, y: this.data.new_pos.y },
      animate = {
        duration: this.options.duration,
        easing: VCO.Ease.easeOutStrong,
      };
    if (this.options.enable.y) {
      if (this.options.constraint.top || this.options.constraint.bottom) {
        if (pos.y > this.options.constraint.bottom) {
          pos.y = this.options.constraint.bottom;
        } else if (pos.y < this.options.constraint.top) {
          pos.y = this.options.constraint.top;
        }
      }
      animate.top = Math.floor(pos.y) + "px";
    }
    if (this.options.enable.x) {
      if (this.options.constraint.left || this.options.constraint.right) {
        if (pos.x > this.options.constraint.left) {
          pos.x = this.options.constraint.left;
        } else if (pos.x < this.options.constraint.right) {
          pos.x = this.options.constraint.right;
        }
      }
      animate.left = Math.floor(pos.x) + "px";
    }
    this.animator = VCO.Animate(this._el.move, animate);
    this.fire("momentum", this.data);
  },
});
VCO.Swipable = VCO.Class.extend({
  includes: VCO.Events,
  _el: {},
  mousedrag: {
    down: "mousedown",
    up: "mouseup",
    leave: "mouseleave",
    move: "mousemove",
  },
  touchdrag: {
    down: "touchstart",
    up: "touchend",
    leave: "mouseleave",
    move: "touchmove",
  },
  initialize: function(drag_elem, move_elem, options) {
    this._el = { drag: drag_elem, move: drag_elem };
    if (move_elem) {
      this._el.move = move_elem;
    }
    this.options = {
      snap: false,
      enable: { x: true, y: true },
      constraint: { top: false, bottom: false, left: 0, right: false },
      momentum_multiplier: 2e3,
      duration: 1e3,
      ease: VCO.Ease.easeInOutQuint,
    };
    this.animator = null;
    this.dragevent = this.mousedrag;
    if (VCO.Browser.touch) {
      this.dragevent = this.touchdrag;
    }
    this.data = {
      sliding: false,
      direction: "none",
      pagex: { start: 0, end: 0 },
      pagey: { start: 0, end: 0 },
      pos: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
      new_pos: { x: 0, y: 0 },
      new_pos_parent: { x: 0, y: 0 },
      time: { start: 0, end: 0 },
      touch: false,
    };
    VCO.Util.mergeData(this.options, options);
  },
  enable: function(e) {
    VCO.DomEvent.addListener(
      this._el.drag,
      this.dragevent.down,
      this._onDragStart,
      this
    );
    VCO.DomEvent.addListener(
      this._el.drag,
      this.dragevent.up,
      this._onDragEnd,
      this
    );
    this.data.pos.start = 0;
    this._el.move.style.left = this.data.pos.start.x + "px";
    this._el.move.style.top = this.data.pos.start.y + "px";
    this._el.move.style.position = "absolute";
  },
  disable: function() {
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.down,
      this._onDragStart,
      this
    );
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.up,
      this._onDragEnd,
      this
    );
  },
  stopMomentum: function() {
    if (this.animator) {
      this.animator.stop();
    }
  },
  updateConstraint: function(c) {
    this.options.constraint = c;
  },
  _onDragStart: function(e) {
    if (this.animator) {
      this.animator.stop();
    }
    if (VCO.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.start = e.originalEvent.touches[0].screenX;
        this.data.pagey.start = e.originalEvent.touches[0].screenY;
      } else {
        this.data.pagex.start = e.targetTouches[0].screenX;
        this.data.pagey.start = e.targetTouches[0].screenY;
      }
    } else {
      this.data.pagex.start = e.pageX;
      this.data.pagey.start = e.pageY;
    }
    if (this.options.enable.x) {
    }
    if (this.options.enable.y) {
    }
    this.data.pos.start = {
      x: this._el.move.offsetLeft,
      y: this._el.move.offsetTop,
    };
    this.data.time.start = new Date().getTime();
    this.fire("dragstart", this.data);
    VCO.DomEvent.addListener(
      this._el.drag,
      this.dragevent.move,
      this._onDragMove,
      this
    );
    VCO.DomEvent.addListener(
      this._el.drag,
      this.dragevent.leave,
      this._onDragEnd,
      this
    );
  },
  _onDragEnd: function(e) {
    this.data.sliding = false;
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.move,
      this._onDragMove,
      this
    );
    VCO.DomEvent.removeListener(
      this._el.drag,
      this.dragevent.leave,
      this._onDragEnd,
      this
    );
    this.fire("dragend", this.data);
    this._momentum();
  },
  _onDragMove: function(e) {
    var change = { x: 0, y: 0 };
    this.data.sliding = true;
    if (VCO.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.end = e.originalEvent.touches[0].screenX;
        this.data.pagey.end = e.originalEvent.touches[0].screenY;
      } else {
        this.data.pagex.end = e.targetTouches[0].screenX;
        this.data.pagey.end = e.targetTouches[0].screenY;
      }
    } else {
      this.data.pagex.end = e.pageX;
      this.data.pagey.end = e.pageY;
    }
    change.x = this.data.pagex.start - this.data.pagex.end;
    change.y = this.data.pagey.start - this.data.pagey.end;
    this.data.pos.end = {
      x: this._el.drag.offsetLeft,
      y: this._el.drag.offsetTop,
    };
    this.data.new_pos.x = -(change.x - this.data.pos.start.x);
    this.data.new_pos.y = -(change.y - this.data.pos.start.y);
    if (this.options.enable.x && Math.abs(change.x) > Math.abs(change.y)) {
      e.preventDefault();
      this._el.move.style.left = this.data.new_pos.x + "px";
    }
    if (this.options.enable.y && Math.abs(change.y) > Math.abs(change.y)) {
      e.preventDefault();
      this._el.move.style.top = this.data.new_pos.y + "px";
    }
    this.fire("dragmove", this.data);
  },
  _momentum: function() {
    var pos_adjust = { x: 0, y: 0, time: 0 },
      pos_change = { x: 0, y: 0, time: 0 },
      swipe_detect = { x: false, y: false },
      swipe = false,
      swipe_direction = "";
    this.data.direction = null;
    pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.x =
      this.options.momentum_multiplier *
      (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
    pos_change.y =
      this.options.momentum_multiplier *
      (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
    pos_adjust.x = Math.round(pos_change.x / pos_change.time);
    pos_adjust.y = Math.round(pos_change.y / pos_change.time);
    this.data.new_pos.x = Math.min(this.data.pos.end.x + pos_adjust.x);
    this.data.new_pos.y = Math.min(this.data.pos.end.y + pos_adjust.y);
    if (!this.options.enable.x) {
      this.data.new_pos.x = this.data.pos.start.x;
    } else if (this.data.new_pos.x > 0) {
      this.data.new_pos.x = 0;
    }
    if (!this.options.enable.y) {
      this.data.new_pos.y = this.data.pos.start.y;
    } else if (this.data.new_pos.y < 0) {
      this.data.new_pos.y = 0;
    }
    if (pos_change.time < 2e3) {
      swipe = true;
    }
    if (this.options.enable.x && this.options.enable.y) {
      if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
        swipe_detect.x = true;
      } else {
        swipe_detect.y = true;
      }
    } else if (this.options.enable.x) {
      if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
        swipe_detect.x = true;
      }
    } else {
      if (Math.abs(pos_change.y) > Math.abs(pos_change.x)) {
        swipe_detect.y = true;
      }
    }
    if (swipe_detect.x) {
      if (Math.abs(pos_change.x) > this._el.drag.offsetWidth / 2) {
        swipe = true;
      }
      if (Math.abs(pos_change.x) > 1e4) {
        this.data.direction = "left";
        if (pos_change.x > 0) {
          this.data.direction = "right";
        }
      }
    }
    if (swipe_detect.y) {
      if (Math.abs(pos_change.y) > this._el.drag.offsetHeight / 2) {
        swipe = true;
      }
      if (Math.abs(pos_change.y) > 1e4) {
        this.data.direction = "up";
        if (pos_change.y > 0) {
          this.data.direction = "down";
        }
      }
    }
    this._animateMomentum();
    if (swipe && this.data.direction) {
      this.fire("swipe_" + this.data.direction, this.data);
    } else if (this.data.direction) {
      this.fire("swipe_nodirection", this.data);
    } else if (this.options.snap) {
      this.animator.stop();
      this.animator = VCO.Animate(this._el.move, {
        top: this.data.pos.start.y,
        left: this.data.pos.start.x,
        duration: this.options.duration,
        easing: VCO.Ease.easeOutStrong,
      });
    }
  },
  _animateMomentum: function() {
    var pos = { x: this.data.new_pos.x, y: this.data.new_pos.y },
      animate = {
        duration: this.options.duration,
        easing: VCO.Ease.easeOutStrong,
      };
    if (this.options.enable.y) {
      if (this.options.constraint.top || this.options.constraint.bottom) {
        if (pos.y > this.options.constraint.bottom) {
          pos.y = this.options.constraint.bottom;
        } else if (pos.y < this.options.constraint.top) {
          pos.y = this.options.constraint.top;
        }
      }
      animate.top = Math.floor(pos.y) + "px";
    }
    if (this.options.enable.x) {
      if (this.options.constraint.left || this.options.constraint.right) {
        if (pos.x >= this.options.constraint.left) {
          pos.x = this.options.constraint.left;
        } else if (pos.x < this.options.constraint.right) {
          pos.x = this.options.constraint.right;
        }
      }
      animate.left = Math.floor(pos.x) + "px";
    }
    this.animator = VCO.Animate(this._el.move, animate);
    this.fire("momentum", this.data);
  },
});
VCO.MenuBar = VCO.Class.extend({
  includes: [VCO.Events, VCO.DomMixins],
  _el: {},
  initialize: function(elem, parent_elem, options) {
    this._el = {
      parent: {},
      container: {},
      button_overview: {},
      button_backtostart: {},
      button_collapse_toggle: {},
      arrow: {},
      line: {},
      coverbar: {},
      grip: {},
    };
    this.collapsed = false;
    if (typeof elem === "object") {
      this._el.container = elem;
    } else {
      this._el.container = VCO.Dom.get(elem);
    }
    if (parent_elem) {
      this._el.parent = parent_elem;
    }
    this.options = {
      width: 600,
      height: 600,
      duration: 1e3,
      ease: VCO.Ease.easeInOutQuint,
      menubar_default_y: 0,
    };
    this.animator = {};
    VCO.Util.mergeData(this.options, options);
    this._initLayout();
    this._initEvents();
  },
  show: function(d) {
    var duration = this.options.duration;
    if (d) {
      duration = d;
    }
  },
  hide: function(top) {},
  setSticky: function(y) {
    this.options.menubar_default_y = y;
  },
  setColor: function(inverted) {
    if (inverted) {
      this._el.container.className = "vco-menubar vco-menubar-inverted";
    } else {
      this._el.container.className = "vco-menubar";
    }
  },
  updateDisplay: function(w, h, a, l) {
    this._updateDisplay(w, h, a, l);
  },
  _onButtonOverview: function(e) {
    this.fire("overview", e);
  },
  _onButtonBackToStart: function(e) {
    this.fire("back_to_start", e);
  },
  _onButtonCollapseMap: function(e) {
    if (this.collapsed) {
      this.collapsed = false;
      this.show();
      this._el.button_overview.style.display = "inline";
      this.fire("collapse", { y: this.options.menubar_default_y });
      if (VCO.Browser.mobile) {
        this._el.button_collapse_toggle.innerHTML =
          "<span class='vco-icon-arrow-up'></span>";
      } else {
        this._el.button_collapse_toggle.innerHTML =
          VCO.Language.buttons.collapse_toggle +
          "<span class='vco-icon-arrow-up'></span>";
      }
    } else {
      this.collapsed = true;
      this.hide(25);
      this._el.button_overview.style.display = "none";
      this.fire("collapse", { y: 1 });
      if (VCO.Browser.mobile) {
        this._el.button_collapse_toggle.innerHTML =
          "<span class='vco-icon-arrow-down'></span>";
      } else {
        this._el.button_collapse_toggle.innerHTML =
          VCO.Language.buttons.uncollapse_toggle +
          "<span class='vco-icon-arrow-down'></span>";
      }
    }
  },
  _initLayout: function() {
    this._el.button_overview = VCO.Dom.create(
      "span",
      "vco-menubar-button",
      this._el.container
    );
    VCO.DomEvent.addListener(
      this._el.button_overview,
      "click",
      this._onButtonOverview,
      this
    );
    this._el.button_backtostart = VCO.Dom.create(
      "span",
      "vco-menubar-button",
      this._el.container
    );
    VCO.DomEvent.addListener(
      this._el.button_backtostart,
      "click",
      this._onButtonBackToStart,
      this
    );
    this._el.button_collapse_toggle = VCO.Dom.create(
      "span",
      "vco-menubar-button",
      this._el.container
    );
    VCO.DomEvent.addListener(
      this._el.button_collapse_toggle,
      "click",
      this._onButtonCollapseMap,
      this
    );
    if (this.options.map_as_image) {
      this._el.button_overview.innerHTML = VCO.Language.buttons.overview;
    } else {
      this._el.button_overview.innerHTML = VCO.Language.buttons.map_overview;
    }
    if (VCO.Browser.mobile) {
      this._el.button_backtostart.innerHTML =
        "<span class='vco-icon-goback'></span>";
      this._el.button_collapse_toggle.innerHTML =
        "<span class='vco-icon-arrow-up'></span>";
      this._el.container.setAttribute("ontouchstart", " ");
    } else {
      this._el.button_backtostart.innerHTML =
        VCO.Language.buttons.backtostart +
        " <span class='vco-icon-goback'></span>";
      this._el.button_collapse_toggle.innerHTML =
        VCO.Language.buttons.collapse_toggle +
        "<span class='vco-icon-arrow-up'></span>";
    }
    if (this.options.layout == "landscape") {
      this._el.button_collapse_toggle.style.display = "none";
    }
  },
  _initEvents: function() {},
  _updateDisplay: function(width, height, animate) {
    if (width) {
      this.options.width = width;
    }
    if (height) {
      this.options.height = height;
    }
  },
});
VCO.Message = VCO.Class.extend({
  includes: [VCO.Events, VCO.DomMixins],
  _el: {},
  initialize: function(data, options, add_to_container) {
    this._el = {
      parent: {},
      container: {},
      message_container: {},
      loading_icon: {},
      message: {},
    };
    this.options = {
      width: 600,
      height: 600,
      message_class: "vco-message",
      message_icon_class: "vco-loading-icon",
    };
    VCO.Util.mergeData(this.data, data);
    VCO.Util.mergeData(this.options, options);
    this._el.container = VCO.Dom.create("div", this.options.message_class);
    if (add_to_container) {
      add_to_container.appendChild(this._el.container);
      this._el.parent = add_to_container;
    }
    this.animator = {};
    this._initLayout();
    this._initEvents();
  },
  updateMessage: function(t) {
    this._updateMessage(t);
  },
  updateDisplay: function(w, h) {
    this._updateDisplay(w, h);
  },
  _updateMessage: function(t) {
    if (!t) {
      if (VCO.Language) {
        this._el.message.innerHTML = VCO.Language.messages.loading;
      } else {
        this._el.message.innerHTML = "Loading";
      }
    } else {
      this._el.message.innerHTML = t;
    }
  },
  _onMouseClick: function() {
    this.fire("clicked", this.options);
  },
  _initLayout: function() {
    this._el.message_container = VCO.Dom.create(
      "div",
      "vco-message-container",
      this._el.container
    );
    this._el.loading_icon = VCO.Dom.create(
      "div",
      this.options.message_icon_class,
      this._el.message_container
    );
    this._el.message = VCO.Dom.create(
      "div",
      "vco-message-content",
      this._el.message_container
    );
    this._updateMessage();
  },
  _initEvents: function() {
    VCO.DomEvent.addListener(
      this._el.container,
      "click",
      this._onMouseClick,
      this
    );
  },
  _updateDisplay: function(width, height, animate) {},
});
VCO.MediaType = function(m) {
  var media = {},
    media_types = [
      {
        type: "youtube",
        name: "YouTube",
        match_str: "(www.)?youtube|youtu.be",
        cls: VCO.Media.YouTube,
      },
      {
        type: "vimeo",
        name: "Vimeo",
        match_str: "(player.)?vimeo.com",
        cls: VCO.Media.Vimeo,
      },
      {
        type: "dailymotion",
        name: "DailyMotion",
        match_str: "(www.)?dailymotion.com",
        cls: VCO.Media.DailyMotion,
      },
      {
        type: "vine",
        name: "Vine",
        match_str: "(www.)?vine.co",
        cls: VCO.Media.Vine,
      },
      {
        type: "soundcloud",
        name: "SoundCloud",
        match_str: "(player.)?soundcloud.com",
        cls: VCO.Media.SoundCloud,
      },
      {
        type: "twitter",
        name: "Twitter",
        match_str: "(www.)?twitter.com",
        cls: VCO.Media.Twitter,
      },
      {
        type: "googlemaps",
        name: "Google Map",
        match_str: "maps.google",
        cls: VCO.Media.Map,
      },
      {
        type: "googleplus",
        name: "Google+",
        match_str: "plus.google",
        cls: VCO.Media.GooglePlus,
      },
      {
        type: "flickr",
        name: "Flickr",
        match_str: "flickr.com/photos",
        cls: VCO.Media.Flickr,
      },
      {
        type: "instagram",
        name: "Instagram",
        match_str: /(instagr.am|instagram.com)\/p\//,
        cls: VCO.Media.Instagram,
      },
      {
        type: "profile",
        name: "Profile",
        match_str: /((instagr.am|instagram.com)(\/profiles\/|[-a-zA-Z0-9@:%_\+.~#?&//=]+instagramprofile))|[-a-zA-Z0-9@:%_\+.~#?&//=]+\?profile/,
        cls: VCO.Media.Profile,
      },
      {
        type: "image",
        name: "Image",
        match_str: /jpg|jpeg|png|gif/i,
        cls: VCO.Media.Image,
      },
      {
        type: "googledocs",
        name: "Google Doc",
        match_str: /\b.(doc|docx|xls|xlsx|ppt|pptx|pdf|pages|ai|psd|tiff|dxf|svg|eps|ps|ttf|xps|zip|tif)\b/,
        cls: VCO.Media.GoogleDoc,
      },
      {
        type: "wikipedia",
        name: "Wikipedia",
        match_str: "(www.)?wikipedia.org",
        cls: VCO.Media.Wikipedia,
      },
      {
        type: "iframe",
        name: "iFrame",
        match_str: "iframe",
        cls: VCO.Media.IFrame,
      },
      {
        type: "storify",
        name: "Storify",
        match_str: "storify",
        cls: VCO.Media.Storify,
      },
      {
        type: "blockquote",
        name: "Quote",
        match_str: "blockquote",
        cls: VCO.Media.Blockquote,
      },
      {
        type: "website",
        name: "Website",
        match_str: "http://",
        cls: VCO.Media.Website,
      },
      { type: "", name: "", match_str: "", cls: VCO.Media },
    ];
  for (var i = 0; i < media_types.length; i++) {
    if (m instanceof Array) {
      return (media = { type: "slider", cls: VCO.Media.Slider });
    } else if (m.url.match(media_types[i].match_str)) {
      media = media_types[i];
      media.url = m.url;
      return media;
      break;
    }
  }
  return false;
};
VCO.Media = VCO.Class.extend({
  includes: [VCO.Events],
  _el: {},
  initialize: function(data, options, add_to_container) {
    this._el = {
      container: {},
      content_container: {},
      content: {},
      content_item: {},
      content_link: {},
      caption: null,
      credit: null,
      parent: {},
      link: null,
    };
    this.player = null;
    this.timer = null;
    this.load_timer = null;
    this.message = null;
    this.media_id = null;
    this._state = { loaded: false, show_meta: false, media_loaded: false };
    this.data = {
      uniqueid: null,
      url: null,
      credit: null,
      caption: null,
      link: null,
      link_target: null,
    };
    this.options = {
      api_key_flickr: "8f2d5becf7b6ba46570741620054b507",
      credit_height: 0,
      caption_height: 0,
    };
    this.animator = {};
    VCO.Util.mergeData(this.options, options);
    VCO.Util.mergeData(this.data, data);
    this._el.container = VCO.Dom.create("div", "vco-media");
    if (this.data.uniqueid) {
      this._el.container.id = this.data.uniqueid;
    }
    this._initLayout();
    if (add_to_container) {
      add_to_container.appendChild(this._el.container);
      this._el.parent = add_to_container;
    }
  },
  loadMedia: function() {
    var self = this;
    if (!this._state.loaded) {
      try {
        this.load_timer = setTimeout(function() {
          self._loadMedia();
          self._state.loaded = true;
          self._updateDisplay();
        }, 1200);
      } catch (e) {
        trace("Error loading media for ", this._media);
        trace(e);
      }
    }
  },
  loadingMessage: function() {
    this.message.updateMessage(
      this._("loading") + " " + this.options.media_name
    );
  },
  updateMediaDisplay: function(layout) {
    if (this._state.loaded) {
      this._updateMediaDisplay(layout);
      if (!VCO.Browser.mobile && layout != "portrait") {
        this._el.content_item.style.maxHeight = this.options.height / 2 + "px";
      }
      if (this._state.media_loaded) {
        if (this._el.credit) {
          this._el.credit.style.width = "auto";
        }
        if (this._el.caption) {
          this._el.caption.style.width = "auto";
        }
      }
      if (VCO.Browser.firefox) {
        if (
          this._el.content_item.offsetWidth > this._el.content_item.offsetHeight
        ) {
          this._el.content_item.style.width = "100%";
          this._el.content_item.style.maxWidth = "100%";
        }
        if (layout == "portrait") {
          this._el.content_item.style.maxHeight = "none";
        }
      }
      if (this._state.media_loaded) {
        if (this._el.credit) {
          this._el.credit.style.width =
            this._el.content_item.offsetWidth + "px";
        }
        if (this._el.caption) {
          this._el.caption.style.width =
            this._el.content_item.offsetWidth + "px";
        }
      }
    }
  },
  _loadMedia: function() {},
  _updateMediaDisplay: function(l) {},
  show: function() {},
  hide: function() {},
  addTo: function(container) {
    container.appendChild(this._el.container);
    this.onAdd();
  },
  removeFrom: function(container) {
    container.removeChild(this._el.container);
    this.onRemove();
  },
  updateDisplay: function(w, h, l) {
    this._updateDisplay(w, h, l);
  },
  stopMedia: function() {
    this._stopMedia();
  },
  loadErrorDisplay: function(message) {
    this._el.content.removeChild(this._el.content_item);
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-loaderror",
      this._el.content
    );
    this._el.content_item.innerHTML =
      "<div class='vco-icon-" +
      this.options.media_type +
      "'></div><p>" +
      message +
      "</p>";
    this.onLoaded(true);
  },
  onLoaded: function(error) {
    this._state.loaded = true;
    this.fire("loaded", this.data);
    if (this.message) {
      this.message.hide();
    }
    if (!error) {
      this.showMeta();
    }
    this.updateDisplay();
  },
  onMediaLoaded: function(e) {
    this._state.media_loaded = true;
    this.fire("media_loaded", this.data);
    if (this._el.credit) {
      this._el.credit.style.width = this._el.content_item.offsetWidth + "px";
    }
    if (this._el.caption) {
      this._el.caption.style.width = this._el.content_item.offsetWidth + "px";
    }
  },
  showMeta: function(credit, caption) {
    this._state.show_meta = true;
    if (this.data.credit && this.data.credit != "" && !this._el.credit) {
      this._el.credit = VCO.Dom.create(
        "div",
        "vco-credit",
        this._el.content_container
      );
      this._el.credit.innerHTML = this.data.credit;
      this.options.credit_height = this._el.credit.offsetHeight;
    }
    if (this.data.caption && this.data.caption != "" && !this._el.caption) {
      this._el.caption = VCO.Dom.create(
        "div",
        "vco-caption",
        this._el.content_container
      );
      this._el.caption.innerHTML = this.data.caption;
      this.options.caption_height = this._el.caption.offsetHeight;
    }
  },
  onAdd: function() {
    this.fire("added", this.data);
  },
  onRemove: function() {
    this.fire("removed", this.data);
  },
  _initLayout: function() {
    this.message = new VCO.Message({}, this.options);
    this.message.addTo(this._el.container);
    this._el.content_container = VCO.Dom.create(
      "div",
      "vco-media-content-container",
      this._el.container
    );
    if (this.data.link && this.data.link != "") {
      this._el.link = VCO.Dom.create(
        "a",
        "vco-media-link",
        this._el.content_container
      );
      this._el.link.href = this.data.link;
      if (this.data.link_target && this.data.link_target != "") {
        this._el.link.target = this.data.link_target;
      } else {
        this._el.link.target = "_blank";
      }
      this._el.content = VCO.Dom.create(
        "div",
        "vco-media-content",
        this._el.link
      );
    } else {
      this._el.content = VCO.Dom.create(
        "div",
        "vco-media-content",
        this._el.content_container
      );
    }
  },
  _updateDisplay: function(w, h, l) {
    if (w) {
      this.options.width = w;
    }
    if (h) {
      this.options.height = h;
    }
    if (l) {
      this.options.layout = l;
    }
    if (this._el.credit) {
      this.options.credit_height = this._el.credit.offsetHeight;
    }
    if (this._el.caption) {
      this.options.caption_height = this._el.caption.offsetHeight + 5;
    }
    this.updateMediaDisplay(this.options.layout);
  },
  _stopMedia: function() {},
});
VCO.Media.Blockquote = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-blockquote",
      this._el.content
    );
    this.media_id = this.data.url;
    this._el.content_item.innerHTML = this.media_id;
    this.onLoaded();
  },
  updateMediaDisplay: function() {},
  _updateMediaDisplay: function() {},
});
VCO.Media.Flickr = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "img",
      "vco-media-item vco-media-image vco-media-flickr vco-media-shadow",
      this._el.content
    );
    this._el.content_item.addEventListener("load", function(e) {
      self.onMediaLoaded();
    });
    this.establishMediaID();
    api_url =
      "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" +
      this.options.api_key_flickr +
      "&photo_id=" +
      this.media_id +
      "&format=json&jsoncallback=?";
    VCO.getJSON(api_url, function(d) {
      if (d.stat == "ok") {
        self.createMedia(d);
      } else {
        self.loadErrorDisplay("Photo not found or private.");
      }
    });
  },
  establishMediaID: function() {
    var marker = "flickr.com/photos/";
    var idx = this.data.url.indexOf(marker);
    if (idx == -1) {
      throw "Invalid Flickr URL";
    }
    var pos = idx + marker.length;
    this.media_id = this.data.url.substr(pos).split("/")[1];
  },
  createMedia: function(d) {
    var best_size = this.sizes(this.options.height),
      size = d.sizes.size[d.sizes.size.length - 2].source;
    for (var i = 0; i < d.sizes.size.length; i++) {
      if (d.sizes.size[i].label == best_size) {
        size = d.sizes.size[i].source;
      }
    }
    this._el.content_item.src = size;
    this.onLoaded();
  },
  sizes: function(s) {
    var _size = "";
    if (s <= 75) {
      if (s <= 0) {
        _size = "Large";
      } else {
        _size = "Thumbnail";
      }
    } else if (s <= 180) {
      _size = "Small";
    } else if (s <= 240) {
      _size = "Small 320";
    } else if (s <= 375) {
      _size = "Medium";
    } else if (s <= 480) {
      _size = "Medium 640";
    } else if (s <= 600) {
      _size = "Large";
    } else {
      _size = "Large";
    }
    return _size;
  },
});
VCO.Media.Instagram = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this.media_id = this.data.url.split("/p/")[1].split("/")[0];
    this._el.content_link = VCO.Dom.create("a", "", this._el.content);
    this._el.content_link.href = this.data.url;
    this._el.content_link.target = "_blank";
    this._el.content_item = VCO.Dom.create(
      "img",
      "vco-media-item vco-media-image vco-media-instagram vco-media-shadow",
      this._el.content_link
    );
    this._el.content_item.addEventListener("load", function(e) {
      self.onMediaLoaded();
    });
    this._el.content_item.src =
      "https://instagram.com/p/" +
      this.media_id +
      "/media/?size=" +
      this.sizes(this._el.content.offsetWidth);
    this.onLoaded();
  },
  sizes: function(s) {
    var _size = "";
    if (s <= 150) {
      _size = "t";
    } else if (s <= 306) {
      _size = "m";
    } else {
      _size = "l";
    }
    return _size;
  },
});
VCO.Media.Profile = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "img",
      "vco-media-item vco-media-image vco-media-profile vco-media-shadow",
      this._el.content
    );
    this._el.content_item.src = this.data.url;
    this.onLoaded();
  },
  _updateMediaDisplay: function(layout) {
    if (VCO.Browser.firefox) {
      this._el.content_item.style.maxWidth = this.options.width / 2 - 40 + "px";
    }
  },
});
VCO.Media.GoogleDoc = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe",
      this._el.content
    );
    this.media_id = this.data.url;
    api_url = this.media_id;
    if (this.media_id.match(/docs.google.com/i)) {
      this._el.content_item.innerHTML =
        "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" +
        this.media_id +
        "&amp;embedded=true'></iframe>";
    } else {
      this._el.content_item.innerHTML =
        "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" +
        "http://docs.google.com/viewer?url=" +
        this.media_id +
        "&amp;embedded=true'></iframe>";
    }
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height = this.options.height + "px";
  },
});
VCO.Media.GooglePlus = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-googleplus",
      this._el.content
    );
    this.media_id = this.data.url;
    api_url = this.media_id;
    this._el.content_item.innerHTML =
      "<iframe frameborder='0' width='100%' height='100%' src='" +
      api_url +
      "'></iframe>";
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height = this.options.height + "px";
  },
});
VCO.Media.IFrame = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe",
      this._el.content
    );
    this.media_id = this.data.url;
    api_url = this.media_id;
    this._el.content_item.innerHTML = api_url;
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height = this.options.height + "px";
  },
});
VCO.Media.Image = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    if (this.data.link) {
      this._el.content_link = VCO.Dom.create("a", "", this._el.content);
      this._el.content_link.href = this.data.link;
      this._el.content_link.target = "_blank";
      this._el.content_item = VCO.Dom.create(
        "img",
        "vco-media-item vco-media-image vco-media-shadow",
        this._el.content_link
      );
    } else {
      this._el.content_item = VCO.Dom.create(
        "img",
        "vco-media-item vco-media-image vco-media-shadow",
        this._el.content
      );
    }
    this._el.content_item.addEventListener("load", function(e) {
      self.onMediaLoaded();
    });
    this._el.content_item.src = this.data.url;
    this.onLoaded();
  },
  _updateMediaDisplay: function(layout) {
    if (VCO.Browser.firefox) {
      this._el.content_item.style.width = "auto";
    }
  },
});
var soundCoudCreated = false;
VCO.Media.SoundCloud = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe vco-media-soundcloud vco-media-shadow",
      this._el.content
    );
    this.media_id = this.data.url;
    api_url =
      "https://soundcloud.com/oembed?url=" +
      this.media_id +
      "&format=js&callback=?";
    VCO.getJSON(api_url, function(d) {
      VCO.Load.js("https://w.soundcloud.com/player/api.js", function() {
        self.createMedia(d);
      });
    });
  },
  createMedia: function(d) {
    this._el.content_item.innerHTML = d.html;
    this.soundCloudCreated = true;
    self.widget = SC.Widget(this._el.content_item.querySelector("iframe"));
    this.onLoaded();
  },
  _stopMedia: function() {
    if (this.soundCloudCreated) {
      self.widget.pause();
    }
  },
});
VCO.Media.Storify = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var content;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe vco-media-storify",
      this._el.content
    );
    this.media_id = this.data.url;
    content =
      "<iframe frameborder='0' width='100%' height='100%' src='" +
      this.media_id +
      "/embed'></iframe>";
    content += "<script src='" + this.media_id + ".js'></script>";
    this._el.content_item.innerHTML = content;
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height = this.options.height + "px";
  },
});
VCO.Media.Text = VCO.Class.extend({
  includes: [VCO.Events],
  _el: {
    container: {},
    content_container: {},
    content: {},
    headline: {},
    date: {},
    start_btn: {},
  },
  data: { uniqueid: "", headline: "headline", text: "text" },
  options: { title: false },
  initialize: function(data, options, add_to_container) {
    VCO.Util.setData(this, data);
    VCO.Util.mergeData(this.options, options);
    this._el.container = VCO.Dom.create("div", "vco-text");
    this._el.container.id = this.data.uniqueid;
    this._initLayout();
    if (add_to_container) {
      add_to_container.appendChild(this._el.container);
    }
  },
  show: function() {},
  hide: function() {},
  addTo: function(container) {
    container.appendChild(this._el.container);
  },
  removeFrom: function(container) {
    container.removeChild(this._el.container);
  },
  headlineHeight: function() {
    return this._el.headline.offsetHeight + 40;
  },
  addDateText: function(str) {
    this._el.date.innerHTML = str;
  },
  onLoaded: function() {
    this.fire("loaded", this.data);
  },
  onAdd: function() {
    this.fire("added", this.data);
  },
  onRemove: function() {
    this.fire("removed", this.data);
  },
  _initLayout: function() {
    this._el.content_container = VCO.Dom.create(
      "div",
      "vco-text-content-container",
      this._el.container
    );
    this._el.date = VCO.Dom.create(
      "h3",
      "vco-headline-date",
      this._el.content_container
    );
    if (this.data.headline != "") {
      var headline_class = "vco-headline";
      if (this.options.title) {
        headline_class = "vco-headline vco-headline-title";
      }
      this._el.headline = VCO.Dom.create(
        "h2",
        headline_class,
        this._el.content_container
      );
      this._el.headline.innerHTML = this.data.headline;
    }
    if (this.data.text != "") {
      var text_content = "";
      text_content += VCO.Util.htmlify(this.data.text);
      if (
        this.data.date &&
        this.data.date.created_time &&
        this.data.date.created_time != ""
      ) {
        if (this.data.date.created_time.length > 10) {
          if (typeof moment !== "undefined") {
            text_content +=
              "<div class='vco-text-date'>" +
              moment(
                this.data.date.created_time,
                "YYYY-MM-DD h:mm:ss"
              ).fromNow() +
              "</div>";
          } else {
            text_content +=
              "<div class='vco-text-date'>" +
              VCO.Util.convertUnixTime(this.data.date.created_time) +
              "</div>";
          }
        }
      }
      this._el.content = VCO.Dom.create(
        "div",
        "vco-text-content",
        this._el.content_container
      );
      this._el.content.innerHTML = text_content;
    }
    this.onLoaded();
  },
});
VCO.Media.Twitter = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-twitter",
      this._el.content
    );
    if (this.data.url.match("status/")) {
      this.media_id = this.data.url.split("status/")[1];
    } else if (url.match("statuses/")) {
      this.media_id = this.data.url.split("statuses/")[1];
    } else {
      this.media_id = "";
    }
    api_url =
      "https://api.twitter.com/1/statuses/oembed.json?id=" +
      this.media_id +
      "&omit_script=true&include_entities=true&callback=?";
    VCO.ajax({
      type: "GET",
      url: api_url,
      dataType: "json",
      success: function(d) {
        self.createMedia(d);
      },
      error: function(xhr, type) {
        var error_text = "";
        error_text +=
          "Unable to load Tweet. <br/>" + self.media_id + "<br/>" + type;
        self.loadErrorDisplay(error_text);
      },
    });
  },
  createMedia: function(d) {
    trace("create_media");
    var tweet = "",
      tweet_text = "",
      tweetuser = "",
      tweet_status_temp = "",
      tweet_status_url = "",
      tweet_status_date = "";
    tweet_text = d.html.split("</p>&mdash;")[0] + "</p></blockquote>";
    tweetuser = d.author_url.split("twitter.com/")[1];
    tweet_status_temp = d.html.split("</p>&mdash;")[1].split('<a href="')[1];
    tweet_status_url = tweet_status_temp.split('">')[0];
    tweet_status_date = tweet_status_temp.split('">')[1].split("</a>")[0];
    tweet_text = tweet_text.replace(/<a href/gi, '<a target="_blank" href');
    tweet += tweet_text;
    tweet += "<div class='vcard'>";
    tweet +=
      "<a href='" +
      tweet_status_url +
      "' class='twitter-date' target='_blank'>" +
      tweet_status_date +
      "</a>";
    tweet += "<div class='author'>";
    tweet +=
      "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
    tweet += "<span class='avatar'></span>";
    tweet +=
      "<span class='fn'>" +
      d.author_name +
      " <span class='vco-icon-twitter'></span></span>";
    tweet +=
      "<span class='nickname'>@" +
      tweetuser +
      "<span class='thumbnail-inline'></span></span>";
    tweet += "</a>";
    tweet += "</div>";
    tweet += "</div>";
    this._el.content_item.innerHTML = tweet;
    this.onLoaded();
  },
  updateMediaDisplay: function() {},
  _updateMediaDisplay: function() {},
});
VCO.Media.Vimeo = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe vco-media-vimeo vco-media-shadow",
      this._el.content
    );
    this.media_id = this.data.url
      .split(/video\/|\/\/vimeo\.com\//)[1]
      .split(/[?&]/)[0];
    api_url =
      "https://player.vimeo.com/video/" +
      this.media_id +
      "?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
    this.player = VCO.Dom.create("iframe", "", this._el.content_item);
    this.player.width = "100%";
    this.player.height = "100%";
    this.player.frameBorder = "0";
    this.player.src = api_url;
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height =
      VCO.Util.ratio.r16_9({ w: this._el.content_item.offsetWidth }) + "px";
  },
  _stopMedia: function() {
    try {
      this.player.contentWindow.postMessage(
        JSON.stringify({ method: "pause" }),
        "https://player.vimeo.com"
      );
    } catch (err) {
      trace(err);
    }
  },
});
VCO.Media.DailyMotion = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe vco-media-dailymotion",
      this._el.content
    );
    if (this.data.url.match("video")) {
      this.media_id = this.data.url.split("video/")[1].split(/[?&]/)[0];
    } else {
      this.media_id = this.data.url.split("embed/")[1].split(/[?&]/)[0];
    }
    api_url =
      "https://www.dailymotion.com/embed/video/" +
      this.media_id +
      "?api=postMessage";
    this._el.content_item.innerHTML =
      "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" +
      api_url +
      "'></iframe>";
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height =
      VCO.Util.ratio.r16_9({ w: this._el.content_item.offsetWidth }) + "px";
  },
  _stopMedia: function() {
    this._el.content_item
      .querySelector("iframe")
      .contentWindow.postMessage('{"command":"pause","parameters":[]}', "*");
  },
});
VCO.Media.Vine = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-iframe vco-media-vine vco-media-shadow",
      this._el.content
    );
    this.media_id = this.data.url.split("vine.co/v/")[1];
    api_url = "https://vine.co/v/" + this.media_id + "/embed/simple";
    this._el.content_item.innerHTML =
      "<iframe frameborder='0' width='100%' height='100%' src='" +
      api_url +
      "'></iframe><script async src='https://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>";
    this.onLoaded();
  },
  _updateMediaDisplay: function() {
    var size = VCO.Util.ratio.square({
      w: this._el.content_item.offsetWidth,
      h: this.options.height,
    });
    this._el.content_item.style.height = size.h + "px";
  },
  _stopMedia: function() {
    this._el.content_item
      .querySelector("iframe")
      .contentWindow.postMessage("pause", "*");
  },
});
VCO.Media.Website = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {},
  createMedia: function(d) {
    this.onLoaded();
  },
});
VCO.Media.Wikipedia = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var api_url,
      api_language,
      self = this;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-wikipedia",
      this._el.content
    );
    this.media_id = this.data.url
      .split("wiki/")[1]
      .split("#")[0]
      .replace("_", " ");
    this.media_id = this.media_id.replace(" ", "%20");
    api_language = this.data.url.split("//")[1].split(".wikipedia")[0];
    api_url =
      "https://" +
      api_language +
      ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" +
      this.media_id +
      "&exintro=1&format=json&callback=?";
    VCO.ajax({
      type: "GET",
      url: api_url,
      dataType: "json",
      success: function(d) {
        self.createMedia(d);
      },
      error: function(xhr, type) {
        var error_text = "";
        error_text +=
          "Unable to load Wikipedia entry. <br/>" +
          self.media_id +
          "<br/>" +
          type;
        self.loadErrorDisplay(error_text);
      },
    });
  },
  createMedia: function(d) {
    var wiki = "";
    if (d.query) {
      var content,
        wiki = {
          entry: {},
          title: "",
          text: "",
          extract: "",
          paragraphs: 1,
          text_array: [],
        };
      wiki.entry = VCO.Util.getObjectAttributeByIndex(d.query.pages, 0);
      wiki.extract = wiki.entry.extract;
      wiki.title = wiki.entry.title;
      if (wiki.extract.match("<p>")) {
        wiki.text_array = wiki.extract.split("<p>");
      } else {
        wiki.text_array.push(wiki.extract);
      }
      for (var i = 0; i < wiki.text_array.length; i++) {
        if (i + 1 <= wiki.paragraphs && i + 1 < wiki.text_array.length) {
          wiki.text += "<p>" + wiki.text_array[i + 1];
        }
      }
      content =
        "<h4><a href='" +
        this.data.url +
        "' target='_blank'>" +
        wiki.title +
        "</a></h4>";
      content +=
        "<span class='wiki-source'>" +
        VCO.Language.messages.wikipedia +
        "</span>";
      content += wiki.text;
      if (wiki.extract.match("REDIRECT")) {
      } else {
        this._el.content_item.innerHTML = content;
        this.onLoaded();
      }
    }
  },
  updateMediaDisplay: function() {},
  _updateMediaDisplay: function() {},
});
VCO.Media.YouTube = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    var self = this,
      url_vars;
    this.message.updateMessage(
      VCO.Language.messages.loading + " " + this.options.media_name
    );
    this.youtube_loaded = false;
    this._el.content_item = VCO.Dom.create(
      "div",
      "vco-media-item vco-media-youtube vco-media-shadow",
      this._el.content
    );
    this._el.content_item.id = VCO.Util.unique_ID(7);
    url_vars = VCO.Util.getUrlVars(this.data.url);
    this.media_id = {};
    if (this.data.url.match("v=")) {
      this.media_id.id = url_vars["v"];
    } else if (this.data.url.match("/embed/")) {
      this.media_id.id = this.data.url.split("embed/")[1].split(/[?&]/)[0];
    } else if (this.data.url.match(/v\/|v=|youtu\.be\//)) {
      this.media_id.id = this.data.url
        .split(/v\/|v=|youtu\.be\//)[1]
        .split(/[?&]/)[0];
    } else {
      trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
    }
    this.media_id.start = url_vars["t"];
    this.media_id.hd = url_vars["hd"];
    VCO.Load.js("https://www.youtube.com/iframe_api", function() {
      self.createMedia();
    });
  },
  _updateMediaDisplay: function() {
    this._el.content_item.style.height =
      VCO.Util.ratio.r16_9({ w: this._el.content_item.offsetWidth }) + "px";
  },
  _stopMedia: function() {
    if (this.youtube_loaded) {
      try {
        if (this.player.getPlayerState() == YT.PlayerState.PLAYING) {
          this.player.pauseVideo();
        }
      } catch (err) {
        trace(err);
      }
    }
  },
  createMedia: function() {
    var self = this;
    if (typeof this.media_id.start != "undefined") {
      var vidstart = this.media_id.start.toString(),
        vid_start_minutes = 0,
        vid_start_seconds = 0;
      if (vidstart.match("m")) {
        vid_start_minutes = parseInt(vidstart.split("m")[0], 10);
        vid_start_seconds = parseInt(vidstart.split("m")[1].split("s")[0], 10);
        this.media_id.start = vid_start_minutes * 60 + vid_start_seconds;
      } else {
        this.media_id.start = 0;
      }
    } else {
      this.media_id.start = 0;
    }
    if (typeof this.media_id.hd != "undefined") {
      this.media_id.hd = true;
    } else {
      this.media_id.hd = false;
    }
    this.createPlayer();
  },
  createPlayer: function() {
    var self = this;
    clearTimeout(this.timer);
    if (typeof YT != "undefined" && typeof YT.Player != "undefined") {
      this.player = new YT.Player(this._el.content_item.id, {
        playerVars: {
          enablejsapi: 1,
          color: "white",
          autohide: 1,
          showinfo: 0,
          theme: "light",
          start: this.media_id.start,
          fs: 0,
          rel: 0,
        },
        videoId: this.media_id.id,
        events: {
          onReady: function() {
            self.onPlayerReady();
          },
          onStateChange: self.onStateChange,
        },
      });
    } else {
      this.timer = setTimeout(function() {
        self.createPlayer();
      }, 1e3);
    }
    this.onLoaded();
  },
  onPlayerReady: function(e) {
    this.youtube_loaded = true;
    this._el.content_item = document.getElementById(this._el.content_item.id);
    this.onMediaLoaded();
    this.onLoaded();
  },
  onStateChange: function(e) {
    if (e.data == YT.PlayerState.ENDED) {
      e.target.seekTo(0);
      e.target.pauseVideo();
    }
  },
});
VCO.Media.Slider = VCO.Media.extend({
  includes: [VCO.Events],
  _loadMedia: function() {
    this._el.content_item = VCO.Dom.create(
      "img",
      "vco-media-item vco-media-image",
      this._el.content
    );
    this._el.content_item.src = this.data.url;
    this.onLoaded();
  },
});
VCO.Slide = VCO.Class.extend({
  includes: [VCO.Events, VCO.DomMixins],
  _el: {},
  initialize: function(data, options, title_slide) {
    this._el = {
      container: {},
      scroll_container: {},
      background: {},
      content_container: {},
      content: {},
      call_to_action: null,
    };
    this._media = null;
    this._mediaclass = {};
    this._text = {};
    this._state = { loaded: false };
    this.has = {
      headline: false,
      text: false,
      media: false,
      title: false,
      background: { image: false, color: false, color_value: "" },
    };
    this.has.title = title_slide;
    this.title = "";
    this.data = {
      uniqueid: null,
      background: null,
      date: null,
      location: null,
      text: null,
      media: null,
    };
    this.options = {
      duration: 1e3,
      slide_padding_lr: 40,
      ease: VCO.Ease.easeInSpline,
      width: 600,
      height: 600,
      skinny_size: 650,
      media_name: "",
    };
    this.active = false;
    this.animator = {};
    VCO.Util.mergeData(this.options, options);
    VCO.Util.mergeData(this.data, data);
    this._initLayout();
    this._initEvents();
  },
  show: function() {
    this.animator = VCO.Animate(this._el.slider_container, {
      left: -(this._el.container.offsetWidth * n) + "px",
      duration: this.options.duration,
      easing: this.options.ease,
    });
  },
  hide: function() {},
  setActive: function(is_active) {
    this.active = is_active;
    if (this.active) {
      if (this.data.background) {
        this.fire("background_change", this.has.background);
      }
      this.loadMedia();
    } else {
      this.stopMedia();
    }
  },
  addTo: function(container) {
    container.appendChild(this._el.container);
  },
  removeFrom: function(container) {
    container.removeChild(this._el.container);
  },
  updateDisplay: function(w, h, l) {
    this._updateDisplay(w, h, l);
  },
  loadMedia: function() {
    if (this._media && !this._state.loaded) {
      this._media.loadMedia();
      this._state.loaded = true;
    }
  },
  stopMedia: function() {
    if (this._media && this._state.loaded) {
      this._media.stopMedia();
    }
  },
  getBackground: function() {
    return this.has.background;
  },
  scrollToTop: function() {
    this._el.container.scrollTop = 0;
  },
  addCallToAction: function(str) {
    this._el.call_to_action = VCO.Dom.create(
      "div",
      "vco-slide-calltoaction",
      this._el.content_container
    );
    this._el.call_to_action.innerHTML =
      "<span class='vco-slide-calltoaction-button-text'>" + str + "</span>";
    VCO.DomEvent.addListener(
      this._el.call_to_action,
      "click",
      this._onCallToAction,
      this
    );
  },
  _onCallToAction: function(e) {
    this.fire("call_to_action", e);
  },
  _initLayout: function() {
    this._el.container = VCO.Dom.create("div", "vco-slide");
    if (this.data.uniqueid) {
      this._el.container.id = this.data.uniqueid;
    }
    this._el.scroll_container = VCO.Dom.create(
      "div",
      "vco-slide-scrollable-container",
      this._el.container
    );
    this._el.content_container = VCO.Dom.create(
      "div",
      "vco-slide-content-container",
      this._el.scroll_container
    );
    this._el.content = VCO.Dom.create(
      "div",
      "vco-slide-content",
      this._el.content_container
    );
    this._el.background = VCO.Dom.create(
      "div",
      "vco-slide-background",
      this._el.container
    );
    if (this.data.background) {
      if (this.data.background.url) {
        this.has.background.image = true;
        this._el.container.className += " vco-full-image-background";
        this.has.background.color_value = "#000";
        this._el.background.style.backgroundImage =
          "url('" + this.data.background.url + "')";
        this._el.background.style.display = "block";
      }
      if (this.data.background.color) {
        this.has.background.color = true;
        this._el.container.className += " vco-full-color-background";
        this.has.background.color_value = this.data.background.color;
      }
      if (this.data.background.text_background) {
        this._el.container.className += " vco-text-background";
      }
    }
    if (this.data.media && this.data.media.url && this.data.media.url != "") {
      this.has.media = true;
    }
    if (this.data.text && this.data.text.text) {
      this.has.text = true;
    }
    if (this.data.text && this.data.text.headline) {
      this.has.headline = true;
      this.title = this.data.text.headline;
    }
    if (this.has.media) {
      this.data.media.mediatype = VCO.MediaType(this.data.media);
      this.options.media_name = this.data.media.mediatype.name;
      this.options.media_type = this.data.media.mediatype.type;
      this._media = new this.data.media.mediatype.cls(
        this.data.media,
        this.options
      );
    }
    if (this.has.text || this.has.headline) {
      this._text = new VCO.Media.Text(this.data.text, {
        title: this.has.title,
      });
    }
    if (!this.has.text && !this.has.headline && this.has.media) {
      this._el.container.className += " vco-slide-media-only";
      this._media.addTo(this._el.content);
    } else if (this.has.headline && this.has.media && !this.has.text) {
      this._el.container.className += " vco-slide-media-only";
      this._text.addTo(this._el.content);
      this._media.addTo(this._el.content);
    } else if (this.has.text && this.has.media) {
      this._media.addTo(this._el.content);
      this._text.addTo(this._el.content);
    } else if (this.has.text || this.has.headline) {
      this._el.container.className += " vco-slide-text-only";
      this._text.addTo(this._el.content);
    }
    this.onLoaded();
  },
  _initEvents: function() {},
  _updateDisplay: function(width, height, layout) {
    var pad_left, pad_right, new_width;
    if (width) {
      this.options.width = width;
    } else {
      this.options.width = this._el.container.offsetWidth;
    }
    if (VCO.Browser.mobile && this.options.width <= this.options.skinny_size) {
      pad_left = 0 + "px";
      pad_right = 0 + "px";
      new_width = this.options.width - 0 + "px";
    } else if (layout == "landscape") {
      pad_left = 40 + "px";
      pad_right = 75 + "px";
      new_width = this.options.width - (75 + 40) + "px";
    } else if (this.options.width <= this.options.skinny_size) {
      pad_left = this.options.slide_padding_lr + "px";
      pad_right = this.options.slide_padding_lr + "px";
      new_width = this.options.width - this.options.slide_padding_lr * 2 + "px";
    } else {
      pad_left = this.options.slide_padding_lr + "px";
      pad_right = this.options.slide_padding_lr + "px";
      new_width = this.options.width - this.options.slide_padding_lr * 2 + "px";
    }
    this._el.content.style.paddingLeft = pad_left;
    this._el.content.style.paddingRight = pad_right;
    this._el.content.style.width = new_width;
    if (this._el.call_to_action) {
      this._el.call_to_action.style.paddingLeft = pad_left;
      this._el.call_to_action.style.paddingRight = pad_right;
      this._el.call_to_action.style.width = new_width;
    }
    if (height) {
      this.options.height = height;
    } else {
      this.options.height = this._el.container.offsetHeight;
    }
    if (this._media) {
      if (!this.has.text && this.has.headline) {
        this._media.updateDisplay(
          this.options.width,
          this.options.height - this._text.headlineHeight(),
          layout
        );
      } else {
        this._media.updateDisplay(
          this.options.width,
          this.options.height,
          layout
        );
      }
    }
  },
});
VCO.SlideNav = VCO.Class.extend({
  includes: [VCO.Events, VCO.DomMixins],
  _el: {},
  initialize: function(data, options, add_to_container) {
    this._el = {
      container: {},
      content_container: {},
      icon: {},
      title: {},
      description: {},
    };
    this.mediatype = {};
    this.data = { title: "Navigation", description: "Description" };
    this.options = { direction: "previous" };
    this.animator = null;
    this.animator_position = null;
    VCO.Util.mergeData(this.options, options);
    VCO.Util.mergeData(this.data, data);
    this._el.container = VCO.Dom.create(
      "div",
      "vco-slidenav-" + this.options.direction
    );
    if (VCO.Browser.mobile) {
      this._el.container.setAttribute("ontouchstart", " ");
    }
    this._initLayout();
    this._initEvents();
    if (add_to_container) {
      add_to_container.appendChild(this._el.container);
    }
  },
  update: function(d) {
    this._update(d);
  },
  setColor: function(inverted) {
    if (inverted) {
      this._el.content_container.className =
        "vco-slidenav-content-container vco-slidenav-inverted";
    } else {
      this._el.content_container.className = "vco-slidenav-content-container";
    }
  },
  updatePosition: function(
    pos,
    use_percent,
    duration,
    ease,
    start_value,
    return_to_default
  ) {
    var self = this,
      ani = {
        duration: duration,
        easing: ease,
        complete: function() {
          self._onUpdatePositionComplete(return_to_default);
        },
      };
    var _start_value = start_value;
    for (var name in pos) {
      if (pos.hasOwnProperty(name)) {
        if (use_percent) {
          ani[name] = pos[name] + "%";
        } else {
          ani[name] = pos[name] + "px";
        }
      }
    }
    if (this.animator_position) {
      this.animator_position.stop();
    }
    var prop_to_set;
    if (ani.right) {
      prop_to_set = "right";
    } else {
      prop_to_set = "left";
    }
    if (use_percent) {
      this._el.container.style[prop_to_set] = _start_value + "%";
    } else {
      this._el.container.style[prop_to_set] = _start_value + "px";
    }
    this.animator_position = VCO.Animate(this._el.container, ani);
  },
  _onUpdatePositionComplete: function(return_to_default) {
    if (return_to_default) {
      this._el.container.style.left = "";
      this._el.container.style.right = "";
    }
  },
  _onMouseClick: function() {
    this.fire("clicked", this.options);
  },
  _update: function(d) {
    this.data = VCO.Util.mergeData(this.data, d);
    if (this.data.title != "") {
      this._el.title.innerHTML = this.data.title;
    }
    if (this.data.date != "") {
      this._el.description.innerHTML = this.data.description;
    }
  },
  _initLayout: function() {
    this._el.content_container = VCO.Dom.create(
      "div",
      "vco-slidenav-content-container",
      this._el.container
    );
    this._el.icon = VCO.Dom.create(
      "div",
      "vco-slidenav-icon",
      this._el.content_container
    );
    this._el.title = VCO.Dom.create(
      "div",
      "vco-slidenav-title",
      this._el.content_container
    );
    this._el.description = VCO.Dom.create(
      "div",
      "vco-slidenav-description",
      this._el.content_container
    );
    this._el.icon.innerHTML = "&nbsp;";
    this._update();
  },
  _initEvents: function() {
    VCO.DomEvent.addListener(
      this._el.container,
      "click",
      this._onMouseClick,
      this
    );
  },
});
VCO.StorySlider = VCO.Class.extend({
  includes: VCO.Events,
  initialize: function(elem, data, options, init) {
    this._el = {
      container: {},
      background: {},
      slider_container_mask: {},
      slider_container: {},
      slider_item_container: {},
    };
    this._nav = {};
    this._nav.previous = {};
    this._nav.next = {};
    this.slide_spacing = 0;
    this._slides = [];
    this._swipable;
    this.preloadTimer;
    this._message;
    this.current_slide = 0;
    this.current_bg_color = null;
    this.data = {};
    this.options = {
      id: "",
      layout: "portrait",
      width: 600,
      height: 600,
      default_bg_color: { r: 256, g: 256, b: 256 },
      slide_padding_lr: 40,
      start_at_slide: 1,
      slide_default_fade: "0%",
      duration: 1e3,
      ease: VCO.Ease.easeInOutQuint,
      dragging: true,
      trackResize: true,
    };
    if (typeof elem === "object") {
      this._el.container = elem;
      this.options.id = VCO.Util.unique_ID(6, "vco");
    } else {
      this.options.id = elem;
      this._el.container = VCO.Dom.get(elem);
    }
    if (!this._el.container.id) {
      this._el.container.id = this.options.id;
    }
    this.animator = null;
    this.animator_background = null;
    VCO.Util.mergeData(this.options, options);
    VCO.Util.mergeData(this.data, data);
    if (init) {
      this.init();
    }
  },
  init: function() {
    this._initLayout();
    this._initEvents();
    this._initData();
    this._updateDisplay();
    this.goTo(this.options.start_at_slide);
    this._onLoaded();
    this._introInterface();
  },
  updateDisplay: function(w, h, a, l) {
    this._updateDisplay(w, h, a, l);
  },
  createSlide: function(d) {
    this._createSlide(d);
  },
  createSlides: function(array) {
    this._createSlides(array);
  },
  _createSlides: function(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].uniqueid == "") {
        array[i].uniqueid = VCO.Util.unique_ID(6, "vco-slide");
      }
      if (i == 0) {
        this._createSlide(array[i], true);
      } else {
        this._createSlide(array[i], false);
      }
    }
  },
  _createSlide: function(d, title_slide) {
    var slide = new VCO.Slide(d, this.options, title_slide);
    this._addSlide(slide);
    this._slides.push(slide);
  },
  _destroySlide: function(slide) {
    this._removeSlide(slide);
    for (var i = 0; i < this._slides.length; i++) {
      if (this._slides[i] == slide) {
        this._slides.splice(i, 1);
      }
    }
  },
  _addSlide: function(slide) {
    slide.addTo(this._el.slider_item_container);
    slide.on("added", this._onSlideAdded, this);
    slide.on("background_change", this._onBackgroundChange, this);
  },
  _removeSlide: function(slide) {
    slide.removeFrom(this._el.slider_item_container);
    slide.off("added", this._onSlideAdded, this);
    slide.off("background_change", this._onBackgroundChange);
  },
  goToId: function(n, fast, displayupdate) {
    if (typeof n == "string" || n instanceof String) {
      _n = VCO.Util.findArrayNumberByUniqueID(n, this._slides, "uniqueid");
    } else {
      _n = n;
    }
    this.goTo(_n, fast, displayupdate);
  },
  goTo: function(n, fast, displayupdate) {
    var self = this;
    this.changeBackground({ color_value: "", image: false });
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer);
    }
    for (var i = 0; i < this._slides.length; i++) {
      this._slides[i].setActive(false);
    }
    if (n < this._slides.length && n >= 0) {
      this.current_slide = n;
      if (this.animator) {
        this.animator.stop();
      }
      if (this._swipable) {
        this._swipable.stopMomentum();
      }
      if (fast) {
        this._el.slider_container.style.left = -(this.slide_spacing * n) + "px";
        this._onSlideChange(displayupdate);
      } else {
        this.animator = VCO.Animate(this._el.slider_container, {
          left: -(this.slide_spacing * n) + "px",
          duration: this.options.duration,
          easing: this.options.ease,
          complete: this._onSlideChange(displayupdate),
        });
      }
      this._slides[this.current_slide].setActive(true);
      if (this._slides[this.current_slide + 1]) {
        this.showNav(this._nav.next, true);
        this._nav.next.update(
          this.getNavInfo(this._slides[this.current_slide + 1])
        );
        // ga('send', 'event', { eventCategory: 'StorymapJS', eventAction: 'storymap_click', eventLabel:'nova_reperta'});
        // console.log("clicky")
      } else {
        this.showNav(this._nav.next, false);
      }
      if (this._slides[this.current_slide - 1]) {
        this.showNav(this._nav.previous, true);
        this._nav.previous.update(
          this.getNavInfo(this._slides[this.current_slide - 1])
        );
      } else {
        this.showNav(this._nav.previous, false);
      }
      this.preloadTimer = setTimeout(function() {
        self.preloadSlides();
      }, this.options.duration);
    }
  },
  preloadSlides: function() {
    if (this._slides[this.current_slide + 1]) {
      this._slides[this.current_slide + 1].loadMedia();
      this._slides[this.current_slide + 1].scrollToTop();
    }
    if (this._slides[this.current_slide + 2]) {
      this._slides[this.current_slide + 2].loadMedia();
      this._slides[this.current_slide + 2].scrollToTop();
    }
    if (this._slides[this.current_slide - 1]) {
      this._slides[this.current_slide - 1].loadMedia();
      this._slides[this.current_slide - 1].scrollToTop();
    }
    if (this._slides[this.current_slide - 2]) {
      this._slides[this.current_slide - 2].loadMedia();
      this._slides[this.current_slide - 2].scrollToTop();
    }
  },
  getNavInfo: function(slide) {
    var n = { title: "", description: "" };
    if (slide.data.text) {
      if (slide.data.text.headline) {
        n.title = slide.data.text.headline;
      }
    }
    return n;
  },
  next: function() {
    if (this.current_slide + 1 < this._slides.length) {
      this.goTo(this.current_slide + 1);
    } else {
      this.goTo(this.current_slide);
    }
  },
  previous: function() {
    if (this.current_slide - 1 >= 0) {
      this.goTo(this.current_slide - 1);
    } else {
      this.goTo(this.current_slide);
    }
  },
  showNav: function(nav_obj, show) {
    if (this.options.width <= 500 && VCO.Browser.mobile) {
    } else {
      if (show) {
        nav_obj.show();
      } else {
        nav_obj.hide();
      }
    }
  },
  changeBackground: function(bg) {
    var self = this,
      do_animation = false;
    var bg_color = { r: 256, g: 256, b: 256 },
      bg_color_rgb,
      bg_percent_start = this.options.slide_default_fade,
      bg_percent_end = "15%",
      bg_alpha_end = "0.87",
      bg_css = "",
      bg_old = this._el.background.getAttribute("style");
    if (bg.color_value) {
      bg_color = VCO.Util.hexToRgb(bg.color_value);
    } else {
      bg_color = this.options.default_bg_color;
    }
    if (this.animator_background) {
      this.animator_background.stop();
    }
    bg_color_rgb = bg_color.r + "," + bg_color.g + "," + bg_color.b;
    if (!this.current_bg_color || this.current_bg_color != bg_color_rgb) {
      this.current_bg_color = bg_color_rgb;
      do_animation = true;
    }
    if (do_animation) {
      if (this.options.layout == "landscape") {
        this._nav.next.setColor(false);
        this._nav.previous.setColor(false);
        if (bg_color.r < 255 && bg_color.g < 255 && bg_color.b < 255) {
          bg_percent_start = "15%";
        }
        if (bg.image) {
          bg_percent_start = "0%";
        }
        bg_css += "opacity:0;";
        bg_css +=
          "background-image: -webkit-linear-gradient(left, color-stop(rgba(" +
          bg_color_rgb +
          ",0.0001 ) " +
          bg_percent_start +
          "), color-stop(rgba(" +
          bg_color_rgb +
          "," +
          bg_alpha_end +
          ") " +
          bg_percent_end +
          "));";
        bg_css +=
          "background-image: linear-gradient(to right, rgba(" +
          bg_color_rgb +
          ",0.0001 ) " +
          bg_percent_start +
          ", rgba(" +
          bg_color_rgb +
          "," +
          bg_alpha_end +
          ") " +
          bg_percent_end +
          ");";
        bg_css += "background-repeat: repeat-x;";
        bg_css +=
          "filter: e(%('progid:DXImageTransform.Microsoft.gradient(startColorstr='%d', endColorstr='%d', GradientType=1)',argb(" +
          bg_color_rgb +
          ", 0.0001),argb(" +
          bg_color_rgb +
          ",0.80)));";
      } else {
        if (bg.color_value) {
          bg_css += "background-color:" + bg.color_value + ";";
        } else {
          bg_css += "background-color:#FFF;";
        }
        if (
          (bg_color.r < 255 && bg_color.g < 255 && bg_color.b < 255) ||
          bg.image
        ) {
          this._nav.next.setColor(true);
          this._nav.previous.setColor(true);
        } else {
          this._nav.next.setColor(false);
          this._nav.previous.setColor(false);
        }
      }
      this.animator_background = VCO.Animate(this._el.background, {
        opacity: 0,
        duration: this.options.duration / 2,
        easing: this.options.ease,
        complete: function() {
          self.fadeInBackground(bg_css);
        },
      });
    }
  },
  fadeInBackground: function(bg_css) {
    if (this.animator_background) {
      this.animator_background.stop();
    }
    if (bg_css) {
      this._el.background.setAttribute("style", bg_css);
    }
    this.animator_background = VCO.Animate(this._el.background, {
      opacity: 1,
      duration: this.options.duration / 2,
      easing: this.options.ease,
    });
  },
  _updateDisplay: function(width, height, animate, layout) {
    var nav_pos, _layout;
    if (typeof layout === "undefined") {
      _layout = this.options.layout;
    } else {
      _layout = layout;
    }
    this.options.layout = _layout;
    this.slide_spacing = this.options.width * 2;
    if (width) {
      this.options.width = width;
    } else {
      this.options.width = this._el.container.offsetWidth;
    }
    if (height) {
      this.options.height = height;
    } else {
      this.options.height = this._el.container.offsetHeight;
    }
    nav_pos = this.options.height / 2;
    this._nav.next.setPosition({ top: nav_pos });
    this._nav.previous.setPosition({ top: nav_pos });
    for (var i = 0; i < this._slides.length; i++) {
      this._slides[i].updateDisplay(
        this.options.width,
        this.options.height,
        _layout
      );
      this._slides[i].setPosition({ left: this.slide_spacing * i, top: 0 });
    }
    this.goTo(this.current_slide, true, true);
  },
  _introInterface: function() {
    if (this.options.call_to_action) {
      var _str = VCO.Language.messages.start;
      if (this.options.call_to_action_text != "") {
        _str = this.options.call_to_action_text;
      }
      this._slides[0].addCallToAction(_str);
      this._slides[0].on("call_to_action", this.next, this);
    }
    if (this.options.width <= this.options.skinny_size) {
    } else {
      this._nav.next.updatePosition(
        { right: "130" },
        false,
        this.options.duration * 3,
        this.options.ease,
        -100,
        true
      );
      this._nav.previous.updatePosition(
        { left: "-100" },
        true,
        this.options.duration * 3,
        this.options.ease,
        -200,
        true
      );
    }
  },
  _initLayout: function() {
    this._el.container.className += " vco-storyslider";
    this._el.slider_container_mask = VCO.Dom.create(
      "div",
      "vco-slider-container-mask",
      this._el.container
    );
    this._el.background = VCO.Dom.create(
      "div",
      "vco-slider-background",
      this._el.container
    );
    this._el.slider_container = VCO.Dom.create(
      "div",
      "vco-slider-container vcoanimate",
      this._el.slider_container_mask
    );
    this._el.slider_item_container = VCO.Dom.create(
      "div",
      "vco-slider-item-container",
      this._el.slider_container
    );
    this.options.width = this._el.container.offsetWidth;
    this.options.height = this._el.container.offsetHeight;
    this._nav.previous = new VCO.SlideNav(
      { title: "Previous", description: "description" },
      { direction: "previous" }
    );
    this._nav.next = new VCO.SlideNav(
      { title: "Next", description: "description" },
      { direction: "next" }
    );
    this._nav.next.addTo(this._el.container);
    this._nav.previous.addTo(this._el.container);
    this._el.slider_container.style.left = "0px";
    if (VCO.Browser.touch) {
      this._swipable = new VCO.Swipable(
        this._el.slider_container_mask,
        this._el.slider_container,
        { enable: { x: true, y: false }, snap: true }
      );
      this._swipable.enable();
      this._message = new VCO.Message(
        {},
        {
          message_class: "vco-message-full",
          message_icon_class: "vco-icon-swipe-left",
        }
      );
      this._message.updateMessage(VCO.Language.buttons.swipe_to_navigate);
      this._message.addTo(this._el.container);
    }
  },
  _initEvents: function() {
    this._nav.next.on("clicked", this._onNavigation, this);
    this._nav.previous.on("clicked", this._onNavigation, this);
    this._nav.next.on("clicked", function(){ gaSendEvent()});
    this._nav.previous.on("clicked", function(){ gaSendEvent()});
    if (this._message) {
      this._message.on("clicked", this._onMessageClick, this);
    }
    if (this._swipable) {
      this._swipable.on("swipe_left", this._onNavigation, this);
      this._swipable.on("swipe_right", this._onNavigation, this);
      this._swipable.on("swipe_nodirection", this._onSwipeNoDirection, this);
    }
  },
  _initData: function() {
    this._createSlides(this.data.slides);
  },
  _onBackgroundChange: function(e) {
    var slide_background = this._slides[this.current_slide].getBackground();
    this.changeBackground(e);
    this.fire("colorchange", slide_background);
  },
  _onMessageClick: function(e) {
    this._message.hide();
  },
  _onSwipeNoDirection: function(e) {
    this.goTo(this.current_slide);
  },
  _onNavigation: function(e) {
    if (e.direction == "next" || e.direction == "left") {
      this.next();
    } else if (e.direction == "previous" || e.direction == "right") {
      this.previous();
    }
    this.fire("nav_" + e.direction, this.data);
  },
  _onSlideAdded: function(e) {
    trace("slideadded");
    this.fire("slideAdded", this.data);
  },
  _onSlideRemoved: function(e) {
    this.fire("slideAdded", this.data);
  },
  _onSlideChange: function(displayupdate) {
    if (!displayupdate) {
      this.fire("change", {
        current_slide: this.current_slide,
        uniqueid: this._slides[this.current_slide].data.uniqueid,
      });
    }
  },
  _onMouseClick: function(e) {},
  _fireMouseEvent: function(e) {
    if (!this._loaded) {
      return;
    }
    var type = e.type;
    type =
      type === "mouseenter"
        ? "mouseover"
        : type === "mouseleave"
        ? "mouseout"
        : type;
    if (!this.hasEventListeners(type)) {
      return;
    }
    if (type === "contextmenu") {
      VCO.DomEvent.preventDefault(e);
    }
    this.fire(type, { latlng: "something", layerPoint: "something else" });
  },
  _onLoaded: function() {
    this.fire("loaded", this.data);
    this.fire("title", { title: this._slides[0].title });
  },
});
var oldL = window.L,
  L = {};
L.version = "0.7.2";
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = L;
} else if (typeof define === "function" && define.amd) {
  define(L);
}
L.noConflict = function() {
  window.L = oldL;
  return this;
};
window.L = L;
L.Util = {
  extend: function(dest) {
    var sources = Array.prototype.slice.call(arguments, 1),
      i,
      j,
      len,
      src;
    for (j = 0, len = sources.length; j < len; j++) {
      src = sources[j] || {};
      for (i in src) {
        if (src.hasOwnProperty(i)) {
          dest[i] = src[i];
        }
      }
    }
    return dest;
  },
  bind: function(fn, obj) {
    var args =
      arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
    return function() {
      return fn.apply(obj, args || arguments);
    };
  },
  stamp: (function() {
    var lastId = 0,
      key = "_leaflet_id";
    return function(obj) {
      obj[key] = obj[key] || ++lastId;
      return obj[key];
    };
  })(),
  invokeEach: function(obj, method, context) {
    var i, args;
    if (typeof obj === "object") {
      args = Array.prototype.slice.call(arguments, 3);
      for (i in obj) {
        method.apply(context, [i, obj[i]].concat(args));
      }
      return true;
    }
    return false;
  },
  limitExecByInterval: function(fn, time, context) {
    var lock, execOnUnlock;
    return function wrapperFn() {
      var args = arguments;
      if (lock) {
        execOnUnlock = true;
        return;
      }
      lock = true;
      setTimeout(function() {
        lock = false;
        if (execOnUnlock) {
          wrapperFn.apply(context, args);
          execOnUnlock = false;
        }
      }, time);
      fn.apply(context, args);
    };
  },
  falseFn: function() {
    return false;
  },
  formatNum: function(num, digits) {
    var pow = Math.pow(10, digits || 5);
    return Math.round(num * pow) / pow;
  },
  trim: function(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
  },
  splitWords: function(str) {
    return L.Util.trim(str).split(/\s+/);
  },
  setOptions: function(obj, options) {
    obj.options = L.extend({}, obj.options, options);
    return obj.options;
  },
  getParamString: function(obj, existingUrl, uppercase) {
    var params = [];
    for (var i in obj) {
      params.push(
        encodeURIComponent(uppercase ? i.toUpperCase() : i) +
          "=" +
          encodeURIComponent(obj[i])
      );
    }
    return (
      (!existingUrl || existingUrl.indexOf("?") === -1 ? "?" : "&") +
      params.join("&")
    );
  },
  template: function(str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function(str, key) {
      var value = data[key];
      if (value === undefined) {
        throw new Error("No value provided for variable " + str);
      } else if (typeof value === "function") {
        value = value(data);
      }
      return value;
    });
  },
  isArray:
    Array.isArray ||
    function(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    },
  emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
};
(function() {
  function getPrefixed(name) {
    var i,
      fn,
      prefixes = ["webkit", "moz", "o", "ms"];
    for (i = 0; i < prefixes.length && !fn; i++) {
      fn = window[prefixes[i] + name];
    }
    return fn;
  }
  var lastTime = 0;
  function timeoutDefer(fn) {
    var time = +new Date(),
      timeToCall = Math.max(0, 16 - (time - lastTime));
    lastTime = time + timeToCall;
    return window.setTimeout(fn, timeToCall);
  }
  var requestFn =
    window.requestAnimationFrame ||
    getPrefixed("RequestAnimationFrame") ||
    timeoutDefer;
  var cancelFn =
    window.cancelAnimationFrame ||
    getPrefixed("CancelAnimationFrame") ||
    getPrefixed("CancelRequestAnimationFrame") ||
    function(id) {
      window.clearTimeout(id);
    };
  L.Util.requestAnimFrame = function(fn, context, immediate, element) {
    fn = L.bind(fn, context);
    if (immediate && requestFn === timeoutDefer) {
      fn();
    } else {
      return requestFn.call(window, fn, element);
    }
  };
  L.Util.cancelAnimFrame = function(id) {
    if (id) {
      cancelFn.call(window, id);
    }
  };
})();
L.extend = L.Util.extend;
L.bind = L.Util.bind;
L.stamp = L.Util.stamp;
L.setOptions = L.Util.setOptions;
L.Class = function() {};
L.Class.extend = function(props) {
  var NewClass = function() {
    if (this.initialize) {
      this.initialize.apply(this, arguments);
    }
    if (this._initHooks) {
      this.callInitHooks();
    }
  };
  var F = function() {};
  F.prototype = this.prototype;
  var proto = new F();
  proto.constructor = NewClass;
  NewClass.prototype = proto;
  for (var i in this) {
    if (this.hasOwnProperty(i) && i !== "prototype") {
      NewClass[i] = this[i];
    }
  }
  if (props.statics) {
    L.extend(NewClass, props.statics);
    delete props.statics;
  }
  if (props.includes) {
    L.Util.extend.apply(null, [proto].concat(props.includes));
    delete props.includes;
  }
  if (props.options && proto.options) {
    props.options = L.extend({}, proto.options, props.options);
  }
  L.extend(proto, props);
  proto._initHooks = [];
  var parent = this;
  NewClass.__super__ = parent.prototype;
  proto.callInitHooks = function() {
    if (this._initHooksCalled) {
      return;
    }
    if (parent.prototype.callInitHooks) {
      parent.prototype.callInitHooks.call(this);
    }
    this._initHooksCalled = true;
    for (var i = 0, len = proto._initHooks.length; i < len; i++) {
      proto._initHooks[i].call(this);
    }
  };
  return NewClass;
};
L.Class.include = function(props) {
  L.extend(this.prototype, props);
};
L.Class.mergeOptions = function(options) {
  L.extend(this.prototype.options, options);
};
L.Class.addInitHook = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  var init =
    typeof fn === "function"
      ? fn
      : function() {
          this[fn].apply(this, args);
        };
  this.prototype._initHooks = this.prototype._initHooks || [];
  this.prototype._initHooks.push(init);
};
var eventsKey = "_leaflet_events";
L.Mixin = {};
L.Mixin.Events = {
  addEventListener: function(types, fn, context) {
    if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) {
      return this;
    }
    var events = (this[eventsKey] = this[eventsKey] || {}),
      contextId = context && context !== this && L.stamp(context),
      i,
      len,
      event,
      type,
      indexKey,
      indexLenKey,
      typeIndex;
    types = L.Util.splitWords(types);
    for (i = 0, len = types.length; i < len; i++) {
      event = { action: fn, context: context || this };
      type = types[i];
      if (contextId) {
        indexKey = type + "_idx";
        indexLenKey = indexKey + "_len";
        typeIndex = events[indexKey] = events[indexKey] || {};
        if (!typeIndex[contextId]) {
          typeIndex[contextId] = [];
          events[indexLenKey] = (events[indexLenKey] || 0) + 1;
        }
        typeIndex[contextId].push(event);
      } else {
        events[type] = events[type] || [];
        events[type].push(event);
      }
    }
    return this;
  },
  hasEventListeners: function(type) {
    var events = this[eventsKey];
    return (
      !!events &&
      ((type in events && events[type].length > 0) ||
        (type + "_idx" in events && events[type + "_idx_len"] > 0))
    );
  },
  removeEventListener: function(types, fn, context) {
    if (!this[eventsKey]) {
      return this;
    }
    if (!types) {
      return this.clearAllEventListeners();
    }
    if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) {
      return this;
    }
    var events = this[eventsKey],
      contextId = context && context !== this && L.stamp(context),
      i,
      len,
      type,
      listeners,
      j,
      indexKey,
      indexLenKey,
      typeIndex,
      removed;
    types = L.Util.splitWords(types);
    for (i = 0, len = types.length; i < len; i++) {
      type = types[i];
      indexKey = type + "_idx";
      indexLenKey = indexKey + "_len";
      typeIndex = events[indexKey];
      if (!fn) {
        delete events[type];
        delete events[indexKey];
        delete events[indexLenKey];
      } else {
        listeners =
          contextId && typeIndex ? typeIndex[contextId] : events[type];
        if (listeners) {
          for (j = listeners.length - 1; j >= 0; j--) {
            if (
              listeners[j].action === fn &&
              (!context || listeners[j].context === context)
            ) {
              removed = listeners.splice(j, 1);
              removed[0].action = L.Util.falseFn;
            }
          }
          if (context && typeIndex && listeners.length === 0) {
            delete typeIndex[contextId];
            events[indexLenKey]--;
          }
        }
      }
    }
    return this;
  },
  clearAllEventListeners: function() {
    delete this[eventsKey];
    return this;
  },
  fireEvent: function(type, data) {
    if (!this.hasEventListeners(type)) {
      return this;
    }
    var event = L.Util.extend({}, data, { type: type, target: this });
    var events = this[eventsKey],
      listeners,
      i,
      len,
      typeIndex,
      contextId;
    if (events[type]) {
      listeners = events[type].slice();
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i].action.call(listeners[i].context, event);
      }
    }
    typeIndex = events[type + "_idx"];
    for (contextId in typeIndex) {
      listeners = typeIndex[contextId].slice();
      if (listeners) {
        for (i = 0, len = listeners.length; i < len; i++) {
          listeners[i].action.call(listeners[i].context, event);
        }
      }
    }
    return this;
  },
  addOneTimeEventListener: function(types, fn, context) {
    if (
      L.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)
    ) {
      return this;
    }
    var handler = L.bind(function() {
      this.removeEventListener(types, fn, context).removeEventListener(
        types,
        handler,
        context
      );
    }, this);
    return this.addEventListener(types, fn, context).addEventListener(
      types,
      handler,
      context
    );
  },
};
L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;
(function() {
  var ie = "ActiveXObject" in window,
    ielt9 = ie && !document.addEventListener,
    ua = navigator.userAgent.toLowerCase(),
    webkit = ua.indexOf("webkit") !== -1,
    chrome = ua.indexOf("chrome") !== -1,
    phantomjs = ua.indexOf("phantom") !== -1,
    android = ua.indexOf("android") !== -1,
    android23 = ua.search("android [23]") !== -1,
    gecko = ua.indexOf("gecko") !== -1,
    mobile = typeof orientation !== undefined + "",
    msPointer =
      window.navigator &&
      window.navigator.msPointerEnabled &&
      window.navigator.msMaxTouchPoints &&
      !window.PointerEvent,
    pointer =
      (window.PointerEvent &&
        window.navigator.pointerEnabled &&
        window.navigator.maxTouchPoints) ||
      msPointer,
    retina =
      ("devicePixelRatio" in window && window.devicePixelRatio > 1) ||
      ("matchMedia" in window &&
        window.matchMedia("(min-resolution:144dpi)") &&
        window.matchMedia("(min-resolution:144dpi)").matches),
    doc = document.documentElement,
    ie3d = ie && "transition" in doc.style,
    webkit3d =
      "WebKitCSSMatrix" in window &&
      "m11" in new window.WebKitCSSMatrix() &&
      !android23,
    gecko3d = "MozPerspective" in doc.style,
    opera3d = "OTransition" in doc.style,
    any3d =
      !window.L_DISABLE_3D &&
      (ie3d || webkit3d || gecko3d || opera3d) &&
      !phantomjs;
  var touch =
    !window.L_NO_TOUCH &&
    !phantomjs &&
    (function() {
      var startName = "ontouchstart";
      if (pointer || startName in doc) {
        return true;
      }
      var div = document.createElement("div"),
        supported = false;
      if (!div.setAttribute) {
        return false;
      }
      div.setAttribute(startName, "return;");
      if (typeof div[startName] === "function") {
        supported = true;
      }
      div.removeAttribute(startName);
      div = null;
      return supported;
    })();
  L.Browser = {
    ie: ie,
    ielt9: ielt9,
    webkit: webkit,
    gecko: gecko && !webkit && !window.opera && !ie,
    android: android,
    android23: android23,
    chrome: chrome,
    ie3d: ie3d,
    webkit3d: webkit3d,
    gecko3d: gecko3d,
    opera3d: opera3d,
    any3d: any3d,
    mobile: mobile,
    mobileWebkit: mobile && webkit,
    mobileWebkit3d: mobile && webkit3d,
    mobileOpera: mobile && window.opera,
    touch: touch,
    msPointer: msPointer,
    pointer: pointer,
    retina: retina,
  };
})();
L.Point = function(x, y, round) {
  this.x = round ? Math.round(x) : x;
  this.y = round ? Math.round(y) : y;
};
L.Point.prototype = {
  clone: function() {
    return new L.Point(this.x, this.y);
  },
  add: function(point) {
    return this.clone()._add(L.point(point));
  },
  _add: function(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  },
  subtract: function(point) {
    return this.clone()._subtract(L.point(point));
  },
  _subtract: function(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  },
  divideBy: function(num) {
    return this.clone()._divideBy(num);
  },
  _divideBy: function(num) {
    this.x /= num;
    this.y /= num;
    return this;
  },
  multiplyBy: function(num) {
    return this.clone()._multiplyBy(num);
  },
  _multiplyBy: function(num) {
    this.x *= num;
    this.y *= num;
    return this;
  },
  round: function() {
    return this.clone()._round();
  },
  _round: function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  },
  floor: function() {
    return this.clone()._floor();
  },
  _floor: function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  },
  distanceTo: function(point) {
    point = L.point(point);
    var x = point.x - this.x,
      y = point.y - this.y;
    return Math.sqrt(x * x + y * y);
  },
  equals: function(point) {
    point = L.point(point);
    return point.x === this.x && point.y === this.y;
  },
  contains: function(point) {
    point = L.point(point);
    return (
      Math.abs(point.x) <= Math.abs(this.x) &&
      Math.abs(point.y) <= Math.abs(this.y)
    );
  },
  toString: function() {
    return (
      "Point(" +
      L.Util.formatNum(this.x) +
      ", " +
      L.Util.formatNum(this.y) +
      ")"
    );
  },
};
L.point = function(x, y, round) {
  if (x instanceof L.Point) {
    return x;
  }
  if (L.Util.isArray(x)) {
    return new L.Point(x[0], x[1]);
  }
  if (x === undefined || x === null) {
    return x;
  }
  return new L.Point(x, y, round);
};
L.Bounds = function(a, b) {
  if (!a) {
    return;
  }
  var points = b ? [a, b] : a;
  for (var i = 0, len = points.length; i < len; i++) {
    this.extend(points[i]);
  }
};
L.Bounds.prototype = {
  extend: function(point) {
    point = L.point(point);
    if (!this.min && !this.max) {
      this.min = point.clone();
      this.max = point.clone();
    } else {
      this.min.x = Math.min(point.x, this.min.x);
      this.max.x = Math.max(point.x, this.max.x);
      this.min.y = Math.min(point.y, this.min.y);
      this.max.y = Math.max(point.y, this.max.y);
    }
    return this;
  },
  getCenter: function(round) {
    return new L.Point(
      (this.min.x + this.max.x) / 2,
      (this.min.y + this.max.y) / 2,
      round
    );
  },
  getBottomLeft: function() {
    return new L.Point(this.min.x, this.max.y);
  },
  getTopRight: function() {
    return new L.Point(this.max.x, this.min.y);
  },
  getSize: function() {
    return this.max.subtract(this.min);
  },
  contains: function(obj) {
    var min, max;
    if (typeof obj[0] === "number" || obj instanceof L.Point) {
      obj = L.point(obj);
    } else {
      obj = L.bounds(obj);
    }
    if (obj instanceof L.Bounds) {
      min = obj.min;
      max = obj.max;
    } else {
      min = max = obj;
    }
    return (
      min.x >= this.min.x &&
      max.x <= this.max.x &&
      min.y >= this.min.y &&
      max.y <= this.max.y
    );
  },
  intersects: function(bounds) {
    bounds = L.bounds(bounds);
    var min = this.min,
      max = this.max,
      min2 = bounds.min,
      max2 = bounds.max,
      xIntersects = max2.x >= min.x && min2.x <= max.x,
      yIntersects = max2.y >= min.y && min2.y <= max.y;
    return xIntersects && yIntersects;
  },
  isValid: function() {
    return !!(this.min && this.max);
  },
};
L.bounds = function(a, b) {
  if (!a || a instanceof L.Bounds) {
    return a;
  }
  return new L.Bounds(a, b);
};
L.Transformation = function(a, b, c, d) {
  this._a = a;
  this._b = b;
  this._c = c;
  this._d = d;
};
L.Transformation.prototype = {
  transform: function(point, scale) {
    return this._transform(point.clone(), scale);
  },
  _transform: function(point, scale) {
    scale = scale || 1;
    point.x = scale * (this._a * point.x + this._b);
    point.y = scale * (this._c * point.y + this._d);
    return point;
  },
  untransform: function(point, scale) {
    scale = scale || 1;
    return new L.Point(
      (point.x / scale - this._b) / this._a,
      (point.y / scale - this._d) / this._c
    );
  },
};
L.DomUtil = {
  get: function(id) {
    return typeof id === "string" ? document.getElementById(id) : id;
  },
  getStyle: function(el, style) {
    var value = el.style[style];
    if (!value && el.currentStyle) {
      value = el.currentStyle[style];
    }
    if ((!value || value === "auto") && document.defaultView) {
      var css = document.defaultView.getComputedStyle(el, null);
      value = css ? css[style] : null;
    }
    return value === "auto" ? null : value;
  },
  getViewportOffset: function(element) {
    var top = 0,
      left = 0,
      el = element,
      docBody = document.body,
      docEl = document.documentElement,
      pos;
    do {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      top += parseInt(L.DomUtil.getStyle(el, "borderTopWidth"), 10) || 0;
      left += parseInt(L.DomUtil.getStyle(el, "borderLeftWidth"), 10) || 0;
      pos = L.DomUtil.getStyle(el, "position");
      if (el.offsetParent === docBody && pos === "absolute") {
        break;
      }
      if (pos === "fixed") {
        top += docBody.scrollTop || docEl.scrollTop || 0;
        left += docBody.scrollLeft || docEl.scrollLeft || 0;
        break;
      }
      if (pos === "relative" && !el.offsetLeft) {
        var width = L.DomUtil.getStyle(el, "width"),
          maxWidth = L.DomUtil.getStyle(el, "max-width"),
          r = el.getBoundingClientRect();
        if (width !== "none" || maxWidth !== "none") {
          left += r.left + el.clientLeft;
        }
        top += r.top + (docBody.scrollTop || docEl.scrollTop || 0);
        break;
      }
      el = el.offsetParent;
    } while (el);
    el = element;
    do {
      if (el === docBody) {
        break;
      }
      top -= el.scrollTop || 0;
      left -= el.scrollLeft || 0;
      el = el.parentNode;
    } while (el);
    return new L.Point(left, top);
  },
  documentIsLtr: function() {
    if (!L.DomUtil._docIsLtrCached) {
      L.DomUtil._docIsLtrCached = true;
      L.DomUtil._docIsLtr =
        L.DomUtil.getStyle(document.body, "direction") === "ltr";
    }
    return L.DomUtil._docIsLtr;
  },
  create: function(tagName, className, container) {
    var el = document.createElement(tagName);
    el.className = className;
    if (container) {
      container.appendChild(el);
    }
    return el;
  },
  hasClass: function(el, name) {
    if (el.classList !== undefined) {
      return el.classList.contains(name);
    }
    var className = L.DomUtil._getClass(el);
    return (
      className.length > 0 &&
      new RegExp("(^|\\s)" + name + "(\\s|$)").test(className)
    );
  },
  addClass: function(el, name) {
    if (el.classList !== undefined) {
      var classes = L.Util.splitWords(name);
      for (var i = 0, len = classes.length; i < len; i++) {
        el.classList.add(classes[i]);
      }
    } else if (!L.DomUtil.hasClass(el, name)) {
      var className = L.DomUtil._getClass(el);
      L.DomUtil._setClass(el, (className ? className + " " : "") + name);
    }
  },
  removeClass: function(el, name) {
    if (el.classList !== undefined) {
      el.classList.remove(name);
    } else {
      L.DomUtil._setClass(
        el,
        L.Util.trim(
          (" " + L.DomUtil._getClass(el) + " ").replace(" " + name + " ", " ")
        )
      );
    }
  },
  _setClass: function(el, name) {
    if (el.className.baseVal === undefined) {
      el.className = name;
    } else {
      el.className.baseVal = name;
    }
  },
  _getClass: function(el) {
    return el.className.baseVal === undefined
      ? el.className
      : el.className.baseVal;
  },
  setOpacity: function(el, value) {
    if ("opacity" in el.style) {
      el.style.opacity = value;
    } else if ("filter" in el.style) {
      var filter = false,
        filterName = "DXImageTransform.Microsoft.Alpha";
      try {
        filter = el.filters.item(filterName);
      } catch (e) {
        if (value === 1) {
          return;
        }
      }
      value = Math.round(value * 100);
      if (filter) {
        filter.Enabled = value !== 100;
        filter.Opacity = value;
      } else {
        el.style.filter += " progid:" + filterName + "(opacity=" + value + ")";
      }
    }
  },
  testProp: function(props) {
    var style = document.documentElement.style;
    for (var i = 0; i < props.length; i++) {
      if (props[i] in style) {
        return props[i];
      }
    }
    return false;
  },
  getTranslateString: function(point) {
    var is3d = L.Browser.webkit3d,
      open = "translate" + (is3d ? "3d" : "") + "(",
      close = (is3d ? ",0" : "") + ")";
    return open + point.x + "px," + point.y + "px" + close;
  },
  getScaleString: function(scale, origin) {
    var preTranslateStr = L.DomUtil.getTranslateString(
        origin.add(origin.multiplyBy(-1 * scale))
      ),
      scaleStr = " scale(" + scale + ") ";
    return preTranslateStr + scaleStr;
  },
  setPosition: function(el, point, disable3D) {
    el._leaflet_pos = point;
    if (!disable3D && L.Browser.any3d) {
      el.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(point);
    } else {
      el.style.left = point.x + "px";
      el.style.top = point.y + "px";
    }
  },
  getPosition: function(el) {
    return el._leaflet_pos;
  },
};
L.DomUtil.TRANSFORM = L.DomUtil.testProp([
  "transform",
  "WebkitTransform",
  "OTransform",
  "MozTransform",
  "msTransform",
]);
L.DomUtil.TRANSITION = L.DomUtil.testProp([
  "webkitTransition",
  "transition",
  "OTransition",
  "MozTransition",
  "msTransition",
]);
L.DomUtil.TRANSITION_END =
  L.DomUtil.TRANSITION === "webkitTransition" ||
  L.DomUtil.TRANSITION === "OTransition"
    ? L.DomUtil.TRANSITION + "End"
    : "transitionend";
(function() {
  if ("onselectstart" in document) {
    L.extend(L.DomUtil, {
      disableTextSelection: function() {
        L.DomEvent.on(window, "selectstart", L.DomEvent.preventDefault);
      },
      enableTextSelection: function() {
        L.DomEvent.off(window, "selectstart", L.DomEvent.preventDefault);
      },
    });
  } else {
    var userSelectProperty = L.DomUtil.testProp([
      "userSelect",
      "WebkitUserSelect",
      "OUserSelect",
      "MozUserSelect",
      "msUserSelect",
    ]);
    L.extend(L.DomUtil, {
      disableTextSelection: function() {
        if (userSelectProperty) {
          var style = document.documentElement.style;
          this._userSelect = style[userSelectProperty];
          style[userSelectProperty] = "none";
        }
      },
      enableTextSelection: function() {
        if (userSelectProperty) {
          document.documentElement.style[userSelectProperty] = this._userSelect;
          delete this._userSelect;
        }
      },
    });
  }
  L.extend(L.DomUtil, {
    disableImageDrag: function() {
      L.DomEvent.on(window, "dragstart", L.DomEvent.preventDefault);
    },
    enableImageDrag: function() {
      L.DomEvent.off(window, "dragstart", L.DomEvent.preventDefault);
    },
  });
})();
L.LatLng = function(lat, lng, alt) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid LatLng object: (" + lat + ", " + lng + ")");
  }
  this.lat = lat;
  this.lng = lng;
  if (alt !== undefined) {
    this.alt = parseFloat(alt);
  }
};
L.extend(L.LatLng, {
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  MAX_MARGIN: 1e-9,
});
L.LatLng.prototype = {
  equals: function(obj) {
    if (!obj) {
      return false;
    }
    obj = L.latLng(obj);
    var margin = Math.max(
      Math.abs(this.lat - obj.lat),
      Math.abs(this.lng - obj.lng)
    );
    return margin <= L.LatLng.MAX_MARGIN;
  },
  toString: function(precision) {
    return (
      "LatLng(" +
      L.Util.formatNum(this.lat, precision) +
      ", " +
      L.Util.formatNum(this.lng, precision) +
      ")"
    );
  },
  distanceTo: function(other) {
    other = L.latLng(other);
    var R = 6378137,
      d2r = L.LatLng.DEG_TO_RAD,
      dLat = (other.lat - this.lat) * d2r,
      dLon = (other.lng - this.lng) * d2r,
      lat1 = this.lat * d2r,
      lat2 = other.lat * d2r,
      sin1 = Math.sin(dLat / 2),
      sin2 = Math.sin(dLon / 2);
    var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },
  wrap: function(a, b) {
    var lng = this.lng;
    a = a || -180;
    b = b || 180;
    lng = ((lng + b) % (b - a)) + (lng < a || lng === b ? b : a);
    return new L.LatLng(this.lat, lng);
  },
};
L.latLng = function(a, b) {
  if (a instanceof L.LatLng) {
    return a;
  }
  if (L.Util.isArray(a)) {
    if (typeof a[0] === "number" || typeof a[0] === "string") {
      return new L.LatLng(a[0], a[1], a[2]);
    } else {
      return null;
    }
  }
  if (a === undefined || a === null) {
    return a;
  }
  if (typeof a === "object" && "lat" in a) {
    return new L.LatLng(a.lat, "lng" in a ? a.lng : a.lon);
  }
  if (b === undefined) {
    return null;
  }
  return new L.LatLng(a, b);
};
L.LatLngBounds = function(southWest, northEast) {
  if (!southWest) {
    return;
  }
  var latlngs = northEast ? [southWest, northEast] : southWest;
  for (var i = 0, len = latlngs.length; i < len; i++) {
    this.extend(latlngs[i]);
  }
};
L.LatLngBounds.prototype = {
  extend: function(obj) {
    if (!obj) {
      return this;
    }
    var latLng = L.latLng(obj);
    if (latLng !== null) {
      obj = latLng;
    } else {
      obj = L.latLngBounds(obj);
    }
    if (obj instanceof L.LatLng) {
      if (!this._southWest && !this._northEast) {
        this._southWest = new L.LatLng(obj.lat, obj.lng);
        this._northEast = new L.LatLng(obj.lat, obj.lng);
      } else {
        this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
        this._southWest.lng = Math.min(obj.lng, this._southWest.lng);
        this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
        this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
      }
    } else if (obj instanceof L.LatLngBounds) {
      this.extend(obj._southWest);
      this.extend(obj._northEast);
    }
    return this;
  },
  pad: function(bufferRatio) {
    var sw = this._southWest,
      ne = this._northEast,
      heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
      widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
    return new L.LatLngBounds(
      new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
      new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer)
    );
  },
  getCenter: function() {
    return new L.LatLng(
      (this._southWest.lat + this._northEast.lat) / 2,
      (this._southWest.lng + this._northEast.lng) / 2
    );
  },
  getSouthWest: function() {
    return this._southWest;
  },
  getNorthEast: function() {
    return this._northEast;
  },
  getNorthWest: function() {
    return new L.LatLng(this.getNorth(), this.getWest());
  },
  getSouthEast: function() {
    return new L.LatLng(this.getSouth(), this.getEast());
  },
  getWest: function() {
    return this._southWest.lng;
  },
  getSouth: function() {
    return this._southWest.lat;
  },
  getEast: function() {
    return this._northEast.lng;
  },
  getNorth: function() {
    return this._northEast.lat;
  },
  contains: function(obj) {
    if (typeof obj[0] === "number" || obj instanceof L.LatLng) {
      obj = L.latLng(obj);
    } else {
      obj = L.latLngBounds(obj);
    }
    var sw = this._southWest,
      ne = this._northEast,
      sw2,
      ne2;
    if (obj instanceof L.LatLngBounds) {
      sw2 = obj.getSouthWest();
      ne2 = obj.getNorthEast();
    } else {
      sw2 = ne2 = obj;
    }
    return (
      sw2.lat >= sw.lat &&
      ne2.lat <= ne.lat &&
      sw2.lng >= sw.lng &&
      ne2.lng <= ne.lng
    );
  },
  intersects: function(bounds) {
    bounds = L.latLngBounds(bounds);
    var sw = this._southWest,
      ne = this._northEast,
      sw2 = bounds.getSouthWest(),
      ne2 = bounds.getNorthEast(),
      latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat,
      lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;
    return latIntersects && lngIntersects;
  },
  toBBoxString: function() {
    return [
      this.getWest(),
      this.getSouth(),
      this.getEast(),
      this.getNorth(),
    ].join(",");
  },
  equals: function(bounds) {
    if (!bounds) {
      return false;
    }
    bounds = L.latLngBounds(bounds);
    return (
      this._southWest.equals(bounds.getSouthWest()) &&
      this._northEast.equals(bounds.getNorthEast())
    );
  },
  isValid: function() {
    return !!(this._southWest && this._northEast);
  },
};
L.latLngBounds = function(a, b) {
  if (!a || a instanceof L.LatLngBounds) {
    return a;
  }
  return new L.LatLngBounds(a, b);
};
L.Projection = {};
L.Projection.SphericalMercator = {
  MAX_LATITUDE: 85.0511287798,
  project: function(latlng) {
    var d = L.LatLng.DEG_TO_RAD,
      max = this.MAX_LATITUDE,
      lat = Math.max(Math.min(max, latlng.lat), -max),
      x = latlng.lng * d,
      y = lat * d;
    y = Math.log(Math.tan(Math.PI / 4 + y / 2));
    return new L.Point(x, y);
  },
  unproject: function(point) {
    var d = L.LatLng.RAD_TO_DEG,
      lng = point.x * d,
      lat = (2 * Math.atan(Math.exp(point.y)) - Math.PI / 2) * d;
    return new L.LatLng(lat, lng);
  },
};
L.Projection.LonLat = {
  project: function(latlng) {
    return new L.Point(latlng.lng, latlng.lat);
  },
  unproject: function(point) {
    return new L.LatLng(point.y, point.x);
  },
};
L.CRS = {
  latLngToPoint: function(latlng, zoom) {
    var projectedPoint = this.projection.project(latlng),
      scale = this.scale(zoom);
    return this.transformation._transform(projectedPoint, scale);
  },
  pointToLatLng: function(point, zoom) {
    var scale = this.scale(zoom),
      untransformedPoint = this.transformation.untransform(point, scale);
    return this.projection.unproject(untransformedPoint);
  },
  project: function(latlng) {
    return this.projection.project(latlng);
  },
  scale: function(zoom) {
    return 256 * Math.pow(2, zoom);
  },
  getSize: function(zoom) {
    var s = this.scale(zoom);
    return L.point(s, s);
  },
};
L.CRS.Simple = L.extend({}, L.CRS, {
  projection: L.Projection.LonLat,
  transformation: new L.Transformation(1, 0, -1, 0),
  scale: function(zoom) {
    return Math.pow(2, zoom);
  },
});
L.CRS.EPSG3857 = L.extend({}, L.CRS, {
  code: "EPSG:3857",
  projection: L.Projection.SphericalMercator,
  transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),
  project: function(latlng) {
    var projectedPoint = this.projection.project(latlng),
      earthRadius = 6378137;
    return projectedPoint.multiplyBy(earthRadius);
  },
});
L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, { code: "EPSG:900913" });
L.CRS.EPSG4326 = L.extend({}, L.CRS, {
  code: "EPSG:4326",
  projection: L.Projection.LonLat,
  transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5),
});
L.Map = L.Class.extend({
  includes: L.Mixin.Events,
  options: {
    crs: L.CRS.EPSG3857,
    fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
    trackResize: true,
    markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d,
  },
  initialize: function(id, options) {
    options = L.setOptions(this, options);
    this._initContainer(id);
    this._initLayout();
    this._onResize = L.bind(this._onResize, this);
    this._initEvents();
    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds);
    }
    if (options.center && options.zoom !== undefined) {
      this.setView(L.latLng(options.center), options.zoom, { reset: true });
    }
    this._handlers = [];
    this._layers = {};
    this._zoomBoundLayers = {};
    this._tileLayersNum = 0;
    this.callInitHooks();
    this._addLayers(options.layers);
  },
  setView: function(center, zoom) {
    zoom = zoom === undefined ? this.getZoom() : zoom;
    this._resetView(L.latLng(center), this._limitZoom(zoom));
    return this;
  },
  setZoom: function(zoom, options) {
    if (!this._loaded) {
      this._zoom = this._limitZoom(zoom);
      return this;
    }
    return this.setView(this.getCenter(), zoom, { zoom: options });
  },
  zoomIn: function(delta, options) {
    return this.setZoom(this._zoom + (delta || 1), options);
  },
  zoomOut: function(delta, options) {
    return this.setZoom(this._zoom - (delta || 1), options);
  },
  setZoomAround: function(latlng, zoom, options) {
    var scale = this.getZoomScale(zoom),
      viewHalf = this.getSize().divideBy(2),
      containerPoint =
        latlng instanceof L.Point
          ? latlng
          : this.latLngToContainerPoint(latlng),
      centerOffset = containerPoint
        .subtract(viewHalf)
        .multiplyBy(1 - 1 / scale),
      newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
    return this.setView(newCenter, zoom, { zoom: options });
  },
  fitBounds: function(bounds, options) {
    options = options || {};
    bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);
    var paddingTL = L.point(
        options.paddingTopLeft || options.padding || [0, 0]
      ),
      paddingBR = L.point(
        options.paddingBottomRight || options.padding || [0, 0]
      ),
      zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
      paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),
      swPoint = this.project(bounds.getSouthWest(), zoom),
      nePoint = this.project(bounds.getNorthEast(), zoom),
      center = this.unproject(
        swPoint
          .add(nePoint)
          .divideBy(2)
          .add(paddingOffset),
        zoom
      );
    zoom = options && options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;
    return this.setView(center, zoom, options);
  },
  fitWorld: function(options) {
    return this.fitBounds(
      [
        [-90, -180],
        [90, 180],
      ],
      options
    );
  },
  panTo: function(center, options) {
    return this.setView(center, this._zoom, { pan: options });
  },
  panBy: function(offset) {
    this.fire("movestart");
    this._rawPanBy(L.point(offset));
    this.fire("move");
    return this.fire("moveend");
  },
  setMaxBounds: function(bounds) {
    bounds = L.latLngBounds(bounds);
    this.options.maxBounds = bounds;
    if (!bounds) {
      return this.off("moveend", this._panInsideMaxBounds, this);
    }
    if (this._loaded) {
      this._panInsideMaxBounds();
    }
    return this.on("moveend", this._panInsideMaxBounds, this);
  },
  panInsideBounds: function(bounds, options) {
    var center = this.getCenter(),
      newCenter = this._limitCenter(center, this._zoom, bounds);
    if (center.equals(newCenter)) {
      return this;
    }
    return this.panTo(newCenter, options);
  },
  addLayer: function(layer) {
    var id = L.stamp(layer);
    if (this._layers[id]) {
      return this;
    }
    this._layers[id] = layer;
    if (
      layer.options &&
      (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom))
    ) {
      this._zoomBoundLayers[id] = layer;
      this._updateZoomLevels();
    }
    if (
      this.options.zoomAnimation &&
      L.TileLayer &&
      layer instanceof L.TileLayer
    ) {
      this._tileLayersNum++;
      this._tileLayersToLoad++;
      layer.on("load", this._onTileLayerLoad, this);
    }
    if (this._loaded) {
      this._layerAdd(layer);
    }
    return this;
  },
  removeLayer: function(layer) {
    var id = L.stamp(layer);
    if (!this._layers[id]) {
      return this;
    }
    if (this._loaded) {
      layer.onRemove(this);
    }
    delete this._layers[id];
    if (this._loaded) {
      this.fire("layerremove", { layer: layer });
    }
    if (this._zoomBoundLayers[id]) {
      delete this._zoomBoundLayers[id];
      this._updateZoomLevels();
    }
    if (
      this.options.zoomAnimation &&
      L.TileLayer &&
      layer instanceof L.TileLayer
    ) {
      this._tileLayersNum--;
      this._tileLayersToLoad--;
      layer.off("load", this._onTileLayerLoad, this);
    }
    return this;
  },
  hasLayer: function(layer) {
    if (!layer) {
      return false;
    }
    return L.stamp(layer) in this._layers;
  },
  eachLayer: function(method, context) {
    for (var i in this._layers) {
      method.call(context, this._layers[i]);
    }
    return this;
  },
  invalidateSize: function(options) {
    if (!this._loaded) {
      return this;
    }
    options = L.extend(
      { animate: false, pan: true },
      options === true ? { animate: true } : options
    );
    var oldSize = this.getSize();
    this._sizeChanged = true;
    this._initialCenter = null;
    var newSize = this.getSize(),
      oldCenter = oldSize.divideBy(2).round(),
      newCenter = newSize.divideBy(2).round(),
      offset = oldCenter.subtract(newCenter);
    if (!offset.x && !offset.y) {
      return this;
    }
    if (options.animate && options.pan) {
      this.panBy(offset);
    } else {
      if (options.pan) {
        this._rawPanBy(offset);
      }
      this.fire("move");
      if (options.debounceMoveend) {
        clearTimeout(this._sizeTimer);
        this._sizeTimer = setTimeout(L.bind(this.fire, this, "moveend"), 200);
      } else {
        this.fire("moveend");
      }
    }
    return this.fire("resize", { oldSize: oldSize, newSize: newSize });
  },
  addHandler: function(name, HandlerClass) {
    if (!HandlerClass) {
      return this;
    }
    var handler = (this[name] = new HandlerClass(this));
    this._handlers.push(handler);
    if (this.options[name]) {
      handler.enable();
    }
    return this;
  },
  remove: function() {
    if (this._loaded) {
      this.fire("unload");
    }
    this._initEvents("off");
    try {
      delete this._container._leaflet;
    } catch (e) {
      this._container._leaflet = undefined;
    }
    this._clearPanes();
    if (this._clearControlPos) {
      this._clearControlPos();
    }
    this._clearHandlers();
    return this;
  },
  getCenter: function() {
    this._checkIfLoaded();
    if (this._initialCenter && !this._moved()) {
      return this._initialCenter;
    }
    return this.layerPointToLatLng(this._getCenterLayerPoint());
  },
  getZoom: function() {
    return this._zoom;
  },
  getBounds: function() {
    var bounds = this.getPixelBounds(),
      sw = this.unproject(bounds.getBottomLeft()),
      ne = this.unproject(bounds.getTopRight());
    return new L.LatLngBounds(sw, ne);
  },
  getMinZoom: function() {
    return this.options.minZoom === undefined
      ? this._layersMinZoom === undefined
        ? 0
        : this._layersMinZoom
      : this.options.minZoom;
  },
  getMaxZoom: function() {
    return this.options.maxZoom === undefined
      ? this._layersMaxZoom === undefined
        ? Infinity
        : this._layersMaxZoom
      : this.options.maxZoom;
  },
  getBoundsZoom: function(bounds, inside, padding) {
    bounds = L.latLngBounds(bounds);
    var zoom = this.getMinZoom() - (inside ? 1 : 0),
      maxZoom = this.getMaxZoom(),
      size = this.getSize(),
      nw = bounds.getNorthWest(),
      se = bounds.getSouthEast(),
      zoomNotFound = true,
      boundsSize;
    padding = L.point(padding || [0, 0]);
    do {
      zoom++;
      boundsSize = this.project(se, zoom)
        .subtract(this.project(nw, zoom))
        .add(padding);
      zoomNotFound = !inside
        ? size.contains(boundsSize)
        : boundsSize.x < size.x || boundsSize.y < size.y;
    } while (zoomNotFound && zoom <= maxZoom);
    if (zoomNotFound && inside) {
      return null;
    }
    return inside ? zoom : zoom - 1;
  },
  getSize: function() {
    if (!this._size || this._sizeChanged) {
      this._size = new L.Point(
        this._container.clientWidth,
        this._container.clientHeight
      );
      this._sizeChanged = false;
    }
    return this._size.clone();
  },
  getPixelBounds: function() {
    var topLeftPoint = this._getTopLeftPoint();
    return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
  },
  getPixelOrigin: function() {
    this._checkIfLoaded();
    return this._initialTopLeftPoint;
  },
  getPanes: function() {
    return this._panes;
  },
  getContainer: function() {
    return this._container;
  },
  getZoomScale: function(toZoom) {
    var crs = this.options.crs;
    return crs.scale(toZoom) / crs.scale(this._zoom);
  },
  getScaleZoom: function(scale) {
    return this._zoom + Math.log(scale) / Math.LN2;
  },
  project: function(latlng, zoom) {
    zoom = zoom === undefined ? this._zoom : zoom;
    return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
  },
  unproject: function(point, zoom) {
    zoom = zoom === undefined ? this._zoom : zoom;
    return this.options.crs.pointToLatLng(L.point(point), zoom);
  },
  layerPointToLatLng: function(point) {
    var projectedPoint = L.point(point).add(this.getPixelOrigin());
    return this.unproject(projectedPoint);
  },
  latLngToLayerPoint: function(latlng) {
    var projectedPoint = this.project(L.latLng(latlng))._round();
    return projectedPoint._subtract(this.getPixelOrigin());
  },
  containerPointToLayerPoint: function(point) {
    return L.point(point).subtract(this._getMapPanePos());
  },
  layerPointToContainerPoint: function(point) {
    return L.point(point).add(this._getMapPanePos());
  },
  containerPointToLatLng: function(point) {
    var layerPoint = this.containerPointToLayerPoint(L.point(point));
    return this.layerPointToLatLng(layerPoint);
  },
  latLngToContainerPoint: function(latlng) {
    return this.layerPointToContainerPoint(
      this.latLngToLayerPoint(L.latLng(latlng))
    );
  },
  mouseEventToContainerPoint: function(e) {
    return L.DomEvent.getMousePosition(e, this._container);
  },
  mouseEventToLayerPoint: function(e) {
    return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
  },
  mouseEventToLatLng: function(e) {
    return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
  },
  _initContainer: function(id) {
    var container = (this._container = L.DomUtil.get(id));
    if (!container) {
      throw new Error("Map container not found.");
    } else if (container._leaflet) {
      throw new Error("Map container is already initialized.");
    }
    container._leaflet = true;
  },
  _initLayout: function() {
    var container = this._container;
    L.DomUtil.addClass(
      container,
      "leaflet-container" +
        (L.Browser.touch ? " leaflet-touch" : "") +
        (L.Browser.retina ? " leaflet-retina" : "") +
        (L.Browser.ielt9 ? " leaflet-oldie" : "") +
        (this.options.fadeAnimation ? " leaflet-fade-anim" : "")
    );
    var position = L.DomUtil.getStyle(container, "position");
    if (
      position !== "absolute" &&
      position !== "relative" &&
      position !== "fixed"
    ) {
      container.style.position = "relative";
    }
    this._initPanes();
    if (this._initControlPos) {
      this._initControlPos();
    }
  },
  _initPanes: function() {
    var panes = (this._panes = {});
    this._mapPane = panes.mapPane = this._createPane(
      "leaflet-map-pane",
      this._container
    );
    this._tilePane = panes.tilePane = this._createPane(
      "leaflet-tile-pane",
      this._mapPane
    );
    panes.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane);
    panes.shadowPane = this._createPane("leaflet-shadow-pane");
    panes.overlayPane = this._createPane("leaflet-overlay-pane");
    panes.markerPane = this._createPane("leaflet-marker-pane");
    panes.popupPane = this._createPane("leaflet-popup-pane");
    var zoomHide = " leaflet-zoom-hide";
    if (!this.options.markerZoomAnimation) {
      L.DomUtil.addClass(panes.markerPane, zoomHide);
      L.DomUtil.addClass(panes.shadowPane, zoomHide);
      L.DomUtil.addClass(panes.popupPane, zoomHide);
    }
  },
  _createPane: function(className, container) {
    return L.DomUtil.create(
      "div",
      className,
      container || this._panes.objectsPane
    );
  },
  _clearPanes: function() {
    this._container.removeChild(this._mapPane);
  },
  _addLayers: function(layers) {
    layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];
    for (var i = 0, len = layers.length; i < len; i++) {
      this.addLayer(layers[i]);
    }
  },
  _resetView: function(center, zoom, preserveMapOffset, afterZoomAnim) {
    var zoomChanged = this._zoom !== zoom;
    if (!afterZoomAnim) {
      this.fire("movestart");
      if (zoomChanged) {
        this.fire("zoomstart");
      }
    }
    this._zoom = zoom;
    this._initialCenter = center;
    this._initialTopLeftPoint = this._getNewTopLeftPoint(center);
    if (!preserveMapOffset) {
      L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
    } else {
      this._initialTopLeftPoint._add(this._getMapPanePos());
    }
    this._tileLayersToLoad = this._tileLayersNum;
    var loading = !this._loaded;
    this._loaded = true;
    if (loading) {
      this.fire("load");
      this.eachLayer(this._layerAdd, this);
    }
    this.fire("viewreset", { hard: !preserveMapOffset });
    this.fire("move");
    if (zoomChanged || afterZoomAnim) {
      this.fire("zoomend");
    }
    this.fire("moveend", { hard: !preserveMapOffset });
  },
  _rawPanBy: function(offset) {
    L.DomUtil.setPosition(
      this._mapPane,
      this._getMapPanePos().subtract(offset)
    );
  },
  _getZoomSpan: function() {
    return this.getMaxZoom() - this.getMinZoom();
  },
  _updateZoomLevels: function() {
    var i,
      minZoom = Infinity,
      maxZoom = -Infinity,
      oldZoomSpan = this._getZoomSpan();
    for (i in this._zoomBoundLayers) {
      var layer = this._zoomBoundLayers[i];
      if (!isNaN(layer.options.minZoom)) {
        minZoom = Math.min(minZoom, layer.options.minZoom);
      }
      if (!isNaN(layer.options.maxZoom)) {
        maxZoom = Math.max(maxZoom, layer.options.maxZoom);
      }
    }
    if (i === undefined) {
      this._layersMaxZoom = this._layersMinZoom = undefined;
    } else {
      this._layersMaxZoom = maxZoom;
      this._layersMinZoom = minZoom;
    }
    if (oldZoomSpan !== this._getZoomSpan()) {
      this.fire("zoomlevelschange");
    }
  },
  _panInsideMaxBounds: function() {
    this.panInsideBounds(this.options.maxBounds);
  },
  _checkIfLoaded: function() {
    if (!this._loaded) {
      throw new Error("Set map center and zoom first.");
    }
  },
  _initEvents: function(onOff) {
    if (!L.DomEvent) {
      return;
    }
    onOff = onOff || "on";
    L.DomEvent[onOff](this._container, "click", this._onMouseClick, this);
    var events = [
        "dblclick",
        "mousedown",
        "mouseup",
        "mouseenter",
        "mouseleave",
        "mousemove",
        "contextmenu",
      ],
      i,
      len;
    for (i = 0, len = events.length; i < len; i++) {
      L.DomEvent[onOff](this._container, events[i], this._fireMouseEvent, this);
    }
    if (this.options.trackResize) {
      L.DomEvent[onOff](window, "resize", this._onResize, this);
    }
  },
  _onResize: function() {
    L.Util.cancelAnimFrame(this._resizeRequest);
    this._resizeRequest = L.Util.requestAnimFrame(
      function() {
        this.invalidateSize({ debounceMoveend: true });
      },
      this,
      false,
      this._container
    );
  },
  _onMouseClick: function(e) {
    if (
      !this._loaded ||
      (!e._simulated &&
        ((this.dragging && this.dragging.moved()) ||
          (this.boxZoom && this.boxZoom.moved()))) ||
      L.DomEvent._skipped(e)
    ) {
      return;
    }
    this.fire("preclick");
    this._fireMouseEvent(e);
  },
  _fireMouseEvent: function(e) {
    if (!this._loaded || L.DomEvent._skipped(e)) {
      return;
    }
    var type = e.type;
    type =
      type === "mouseenter"
        ? "mouseover"
        : type === "mouseleave"
        ? "mouseout"
        : type;
    if (!this.hasEventListeners(type)) {
      return;
    }
    if (type === "contextmenu") {
      L.DomEvent.preventDefault(e);
    }
    var containerPoint = this.mouseEventToContainerPoint(e),
      layerPoint = this.containerPointToLayerPoint(containerPoint),
      latlng = this.layerPointToLatLng(layerPoint);
    this.fire(type, {
      latlng: latlng,
      layerPoint: layerPoint,
      containerPoint: containerPoint,
      originalEvent: e,
    });
  },
  _onTileLayerLoad: function() {
    this._tileLayersToLoad--;
    if (this._tileLayersNum && !this._tileLayersToLoad) {
      this.fire("tilelayersload");
    }
  },
  _clearHandlers: function() {
    for (var i = 0, len = this._handlers.length; i < len; i++) {
      this._handlers[i].disable();
    }
  },
  whenReady: function(callback, context) {
    if (this._loaded) {
      callback.call(context || this, this);
    } else {
      this.on("load", callback, context);
    }
    return this;
  },
  _layerAdd: function(layer) {
    layer.onAdd(this);
    this.fire("layeradd", { layer: layer });
  },
  _getMapPanePos: function() {
    return L.DomUtil.getPosition(this._mapPane);
  },
  _moved: function() {
    var pos = this._getMapPanePos();
    return pos && !pos.equals([0, 0]);
  },
  _getTopLeftPoint: function() {
    return this.getPixelOrigin().subtract(this._getMapPanePos());
  },
  _getNewTopLeftPoint: function(center, zoom) {
    var viewHalf = this.getSize()._divideBy(2);
    return this.project(center, zoom)
      ._subtract(viewHalf)
      ._round();
  },
  _latLngToNewLayerPoint: function(latlng, newZoom, newCenter) {
    var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(
      this._getMapPanePos()
    );
    return this.project(latlng, newZoom)._subtract(topLeft);
  },
  _getCenterLayerPoint: function() {
    return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
  },
  _getCenterOffset: function(latlng) {
    return this.latLngToLayerPoint(latlng).subtract(
      this._getCenterLayerPoint()
    );
  },
  _limitCenter: function(center, zoom, bounds) {
    if (!bounds) {
      return center;
    }
    var centerPoint = this.project(center, zoom),
      viewHalf = this.getSize().divideBy(2),
      viewBounds = new L.Bounds(
        centerPoint.subtract(viewHalf),
        centerPoint.add(viewHalf)
      ),
      offset = this._getBoundsOffset(viewBounds, bounds, zoom);
    return this.unproject(centerPoint.add(offset), zoom);
  },
  _limitOffset: function(offset, bounds) {
    if (!bounds) {
      return offset;
    }
    var viewBounds = this.getPixelBounds(),
      newBounds = new L.Bounds(
        viewBounds.min.add(offset),
        viewBounds.max.add(offset)
      );
    return offset.add(this._getBoundsOffset(newBounds, bounds));
  },
  _getBoundsOffset: function(pxBounds, maxBounds, zoom) {
    var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(
        pxBounds.min
      ),
      seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(
        pxBounds.max
      ),
      dx = this._rebound(nwOffset.x, -seOffset.x),
      dy = this._rebound(nwOffset.y, -seOffset.y);
    return new L.Point(dx, dy);
  },
  _rebound: function(left, right) {
    return left + right > 0
      ? Math.round(left - right) / 2
      : Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
  },
  _limitZoom: function(zoom) {
    var min = this.getMinZoom(),
      max = this.getMaxZoom();
    return Math.max(min, Math.min(max, zoom));
  },
});
L.map = function(id, options) {
  return new L.Map(id, options);
};
L.DomEvent = {
  addListener: function(obj, type, fn, context) {
    var id = L.stamp(fn),
      key = "_leaflet_" + type + id,
      handler,
      originalHandler,
      newType;
    if (obj[key]) {
      return this;
    }
    handler = function(e) {
      return fn.call(context || obj, e || L.DomEvent._getEvent());
    };
    if (L.Browser.pointer && type.indexOf("touch") === 0) {
      return this.addPointerListener(obj, type, handler, id);
    }
    if (L.Browser.touch && type === "dblclick" && this.addDoubleTapListener) {
      this.addDoubleTapListener(obj, handler, id);
    }
    if ("addEventListener" in obj) {
      if (type === "mousewheel") {
        obj.addEventListener("DOMMouseScroll", handler, false);
        obj.addEventListener(type, handler, false);
      } else if (type === "mouseenter" || type === "mouseleave") {
        originalHandler = handler;
        newType = type === "mouseenter" ? "mouseover" : "mouseout";
        handler = function(e) {
          if (!L.DomEvent._checkMouse(obj, e)) {
            return;
          }
          return originalHandler(e);
        };
        obj.addEventListener(newType, handler, false);
      } else if (type === "click" && L.Browser.android) {
        originalHandler = handler;
        handler = function(e) {
          return L.DomEvent._filterClick(e, originalHandler);
        };
        obj.addEventListener(type, handler, false);
      } else {
        obj.addEventListener(type, handler, false);
      }
    } else if ("attachEvent" in obj) {
      obj.attachEvent("on" + type, handler);
    }
    obj[key] = handler;
    return this;
  },
  removeListener: function(obj, type, fn) {
    var id = L.stamp(fn),
      key = "_leaflet_" + type + id,
      handler = obj[key];
    if (!handler) {
      return this;
    }
    if (L.Browser.pointer && type.indexOf("touch") === 0) {
      this.removePointerListener(obj, type, id);
    } else if (
      L.Browser.touch &&
      type === "dblclick" &&
      this.removeDoubleTapListener
    ) {
      this.removeDoubleTapListener(obj, id);
    } else if ("removeEventListener" in obj) {
      if (type === "mousewheel") {
        obj.removeEventListener("DOMMouseScroll", handler, false);
        obj.removeEventListener(type, handler, false);
      } else if (type === "mouseenter" || type === "mouseleave") {
        obj.removeEventListener(
          type === "mouseenter" ? "mouseover" : "mouseout",
          handler,
          false
        );
      } else {
        obj.removeEventListener(type, handler, false);
      }
    } else if ("detachEvent" in obj) {
      obj.detachEvent("on" + type, handler);
    }
    obj[key] = null;
    return this;
  },
  stopPropagation: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    L.DomEvent._skipped(e);
    return this;
  },
  disableScrollPropagation: function(el) {
    var stop = L.DomEvent.stopPropagation;
    return L.DomEvent.on(el, "mousewheel", stop).on(
      el,
      "MozMousePixelScroll",
      stop
    );
  },
  disableClickPropagation: function(el) {
    var stop = L.DomEvent.stopPropagation;
    for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
      L.DomEvent.on(el, L.Draggable.START[i], stop);
    }
    return L.DomEvent.on(el, "click", L.DomEvent._fakeStop).on(
      el,
      "dblclick",
      stop
    );
  },
  preventDefault: function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    return this;
  },
  stop: function(e) {
    return L.DomEvent.preventDefault(e).stopPropagation(e);
  },
  getMousePosition: function(e, container) {
    if (!container) {
      return new L.Point(e.clientX, e.clientY);
    }
    var rect = container.getBoundingClientRect();
    return new L.Point(
      e.clientX - rect.left - container.clientLeft,
      e.clientY - rect.top - container.clientTop
    );
  },
  getWheelDelta: function(e) {
    var delta = 0;
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
    }
    if (e.detail) {
      delta = -e.detail / 3;
    }
    return delta;
  },
  _skipEvents: {},
  _fakeStop: function(e) {
    L.DomEvent._skipEvents[e.type] = true;
  },
  _skipped: function(e) {
    var skipped = this._skipEvents[e.type];
    this._skipEvents[e.type] = false;
    return skipped;
  },
  _checkMouse: function(el, e) {
    var related = e.relatedTarget;
    if (!related) {
      return true;
    }
    try {
      while (related && related !== el) {
        related = related.parentNode;
      }
    } catch (err) {
      return false;
    }
    return related !== el;
  },
  _getEvent: function() {
    var e = window.event;
    if (!e) {
      var caller = arguments.callee.caller;
      while (caller) {
        e = caller["arguments"][0];
        if (e && window.Event === e.constructor) {
          break;
        }
        caller = caller.caller;
      }
    }
    return e;
  },
  _filterClick: function(e, handler) {
    var timeStamp = e.timeStamp || e.originalEvent.timeStamp,
      elapsed = L.DomEvent._lastClick && timeStamp - L.DomEvent._lastClick;
    if (
      (elapsed && elapsed > 100 && elapsed < 1e3) ||
      (e.target._simulatedClick && !e._simulated)
    ) {
      L.DomEvent.stop(e);
      return;
    }
    L.DomEvent._lastClick = timeStamp;
    return handler(e);
  },
};
L.DomEvent.on = L.DomEvent.addListener;
L.DomEvent.off = L.DomEvent.removeListener;
L.Draggable = L.Class.extend({
  includes: L.Mixin.Events,
  statics: {
    START: L.Browser.touch ? ["touchstart", "mousedown"] : ["mousedown"],
    END: {
      mousedown: "mouseup",
      touchstart: "touchend",
      pointerdown: "touchend",
      MSPointerDown: "touchend",
    },
    MOVE: {
      mousedown: "mousemove",
      touchstart: "touchmove",
      pointerdown: "touchmove",
      MSPointerDown: "touchmove",
    },
  },
  initialize: function(element, dragStartTarget) {
    this._element = element;
    this._dragStartTarget = dragStartTarget || element;
  },
  enable: function() {
    if (this._enabled) {
      return;
    }
    for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
      L.DomEvent.on(
        this._dragStartTarget,
        L.Draggable.START[i],
        this._onDown,
        this
      );
    }
    this._enabled = true;
  },
  disable: function() {
    if (!this._enabled) {
      return;
    }
    for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
      L.DomEvent.off(
        this._dragStartTarget,
        L.Draggable.START[i],
        this._onDown,
        this
      );
    }
    this._enabled = false;
    this._moved = false;
  },
  _onDown: function(e) {
    this._moved = false;
    if (e.shiftKey || (e.which !== 1 && e.button !== 1 && !e.touches)) {
      return;
    }
    L.DomEvent.stopPropagation(e);
    if (L.Draggable._disabled) {
      return;
    }
    L.DomUtil.disableImageDrag();
    L.DomUtil.disableTextSelection();
    if (this._moving) {
      return;
    }
    var first = e.touches ? e.touches[0] : e;
    this._startPoint = new L.Point(first.clientX, first.clientY);
    this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
    L.DomEvent.on(document, L.Draggable.MOVE[e.type], this._onMove, this).on(
      document,
      L.Draggable.END[e.type],
      this._onUp,
      this
    );
  },
  _onMove: function(e) {
    if (e.touches && e.touches.length > 1) {
      this._moved = true;
      return;
    }
    var first = e.touches && e.touches.length === 1 ? e.touches[0] : e,
      newPoint = new L.Point(first.clientX, first.clientY),
      offset = newPoint.subtract(this._startPoint);
    if (!offset.x && !offset.y) {
      return;
    }
    L.DomEvent.preventDefault(e);
    if (!this._moved) {
      this.fire("dragstart");
      this._moved = true;
      this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);
      L.DomUtil.addClass(document.body, "leaflet-dragging");
      L.DomUtil.addClass(e.target || e.srcElement, "leaflet-drag-target");
    }
    this._newPos = this._startPos.add(offset);
    this._moving = true;
    L.Util.cancelAnimFrame(this._animRequest);
    this._animRequest = L.Util.requestAnimFrame(
      this._updatePosition,
      this,
      true,
      this._dragStartTarget
    );
  },
  _updatePosition: function() {
    this.fire("predrag");
    L.DomUtil.setPosition(this._element, this._newPos);
    this.fire("drag");
  },
  _onUp: function(e) {
    L.DomUtil.removeClass(document.body, "leaflet-dragging");
    L.DomUtil.removeClass(e.target || e.srcElement, "leaflet-drag-target");
    for (var i in L.Draggable.MOVE) {
      L.DomEvent.off(document, L.Draggable.MOVE[i], this._onMove).off(
        document,
        L.Draggable.END[i],
        this._onUp
      );
    }
    L.DomUtil.enableImageDrag();
    L.DomUtil.enableTextSelection();
    if (this._moved && this._moving) {
      L.Util.cancelAnimFrame(this._animRequest);
      this.fire("dragend", {
        distance: this._newPos.distanceTo(this._startPos),
      });
    }
    this._moving = false;
  },
});
L.Handler = L.Class.extend({
  initialize: function(map) {
    this._map = map;
  },
  enable: function() {
    if (this._enabled) {
      return;
    }
    this._enabled = true;
    this.addHooks();
  },
  disable: function() {
    if (!this._enabled) {
      return;
    }
    this._enabled = false;
    this.removeHooks();
  },
  enabled: function() {
    return !!this._enabled;
  },
});
L.Control = L.Class.extend({
  options: { position: "topright" },
  initialize: function(options) {
    L.setOptions(this, options);
  },
  getPosition: function() {
    return this.options.position;
  },
  setPosition: function(position) {
    var map = this._map;
    if (map) {
      map.removeControl(this);
    }
    this.options.position = position;
    if (map) {
      map.addControl(this);
    }
    return this;
  },
  getContainer: function() {
    return this._container;
  },
  addTo: function(map) {
    this._map = map;
    var container = (this._container = this.onAdd(map)),
      pos = this.getPosition(),
      corner = map._controlCorners[pos];
    L.DomUtil.addClass(container, "leaflet-control");
    if (pos.indexOf("bottom") !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }
    return this;
  },
  removeFrom: function(map) {
    var pos = this.getPosition(),
      corner = map._controlCorners[pos];
    corner.removeChild(this._container);
    this._map = null;
    if (this.onRemove) {
      this.onRemove(map);
    }
    return this;
  },
  _refocusOnMap: function() {
    if (this._map) {
      this._map.getContainer().focus();
    }
  },
});
L.control = function(options) {
  return new L.Control(options);
};
L.Map.include({
  addControl: function(control) {
    control.addTo(this);
    return this;
  },
  removeControl: function(control) {
    control.removeFrom(this);
    return this;
  },
  _initControlPos: function() {
    var corners = (this._controlCorners = {}),
      l = "leaflet-",
      container = (this._controlContainer = L.DomUtil.create(
        "div",
        l + "control-container",
        this._container
      ));
    function createCorner(vSide, hSide) {
      var className = l + vSide + " " + l + hSide;
      corners[vSide + hSide] = L.DomUtil.create("div", className, container);
    }
    createCorner("top", "left");
    createCorner("top", "right");
    createCorner("bottom", "left");
    createCorner("bottom", "right");
  },
  _clearControlPos: function() {
    this._container.removeChild(this._controlContainer);
  },
});
L.TileLayer = L.Class.extend({
  includes: L.Mixin.Events,
  options: {
    minZoom: 0,
    maxZoom: 18,
    tileSize: 256,
    subdomains: "abc",
    errorTileUrl: "",
    attribution: "",
    zoomOffset: 0,
    opacity: 1,
    unloadInvisibleTiles: L.Browser.mobile,
    updateWhenIdle: L.Browser.mobile,
  },
  initialize: function(url, options) {
    options = L.setOptions(this, options);
    if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {
      options.tileSize = Math.floor(options.tileSize / 2);
      options.zoomOffset++;
      if (options.minZoom > 0) {
        options.minZoom--;
      }
      this.options.maxZoom--;
    }
    if (options.bounds) {
      options.bounds = L.latLngBounds(options.bounds);
    }
    this._url = url;
    var subdomains = this.options.subdomains;
    if (typeof subdomains === "string") {
      this.options.subdomains = subdomains.split("");
    }
  },
  onAdd: function(map) {
    this._map = map;
    this._animated = map._zoomAnimated;
    this._initContainer();
    map.on({ viewreset: this._reset, moveend: this._update }, this);
    if (this._animated) {
      map.on({ zoomanim: this._animateZoom, zoomend: this._endZoomAnim }, this);
    }
    if (!this.options.updateWhenIdle) {
      this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
      map.on("move", this._limitedUpdate, this);
    }
    this._reset();
    this._update();
  },
  addTo: function(map) {
    map.addLayer(this);
    return this;
  },
  onRemove: function(map) {
    this._container.parentNode.removeChild(this._container);
    map.off({ viewreset: this._reset, moveend: this._update }, this);
    if (this._animated) {
      map.off(
        { zoomanim: this._animateZoom, zoomend: this._endZoomAnim },
        this
      );
    }
    if (!this.options.updateWhenIdle) {
      map.off("move", this._limitedUpdate, this);
    }
    this._container = null;
    this._map = null;
  },
  bringToFront: function() {
    var pane = this._map._panes.tilePane;
    if (this._container) {
      pane.appendChild(this._container);
      this._setAutoZIndex(pane, Math.max);
    }
    return this;
  },
  bringToBack: function() {
    var pane = this._map._panes.tilePane;
    if (this._container) {
      pane.insertBefore(this._container, pane.firstChild);
      this._setAutoZIndex(pane, Math.min);
    }
    return this;
  },
  getAttribution: function() {
    return this.options.attribution;
  },
  getContainer: function() {
    return this._container;
  },
  setOpacity: function(opacity) {
    this.options.opacity = opacity;
    if (this._map) {
      this._updateOpacity();
    }
    return this;
  },
  setZIndex: function(zIndex) {
    this.options.zIndex = zIndex;
    this._updateZIndex();
    return this;
  },
  setUrl: function(url, noRedraw) {
    this._url = url;
    if (!noRedraw) {
      this.redraw();
    }
    return this;
  },
  redraw: function() {
    if (this._map) {
      this._reset({ hard: true });
      this._update();
    }
    return this;
  },
  _updateZIndex: function() {
    if (this._container && this.options.zIndex !== undefined) {
      this._container.style.zIndex = this.options.zIndex;
    }
  },
  _setAutoZIndex: function(pane, compare) {
    var layers = pane.children,
      edgeZIndex = -compare(Infinity, -Infinity),
      zIndex,
      i,
      len;
    for (i = 0, len = layers.length; i < len; i++) {
      if (layers[i] !== this._container) {
        zIndex = parseInt(layers[i].style.zIndex, 10);
        if (!isNaN(zIndex)) {
          edgeZIndex = compare(edgeZIndex, zIndex);
        }
      }
    }
    this.options.zIndex = this._container.style.zIndex =
      (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
  },
  _updateOpacity: function() {
    var i,
      tiles = this._tiles;
    if (L.Browser.ielt9) {
      for (i in tiles) {
        L.DomUtil.setOpacity(tiles[i], this.options.opacity);
      }
    } else {
      L.DomUtil.setOpacity(this._container, this.options.opacity);
    }
  },
  _initContainer: function() {
    var tilePane = this._map._panes.tilePane;
    if (!this._container) {
      this._container = L.DomUtil.create("div", "leaflet-layer");
      this._updateZIndex();
      if (this._animated) {
        var className = "leaflet-tile-container";
        this._bgBuffer = L.DomUtil.create("div", className, this._container);
        this._tileContainer = L.DomUtil.create(
          "div",
          className,
          this._container
        );
      } else {
        this._tileContainer = this._container;
      }
      tilePane.appendChild(this._container);
      if (this.options.opacity < 1) {
        this._updateOpacity();
      }
    }
  },
  _reset: function(e) {
    for (var key in this._tiles) {
      this.fire("tileunload", { tile: this._tiles[key] });
    }
    this._tiles = {};
    this._tilesToLoad = 0;
    if (this.options.reuseTiles) {
      this._unusedTiles = [];
    }
    this._tileContainer.innerHTML = "";
    if (this._animated && e && e.hard) {
      this._clearBgBuffer();
    }
    this._initContainer();
  },
  _getTileSize: function() {
    var map = this._map,
      zoom = map.getZoom() + this.options.zoomOffset,
      zoomN = this.options.maxNativeZoom,
      tileSize = this.options.tileSize;
    if (zoomN && zoom > zoomN) {
      tileSize = Math.round(
        (map.getZoomScale(zoom) / map.getZoomScale(zoomN)) * tileSize
      );
    }
    return tileSize;
  },
  _update: function() {
    if (!this._map) {
      return;
    }
    var map = this._map,
      bounds = map.getPixelBounds(),
      zoom = map.getZoom(),
      tileSize = this._getTileSize();
    if (isNaN(map.getZoom())) {
      zoom = this.options.minZoom || 1;
      map.setZoom(zoom);
    }
    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }
    var tileBounds = L.bounds(
      bounds.min.divideBy(tileSize)._floor(),
      bounds.max.divideBy(tileSize)._floor()
    );
    this._addTilesFromCenterOut(tileBounds);
    if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
      this._removeOtherTiles(tileBounds);
    }
  },
  _addTilesFromCenterOut: function(bounds) {
    var queue = [],
      center = bounds.getCenter();
    var j, i, point;
    for (j = bounds.min.y; j <= bounds.max.y; j++) {
      for (i = bounds.min.x; i <= bounds.max.x; i++) {
        point = new L.Point(i, j);
        if (!this._tilePointIsCached() && this._tileShouldBeLoaded(point)) {
          queue.push(point);
        }
      }
    }
    var tilesToLoad = queue.length;
    if (tilesToLoad === 0) {
      return;
    }
    queue.sort(function(a, b) {
      return a.distanceTo(center) - b.distanceTo(center);
    });
    var fragment = document.createDocumentFragment();
    if (!this._tilesToLoad) {
      this.fire("loading");
    }
    this._tilesToLoad += tilesToLoad;
    for (i = 0; i < tilesToLoad; i++) {
      this._addTile(queue[i], fragment);
    }
    this._tileContainer.appendChild(fragment);
  },
  _tilePointIsCached: function(tilePoint) {
    if (typeof tilePoint == "undefined") return false;
    return tilePoint.x + ":" + tilePoint.y in this._tiles;
  },
  _tileShouldBeLoaded: function(tilePoint) {
    var options = this.options;
    if (!options.continuousWorld) {
      var limit = this._getWrapTileNum();
      if (
        (options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
        tilePoint.y < 0 ||
        tilePoint.y >= limit.y
      ) {
        return false;
      }
    }
    if (options.bounds) {
      var tileSize = options.tileSize,
        nwPoint = tilePoint.multiplyBy(tileSize),
        sePoint = nwPoint.add([tileSize, tileSize]),
        nw = this._map.unproject(nwPoint),
        se = this._map.unproject(sePoint);
      if (!options.continuousWorld && !options.noWrap) {
        nw = nw.wrap();
        se = se.wrap();
      }
      if (!options.bounds.intersects([nw, se])) {
        return false;
      }
    }
    return true;
  },
  _removeOtherTiles: function(bounds) {
    var kArr, x, y, key;
    for (key in this._tiles) {
      kArr = key.split(":");
      x = parseInt(kArr[0], 10);
      y = parseInt(kArr[1], 10);
      if (
        x < bounds.min.x ||
        x > bounds.max.x ||
        y < bounds.min.y ||
        y > bounds.max.y
      ) {
        this._removeTile(key);
      }
    }
  },
  _removeTile: function(key) {
    var tile = this._tiles[key];
    this.fire("tileunload", { tile: tile, url: tile.src });
    if (this.options.reuseTiles) {
      L.DomUtil.removeClass(tile, "leaflet-tile-loaded");
      this._unusedTiles.push(tile);
    } else if (tile.parentNode === this._tileContainer) {
      this._tileContainer.removeChild(tile);
    }
    if (!L.Browser.android) {
      tile.onload = null;
      tile.src = L.Util.emptyImageUrl;
    }
    delete this._tiles[key];
  },
  _addTile: function(tilePoint, container) {
    var tilePos = this._getTilePos(tilePoint);
    var tile = this._getTile();
    L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome);
    this._tiles[tilePoint.x + ":" + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);
    if (tile.parentNode !== this._tileContainer) {
      container.appendChild(tile);
    }
  },
  _getZoomForUrl: function() {
    var options = this.options,
      zoom = this._map.getZoom();
    if (options.zoomReverse) {
      zoom = options.maxZoom - zoom;
    }
    zoom += options.zoomOffset;
    return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
  },
  _getTilePos: function(tilePoint) {
    var origin = this._map.getPixelOrigin(),
      tileSize = this._getTileSize();
    return tilePoint.multiplyBy(tileSize).subtract(origin);
  },
  getTileUrl: function(tilePoint) {
    return L.Util.template(
      this._url,
      L.extend(
        {
          s: this._getSubdomain(tilePoint),
          z: tilePoint.z,
          x: tilePoint.x,
          y: tilePoint.y,
        },
        this.options
      )
    );
  },
  _getWrapTileNum: function() {
    var crs = this._map.options.crs,
      size = crs.getSize(this._map.getZoom());
    return size.divideBy(this._getTileSize())._floor();
  },
  _adjustTilePoint: function(tilePoint) {
    var limit = this._getWrapTileNum();
    if (!this.options.continuousWorld && !this.options.noWrap) {
      tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
    }
    if (this.options.tms) {
      tilePoint.y = limit.y - tilePoint.y - 1;
    }
    tilePoint.z = this._getZoomForUrl();
  },
  _getSubdomain: function(tilePoint) {
    var index =
      Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
    return this.options.subdomains[index];
  },
  _getTile: function() {
    if (this.options.reuseTiles && this._unusedTiles.length > 0) {
      var tile = this._unusedTiles.pop();
      this._resetTile(tile);
      return tile;
    }
    return this._createTile();
  },
  _resetTile: function() {},
  _createTile: function() {
    var tile = L.DomUtil.create("img", "leaflet-tile");
    tile.style.width = tile.style.height = this._getTileSize() + "px";
    tile.galleryimg = "no";
    tile.onselectstart = tile.onmousemove = L.Util.falseFn;
    if (L.Browser.ielt9 && this.options.opacity !== undefined) {
      L.DomUtil.setOpacity(tile, this.options.opacity);
    }
    if (L.Browser.mobileWebkit3d) {
      tile.style.WebkitBackfaceVisibility = "hidden";
    }
    return tile;
  },
  _loadTile: function(tile, tilePoint) {
    tile._layer = this;
    tile.onload = this._tileOnLoad;
    tile.onerror = this._tileOnError;
    this._adjustTilePoint(tilePoint);
    tile.src = this.getTileUrl(tilePoint);
    this.fire("tileloadstart", { tile: tile, url: tile.src });
  },
  _tileLoaded: function() {
    this._tilesToLoad--;
    if (this._animated) {
      L.DomUtil.addClass(this._tileContainer, "leaflet-zoom-animated");
    }
    if (!this._tilesToLoad) {
      this.fire("load");
      if (this._animated) {
        clearTimeout(this._clearBgBufferTimer);
        this._clearBgBufferTimer = setTimeout(
          L.bind(this._clearBgBuffer, this),
          500
        );
      }
    }
  },
  _tileOnLoad: function() {
    var layer = this._layer;
    if (this.src !== L.Util.emptyImageUrl) {
      L.DomUtil.addClass(this, "leaflet-tile-loaded");
      layer.fire("tileload", { tile: this, url: this.src });
    }
    layer._tileLoaded();
  },
  _tileOnError: function() {
    var layer = this._layer;
    layer.fire("tileerror", { tile: this, url: this.src });
    var newUrl = layer.options.errorTileUrl;
    if (newUrl) {
      this.src = newUrl;
    }
    layer._tileLoaded();
  },
});
L.tileLayer = function(url, options) {
  return new L.TileLayer(url, options);
};
L.TileLayer.Canvas = L.TileLayer.extend({
  options: { async: false },
  initialize: function(options) {
    L.setOptions(this, options);
  },
  redraw: function() {
    if (this._map) {
      this._reset({ hard: true });
      this._update();
    }
    for (var i in this._tiles) {
      this._redrawTile(this._tiles[i]);
    }
    return this;
  },
  _redrawTile: function(tile) {
    this.drawTile(tile, tile._tilePoint, this._map._zoom);
  },
  _createTile: function() {
    var tile = L.DomUtil.create("canvas", "leaflet-tile");
    tile.width = tile.height = this.options.tileSize;
    tile.onselectstart = tile.onmousemove = L.Util.falseFn;
    return tile;
  },
  _loadTile: function(tile, tilePoint) {
    tile._layer = this;
    tile._tilePoint = tilePoint;
    this._redrawTile(tile);
    if (!this.options.async) {
      this.tileDrawn(tile);
    }
  },
  drawTile: function() {},
  tileDrawn: function(tile) {
    this._tileOnLoad.call(tile);
  },
});
L.tileLayer.canvas = function(options) {
  return new L.TileLayer.Canvas(options);
};
L.ImageOverlay = L.Class.extend({
  includes: L.Mixin.Events,
  options: { opacity: 1 },
  initialize: function(url, bounds, options) {
    this._url = url;
    this._bounds = L.latLngBounds(bounds);
    L.setOptions(this, options);
  },
  onAdd: function(map) {
    this._map = map;
    if (!this._image) {
      this._initImage();
    }
    map._panes.overlayPane.appendChild(this._image);
    map.on("viewreset", this._reset, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on("zoomanim", this._animateZoom, this);
    }
    this._reset();
  },
  onRemove: function(map) {
    map.getPanes().overlayPane.removeChild(this._image);
    map.off("viewreset", this._reset, this);
    if (map.options.zoomAnimation) {
      map.off("zoomanim", this._animateZoom, this);
    }
  },
  addTo: function(map) {
    map.addLayer(this);
    return this;
  },
  setOpacity: function(opacity) {
    this.options.opacity = opacity;
    this._updateOpacity();
    return this;
  },
  bringToFront: function() {
    if (this._image) {
      this._map._panes.overlayPane.appendChild(this._image);
    }
    return this;
  },
  bringToBack: function() {
    var pane = this._map._panes.overlayPane;
    if (this._image) {
      pane.insertBefore(this._image, pane.firstChild);
    }
    return this;
  },
  setUrl: function(url) {
    this._url = url;
    this._image.src = this._url;
  },
  getAttribution: function() {
    return this.options.attribution;
  },
  _initImage: function() {
    this._image = L.DomUtil.create("img", "leaflet-image-layer");
    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._image, "leaflet-zoom-animated");
    } else {
      L.DomUtil.addClass(this._image, "leaflet-zoom-hide");
    }
    this._updateOpacity();
    L.extend(this._image, {
      galleryimg: "no",
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.bind(this._onImageLoad, this),
      src: this._url,
    });
  },
  _animateZoom: function(e) {
    var map = this._map,
      image = this._image,
      scale = map.getZoomScale(e.zoom),
      nw = this._bounds.getNorthWest(),
      se = this._bounds.getSouthEast(),
      topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
      size = map
        ._latLngToNewLayerPoint(se, e.zoom, e.center)
        ._subtract(topLeft),
      origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
    image.style[L.DomUtil.TRANSFORM] =
      L.DomUtil.getTranslateString(origin) + " scale(" + scale + ") ";
  },
  _reset: function() {
    var image = this._image,
      topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
      size = this._map
        .latLngToLayerPoint(this._bounds.getSouthEast())
        ._subtract(topLeft);
    L.DomUtil.setPosition(image, topLeft);
    image.style.width = size.x + "px";
    image.style.height = size.y + "px";
  },
  _onImageLoad: function() {
    this.fire("load");
  },
  _updateOpacity: function() {
    L.DomUtil.setOpacity(this._image, this.options.opacity);
  },
});
L.imageOverlay = function(url, bounds, options) {
  return new L.ImageOverlay(url, bounds, options);
};
L.Icon = L.Class.extend({
  options: { className: "" },
  initialize: function(options) {
    L.setOptions(this, options);
  },
  createIcon: function(oldIcon) {
    return this._createIcon("icon", oldIcon);
  },
  createShadow: function(oldIcon) {
    return this._createIcon("shadow", oldIcon);
  },
  _createIcon: function(name, oldIcon) {
    var src = this._getIconUrl(name);
    if (!src) {
      if (name === "icon") {
        throw new Error("iconUrl not set in Icon options (see the docs).");
      }
      return null;
    }
    var img;
    if (!oldIcon || oldIcon.tagName !== "IMG") {
      img = this._createImg(src);
    } else {
      img = this._createImg(src, oldIcon);
    }
    this._setIconStyles(img, name);
    return img;
  },
  _setIconStyles: function(img, name) {
    var options = this.options,
      size = L.point(options[name + "Size"]),
      anchor;
    if (name === "shadow") {
      anchor = L.point(options.shadowAnchor || options.iconAnchor);
    } else {
      anchor = L.point(options.iconAnchor);
    }
    if (!anchor && size) {
      anchor = size.divideBy(2, true);
    }
    img.className = "leaflet-marker-" + name + " " + options.className;
    if (anchor) {
      img.style.marginLeft = -anchor.x + "px";
      img.style.marginTop = -anchor.y + "px";
    }
    if (size) {
      img.style.width = size.x + "px";
      img.style.height = size.y + "px";
    }
  },
  _createImg: function(src, el) {
    el = el || document.createElement("img");
    el.src = src;
    return el;
  },
  _getIconUrl: function(name) {
    if (L.Browser.retina && this.options[name + "RetinaUrl"]) {
      return this.options[name + "RetinaUrl"];
    }
    return this.options[name + "Url"];
  },
});
L.icon = function(options) {
  return new L.Icon(options);
};
L.Icon.Default = L.Icon.extend({
  options: {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  },
  _getIconUrl: function(name) {
    var key = name + "Url";
    if (this.options[key]) {
      return this.options[key];
    }
    if (L.Browser.retina && name === "icon") {
      name += "-2x";
    }
    var path = L.Icon.Default.imagePath;
    if (!path) {
      throw new Error(
        "Couldn't autodetect L.Icon.Default.imagePath, set it manually."
      );
    }
    return path + "/marker-" + name + ".png";
  },
});
L.Icon.Default.imagePath = (function() {
  var scripts = document.getElementsByTagName("script"),
    leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;
  var i, len, src, matches, path;
  for (i = 0, len = scripts.length; i < len; i++) {
    src = scripts[i].src;
    matches = src.match(leafletRe);
    if (matches) {
      path = src.split(leafletRe)[0];
      return (path ? path + "/" : "") + "images";
    }
  }
})();
L.Marker = L.Class.extend({
  includes: L.Mixin.Events,
  options: {
    icon: new L.Icon.Default(),
    title: "",
    alt: "",
    clickable: true,
    draggable: false,
    keyboard: true,
    zIndexOffset: 0,
    opacity: 1,
    riseOnHover: false,
    riseOffset: 250,
  },
  initialize: function(latlng, options) {
    L.setOptions(this, options);
    this._latlng = L.latLng(latlng);
  },
  onAdd: function(map) {
    this._map = map;
    map.on("viewreset", this.update, this);
    this._initIcon();
    this.update();
    this.fire("add");
    if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
      map.on("zoomanim", this._animateZoom, this);
    }
  },
  addTo: function(map) {
    map.addLayer(this);
    return this;
  },
  onRemove: function(map) {
    if (this.dragging) {
      this.dragging.disable();
    }
    this._removeIcon();
    this._removeShadow();
    this.fire("remove");
    map.off({ viewreset: this.update, zoomanim: this._animateZoom }, this);
    this._map = null;
  },
  getLatLng: function() {
    return this._latlng;
  },
  setLatLng: function(latlng) {
    this._latlng = L.latLng(latlng);
    this.update();
    return this.fire("move", { latlng: this._latlng });
  },
  setZIndexOffset: function(offset) {
    this.options.zIndexOffset = offset;
    this.update();
    return this;
  },
  setIcon: function(icon) {
    this.options.icon = icon;
    if (this._map) {
      this._initIcon();
      this.update();
    }
    if (this._popup) {
      this.bindPopup(this._popup);
    }
    return this;
  },
  update: function() {
    if (this._icon) {
      var pos = this._map.latLngToLayerPoint(this._latlng).round();
      this._setPos(pos);
    }
    return this;
  },
  _initIcon: function() {
    var options = this.options,
      map = this._map,
      animation = map.options.zoomAnimation && map.options.markerZoomAnimation,
      classToAdd = animation ? "leaflet-zoom-animated" : "leaflet-zoom-hide";
    var icon = options.icon.createIcon(this._icon),
      addIcon = false;
    if (icon !== this._icon) {
      if (this._icon) {
        this._removeIcon();
      }
      addIcon = true;
      if (options.title) {
        icon.title = options.title;
      }
      if (options.alt) {
        icon.alt = options.alt;
      }
    }
    L.DomUtil.addClass(icon, classToAdd);
    if (options.keyboard) {
      icon.tabIndex = "0";
    }
    this._icon = icon;
    this._initInteraction();
    if (options.riseOnHover) {
      L.DomEvent.on(icon, "mouseover", this._bringToFront, this).on(
        icon,
        "mouseout",
        this._resetZIndex,
        this
      );
    }
    var newShadow = options.icon.createShadow(this._shadow),
      addShadow = false;
    if (newShadow !== this._shadow) {
      this._removeShadow();
      addShadow = true;
    }
    if (newShadow) {
      L.DomUtil.addClass(newShadow, classToAdd);
    }
    this._shadow = newShadow;
    if (options.opacity < 1) {
      this._updateOpacity();
    }
    var panes = this._map._panes;
    if (addIcon) {
      panes.markerPane.appendChild(this._icon);
    }
    if (newShadow && addShadow) {
      panes.shadowPane.appendChild(this._shadow);
    }
  },
  _removeIcon: function() {
    if (this.options.riseOnHover) {
      L.DomEvent.off(this._icon, "mouseover", this._bringToFront).off(
        this._icon,
        "mouseout",
        this._resetZIndex
      );
    }
    this._map._panes.markerPane.removeChild(this._icon);
    this._icon = null;
  },
  _removeShadow: function() {
    if (this._shadow) {
      this._map._panes.shadowPane.removeChild(this._shadow);
    }
    this._shadow = null;
  },
  _setPos: function(pos) {
    L.DomUtil.setPosition(this._icon, pos);
    if (this._shadow) {
      L.DomUtil.setPosition(this._shadow, pos);
    }
    this._zIndex = pos.y + this.options.zIndexOffset;
    this._resetZIndex();
  },
  _updateZIndex: function(offset) {
    this._icon.style.zIndex = this._zIndex + offset;
  },
  _animateZoom: function(opt) {
    var pos = this._map
      ._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center)
      .round();
    this._setPos(pos);
  },
  _initInteraction: function() {
    if (!this.options.clickable) {
      return;
    }
    var icon = this._icon,
      events = [
        "dblclick",
        "mousedown",
        "mouseover",
        "mouseout",
        "contextmenu",
      ];
    L.DomUtil.addClass(icon, "leaflet-clickable");
    L.DomEvent.on(icon, "click", this._onMouseClick, this);
    L.DomEvent.on(icon, "keypress", this._onKeyPress, this);
    for (var i = 0; i < events.length; i++) {
      L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
    }
    if (L.Handler.MarkerDrag) {
      this.dragging = new L.Handler.MarkerDrag(this);
      if (this.options.draggable) {
        this.dragging.enable();
      }
    }
  },
  _onMouseClick: function(e) {
    var wasDragged = this.dragging && this.dragging.moved();
    if (this.hasEventListeners(e.type) || wasDragged) {
      L.DomEvent.stopPropagation(e);
    }
    if (wasDragged) {
      return;
    }
    if (
      (!this.dragging || !this.dragging._enabled) &&
      this._map.dragging &&
      this._map.dragging.moved()
    ) {
      return;
    }
    this.fire(e.type, { originalEvent: e, latlng: this._latlng });
  },
  _onKeyPress: function(e) {
    if (e.keyCode === 13) {
      this.fire("click", { originalEvent: e, latlng: this._latlng });
    }
  },
  _fireMouseEvent: function(e) {
    this.fire(e.type, { originalEvent: e, latlng: this._latlng });
    if (e.type === "contextmenu" && this.hasEventListeners(e.type)) {
      L.DomEvent.preventDefault(e);
    }
    if (e.type !== "mousedown") {
      L.DomEvent.stopPropagation(e);
    } else {
      L.DomEvent.preventDefault(e);
    }
  },
  setOpacity: function(opacity) {
    this.options.opacity = opacity;
    if (this._map) {
      this._updateOpacity();
    }
    return this;
  },
  _updateOpacity: function() {
    L.DomUtil.setOpacity(this._icon, this.options.opacity);
    if (this._shadow) {
      L.DomUtil.setOpacity(this._shadow, this.options.opacity);
    }
  },
  _bringToFront: function() {
    this._updateZIndex(this.options.riseOffset);
  },
  _resetZIndex: function() {
    this._updateZIndex(0);
  },
});
L.marker = function(latlng, options) {
  return new L.Marker(latlng, options);
};
L.DivIcon = L.Icon.extend({
  options: { iconSize: [12, 12], className: "leaflet-div-icon", html: false },
  createIcon: function(oldIcon) {
    var div =
        oldIcon && oldIcon.tagName === "DIV"
          ? oldIcon
          : document.createElement("div"),
      options = this.options;
    if (options.html !== false) {
      div.innerHTML = options.html;
    } else {
      div.innerHTML = "";
    }
    if (options.bgPos) {
      div.style.backgroundPosition =
        -options.bgPos.x + "px " + -options.bgPos.y + "px";
    }
    this._setIconStyles(div, "icon");
    return div;
  },
  createShadow: function() {
    return null;
  },
});
L.divIcon = function(options) {
  return new L.DivIcon(options);
};
L.LayerGroup = L.Class.extend({
  initialize: function(layers) {
    this._layers = {};
    var i, len;
    if (layers) {
      for (i = 0, len = layers.length; i < len; i++) {
        this.addLayer(layers[i]);
      }
    }
  },
  addLayer: function(layer) {
    var id = this.getLayerId(layer);
    this._layers[id] = layer;
    if (this._map) {
      this._map.addLayer(layer);
    }
    return this;
  },
  removeLayer: function(layer) {
    var id = layer in this._layers ? layer : this.getLayerId(layer);
    if (this._map && this._layers[id]) {
      this._map.removeLayer(this._layers[id]);
    }
    delete this._layers[id];
    return this;
  },
  hasLayer: function(layer) {
    if (!layer) {
      return false;
    }
    return layer in this._layers || this.getLayerId(layer) in this._layers;
  },
  clearLayers: function() {
    this.eachLayer(this.removeLayer, this);
    return this;
  },
  invoke: function(methodName) {
    var args = Array.prototype.slice.call(arguments, 1),
      i,
      layer;
    for (i in this._layers) {
      layer = this._layers[i];
      if (layer[methodName]) {
        layer[methodName].apply(layer, args);
      }
    }
    return this;
  },
  onAdd: function(map) {
    this._map = map;
    this.eachLayer(map.addLayer, map);
  },
  onRemove: function(map) {
    this.eachLayer(map.removeLayer, map);
    this._map = null;
  },
  addTo: function(map) {
    map.addLayer(this);
    return this;
  },
  eachLayer: function(method, context) {
    for (var i in this._layers) {
      method.call(context, this._layers[i]);
    }
    return this;
  },
  getLayer: function(id) {
    return this._layers[id];
  },
  getLayers: function() {
    var layers = [];
    for (var i in this._layers) {
      layers.push(this._layers[i]);
    }
    return layers;
  },
  setZIndex: function(zIndex) {
    return this.invoke("setZIndex", zIndex);
  },
  getLayerId: function(layer) {
    return L.stamp(layer);
  },
});
L.layerGroup = function(layers) {
  return new L.LayerGroup(layers);
};
L.FeatureGroup = L.LayerGroup.extend({
  includes: L.Mixin.Events,
  statics: {
    EVENTS:
      "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose",
  },
  addLayer: function(layer) {
    if (this.hasLayer(layer)) {
      return this;
    }
    if ("on" in layer) {
      layer.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);
    }
    L.LayerGroup.prototype.addLayer.call(this, layer);
    if (this._popupContent && layer.bindPopup) {
      layer.bindPopup(this._popupContent, this._popupOptions);
    }
    return this.fire("layeradd", { layer: layer });
  },
  removeLayer: function(layer) {
    if (!this.hasLayer(layer)) {
      return this;
    }
    if (layer in this._layers) {
      layer = this._layers[layer];
    }
    layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this);
    L.LayerGroup.prototype.removeLayer.call(this, layer);
    if (this._popupContent) {
      this.invoke("unbindPopup");
    }
    return this.fire("layerremove", { layer: layer });
  },
  bindPopup: function(content, options) {
    this._popupContent = content;
    this._popupOptions = options;
    return this.invoke("bindPopup", content, options);
  },
  openPopup: function(latlng) {
    for (var id in this._layers) {
      this._layers[id].openPopup(latlng);
      break;
    }
    return this;
  },
  setStyle: function(style) {
    return this.invoke("setStyle", style);
  },
  bringToFront: function() {
    return this.invoke("bringToFront");
  },
  bringToBack: function() {
    return this.invoke("bringToBack");
  },
  getBounds: function() {
    var bounds = new L.LatLngBounds();
    this.eachLayer(function(layer) {
      bounds.extend(
        layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds()
      );
    });
    return bounds;
  },
  _propagateEvent: function(e) {
    e = L.extend({ layer: e.target, target: this }, e);
    this.fire(e.type, e);
  },
});
L.featureGroup = function(layers) {
  return new L.FeatureGroup(layers);
};
L.Path = L.Class.extend({
  includes: [L.Mixin.Events],
  statics: {
    CLIP_PADDING: (function() {
      var max = L.Browser.mobile ? 1280 : 2e3,
        target =
          (max / Math.max(window.outerWidth, window.outerHeight) - 1) / 2;
      return Math.max(0, Math.min(0.5, target));
    })(),
  },
  options: {
    stroke: true,
    color: "#0033ff",
    dashArray: null,
    lineCap: null,
    lineJoin: null,
    weight: 5,
    opacity: 0.5,
    fill: false,
    fillColor: null,
    fillOpacity: 0.2,
    clickable: true,
  },
  initialize: function(options) {
    L.setOptions(this, options);
  },
  onAdd: function(map) {
    this._map = map;
    if (!this._container) {
      this._initElements();
      this._initEvents();
    }
    this.projectLatlngs();
    this._updatePath();
    if (this._container) {
      this._map._pathRoot.appendChild(this._container);
    }
    this.fire("add");
    map.on({ viewreset: this.projectLatlngs, moveend: this._updatePath }, this);
  },
  addTo: function(map) {
    map.addLayer(this);
    return this;
  },
  onRemove: function(map) {
    map._pathRoot.removeChild(this._container);
    this.fire("remove");
    this._map = null;
    if (L.Browser.vml) {
      this._container = null;
      this._stroke = null;
      this._fill = null;
    }
    map.off(
      { viewreset: this.projectLatlngs, moveend: this._updatePath },
      this
    );
  },
  projectLatlngs: function() {},
  setStyle: function(style) {
    L.setOptions(this, style);
    if (this._container) {
      this._updateStyle();
    }
    return this;
  },
  redraw: function() {
    if (this._map) {
      this.projectLatlngs();
      this._updatePath();
    }
    return this;
  },
});
L.Map.include({
  _updatePathViewport: function() {
    var p = L.Path.CLIP_PADDING,
      size = this.getSize(),
      panePos = L.DomUtil.getPosition(this._mapPane),
      min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
      max = min.add(size.multiplyBy(1 + p * 2)._round());
    this._pathViewport = new L.Bounds(min, max);
  },
});
L.Path.SVG_NS = "http://www.w3.org/2000/svg";
L.Browser.svg = !!(
  document.createElementNS &&
  document.createElementNS(L.Path.SVG_NS, "svg").createSVGRect
);
L.Path = L.Path.extend({
  statics: { SVG: L.Browser.svg },
  bringToFront: function() {
    var root = this._map._pathRoot,
      path = this._container;
    if (path && root.lastChild !== path) {
      root.appendChild(path);
    }
    return this;
  },
  bringToBack: function() {
    var root = this._map._pathRoot,
      path = this._container,
      first = root.firstChild;
    if (path && first !== path) {
      root.insertBefore(path, first);
    }
    return this;
  },
  getPathString: function() {},
  _createElement: function(name) {
    return document.createElementNS(L.Path.SVG_NS, name);
  },
  _initElements: function() {
    this._map._initPathRoot();
    this._initPath();
    this._initStyle();
  },
  _initPath: function() {
    this._container = this._createElement("g");
    this._path = this._createElement("path");
    if (this.options.className) {
      L.DomUtil.addClass(this._path, this.options.className);
    }
    this._container.appendChild(this._path);
  },
  _initStyle: function() {
    if (this.options.stroke) {
      this._path.setAttribute("stroke-linejoin", "round");
      this._path.setAttribute("stroke-linecap", "round");
    }
    if (this.options.fill) {
      this._path.setAttribute("fill-rule", "evenodd");
    }
    if (this.options.pointerEvents) {
      this._path.setAttribute("pointer-events", this.options.pointerEvents);
    }
    if (!this.options.clickable && !this.options.pointerEvents) {
      this._path.setAttribute("pointer-events", "none");
    }
    this._updateStyle();
  },
  _updateStyle: function() {
    if (this.options.stroke) {
      this._path.setAttribute("stroke", this.options.color);
      this._path.setAttribute("stroke-opacity", this.options.opacity);
      this._path.setAttribute("stroke-width", this.options.weight);
      if (this.options.dashArray) {
        this._path.setAttribute("stroke-dasharray", this.options.dashArray);
      } else {
        this._path.removeAttribute("stroke-dasharray");
      }
      if (this.options.lineCap) {
        this._path.setAttribute("stroke-linecap", this.options.lineCap);
      }
      if (this.options.lineJoin) {
        this._path.setAttribute("stroke-linejoin", this.options.lineJoin);
      }
    } else {
      this._path.setAttribute("stroke", "none");
    }
    if (this.options.fill) {
      this._path.setAttribute(
        "fill",
        this.options.fillColor || this.options.color
      );
      this._path.setAttribute("fill-opacity", this.options.fillOpacity);
    } else {
      this._path.setAttribute("fill", "none");
    }
  },
  _updatePath: function() {
    var str = this.getPathString();
    if (!str) {
      str = "M0 0";
    }
    this._path.setAttribute("d", str);
  },
  _initEvents: function() {
    if (this.options.clickable) {
      if (L.Browser.svg || !L.Browser.vml) {
        L.DomUtil.addClass(this._path, "leaflet-clickable");
      }
      L.DomEvent.on(this._container, "click", this._onMouseClick, this);
      var events = [
        "dblclick",
        "mousedown",
        "mouseover",
        "mouseout",
        "mousemove",
        "contextmenu",
      ];
      for (var i = 0; i < events.length; i++) {
        L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
      }
    }
  },
  _onMouseClick: function(e) {
    if (this._map.dragging && this._map.dragging.moved()) {
      return;
    }
    this._fireMouseEvent(e);
  },
  _fireMouseEvent: function(e) {
    if (!this.hasEventListeners(e.type)) {
      return;
    }
    var map = this._map,
      containerPoint = map.mouseEventToContainerPoint(e),
      layerPoint = map.containerPointToLayerPoint(containerPoint),
      latlng = map.layerPointToLatLng(layerPoint);
    this.fire(e.type, {
      latlng: latlng,
      layerPoint: layerPoint,
      containerPoint: containerPoint,
      originalEvent: e,
    });
    if (e.type === "contextmenu") {
      L.DomEvent.preventDefault(e);
    }
    if (e.type !== "mousemove") {
      L.DomEvent.stopPropagation(e);
    }
  },
});
L.Map.include({
  _initPathRoot: function() {
    if (!this._pathRoot) {
      this._pathRoot = L.Path.prototype._createElement("svg");
      this._panes.overlayPane.appendChild(this._pathRoot);
      if (this.options.zoomAnimation && L.Browser.any3d) {
        L.DomUtil.addClass(this._pathRoot, "leaflet-zoom-animated");
        this.on({
          zoomanim: this._animatePathZoom,
          zoomend: this._endPathZoom,
        });
      } else {
        L.DomUtil.addClass(this._pathRoot, "leaflet-zoom-hide");
      }
      this.on("moveend", this._updateSvgViewport);
      this._updateSvgViewport();
    }
  },
  _animatePathZoom: function(e) {
    var scale = this.getZoomScale(e.zoom),
      offset = this._getCenterOffset(e.center)
        ._multiplyBy(-scale)
        ._add(this._pathViewport.min);
    this._pathRoot.style[L.DomUtil.TRANSFORM] =
      L.DomUtil.getTranslateString(offset) + " scale(" + scale + ") ";
    this._pathZooming = true;
  },
  _endPathZoom: function() {
    this._pathZooming = false;
  },
  _updateSvgViewport: function() {
    if (this._pathZooming) {
      return;
    }
    this._updatePathViewport();
    var vp = this._pathViewport,
      min = vp.min,
      max = vp.max,
      width = max.x - min.x,
      height = max.y - min.y,
      root = this._pathRoot,
      pane = this._panes.overlayPane;
    if (L.Browser.mobileWebkit) {
      pane.removeChild(root);
    }
    L.DomUtil.setPosition(root, min);
    root.setAttribute("width", width);
    root.setAttribute("height", height);
    root.setAttribute("viewBox", [min.x, min.y, width, height].join(" "));
    if (L.Browser.mobileWebkit) {
      pane.appendChild(root);
    }
  },
});
L.Browser.canvas = (function() {
  return !!document.createElement("canvas").getContext;
})();
L.Path =
  (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas
    ? L.Path
    : L.Path.extend({
        statics: { CANVAS: true, SVG: false },
        redraw: function() {
          if (this._map) {
            this.projectLatlngs();
            this._requestUpdate();
          }
          return this;
        },
        setStyle: function(style) {
          L.setOptions(this, style);
          if (this._map) {
            this._updateStyle();
            this._requestUpdate();
          }
          return this;
        },
        onRemove: function(map) {
          map
            .off("viewreset", this.projectLatlngs, this)
            .off("moveend", this._updatePath, this);
          if (this.options.clickable) {
            this._map.off("click", this._onClick, this);
            this._map.off("mousemove", this._onMouseMove, this);
          }
          this._requestUpdate();
          this._map = null;
        },
        _requestUpdate: function() {
          if (this._map && !L.Path._updateRequest) {
            L.Path._updateRequest = L.Util.requestAnimFrame(
              this._fireMapMoveEnd,
              this._map
            );
          }
        },
        _fireMapMoveEnd: function() {
          L.Path._updateRequest = null;
          this.fire("moveend");
        },
        _initElements: function() {
          this._map._initPathRoot();
          this._ctx = this._map._canvasCtx;
        },
        _updateStyle: function() {
          var options = this.options;
          if (options.stroke) {
            this._ctx.lineWidth = options.weight;
            this._ctx.strokeStyle = options.color;
          }
          if (options.fill) {
            this._ctx.fillStyle = options.fillColor || options.color;
          }
        },
        _drawPath: function() {
          var i, j, len, len2, point, drawMethod;
          this._ctx.beginPath();
          for (i = 0, len = this._parts.length; i < len; i++) {
            for (j = 0, len2 = this._parts[i].length; j < len2; j++) {
              point = this._parts[i][j];
              drawMethod = (j === 0 ? "move" : "line") + "To";
              this._ctx[drawMethod](point.x, point.y);
            }
            if (this instanceof L.Polygon) {
              this._ctx.closePath();
            }
          }
        },
        _checkIfEmpty: function() {
          return !this._parts.length;
        },
        _updatePath: function() {
          if (this._checkIfEmpty()) {
            return;
          }
          var ctx = this._ctx,
            options = this.options;
          this._drawPath();
          ctx.save();
          this._updateStyle();
          if (options.fill) {
            ctx.globalAlpha = options.fillOpacity;
            ctx.fill();
          }
          if (options.stroke) {
            ctx.globalAlpha = options.opacity;
            ctx.stroke();
          }
          ctx.restore();
        },
        _initEvents: function() {
          if (this.options.clickable) {
            this._map.on("mousemove", this._onMouseMove, this);
            this._map.on("click", this._onClick, this);
          }
        },
        _onClick: function(e) {
          if (this._containsPoint(e.layerPoint)) {
            console.log('clicker')
            this.fire("click", e);
          }
        },
        _onMouseMove: function(e) {
          if (!this._map || this._map._animatingZoom) {
            return;
          }
          if (this._containsPoint(e.layerPoint)) {
            this._ctx.canvas.style.cursor = "pointer";
            this._mouseInside = true;
            this.fire("mouseover", e);
          } else if (this._mouseInside) {
            this._ctx.canvas.style.cursor = "";
            this._mouseInside = false;
            this.fire("mouseout", e);
          }
        },
      });
L.Map.include(
  (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas
    ? {}
    : {
        _initPathRoot: function() {
          var root = this._pathRoot,
            ctx;
          if (!root) {
            root = this._pathRoot = document.createElement("canvas");
            root.style.position = "absolute";
            ctx = this._canvasCtx = root.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            this._panes.overlayPane.appendChild(root);
            if (this.options.zoomAnimation) {
              this._pathRoot.className = "leaflet-zoom-animated";
              this.on("zoomanim", this._animatePathZoom);
              this.on("zoomend", this._endPathZoom);
            }
            this.on("moveend", this._updateCanvasViewport);
            this._updateCanvasViewport();
          }
        },
        _updateCanvasViewport: function() {
          if (this._pathZooming) {
            return;
          }
          this._updatePathViewport();
          var vp = this._pathViewport,
            min = vp.min,
            size = vp.max.subtract(min),
            root = this._pathRoot;
          L.DomUtil.setPosition(root, min);
          root.width = size.x;
          root.height = size.y;
          root.getContext("2d").translate(-min.x, -min.y);
        },
      }
);
L.LineUtil = {
  simplify: function(points, tolerance) {
    if (!tolerance || !points.length) {
      return points.slice();
    }
    var sqTolerance = tolerance * tolerance;
    points = this._reducePoints(points, sqTolerance);
    points = this._simplifyDP(points, sqTolerance);
    return points;
  },
  pointToSegmentDistance: function(p, p1, p2) {
    return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
  },
  closestPointOnSegment: function(p, p1, p2) {
    return this._sqClosestPointOnSegment(p, p1, p2);
  },
  _simplifyDP: function(points, sqTolerance) {
    var len = points.length,
      ArrayConstructor =
        typeof Uint8Array !== undefined + "" ? Uint8Array : Array,
      markers = new ArrayConstructor(len);
    markers[0] = markers[len - 1] = 1;
    this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
    var i,
      newPoints = [];
    for (i = 0; i < len; i++) {
      if (markers[i]) {
        newPoints.push(points[i]);
      }
    }
    return newPoints;
  },
  _simplifyDPStep: function(points, markers, sqTolerance, first, last) {
    var maxSqDist = 0,
      index,
      i,
      sqDist;
    for (i = first + 1; i <= last - 1; i++) {
      sqDist = this._sqClosestPointOnSegment(
        points[i],
        points[first],
        points[last],
        true
      );
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    if (maxSqDist > sqTolerance) {
      markers[index] = 1;
      this._simplifyDPStep(points, markers, sqTolerance, first, index);
      this._simplifyDPStep(points, markers, sqTolerance, index, last);
    }
  },
  _reducePoints: function(points, sqTolerance) {
    var reducedPoints = [points[0]];
    for (var i = 1, prev = 0, len = points.length; i < len; i++) {
      if (this._sqDist(points[i], points[prev]) > sqTolerance) {
        reducedPoints.push(points[i]);
        prev = i;
      }
    }
    if (prev < len - 1) {
      reducedPoints.push(points[len - 1]);
    }
    return reducedPoints;
  },
  clipSegment: function(a, b, bounds, useLastCode) {
    var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
      codeB = this._getBitCode(b, bounds),
      codeOut,
      p,
      newCode;
    this._lastCode = codeB;
    while (true) {
      if (!(codeA | codeB)) {
        return [a, b];
      } else if (codeA & codeB) {
        return false;
      } else {
        codeOut = codeA || codeB;
        p = this._getEdgeIntersection(a, b, codeOut, bounds);
        newCode = this._getBitCode(p, bounds);
        if (codeOut === codeA) {
          a = p;
          codeA = newCode;
        } else {
          b = p;
          codeB = newCode;
        }
      }
    }
  },
  _getEdgeIntersection: function(a, b, code, bounds) {
    var dx = b.x - a.x,
      dy = b.y - a.y,
      min = bounds.min,
      max = bounds.max;
    if (code & 8) {
      return new L.Point(a.x + (dx * (max.y - a.y)) / dy, max.y);
    } else if (code & 4) {
      return new L.Point(a.x + (dx * (min.y - a.y)) / dy, min.y);
    } else if (code & 2) {
      return new L.Point(max.x, a.y + (dy * (max.x - a.x)) / dx);
    } else if (code & 1) {
      return new L.Point(min.x, a.y + (dy * (min.x - a.x)) / dx);
    }
  },
  _getBitCode: function(p, bounds) {
    var code = 0;
    if (p.x < bounds.min.x) {
      code |= 1;
    } else if (p.x > bounds.max.x) {
      code |= 2;
    }
    if (p.y < bounds.min.y) {
      code |= 4;
    } else if (p.y > bounds.max.y) {
      code |= 8;
    }
    return code;
  },
  _sqDist: function(p1, p2) {
    var dx = p2.x - p1.x,
      dy = p2.y - p1.y;
    return dx * dx + dy * dy;
  },
  _sqClosestPointOnSegment: function(p, p1, p2, sqDist) {
    var x = p1.x,
      y = p1.y,
      dx = p2.x - x,
      dy = p2.y - y,
      dot = dx * dx + dy * dy,
      t;
    if (dot > 0) {
      t = ((p.x - x) * dx + (p.y - y) * dy) / dot;
      if (t > 1) {
        x = p2.x;
        y = p2.y;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p.x - x;
    dy = p.y - y;
    return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
  },
};
L.Polyline = L.Path.extend({
  initialize: function(latlngs, options) {
    L.Path.prototype.initialize.call(this, options);
    this._latlngs = this._convertLatLngs(latlngs);
  },
  options: { smoothFactor: 1, noClip: false },
  projectLatlngs: function() {
    this._originalPoints = [];
    for (var i = 0, len = this._latlngs.length; i < len; i++) {
      this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
    }
  },
  getPathString: function() {
    for (var i = 0, len = this._parts.length, str = ""; i < len; i++) {
      str += this._getPathPartStr(this._parts[i]);
    }
    return str;
  },
  getLatLngs: function() {
    return this._latlngs;
  },
  setLatLngs: function(latlngs) {
    this._latlngs = this._convertLatLngs(latlngs);
    return this.redraw();
  },
  addLatLng: function(latlng) {
    this._latlngs.push(L.latLng(latlng));
    return this.redraw();
  },
  spliceLatLngs: function() {
    var removed = [].splice.apply(this._latlngs, arguments);
    this._convertLatLngs(this._latlngs, true);
    this.redraw();
    return removed;
  },
  closestLayerPoint: function(p) {
    var minDistance = Infinity,
      parts = this._parts,
      p1,
      p2,
      minPoint = null;
    for (var j = 0, jLen = parts.length; j < jLen; j++) {
      var points = parts[j];
      for (var i = 1, len = points.length; i < len; i++) {
        p1 = points[i - 1];
        p2 = points[i];
        var sqDist = L.LineUtil._sqClosestPointOnSegment(p, p1, p2, true);
        if (sqDist < minDistance) {
          minDistance = sqDist;
          minPoint = L.LineUtil._sqClosestPointOnSegment(p, p1, p2);
        }
      }
    }
    if (minPoint) {
      minPoint.distance = Math.sqrt(minDistance);
    }
    return minPoint;
  },
  getBounds: function() {
    return new L.LatLngBounds(this.getLatLngs());
  },
  _convertLatLngs: function(latlngs, overwrite) {
    var i,
      len,
      target = overwrite ? latlngs : [];
    for (i = 0, len = latlngs.length; i < len; i++) {
      if (L.Util.isArray(latlngs[i]) && typeof latlngs[i][0] !== "number") {
        return;
      }
      target[i] = L.latLng(latlngs[i]);
    }
    return target;
  },
  _initEvents: function() {
    L.Path.prototype._initEvents.call(this);
  },
  _getPathPartStr: function(points) {
    var round = L.Path.VML;
    for (var j = 0, len2 = points.length, str = "", p; j < len2; j++) {
      p = points[j];
      if (round) {
        p._round();
      }
      str += (j ? "L" : "M") + p.x + " " + p.y;
    }
    return str;
  },
  _clipPoints: function() {
    var points = this._originalPoints,
      len = points.length,
      i,
      k,
      segment;
    if (this.options.noClip) {
      this._parts = [points];
      return;
    }
    this._parts = [];
    var parts = this._parts,
      vp = this._map._pathViewport,
      lu = L.LineUtil;
    for (i = 0, k = 0; i < len - 1; i++) {
      segment = lu.clipSegment(points[i], points[i + 1], vp, i);
      if (!segment) {
        continue;
      }
      parts[k] = parts[k] || [];
      parts[k].push(segment[0]);
      if (segment[1] !== points[i + 1] || i === len - 2) {
        parts[k].push(segment[1]);
        k++;
      }
    }
  },
  _simplifyPoints: function() {
    var parts = this._parts,
      lu = L.LineUtil;
    for (var i = 0, len = parts.length; i < len; i++) {
      parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
    }
  },
  _updatePath: function() {
    if (!this._map) {
      return;
    }
    this._clipPoints();
    this._simplifyPoints();
    L.Path.prototype._updatePath.call(this);
  },
});
L.polyline = function(latlngs, options) {
  return new L.Polyline(latlngs, options);
};
L.PolyUtil = {};
L.PolyUtil.clipPolygon = function(points, bounds) {
  var clippedPoints,
    edges = [1, 4, 2, 8],
    i,
    j,
    k,
    a,
    b,
    len,
    edge,
    p,
    lu = L.LineUtil;
  for (i = 0, len = points.length; i < len; i++) {
    points[i]._code = lu._getBitCode(points[i], bounds);
  }
  for (k = 0; k < 4; k++) {
    edge = edges[k];
    clippedPoints = [];
    for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
      a = points[i];
      b = points[j];
      if (!(a._code & edge)) {
        if (b._code & edge) {
          p = lu._getEdgeIntersection(b, a, edge, bounds);
          p._code = lu._getBitCode(p, bounds);
          clippedPoints.push(p);
        }
        clippedPoints.push(a);
      } else if (!(b._code & edge)) {
        p = lu._getEdgeIntersection(b, a, edge, bounds);
        p._code = lu._getBitCode(p, bounds);
        clippedPoints.push(p);
      }
    }
    points = clippedPoints;
  }
  return points;
};
L.Polygon = L.Polyline.extend({
  options: { fill: true },
  initialize: function(latlngs, options) {
    L.Polyline.prototype.initialize.call(this, latlngs, options);
    this._initWithHoles(latlngs);
  },
  _initWithHoles: function(latlngs) {
    var i, len, hole;
    if (
      latlngs &&
      L.Util.isArray(latlngs[0]) &&
      typeof latlngs[0][0] !== "number"
    ) {
      this._latlngs = this._convertLatLngs(latlngs[0]);
      this._holes = latlngs.slice(1);
      for (i = 0, len = this._holes.length; i < len; i++) {
        hole = this._holes[i] = this._convertLatLngs(this._holes[i]);
        if (hole[0].equals(hole[hole.length - 1])) {
          hole.pop();
        }
      }
    }
    latlngs = this._latlngs;
    if (latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1])) {
      latlngs.pop();
    }
  },
  projectLatlngs: function() {
    L.Polyline.prototype.projectLatlngs.call(this);
    this._holePoints = [];
    if (!this._holes) {
      return;
    }
    var i, j, len, len2;
    for (i = 0, len = this._holes.length; i < len; i++) {
      this._holePoints[i] = [];
      for (j = 0, len2 = this._holes[i].length; j < len2; j++) {
        this._holePoints[i][j] = this._map.latLngToLayerPoint(
          this._holes[i][j]
        );
      }
    }
  },
  setLatLngs: function(latlngs) {
    if (
      latlngs &&
      L.Util.isArray(latlngs[0]) &&
      typeof latlngs[0][0] !== "number"
    ) {
      this._initWithHoles(latlngs);
      return this.redraw();
    } else {
      return L.Polyline.prototype.setLatLngs.call(this, latlngs);
    }
  },
  _clipPoints: function() {
    var points = this._originalPoints,
      newParts = [];
    this._parts = [points].concat(this._holePoints);
    if (this.options.noClip) {
      return;
    }
    for (var i = 0, len = this._parts.length; i < len; i++) {
      var clipped = L.PolyUtil.clipPolygon(
        this._parts[i],
        this._map._pathViewport
      );
      if (clipped.length) {
        newParts.push(clipped);
      }
    }
    this._parts = newParts;
  },
  _getPathPartStr: function(points) {
    var str = L.Polyline.prototype._getPathPartStr.call(this, points);
    return str + (L.Browser.svg ? "z" : "x");
  },
});
L.polygon = function(latlngs, options) {
  return new L.Polygon(latlngs, options);
};
(function() {
  function createMulti(Klass) {
    return L.FeatureGroup.extend({
      initialize: function(latlngs, options) {
        this._layers = {};
        this._options = options;
        this.setLatLngs(latlngs);
      },
      setLatLngs: function(latlngs) {
        var i = 0,
          len = latlngs.length;
        this.eachLayer(function(layer) {
          if (i < len) {
            layer.setLatLngs(latlngs[i++]);
          } else {
            this.removeLayer(layer);
          }
        }, this);
        while (i < len) {
          this.addLayer(new Klass(latlngs[i++], this._options));
        }
        return this;
      },
      getLatLngs: function() {
        var latlngs = [];
        this.eachLayer(function(layer) {
          latlngs.push(layer.getLatLngs());
        });
        return latlngs;
      },
    });
  }
  L.MultiPolyline = createMulti(L.Polyline);
  L.MultiPolygon = createMulti(L.Polygon);
  L.multiPolyline = function(latlngs, options) {
    return new L.MultiPolyline(latlngs, options);
  };
  L.multiPolygon = function(latlngs, options) {
    return new L.MultiPolygon(latlngs, options);
  };
})();
L.Rectangle = L.Polygon.extend({
  initialize: function(latLngBounds, options) {
    L.Polygon.prototype.initialize.call(
      this,
      this._boundsToLatLngs(latLngBounds),
      options
    );
  },
  setBounds: function(latLngBounds) {
    this.setLatLngs(this._boundsToLatLngs(latLngBounds));
  },
  _boundsToLatLngs: function(latLngBounds) {
    latLngBounds = L.latLngBounds(latLngBounds);
    return [
      latLngBounds.getSouthWest(),
      latLngBounds.getNorthWest(),
      latLngBounds.getNorthEast(),
      latLngBounds.getSouthEast(),
    ];
  },
});
L.rectangle = function(latLngBounds, options) {
  return new L.Rectangle(latLngBounds, options);
};
L.Circle = L.Path.extend({
  initialize: function(latlng, radius, options) {
    L.Path.prototype.initialize.call(this, options);
    this._latlng = L.latLng(latlng);
    this._mRadius = radius;
  },
  options: { fill: true },
  setLatLng: function(latlng) {
    this._latlng = L.latLng(latlng);
    return this.redraw();
  },
  setRadius: function(radius) {
    this._mRadius = radius;
    return this.redraw();
  },
  projectLatlngs: function() {
    var lngRadius = this._getLngRadius(),
      latlng = this._latlng,
      pointLeft = this._map.latLngToLayerPoint([
        latlng.lat,
        latlng.lng - lngRadius,
      ]);
    this._point = this._map.latLngToLayerPoint(latlng);
    this._radius = Math.max(this._point.x - pointLeft.x, 1);
  },
  getBounds: function() {
    var lngRadius = this._getLngRadius(),
      latRadius = (this._mRadius / 40075017) * 360,
      latlng = this._latlng;
    return new L.LatLngBounds(
      [latlng.lat - latRadius, latlng.lng - lngRadius],
      [latlng.lat + latRadius, latlng.lng + lngRadius]
    );
  },
  getLatLng: function() {
    return this._latlng;
  },
  getPathString: function() {
    var p = this._point,
      r = this._radius;
    if (this._checkIfEmpty()) {
      return "";
    }
    if (L.Browser.svg) {
      return (
        "M" +
        p.x +
        "," +
        (p.y - r) +
        "A" +
        r +
        "," +
        r +
        ",0,1,1," +
        (p.x - 0.1) +
        "," +
        (p.y - r) +
        " z"
      );
    } else {
      p._round();
      r = Math.round(r);
      return "AL " + p.x + "," + p.y + " " + r + "," + r + " 0," + 65535 * 360;
    }
  },
  getRadius: function() {
    return this._mRadius;
  },
  _getLatRadius: function() {
    return (this._mRadius / 40075017) * 360;
  },
  _getLngRadius: function() {
    return (
      this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat)
    );
  },
  _checkIfEmpty: function() {
    if (!this._map) {
      return false;
    }
    var vp = this._map._pathViewport,
      r = this._radius,
      p = this._point;
    return (
      p.x - r > vp.max.x ||
      p.y - r > vp.max.y ||
      p.x + r < vp.min.x ||
      p.y + r < vp.min.y
    );
  },
});
L.circle = function(latlng, radius, options) {
  return new L.Circle(latlng, radius, options);
};
L.CircleMarker = L.Circle.extend({
  options: { radius: 10, weight: 2 },
  initialize: function(latlng, options) {
    L.Circle.prototype.initialize.call(this, latlng, null, options);
    this._radius = this.options.radius;
  },
  projectLatlngs: function() {
    this._point = this._map.latLngToLayerPoint(this._latlng);
  },
  _updateStyle: function() {
    L.Circle.prototype._updateStyle.call(this);
    this.setRadius(this.options.radius);
  },
  setLatLng: function(latlng) {
    L.Circle.prototype.setLatLng.call(this, latlng);
    if (this._popup && this._popup._isOpen) {
      this._popup.setLatLng(latlng);
    }
    return this;
  },
  setRadius: function(radius) {
    this.options.radius = this._radius = radius;
    return this.redraw();
  },
  getRadius: function() {
    return this._radius;
  },
});
L.circleMarker = function(latlng, options) {
  return new L.CircleMarker(latlng, options);
};
L.Polyline.include(
  !L.Path.CANVAS
    ? {}
    : {
        _containsPoint: function(p, closed) {
          var i,
            j,
            k,
            len,
            len2,
            dist,
            part,
            w = this.options.weight / 2;
          if (L.Browser.touch) {
            w += 10;
          }
          for (i = 0, len = this._parts.length; i < len; i++) {
            part = this._parts[i];
            for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
              if (!closed && j === 0) {
                continue;
              }
              dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);
              if (dist <= w) {
                return true;
              }
            }
          }
          return false;
        },
      }
);
L.Map.mergeOptions({
  dragging: true,
  inertia: !L.Browser.android23,
  inertiaDeceleration: 3400,
  inertiaMaxSpeed: Infinity,
  inertiaThreshold: L.Browser.touch ? 32 : 18,
  easeLinearity: 0.25,
  worldCopyJump: false,
});
L.Map.Drag = L.Handler.extend({
  addHooks: function() {
    if (!this._draggable) {
      var map = this._map;
      this._draggable = new L.Draggable(map._mapPane, map._container);
      this._draggable.on(
        {
          dragstart: this._onDragStart,
          drag: this._onDrag,
          dragend: this._onDragEnd,
        },
        this
      );
      if (map.options.worldCopyJump) {
        this._draggable.on("predrag", this._onPreDrag, this);
        map.on("viewreset", this._onViewReset, this);
        map.whenReady(this._onViewReset, this);
      }
    }
    this._draggable.enable();
  },
  removeHooks: function() {
    this._draggable.disable();
  },
  moved: function() {
    return this._draggable && this._draggable._moved;
  },
  _onDragStart: function() {
    var map = this._map;
    if (map._panAnim) {
      map._panAnim.stop();
    }
    map.fire("movestart").fire("dragstart");
    if (map.options.inertia) {
      this._positions = [];
      this._times = [];
    }
  },
  _onDrag: function() {
    if (this._map.options.inertia) {
      var time = (this._lastTime = +new Date()),
        pos = (this._lastPos = this._draggable._newPos);
      this._positions.push(pos);
      this._times.push(time);
      if (time - this._times[0] > 200) {
        this._positions.shift();
        this._times.shift();
      }
    }
    this._map.fire("move").fire("drag");
  },
  _onViewReset: function() {
    var pxCenter = this._map.getSize()._divideBy(2),
      pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
    this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
    this._worldWidth = this._map.project([0, 180]).x;
  },
  _onPreDrag: function() {
    var worldWidth = this._worldWidth,
      halfWidth = Math.round(worldWidth / 2),
      dx = this._initialWorldOffset,
      x = this._draggable._newPos.x,
      newX1 = ((x - halfWidth + dx) % worldWidth) + halfWidth - dx,
      newX2 = ((x + halfWidth + dx) % worldWidth) - halfWidth - dx,
      newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
    this._draggable._newPos.x = newX;
  },
  _onDragEnd: function(e) {
    var map = this._map,
      options = map.options,
      delay = +new Date() - this._lastTime,
      noInertia =
        !options.inertia ||
        delay > options.inertiaThreshold ||
        !this._positions[0];
    map.fire("dragend", e);
    if (noInertia) {
      map.fire("moveend");
    } else {
      var direction = this._lastPos.subtract(this._positions[0]),
        duration = (this._lastTime + delay - this._times[0]) / 1e3,
        ease = options.easeLinearity,
        speedVector = direction.multiplyBy(ease / duration),
        speed = speedVector.distanceTo([0, 0]),
        limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
        limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),
        decelerationDuration =
          limitedSpeed / (options.inertiaDeceleration * ease),
        offset = limitedSpeedVector
          .multiplyBy(-decelerationDuration / 2)
          .round();
      if (!offset.x || !offset.y) {
        map.fire("moveend");
      } else {
        offset = map._limitOffset(offset, map.options.maxBounds);
        L.Util.requestAnimFrame(function() {
          map.panBy(offset, {
            duration: decelerationDuration,
            easeLinearity: ease,
            noMoveStart: true,
          });
        });
      }
    }
  },
});
L.Map.addInitHook("addHandler", "dragging", L.Map.Drag);
L.Map.mergeOptions({ doubleClickZoom: true });
L.Map.DoubleClickZoom = L.Handler.extend({
  addHooks: function() {
    this._map.on("dblclick", this._onDoubleClick, this);
  },
  removeHooks: function() {
    this._map.off("dblclick", this._onDoubleClick, this);
  },
  _onDoubleClick: function(e) {
    var map = this._map,
      zoom = map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1);
    if (map.options.doubleClickZoom === "center") {
      map.setZoom(zoom);
    } else {
      map.setZoomAround(e.containerPoint, zoom);
    }
  },
});
L.Map.addInitHook("addHandler", "doubleClickZoom", L.Map.DoubleClickZoom);
L.Map.mergeOptions({ scrollWheelZoom: true });
L.Map.ScrollWheelZoom = L.Handler.extend({
  addHooks: function() {
    L.DomEvent.on(
      this._map._container,
      "mousewheel",
      this._onWheelScroll,
      this
    );
    L.DomEvent.on(
      this._map._container,
      "MozMousePixelScroll",
      L.DomEvent.preventDefault
    );
    this._delta = 0;
  },
  removeHooks: function() {
    L.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll);
    L.DomEvent.off(
      this._map._container,
      "MozMousePixelScroll",
      L.DomEvent.preventDefault
    );
  },
  _onWheelScroll: function(e) {
    var delta = L.DomEvent.getWheelDelta(e);
    this._delta += delta;
    this._lastMousePos = this._map.mouseEventToContainerPoint(e);
    if (!this._startTime) {
      this._startTime = +new Date();
    }
    var left = Math.max(40 - (+new Date() - this._startTime), 0);
    clearTimeout(this._timer);
    this._timer = setTimeout(L.bind(this._performZoom, this), left);
    L.DomEvent.preventDefault(e);
    L.DomEvent.stopPropagation(e);
  },
  _performZoom: function() {
    var map = this._map,
      delta = this._delta,
      zoom = map.getZoom();
    delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
    delta = Math.max(Math.min(delta, 4), -4);
    delta = map._limitZoom(zoom + delta) - zoom;
    this._delta = 0;
    this._startTime = null;
    if (!delta) {
      return;
    }
    if (map.options.scrollWheelZoom === "center") {
      map.setZoom(zoom + delta);
    } else {
      map.setZoomAround(this._lastMousePos, zoom + delta);
    }
  },
});
L.Map.addInitHook("addHandler", "scrollWheelZoom", L.Map.ScrollWheelZoom);
L.extend(L.DomEvent, {
  _touchstart: L.Browser.msPointer
    ? "MSPointerDown"
    : L.Browser.pointer
    ? "pointerdown"
    : "touchstart",
  _touchend: L.Browser.msPointer
    ? "MSPointerUp"
    : L.Browser.pointer
    ? "pointerup"
    : "touchend",
  addDoubleTapListener: function(obj, handler, id) {
    var last,
      doubleTap = false,
      delay = 250,
      touch,
      pre = "_leaflet_",
      touchstart = this._touchstart,
      touchend = this._touchend,
      trackedTouches = [];
    function onTouchStart(e) {
      var count;
      if (L.Browser.pointer) {
        trackedTouches.push(e.pointerId);
        count = trackedTouches.length;
      } else {
        count = e.touches.length;
      }
      if (count > 1) {
        return;
      }
      var now = Date.now(),
        delta = now - (last || now);
      touch = e.touches ? e.touches[0] : e;
      doubleTap = delta > 0 && delta <= delay;
      last = now;
    }
    function onTouchEnd(e) {
      if (L.Browser.pointer) {
        var idx = trackedTouches.indexOf(e.pointerId);
        if (idx === -1) {
          return;
        }
        trackedTouches.splice(idx, 1);
      }
      if (doubleTap) {
        if (L.Browser.pointer) {
          var newTouch = {},
            prop;
          for (var i in touch) {
            prop = touch[i];
            if (typeof prop === "function") {
              newTouch[i] = prop.bind(touch);
            } else {
              newTouch[i] = prop;
            }
          }
          touch = newTouch;
        }
        touch.type = "dblclick";
        handler(touch);
        last = null;
      }
    }
    obj[pre + touchstart + id] = onTouchStart;
    obj[pre + touchend + id] = onTouchEnd;
    var endElement = L.Browser.pointer ? document.documentElement : obj;
    obj.addEventListener(touchstart, onTouchStart, false);
    endElement.addEventListener(touchend, onTouchEnd, false);
    if (L.Browser.pointer) {
      endElement.addEventListener(L.DomEvent.POINTER_CANCEL, onTouchEnd, false);
    }
    return this;
  },
  removeDoubleTapListener: function(obj, id) {
    var pre = "_leaflet_";
    obj.removeEventListener(
      this._touchstart,
      obj[pre + this._touchstart + id],
      false
    );
    (L.Browser.pointer ? document.documentElement : obj).removeEventListener(
      this._touchend,
      obj[pre + this._touchend + id],
      false
    );
    if (L.Browser.pointer) {
      document.documentElement.removeEventListener(
        L.DomEvent.POINTER_CANCEL,
        obj[pre + this._touchend + id],
        false
      );
    }
    return this;
  },
});
L.extend(L.DomEvent, {
  POINTER_DOWN: L.Browser.msPointer ? "MSPointerDown" : "pointerdown",
  POINTER_MOVE: L.Browser.msPointer ? "MSPointerMove" : "pointermove",
  POINTER_UP: L.Browser.msPointer ? "MSPointerUp" : "pointerup",
  POINTER_CANCEL: L.Browser.msPointer ? "MSPointerCancel" : "pointercancel",
  _pointers: [],
  _pointerDocumentListener: false,
  addPointerListener: function(obj, type, handler, id) {
    switch (type) {
      case "touchstart":
        return this.addPointerListenerStart(obj, type, handler, id);
      case "touchend":
        return this.addPointerListenerEnd(obj, type, handler, id);
      case "touchmove":
        return this.addPointerListenerMove(obj, type, handler, id);
      default:
        throw "Unknown touch event type";
    }
  },
  addPointerListenerStart: function(obj, type, handler, id) {
    var pre = "_leaflet_",
      pointers = this._pointers;
    var cb = function(e) {
      L.DomEvent.preventDefault(e);
      var alreadyInArray = false;
      for (var i = 0; i < pointers.length; i++) {
        if (pointers[i].pointerId === e.pointerId) {
          alreadyInArray = true;
          break;
        }
      }
      if (!alreadyInArray) {
        pointers.push(e);
      }
      e.touches = pointers.slice();
      e.changedTouches = [e];
      handler(e);
    };
    obj[pre + "touchstart" + id] = cb;
    obj.addEventListener(this.POINTER_DOWN, cb, false);
    if (!this._pointerDocumentListener) {
      var internalCb = function(e) {
        for (var i = 0; i < pointers.length; i++) {
          if (pointers[i].pointerId === e.pointerId) {
            pointers.splice(i, 1);
            break;
          }
        }
      };
      document.documentElement.addEventListener(
        this.POINTER_UP,
        internalCb,
        false
      );
      document.documentElement.addEventListener(
        this.POINTER_CANCEL,
        internalCb,
        false
      );
      this._pointerDocumentListener = true;
    }
    return this;
  },
  addPointerListenerMove: function(obj, type, handler, id) {
    var pre = "_leaflet_",
      touches = this._pointers;
    function cb(e) {
      if (
        (e.pointerType === e.MSPOINTER_TYPE_MOUSE ||
          e.pointerType === "mouse") &&
        e.buttons === 0
      ) {
        return;
      }
      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pointerId === e.pointerId) {
          touches[i] = e;
          break;
        }
      }
      e.touches = touches.slice();
      e.changedTouches = [e];
      handler(e);
    }
    obj[pre + "touchmove" + id] = cb;
    obj.addEventListener(this.POINTER_MOVE, cb, false);
    return this;
  },
  addPointerListenerEnd: function(obj, type, handler, id) {
    var pre = "_leaflet_",
      touches = this._pointers;
    var cb = function(e) {
      for (var i = 0; i < touches.length; i++) {
        if (touches[i].pointerId === e.pointerId) {
          touches.splice(i, 1);
          break;
        }
      }
      e.touches = touches.slice();
      e.changedTouches = [e];
      handler(e);
    };
    obj[pre + "touchend" + id] = cb;
    obj.addEventListener(this.POINTER_UP, cb, false);
    obj.addEventListener(this.POINTER_CANCEL, cb, false);
    return this;
  },
  removePointerListener: function(obj, type, id) {
    var pre = "_leaflet_",
      cb = obj[pre + type + id];
    switch (type) {
      case "touchstart":
        obj.removeEventListener(this.POINTER_DOWN, cb, false);
        break;
      case "touchmove":
        obj.removeEventListener(this.POINTER_MOVE, cb, false);
        break;
      case "touchend":
        obj.removeEventListener(this.POINTER_UP, cb, false);
        obj.removeEventListener(this.POINTER_CANCEL, cb, false);
        break;
    }
    return this;
  },
});
L.Map.mergeOptions({
  touchZoom: L.Browser.touch && !L.Browser.android23,
  bounceAtZoomLimits: true,
});
L.Map.TouchZoom = L.Handler.extend({
  addHooks: function() {
    L.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this);
  },
  removeHooks: function() {
    L.DomEvent.off(
      this._map._container,
      "touchstart",
      this._onTouchStart,
      this
    );
  },
  _onTouchStart: function(e) {
    var map = this._map;
    if (
      !e.touches ||
      e.touches.length !== 2 ||
      map._animatingZoom ||
      this._zooming
    ) {
      return;
    }
    var p1 = map.mouseEventToLayerPoint(e.touches[0]),
      p2 = map.mouseEventToLayerPoint(e.touches[1]),
      viewCenter = map._getCenterLayerPoint();
    this._startCenter = p1.add(p2)._divideBy(2);
    this._startDist = p1.distanceTo(p2);
    this._moved = false;
    this._zooming = true;
    this._centerOffset = viewCenter.subtract(this._startCenter);
    if (map._panAnim) {
      map._panAnim.stop();
    }
    L.DomEvent.on(document, "touchmove", this._onTouchMove, this).on(
      document,
      "touchend",
      this._onTouchEnd,
      this
    );
    L.DomEvent.preventDefault(e);
  },
  _onTouchMove: function(e) {
    var map = this._map;
    if (!e.touches || e.touches.length !== 2 || !this._zooming) {
      return;
    }
    var p1 = map.mouseEventToLayerPoint(e.touches[0]),
      p2 = map.mouseEventToLayerPoint(e.touches[1]);
    this._scale = p1.distanceTo(p2) / this._startDist;
    this._delta = p1
      ._add(p2)
      ._divideBy(2)
      ._subtract(this._startCenter);
    if (this._scale === 1) {
      return;
    }
    if (!map.options.bounceAtZoomLimits) {
      if (
        (map.getZoom() === map.getMinZoom() && this._scale < 1) ||
        (map.getZoom() === map.getMaxZoom() && this._scale > 1)
      ) {
        return;
      }
    }
    if (!this._moved) {
      L.DomUtil.addClass(map._mapPane, "leaflet-touching");
      map.fire("movestart").fire("zoomstart");
      this._moved = true;
    }
    L.Util.cancelAnimFrame(this._animRequest);
    this._animRequest = L.Util.requestAnimFrame(
      this._updateOnMove,
      this,
      true,
      this._map._container
    );
    L.DomEvent.preventDefault(e);
  },
  _updateOnMove: function() {
    var map = this._map,
      origin = this._getScaleOrigin(),
      center = map.layerPointToLatLng(origin),
      zoom = map.getScaleZoom(this._scale);
    map._animateZoom(center, zoom, this._startCenter, this._scale, this._delta);
  },
  _onTouchEnd: function() {
    if (!this._moved || !this._zooming) {
      this._zooming = false;
      return;
    }
    var map = this._map;
    this._zooming = false;
    L.DomUtil.removeClass(map._mapPane, "leaflet-touching");
    L.Util.cancelAnimFrame(this._animRequest);
    L.DomEvent.off(document, "touchmove", this._onTouchMove).off(
      document,
      "touchend",
      this._onTouchEnd
    );
    var origin = this._getScaleOrigin(),
      center = map.layerPointToLatLng(origin),
      oldZoom = map.getZoom(),
      floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
      roundZoomDelta =
        floatZoomDelta > 0
          ? Math.ceil(floatZoomDelta)
          : Math.floor(floatZoomDelta),
      zoom = map._limitZoom(oldZoom + roundZoomDelta),
      scale = map.getZoomScale(zoom) / this._scale;
    map._animateZoom(center, zoom, origin, scale);
  },
  _getScaleOrigin: function() {
    var centerOffset = this._centerOffset
      .subtract(this._delta)
      .divideBy(this._scale);
    return this._startCenter.add(centerOffset);
  },
});
L.Map.addInitHook("addHandler", "touchZoom", L.Map.TouchZoom);
L.Map.mergeOptions({ tap: true, tapTolerance: 15 });
L.Map.Tap = L.Handler.extend({
  addHooks: function() {
    L.DomEvent.on(this._map._container, "touchstart", this._onDown, this);
  },
  removeHooks: function() {
    L.DomEvent.off(this._map._container, "touchstart", this._onDown, this);
  },
  _onDown: function(e) {
    if (!e.touches) {
      return;
    }
    L.DomEvent.preventDefault(e);
    this._fireClick = true;
    if (e.touches.length > 1) {
      this._fireClick = false;
      clearTimeout(this._holdTimeout);
      return;
    }
    var first = e.touches[0],
      el = first.target;
    this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);
    if (el.tagName && el.tagName.toLowerCase() === "a") {
      L.DomUtil.addClass(el, "leaflet-active");
    }
    this._holdTimeout = setTimeout(
      L.bind(function() {
        if (this._isTapValid()) {
          this._fireClick = false;
          this._onUp();
          this._simulateEvent("contextmenu", first);
        }
      }, this),
      1e3
    );
    L.DomEvent.on(document, "touchmove", this._onMove, this).on(
      document,
      "touchend",
      this._onUp,
      this
    );
  },
  _onUp: function(e) {
    clearTimeout(this._holdTimeout);
    L.DomEvent.off(document, "touchmove", this._onMove, this).off(
      document,
      "touchend",
      this._onUp,
      this
    );
    if (this._fireClick && e && e.changedTouches) {
      var first = e.changedTouches[0],
        el = first.target;
      if (el && el.tagName && el.tagName.toLowerCase() === "a") {
        L.DomUtil.removeClass(el, "leaflet-active");
      }
      if (this._isTapValid()) {
        this._simulateEvent("click", first);
      }
    }
  },
  _isTapValid: function() {
    return (
      this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance
    );
  },
  _onMove: function(e) {
    var first = e.touches[0];
    this._newPos = new L.Point(first.clientX, first.clientY);
  },
  _simulateEvent: function(type, e) {
    var simulatedEvent = document.createEvent("MouseEvents");
    simulatedEvent._simulated = true;
    e.target._simulatedClick = true;
    simulatedEvent.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      e.screenX,
      e.screenY,
      e.clientX,
      e.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    e.target.dispatchEvent(simulatedEvent);
  },
});
if (L.Browser.touch && !L.Browser.pointer) {
  L.Map.addInitHook("addHandler", "tap", L.Map.Tap);
}
L.Control.Zoom = L.Control.extend({
  options: {
    position: "topleft",
    zoomInText: "+",
    zoomInTitle: "Zoom in",
    zoomOutText: "-",
    zoomOutTitle: "Zoom out",
  },
  onAdd: function(map) {
    var zoomName = "leaflet-control-zoom",
      container = L.DomUtil.create("div", zoomName + " leaflet-bar");
    this._map = map;
    this._zoomInButton = this._createButton(
      this.options.zoomInText,
      this.options.zoomInTitle,
      zoomName + "-in",
      container,
      this._zoomIn,
      this
    );
    this._zoomOutButton = this._createButton(
      this.options.zoomOutText,
      this.options.zoomOutTitle,
      zoomName + "-out",
      container,
      this._zoomOut,
      this
    );
    this._updateDisabled();
    map.on("zoomend zoomlevelschange", this._updateDisabled, this);
    return container;
  },
  onRemove: function(map) {
    map.off("zoomend zoomlevelschange", this._updateDisabled, this);
  },
  _zoomIn: function(e) {
    this._map.zoomIn(e.shiftKey ? 3 : 1);
  },
  _zoomOut: function(e) {
    this._map.zoomOut(e.shiftKey ? 3 : 1);
  },
  _createButton: function(html, title, className, container, fn, context) {
    var link = L.DomUtil.create("a", className, container);
    link.innerHTML = html;
    link.href = "#";
    link.title = title;
    var stop = L.DomEvent.stopPropagation;
    L.DomEvent.on(link, "click", stop)
      .on(link, "mousedown", stop)
      .on(link, "dblclick", stop)
      .on(link, "click", L.DomEvent.preventDefault)
      .on(link, "click", fn, context)
      .on(link, "click", this._refocusOnMap, context);
    return link;
  },
  _updateDisabled: function() {
    var map = this._map,
      className = "leaflet-disabled";
    L.DomUtil.removeClass(this._zoomInButton, className);
    L.DomUtil.removeClass(this._zoomOutButton, className);
    if (map._zoom === map.getMinZoom()) {
      L.DomUtil.addClass(this._zoomOutButton, className);
    }
    if (map._zoom === map.getMaxZoom()) {
      L.DomUtil.addClass(this._zoomInButton, className);
    }
  },
});
L.Map.mergeOptions({ zoomControl: true });
L.Map.addInitHook(function() {
  if (this.options.zoomControl) {
    this.zoomControl = new L.Control.Zoom();
    this.addControl(this.zoomControl);
  }
});
L.control.zoom = function(options) {
  return new L.Control.Zoom(options);
};
L.Control.Attribution = L.Control.extend({
  options: {
    position: "bottomright",
    prefix:
      '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>',
  },
  initialize: function(options) {
    L.setOptions(this, options);
    this._attributions = {};
  },
  onAdd: function(map) {
    this._container = L.DomUtil.create("div", "leaflet-control-attribution");
    L.DomEvent.disableClickPropagation(this._container);
    for (var i in map._layers) {
      if (map._layers[i].getAttribution) {
        this.addAttribution(map._layers[i].getAttribution());
      }
    }
    map
      .on("layeradd", this._onLayerAdd, this)
      .on("layerremove", this._onLayerRemove, this);
    this._update();
    return this._container;
  },
  onRemove: function(map) {
    map
      .off("layeradd", this._onLayerAdd)
      .off("layerremove", this._onLayerRemove);
  },
  setPrefix: function(prefix) {
    this.options.prefix = prefix;
    this._update();
    return this;
  },
  addAttribution: function(text) {
    if (!text) {
      return;
    }
    if (!this._attributions[text]) {
      this._attributions[text] = 0;
    }
    this._attributions[text]++;
    this._update();
    return this;
  },
  removeAttribution: function(text) {
    if (!text) {
      return;
    }
    if (this._attributions[text]) {
      this._attributions[text]--;
      this._update();
    }
    return this;
  },
  _update: function() {
    if (!this._map) {
      return;
    }
    var attribs = [];
    for (var i in this._attributions) {
      if (this._attributions[i]) {
        attribs.push(i);
      }
    }
    var prefixAndAttribs = [];
    if (this.options.prefix) {
      prefixAndAttribs.push(this.options.prefix);
    }
    if (attribs.length) {
      prefixAndAttribs.push(attribs.join(", "));
    }
    this._container.innerHTML = prefixAndAttribs.join(" | ");
  },
  _onLayerAdd: function(e) {
    if (e.layer.getAttribution) {
      this.addAttribution(e.layer.getAttribution());
    }
  },
  _onLayerRemove: function(e) {
    if (e.layer.getAttribution) {
      this.removeAttribution(e.layer.getAttribution());
    }
  },
});
L.Map.mergeOptions({ attributionControl: true });
L.Map.addInitHook(function() {
  if (this.options.attributionControl) {
    this.attributionControl = new L.Control.Attribution().addTo(this);
  }
});
L.control.attribution = function(options) {
  return new L.Control.Attribution(options);
};
L.PosAnimation = L.Class.extend({
  includes: L.Mixin.Events,
  run: function(el, newPos, duration, easeLinearity) {
    this.stop();
    this._el = el;
    this._inProgress = true;
    this._newPos = newPos;
    this.fire("start");
    el.style[L.DomUtil.TRANSITION] =
      "all " +
      (duration || 0.25) +
      "s cubic-bezier(0,0," +
      (easeLinearity || 0.5) +
      ",1)";
    L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
    L.DomUtil.setPosition(el, newPos);
    L.Util.falseFn(el.offsetWidth);
    this._stepTimer = setInterval(L.bind(this._onStep, this), 50);
  },
  stop: function() {
    if (!this._inProgress) {
      return;
    }
    L.DomUtil.setPosition(this._el, this._getPos());
    this._onTransitionEnd();
    L.Util.falseFn(this._el.offsetWidth);
  },
  _onStep: function() {
    var stepPos = this._getPos();
    if (!stepPos) {
      this._onTransitionEnd();
      return;
    }
    this._el._leaflet_pos = stepPos;
    this.fire("step");
  },
  _transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,
  _getPos: function() {
    var left,
      top,
      matches,
      el = this._el,
      style = window.getComputedStyle(el);
    if (L.Browser.any3d) {
      matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
      if (!matches) {
        return;
      }
      left = parseFloat(matches[1]);
      top = parseFloat(matches[2]);
    } else {
      left = parseFloat(style.left);
      top = parseFloat(style.top);
    }
    return new L.Point(left, top, true);
  },
  _onTransitionEnd: function() {
    L.DomEvent.off(
      this._el,
      L.DomUtil.TRANSITION_END,
      this._onTransitionEnd,
      this
    );
    if (!this._inProgress) {
      return;
    }
    this._inProgress = false;
    this._el.style[L.DomUtil.TRANSITION] = "";
    this._el._leaflet_pos = this._newPos;
    clearInterval(this._stepTimer);
    this.fire("step").fire("end");
  },
});
L.Map.include({
  setView: function(center, zoom, options) {
    zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
    center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
    options = options || {};
    if (this._panAnim) {
      this._panAnim.stop();
    }
    if (this._loaded && !options.reset && options !== true) {
      if (options.animate !== undefined) {
        options.zoom = L.extend({ animate: options.animate }, options.zoom);
        options.pan = L.extend({ animate: options.animate }, options.pan);
      }
      var animated =
        this._zoom !== zoom
          ? this._tryAnimatedZoom &&
            this._tryAnimatedZoom(center, zoom, options.zoom)
          : this._tryAnimatedPan(center, options.pan);
      if (animated) {
        clearTimeout(this._sizeTimer);
        return this;
      }
    }
    this._resetView(center, zoom);
    return this;
  },
  panBy: function(offset, options) {
    offset = L.point(offset).round();
    options = options || {};
    if (!offset.x && !offset.y) {
      return this;
    }
    if (!this._panAnim) {
      this._panAnim = new L.PosAnimation();
      this._panAnim.on(
        { step: this._onPanTransitionStep, end: this._onPanTransitionEnd },
        this
      );
    }
    if (!options.noMoveStart) {
      this.fire("movestart");
    }
    if (options.animate !== false) {
      L.DomUtil.addClass(this._mapPane, "leaflet-pan-anim");
      var newPos = this._getMapPanePos().subtract(offset);
      this._panAnim.run(
        this._mapPane,
        newPos,
        options.duration || 0.25,
        options.easeLinearity
      );
    } else {
      this._rawPanBy(offset);
      this.fire("move").fire("moveend");
    }
    return this;
  },
  _onPanTransitionStep: function() {
    this.fire("move");
  },
  _onPanTransitionEnd: function() {
    L.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim");
    this.fire("moveend");
  },
  _tryAnimatedPan: function(center, options) {
    var offset = this._getCenterOffset(center)._floor();
    if (
      (options && options.animate) !== true &&
      !this.getSize().contains(offset)
    ) {
      return false;
    }
    this.panBy(offset, options);
    return true;
  },
});
L.PosAnimation = L.DomUtil.TRANSITION
  ? L.PosAnimation
  : L.PosAnimation.extend({
      run: function(el, newPos, duration, easeLinearity) {
        this.stop();
        this._el = el;
        this._inProgress = true;
        this._duration = duration || 0.25;
        this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);
        this._startPos = L.DomUtil.getPosition(el);
        this._offset = newPos.subtract(this._startPos);
        this._startTime = +new Date();
        this.fire("start");
        this._animate();
      },
      stop: function() {
        if (!this._inProgress) {
          return;
        }
        this._step();
        this._complete();
      },
      _animate: function() {
        this._animId = L.Util.requestAnimFrame(this._animate, this);
        this._step();
      },
      _step: function() {
        var elapsed = +new Date() - this._startTime,
          duration = this._duration * 1e3;
        if (elapsed < duration) {
          this._runFrame(this._easeOut(elapsed / duration));
        } else {
          this._runFrame(1);
          this._complete();
        }
      },
      _runFrame: function(progress) {
        var pos = this._startPos.add(this._offset.multiplyBy(progress));
        L.DomUtil.setPosition(this._el, pos);
        this.fire("step");
      },
      _complete: function() {
        L.Util.cancelAnimFrame(this._animId);
        this._inProgress = false;
        this.fire("end");
      },
      _easeOut: function(t) {
        return 1 - Math.pow(1 - t, this._easeOutPower);
      },
    });
L.Map.mergeOptions({ zoomAnimation: true, zoomAnimationThreshold: 4 });
if (L.DomUtil.TRANSITION) {
  L.Map.addInitHook(function() {
    this._zoomAnimated =
      this.options.zoomAnimation &&
      L.DomUtil.TRANSITION &&
      L.Browser.any3d &&
      !L.Browser.android23 &&
      !L.Browser.mobileOpera;
    if (this._zoomAnimated) {
      L.DomEvent.on(
        this._mapPane,
        L.DomUtil.TRANSITION_END,
        this._catchTransitionEnd,
        this
      );
    }
  });
}
L.Map.include(
  !L.DomUtil.TRANSITION
    ? {}
    : {
        _catchTransitionEnd: function(e) {
          if (this._animatingZoom && e.propertyName.indexOf("transform") >= 0) {
            this._onZoomTransitionEnd();
          }
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName(
            "leaflet-zoom-animated"
          ).length;
        },
        _tryAnimatedZoom: function(center, zoom, options) {
          if (this._animatingZoom) {
            return true;
          }
          options = options || {};
          if (
            !this._zoomAnimated ||
            options.animate === false ||
            this._nothingToAnimate() ||
            Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold
          ) {
            return false;
          }
          var scale = this.getZoomScale(zoom),
            offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
            origin = this._getCenterLayerPoint()._add(offset);
          if (options.animate !== true && !this.getSize().contains(offset)) {
            return false;
          }
          this.fire("movestart").fire("zoomstart");
          this._animateZoom(center, zoom, origin, scale, null, true);
          return true;
        },
        _animateZoom: function(center, zoom, origin, scale, delta, backwards) {
          this._animatingZoom = true;
          L.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim");
          this._animateToCenter = center;
          this._animateToZoom = zoom;
          if (L.Draggable) {
            L.Draggable._disabled = true;
          }
          this.fire("zoomanim", {
            center: center,
            zoom: zoom,
            origin: origin,
            scale: scale,
            delta: delta,
            backwards: backwards,
          });
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom = false;
          L.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim");
          this._resetView(
            this._animateToCenter,
            this._animateToZoom,
            true,
            true
          );
          if (L.Draggable) {
            L.Draggable._disabled = false;
          }
        },
      }
);
L.TileLayer.include({
  _animateZoom: function(e) {
    if (!this._animating) {
      this._animating = true;
      this._prepareBgBuffer();
    }
    var bg = this._bgBuffer,
      transform = L.DomUtil.TRANSFORM,
      initialTransform = e.delta
        ? L.DomUtil.getTranslateString(e.delta)
        : bg.style[transform],
      scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);
    bg.style[transform] = e.backwards
      ? scaleStr + " " + initialTransform
      : initialTransform + " " + scaleStr;
  },
  _endZoomAnim: function() {
    var front = this._tileContainer,
      bg = this._bgBuffer;
    front.style.visibility = "";
    front.parentNode.appendChild(front);
    L.Util.falseFn(bg.offsetWidth);
    this._animating = false;
  },
  _clearBgBuffer: function() {
    var map = this._map;
    if (map && !map._animatingZoom && !map.touchZoom._zooming) {
      this._bgBuffer.innerHTML = "";
      this._bgBuffer.style[L.DomUtil.TRANSFORM] = "";
    }
  },
  _prepareBgBuffer: function() {
    var front = this._tileContainer,
      bg = this._bgBuffer;
    var bgLoaded = this._getLoadedTilesPercentage(bg),
      frontLoaded = this._getLoadedTilesPercentage(front);
    if (bg && bgLoaded > 0.5 && frontLoaded < 0.5) {
      front.style.visibility = "hidden";
      this._stopLoadingImages(front);
      return;
    }
    bg.style.visibility = "hidden";
    bg.style[L.DomUtil.TRANSFORM] = "";
    this._tileContainer = bg;
    bg = this._bgBuffer = front;
    this._stopLoadingImages(bg);
    clearTimeout(this._clearBgBufferTimer);
  },
  _getLoadedTilesPercentage: function(container) {
    var tiles = container.getElementsByTagName("img"),
      i,
      len,
      count = 0;
    for (i = 0, len = tiles.length; i < len; i++) {
      if (tiles[i].complete) {
        count++;
      }
    }
    return count / len;
  },
  _stopLoadingImages: function(container) {
    var tiles = Array.prototype.slice.call(
        container.getElementsByTagName("img")
      ),
      i,
      len,
      tile;
    for (i = 0, len = tiles.length; i < len; i++) {
      tile = tiles[i];
      if (!tile.complete) {
        tile.onload = L.Util.falseFn;
        tile.onerror = L.Util.falseFn;
        tile.src = L.Util.emptyImageUrl;
        tile.parentNode.removeChild(tile);
      }
    }
  },
});
L.TileLayer.Zoomify = L.TileLayer.extend({
  options: { continuousWorld: true, tolerance: 0.8 },
  initialize: function(url, options) {
    options = L.setOptions(this, options);
    this._url = url;
    var imageSize = L.point(options.width, options.height),
      tileSize = options.tileSize;
    this._imageSize = [imageSize];
    this._gridSize = [this._getGridSize(imageSize)];
    while (imageSize.x > tileSize || imageSize.y > tileSize) {
      imageSize = imageSize.divideBy(2).floor();
      this._imageSize.push(imageSize);
      this._gridSize.push(this._getGridSize(imageSize));
    }
    this._imageSize.reverse();
    this._gridSize.reverse();
    this.options.maxZoom = this._gridSize.length - 1;
  },
  onAdd: function(map) {
    L.TileLayer.prototype.onAdd.call(this, map);
    var mapSize = map.getSize(),
      zoom = this._getBestFitZoom(mapSize),
      imageSize = this._imageSize[zoom],
      center = map.options.crs.pointToLatLng(
        L.point(imageSize.x / 2, imageSize.y / 2),
        zoom
      );
  },
  getZoomifyBounds: function(map) {
    var imageSize = this._imageSize[0],
      topleft = map.options.crs.pointToLatLng(L.point(0, 0), 0),
      bottomright = map.options.crs.pointToLatLng(
        L.point(imageSize.x, imageSize.y),
        0
      ),
      bounds = L.latLngBounds(topleft, bottomright);
    return bounds;
  },
  getCenterZoom: function(map) {
    var mapSize = map.getSize(),
      zoom = this._getBestFitZoom(mapSize),
      imageSize = this._imageSize[zoom],
      center = map.options.crs.pointToLatLng(
        L.point(imageSize.x / 2, imageSize.y / 2),
        zoom
      );
    return { center: center, lat: center.lat, lon: center.lng, zoom: zoom };
  },
  _getGridSize: function(imageSize) {
    var tileSize = this.options.tileSize;
    return L.point(
      Math.ceil(imageSize.x / tileSize),
      Math.ceil(imageSize.y / tileSize)
    );
  },
  _getBestFitZoom: function(mapSize) {
    var tolerance = this.options.tolerance,
      zoom = this._imageSize.length - 1,
      imageSize,
      zoom;
    while (zoom) {
      imageSize = this._imageSize[zoom];
      if (
        imageSize.x * tolerance < mapSize.x &&
        imageSize.y * tolerance < mapSize.y
      ) {
        return zoom;
      }
      zoom--;
    }
    return zoom;
  },
  _tileShouldBeLoaded: function(tilePoint) {
    var gridSize = this._gridSize[this._map.getZoom()];
    if (gridSize) {
      return (
        tilePoint.x >= 0 &&
        tilePoint.x < gridSize.x &&
        tilePoint.y >= 0 &&
        tilePoint.y < gridSize.y
      );
    } else {
      console.log(
        "_tileShouldBeLoaded: No gridSize for " + this._map.getZoom()
      );
      return false;
    }
  },
  _addTile: function(tilePoint, container) {
    var tilePos = this._getTilePos(tilePoint),
      tile = this._getTile(),
      zoom = this._map.getZoom(),
      imageSize = this._imageSize[zoom],
      gridSize = this._gridSize[zoom],
      tileSize = this.options.tileSize;
    if (tilePoint.x === gridSize.x - 1) {
      tile.style.width = imageSize.x - tileSize * (gridSize.x - 1) + "px";
    }
    if (tilePoint.y === gridSize.y - 1) {
      tile.style.height = imageSize.y - tileSize * (gridSize.y - 1) + "px";
    }
    L.DomUtil.setPosition(
      tile,
      tilePos,
      L.Browser.chrome || L.Browser.android23
    );
    this._tiles[tilePoint.x + ":" + tilePoint.y] = tile;
    this._loadTile(tile, tilePoint);
    if (tile.parentNode !== this._tileContainer) {
      container.appendChild(tile);
    }
  },
  getTileUrl: function(tilePoint) {
    return (
      this._url +
      "TileGroup" +
      this._getTileGroup(tilePoint) +
      "/" +
      this._map.getZoom() +
      "-" +
      tilePoint.x +
      "-" +
      tilePoint.y +
      ".jpg"
    );
  },
  _getTileGroup: function(tilePoint) {
    var zoom = this._map.getZoom(),
      num = 0,
      gridSize;
    for (z = 0; z < zoom; z++) {
      gridSize = this._gridSize[z];
      num += gridSize.x * gridSize.y;
    }
    num += tilePoint.y * this._gridSize[zoom].x + tilePoint.x;
    return Math.floor(num / 256);
  },
});
L.tileLayer.zoomify = function(url, options) {
  return new L.TileLayer.Zoomify(url, options);
};
L.Control.MiniMap = L.Control.extend({
  options: {
    position: "bottomright",
    toggleDisplay: false,
    zoomLevelOffset: -5,
    zoomLevelFixed: false,
    zoomAnimation: false,
    autoToggleDisplay: false,
    show_view: true,
    width: 150,
    height: 150,
    aimingRectOptions: {
      color: "#c34528",
      weight: 1,
      clickable: false,
      stroke: true,
    },
    shadowRectOptions: {
      color: "#000000",
      weight: 1,
      clickable: false,
      opacity: 0,
      fillOpacity: 0,
    },
  },
  hideText: "Hide MiniMap",
  showText: "Show MiniMap",
  initialize: function(layer, options) {
    L.Util.setOptions(this, options);
    this.options.aimingRectOptions.clickable = false;
    this.options.shadowRectOptions.clickable = false;
    this._layer = layer;
  },
  onAdd: function(map) {
    this._mainMap = map;
    this._container = L.DomUtil.create("div", "leaflet-control-minimap");
    this._container.style.width = this.options.width + "px";
    this._container.style.height = this.options.height + "px";
    L.DomEvent.disableClickPropagation(this._container);
    L.DomEvent.on(this._container, "mousewheel", L.DomEvent.stopPropagation);
    this._miniMap = new L.Map(this._container, {
      attributionControl: false,
      zoomControl: false,
      zoomAnimation: this.options.zoomAnimation,
      autoToggleDisplay: this.options.autoToggleDisplay,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      dragging: false,
      crs: map.options.crs,
    });
    this._miniMap.addLayer(this._layer);
    this._mainMapMoving = false;
    this._miniMapMoving = false;
    this._userToggledDisplay = false;
    this._minimized = false;
    if (this.options.toggleDisplay) {
      this._addToggleButton();
    }
    this._miniMap.whenReady(
      L.Util.bind(function() {
        this._aimingRect = L.rectangle(
          this._mainMap.getBounds(),
          this.options.aimingRectOptions
        ).addTo(this._miniMap);
        this._shadowRect = L.rectangle(
          this._mainMap.getBounds(),
          this.options.shadowRectOptions
        ).addTo(this._miniMap);
        this._locationCircle = L.circleMarker(this._mainMap.getCenter(), {
          fillColor: "#c34528",
          color: "#FFFFFF",
          weight: 2,
          radius: 10,
          fill: true,
          fillOpacity: 1,
          stroke: true,
          clickable: false,
        }).addTo(this._miniMap);
        this._locationCircle.setRadius(5);
        this._mainMap.on("moveend", this._onMainMapMoved, this);
        this._mainMap.on("move", this._onMainMapMoving, this);
        if (this.options.bounds_array) {
          this._miniMap.fitBounds(this.options.bounds_array, {
            padding: [15, 15],
          });
        }
      }, this)
    );
    return this._container;
  },
  minimize: function(hide_completely) {
    if (!this._minimized) {
      this._minimize();
    }
  },
  restore: function() {
    if (this._minimized) {
      this._restore();
      this._miniMap.fitBounds(this.options.bounds_array, { padding: [15, 15] });
    }
  },
  addTo: function(map) {
    L.Control.prototype.addTo.call(this, map);
    this._miniMap.setView(this._mainMap.getCenter(), this._decideZoom(true));
    this._setDisplay(this._decideMinimized());
    return this;
  },
  onRemove: function(map) {
    this._mainMap.off("moveend", this._onMainMapMoved, this);
    this._mainMap.off("move", this._onMainMapMoving, this);
    this._miniMap.off("moveend", this._onMiniMapMoved, this);
    this._miniMap.removeLayer(this._layer);
  },
  _addToggleButton: function() {
    this._toggleDisplayButton = this.options.toggleDisplay
      ? this._createButton(
          "",
          this.hideText,
          "leaflet-control-minimap-toggle-display",
          this._container,
          this._toggleDisplayButtonClicked,
          this
        )
      : undefined;
  },
  _createButton: function(html, title, className, container, fn, context) {
    var link = L.DomUtil.create("a", className, container);
    link.innerHTML = html;
    link.href = "#";
    link.title = title;
    var stop = L.DomEvent.stopPropagation;
    L.DomEvent.on(link, "click", stop)
      .on(link, "mousedown", stop)
      .on(link, "dblclick", stop)
      .on(link, "click", L.DomEvent.preventDefault)
      .on(link, "click", fn, context);
    return link;
  },
  _toggleDisplayButtonClicked: function() {
    this._userToggledDisplay = true;
    if (!this._minimized) {
      this._minimize();
      this._toggleDisplayButton.title = this.showText;
    } else {
      this._restore();
      this._toggleDisplayButton.title = this.hideText;
    }
  },
  _setDisplay: function(minimize) {
    if (minimize != this._minimized) {
      if (!this._minimized) {
        this._minimize();
      } else {
        this._restore();
      }
    }
  },
  _minimize: function() {
    this._container.style.width = "0px";
    this._container.style.height = "0px";
    this._minimized = true;
  },
  _restore: function() {
    this._container.style.width = this.options.width + "px";
    this._container.style.height = this.options.height + "px";
    this._minimized = false;
  },
  _onMainMapMoved: function(e) {
    if (!this._miniMapMoving) {
      var zoom = this._decideZoom(true);
      if (zoom != 0) {
      }
      this._mainMapMoving = true;
      this._setDisplay(this._decideMinimized());
    } else {
      this._miniMapMoving = false;
    }
    if (this.options.show_view) {
      this._aimingRect.setBounds(this._mainMap.getBounds());
    }
    this._locationCircle.setLatLng(this._mainMap.getCenter());
  },
  _onMainMapMoving: function(e) {
    if (this.options.show_view) {
      this._aimingRect.setBounds(this._mainMap.getBounds());
    }
    this._locationCircle.setLatLng(this._mainMap.getCenter());
  },
  _onMiniMapMoveStarted: function(e) {
    var lastAimingRect = this._aimingRect.getBounds();
    var sw = this._miniMap.latLngToContainerPoint(
      lastAimingRect.getSouthWest()
    );
    var ne = this._miniMap.latLngToContainerPoint(
      lastAimingRect.getNorthEast()
    );
    this._lastAimingRectPosition = { sw: sw, ne: ne };
  },
  _onMiniMapMoving: function(e) {
    if (!this._mainMapMoving && this._lastAimingRectPosition) {
      this._shadowRect.setBounds(
        new L.LatLngBounds(
          this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.sw),
          this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.ne)
        )
      );
      this._shadowRect.setStyle({ opacity: 1, fillOpacity: 0.3 });
    }
  },
  _onMiniMapMoved: function(e) {
    if (!this._mainMapMoving) {
      this._miniMapMoving = true;
      this._mainMap.setView(this._miniMap.getCenter(), this._decideZoom(false));
      this._shadowRect.setStyle({ opacity: 0, fillOpacity: 0 });
    } else {
      this._mainMapMoving = false;
    }
  },
  _decideZoom: function(fromMaintoMini) {
    if (!this.options.zoomLevelFixed && this.options.zoomLevelFixed != 0) {
      if (fromMaintoMini) {
        return this._mainMap.getZoom() + this.options.zoomLevelOffset;
      } else {
        var currentDiff = this._miniMap.getZoom() - this._mainMap.getZoom();
        var proposedZoom =
          this._miniMap.getZoom() - this.options.zoomLevelOffset;
        var toRet;
        if (
          currentDiff > this.options.zoomLevelOffset &&
          this._mainMap.getZoom() <
            this._miniMap.getMinZoom() - this.options.zoomLevelOffset
        ) {
          if (this._miniMap.getZoom() > this._lastMiniMapZoom) {
            toRet = this._mainMap.getZoom() + 1;
            this._miniMap.setZoom(this._miniMap.getZoom() - 1);
          } else {
            toRet = this._mainMap.getZoom();
          }
        } else {
          toRet = proposedZoom;
        }
        this._lastMiniMapZoom = this._miniMap.getZoom();
        return toRet;
      }
    } else {
      if (fromMaintoMini) {
        return this.options.zoomLevelFixed;
      } else {
        return this._mainMap.getZoom();
      }
    }
  },
  _decideMinimized: function() {
    if (this._userToggledDisplay) {
      return this._minimized;
    }
    if (this.options.autoToggleDisplay) {
      if (this._mainMap.getBounds().contains(this._miniMap.getBounds())) {
        return true;
      }
      return false;
    }
    return this._minimized;
  },
});
L.Map.mergeOptions({ miniMapControl: false });
L.Map.addInitHook(function() {
  if (this.options.miniMapControl) {
    this.miniMapControl = new L.Control.MiniMap().addTo(this);
  }
});
L.control.minimap = function(options) {
  return new L.Control.MiniMap(options);
};
(function(exports) {
  var SUBDOMAINS = "a b c d".split(" "),
    MAKE_PROVIDER = function(layer, type, minZoom, maxZoom) {
      return {
        url: [
          "//stamen-tiles-{S}.a.ssl.fastly.net/",
          layer,
          "/{Z}/{X}/{Y}.",
          type,
        ].join(""),
        type: type,
        subdomains: SUBDOMAINS.slice(),
        minZoom: minZoom,
        maxZoom: maxZoom,
        attribution: [
          "<a href='http://leafletjs.com' title='A JS library for interactive maps'>Leaflet</a> | ",
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ',
          'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
          'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
          'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
        ].join(""),
      };
    },
    PROVIDERS = {
      toner: MAKE_PROVIDER("toner", "png", 0, 20),
      terrain: MAKE_PROVIDER("terrain", "jpg", 4, 18),
      watercolor: MAKE_PROVIDER("watercolor", "jpg", 1, 16),
      "trees-cabs-crime": {
        url:
          "http://{S}.tiles.mapbox.com/v3/stamen.trees-cabs-crime/{Z}/{X}/{Y}.png",
        type: "png",
        subdomains: "a b c d".split(" "),
        minZoom: 11,
        maxZoom: 18,
        extent: [
          { lat: 37.853, lon: -122.577 },
          { lat: 37.684, lon: -122.313 },
        ],
        attribution: [
          'Design by Shawn Allen at <a href="http://stamen.com">Stamen</a>.',
          'Data courtesy of <a href="http://fuf.net">FuF</a>,',
          '<a href="http://www.yellowcabsf.com">Yellow Cab</a>',
          '&amp; <a href="http://sf-police.org">SFPD</a>.',
        ].join(" "),
      },
    };
  setupFlavors("toner", ["hybrid", "labels", "lines", "background", "lite"]);
  setupFlavors("toner", ["2010"]);
  setupFlavors("toner", ["2011", "2011-lines", "2011-labels", "2011-lite"]);
  setupFlavors("terrain", ["background"]);
  setupFlavors("terrain", ["labels", "lines"], "png");
  exports.stamen = exports.stamen || {};
  exports.stamen.tile = exports.stamen.tile || {};
  exports.stamen.tile.providers = PROVIDERS;
  exports.stamen.tile.getProvider = getProvider;
  function setupFlavors(base, flavors, type) {
    var provider = getProvider(base);
    for (var i = 0; i < flavors.length; i++) {
      var flavor = [base, flavors[i]].join("-");
      PROVIDERS[flavor] = MAKE_PROVIDER(
        flavor,
        type || provider.type,
        provider.minZoom,
        provider.maxZoom
      );
    }
  }
  function getProvider(name) {
    if (name in PROVIDERS) {
      return PROVIDERS[name];
    } else {
      throw "No such provider (" + name + ")";
    }
  }
  if (typeof L === "object") {
    L.StamenTileLayer = L.TileLayer.extend({
      initialize: function(name, options) {
        var provider = getProvider(name),
          url = provider.url.replace(/({[A-Z]})/g, function(s) {
            return s.toLowerCase();
          }),
          _options = {
            minZoom: provider.minZoom,
            maxZoom: provider.maxZoom,
            subdomains: provider.subdomains,
            scheme: "xyz",
            attribution: provider.attribution,
          };
        if (options) {
          VCO.Util.mergeData(_options, options);
        }
        L.TileLayer.prototype.initialize.call(this, url, _options);
      },
    });
  }
})(typeof exports === "undefined" ? this : exports);
VCO.MapMarker = VCO.Class.extend({
  includes: [VCO.Events],
  initialize: function(data, options) {
    this._el = { container: {}, content_container: {}, content: {} };
    this._marker = {};
    this._icon = {};
    this._custom_icon = false;
    this._custom_icon_url = "";
    this._custom_image_icon = false;
    this.marker_number = 0;
    this.media_icon_class = "";
    this.timer = {};
    this.data = {};
    this.options = {
      duration: 1e3,
      ease: VCO.Ease.easeInSpline,
      width: 600,
      height: 600,
      map_popup: false,
    };
    this.animator = null;
    VCO.Util.mergeData(this.options, options);
    VCO.Util.mergeData(this.data, data);
    this._initLayout();
  },
  show: function() {},
  hide: function() {},
  addTo: function(m) {
    this._addTo(m);
  },
  removeFrom: function(m) {
    this._removeFrom(m);
  },
  updateDisplay: function(w, h, a) {
    this._updateDisplay(w, h, a);
  },
  createMarker: function(d, o) {
    this._createMarker(d, o);
  },
  createPopup: function(d, o) {
    this._createPopup(d, o);
  },
  active: function(a) {
    this._active(a);
  },
  location: function() {
    return this._location();
  },
  _createMarker: function(d, o) {},
  _addTo: function(m) {},
  _removeFrom: function(m) {},
  _createPopup: function(d, o) {},
  _active: function(a) {},
  _location: function() {
    return { lat: 0, lng: 0 };
  },
  _onMarkerClick: function(e) {
    this.fire("markerclick", { marker_number: this.marker_number });
  },
  _initLayout: function() {
    this._createMarker(this.data, this.options);
  },
  _updateDisplay: function(width, height, animate) {},
});
VCO.Map = VCO.Class.extend({
  includes: [VCO.Events, VCO.DomMixins],
  _el: {},
  initialize: function(elem, data, options) {
    this._el = { container: {}, map: {}, map_mask: {} };
    if (typeof elem === "object") {
      this._el.container = elem;
    } else {
      this._el.container = VCO.Dom.get(elem);
    }
    this._loaded = { data: false, map: false };
    this._map = null;
    this._mini_map = null;
    this._markers = [];
    this.zoom_min_max = { min: null, max: null };
    this._line = null;
    this._line_active = null;
    this.current_marker = 0;
    this.bounds_array = null;
    this._tile_layer = null;
    this._tile_layer_mini = null;
    this._image_layer = null;
    this.data = {
      uniqueid: "",
      slides: [{ test: "yes" }, { test: "yes" }, { test: "yes" }],
    };
    this.options = {
      map_type: "stamen:toner-lite",
      map_as_image: false,
      map_mini: false,
      map_background_color: "#d9d9d9",
      map_subdomains: "",
      map_access_token: "",
      zoomify: {
        path: "",
        width: "",
        height: "",
        tolerance: 0.8,
        attribution: "",
      },
      skinny_size: 650,
      less_bounce: true,
      path_gfx: "gfx",
      start_at_slide: 0,
      map_popup: false,
      zoom_distance: 100,
      calculate_zoom: true,
      line_follows_path: true,
      line_color: "#333",
      line_color_inactive: "#000",
      line_weight: 5,
      line_opacity: 0.2,
      line_dash: "5,5",
      line_join: "miter",
      show_lines: true,
      show_history_line: true,
      map_center_offset: null,
    };
    this.animator = null;
    this.timer = null;
    this.touch_scale = 1;
    this.scroll = { start_time: null };
    VCO.Util.mergeData(this.options, options);
    VCO.Util.mergeData(this.data, data);
    this._initLayout();
    this._initEvents();
    this._createMap();
    this._initData();
  },
  updateDisplay: function(w, h, animate, d, offset) {
    this._updateDisplay(w, h, animate, d, offset);
  },
  goTo: function(n, change) {
    if (n < this._markers.length && n >= 0) {
      var zoom = 0,
        previous_marker = this.current_marker;
      this.current_marker = n;
      var marker = this._markers[this.current_marker];
      if (this.animator) {
        this.animator.stop();
      }
      this._resetMarkersActive();
      if (marker.data.type && marker.data.type == "overview") {
        this._markerOverview();
        if (!change) {
          this._onMarkerChange();
        }
      } else {
        marker.active(true);
        if (change) {
          if (marker.data.location) {
            this._viewTo(marker.data.location);
          } else {
          }
        } else {
          if (marker.data.location && marker.data.location.lat) {
            zoom = this._calculateZoomChange(
              this._getMapCenter(true),
              marker.location()
            );
            this._viewTo(marker.data.location, {
              calculate_zoom: this.options.calculate_zoom,
              zoom: zoom,
            });
            if (this.options.line_follows_path) {
              if (
                this.options.show_history_line &&
                marker.data.real_marker &&
                this._markers[previous_marker].data.real_marker
              ) {
                var lines_array = [],
                  line_num = previous_marker,
                  point;
                if (line_num < this.current_marker) {
                  while (line_num < this.current_marker) {
                    if (
                      this._markers[line_num].data.location &&
                      this._markers[line_num].data.location.lat
                    ) {
                      point = {
                        lat: this._markers[line_num].data.location.lat,
                        lon: this._markers[line_num].data.location.lon,
                      };
                      lines_array.push(point);
                    }
                    line_num++;
                  }
                } else if (line_num > this.current_marker) {
                  while (line_num > this.current_marker) {
                    if (
                      this._markers[line_num].data.location &&
                      this._markers[line_num].data.location.lat
                    ) {
                      point = {
                        lat: this._markers[line_num].data.location.lat,
                        lon: this._markers[line_num].data.location.lon,
                      };
                      lines_array.push(point);
                    }
                    line_num--;
                  }
                }
                lines_array.push({
                  lat: marker.data.location.lat,
                  lon: marker.data.location.lon,
                });
                this._replaceLines(this._line_active, lines_array);
              }
            } else {
              if (
                this.options.show_history_line &&
                marker.data.real_marker &&
                this._markers[previous_marker].data.real_marker
              ) {
                this._replaceLines(this._line_active, [
                  {
                    lat: marker.data.location.lat,
                    lon: marker.data.location.lon,
                  },
                  {
                    lat: this._markers[previous_marker].data.location.lat,
                    lon: this._markers[previous_marker].data.location.lon,
                  },
                ]);
              }
            }
          } else {
            this._markerOverview();
            if (!change) {
              this._onMarkerChange();
            }
          }
          this._onMarkerChange();
        }
      }
    }
  },
  panTo: function(loc, animate) {
    this._panTo(loc, animate);
  },
  zoomTo: function(z, animate) {
    this._zoomTo(z, animate);
  },
  viewTo: function(loc, opts) {
    this._viewTo(loc, opts);
  },
  getBoundsZoom: function(m1, m2, inside, padding) {
    this.__getBoundsZoom(m1, m2, inside, padding);
  },
  markerOverview: function() {
    this._markerOverview();
  },
  calculateMarkerZooms: function() {
    this._calculateMarkerZooms();
  },
  createMiniMap: function() {
    this._createMiniMap();
  },
  setMapOffset: function(left, top) {
    this.options.map_center_offset.left = left;
    this.options.map_center_offset.top = top;
  },
  calculateMinMaxZoom: function() {
    for (var i = 0; i < this._markers.length; i++) {
      if (
        this._markers[i].data.location &&
        this._markers[i].data.location.zoom
      ) {
        this.updateMinMaxZoom(this._markers[i].data.location.zoom);
      }
    }
    trace(
      "MAX ZOOM: " +
        this.zoom_min_max.max +
        " MIN ZOOM: " +
        this.zoom_min_max.min
    );
  },
  updateMinMaxZoom: function(zoom) {
    if (!this.zoom_min_max.max) {
      this.zoom_min_max.max = zoom;
    }
    if (!this.zoom_min_max.min) {
      this.zoom_min_max.min = zoom;
    }
    if (this.zoom_min_max.max < zoom) {
      this.zoom_min_max.max = zoom;
    }
    if (this.zoom_min_max.min > zoom) {
      this.zoom_min_max.min = zoom;
    }
  },
  initialMapLocation: function() {
    if (this._loaded.data && this._loaded.map) {
      this.goTo(this.options.start_at_slide, true);
      this._initialMapLocation();
    }
  },
  show: function() {},
  hide: function() {},
  addTo: function(container) {
    container.appendChild(this._el.container);
    this.onAdd();
  },
  removeFrom: function(container) {
    container.removeChild(this._el.container);
    this.onRemove();
  },
  createMarkers: function(array) {
    this._createMarkers(array);
  },
  createMarker: function(d) {
    this._createMarker(d);
  },
  _destroyMarker: function(marker) {
    this._removeMarker(marker);
    for (var i = 0; i < this._markers.length; i++) {
      if (this._markers[i] == marker) {
        this._markers.splice(i, 1);
      }
    }
    this.fire("markerRemoved", marker);
  },
  _createMarkers: function(array) {
    for (var i = 0; i < array.length; i++) {
      this._createMarker(array[i]);
      if (
        array[i].location &&
        array[i].location.lat &&
        this.options.show_lines
      ) {
        this._addToLine(this._line, array[i]);
      }
    }
  },
  _createLines: function(array) {},
  _createMap: function() {},
  _createMiniMap: function() {},
  _createMarker: function(d) {
    var marker = {};
    marker.on("markerclick", this._onMarkerClick);
    this._addMarker(marker);
    this._markers.push(marker);
    marker.marker_number = this._markers.length - 1;
    this.fire("markerAdded", marker);
  },
  _addMarker: function(marker) {},
  _removeMarker: function(marker) {},
  _resetMarkersActive: function() {
    for (var i = 0; i < this._markers.length; i++) {
      this._markers[i].active(false);
    }
  },
  _calculateMarkerZooms: function() {},
  _createLine: function(d) {
    return { data: d };
  },
  _addToLine: function(line, d) {},
  _replaceLines: function(line, d) {},
  _addLineToMap: function(line) {},
  _panTo: function(loc, animate) {},
  _zoomTo: function(z, animate) {},
  _viewTo: function(loc, opts) {},
  _updateMapDisplay: function(animate, d) {},
  _refreshMap: function() {},
  _getMapLocation: function(m) {
    return { x: 0, y: 0 };
  },
  _getMapZoom: function() {
    return 1;
  },
  _getMapCenter: function() {
    return { lat: 0, lng: 0 };
  },
  _getBoundsZoom: function(m1, m2, inside, padding) {},
  _markerOverview: function() {},
  _initialMapLocation: function() {},
  _onMarkerChange: function(e) {
    this.fire("change", { current_marker: this.current_marker });
  },
  _onMarkerClick: function(e) {
    if (this.current_marker != e.marker_number) {
      this.goTo(e.marker_number);
    }
  },
  _onMapLoaded: function(e) {
    this._loaded.map = true;
    if (this.options.calculate_zoom) {
      this.calculateMarkerZooms();
    }
    this.calculateMinMaxZoom();
    if (this.options.map_mini && !VCO.Browser.touch) {
      this.createMiniMap();
    }
    this.initialMapLocation();
    this.fire("loaded", this.data);
  },
  _onWheel: function(e) {
    var self = this;
    if (e.ctrlKey) {
      var s = Math.exp(-e.deltaY / 100);
      this.touch_scale *= s;
      e.preventDefault();
      e.stopPropagation(e);
    }
    if (!this.scroll.start_time) {
      this.scroll.start_time = +new Date();
    }
    var time_left = Math.max(40 - (+new Date() - this.scroll.start_time), 0);
    clearTimeout(this.scroll.timer);
    this.scroll.timer = setTimeout(function() {
      self._scollZoom();
    }, time_left);
  },
  _scollZoom: function(e) {
    var self = this,
      current_zoom = this._getMapZoom();
    this.scroll.start_time = null;
    clearTimeout(this.scroll.timer);
    clearTimeout(this.scroll.timer_done);
    this.scroll.timer_done = setTimeout(function() {
      self._scollZoomDone();
    }, 1e3);
    this.zoomTo(Math.round(current_zoom * this.touch_scale));
  },
  _scollZoomDone: function(e) {
    this.touch_scale = 1;
  },
  _calculateZoomChange: function(origin, destination, correct_for_center) {
    return this._getBoundsZoom(origin, destination, correct_for_center);
  },
  _updateDisplay: function(w, h, animate, d) {
    this._updateMapDisplay(animate, d);
  },
  _initLayout: function() {
    this._el.map_mask = VCO.Dom.create(
      "div",
      "vco-map-mask",
      this._el.container
    );
    if (this.options.map_as_image) {
      this._el.map = VCO.Dom.create(
        "div",
        "vco-map-display vco-mapimage-display",
        this._el.map_mask
      );
    } else {
      this._el.map = VCO.Dom.create(
        "div",
        "vco-map-display",
        this._el.map_mask
      );
    }
  },
  _initData: function() {
    if (this.data.slides) {
      this._createMarkers(this.data.slides);
      this._resetMarkersActive();
      this._markers[this.current_marker].active(true);
      this._loaded.data = true;
      this._initialMapLocation();
    }
  },
  _initEvents: function() {
    var self = this;
    this._el.map.addEventListener("wheel", function(e) {
      self._onWheel(e);
    });
  },
});
VCO.MapMarker.Leaflet = VCO.MapMarker.extend({
  _createMarker: function(d, o) {
    var icon = {};
    if (
      d.location &&
      typeof d.location.lat == "number" &&
      typeof d.location.lon == "number"
    ) {
      this.data.real_marker = true;
      var use_custom_marker =
        o.use_custom_markers || d.location.use_custom_marker;
      if (use_custom_marker && d.location.icon) {
        this._custom_icon = {
          url: d.location.icon,
          size: d.location.iconSize || [48, 48],
          anchor: this._customIconAnchor(d.location.iconSize),
        };
        this._icon = this._createIcon();
      } else if (use_custom_marker && d.location.image) {
        this._custom_image_icon = d.location.image;
        this._icon = this._createImage();
      } else {
        this._icon = this._createDefaultIcon(false);
      }
      this._marker = new L.marker([d.location.lat, d.location.lon], {
        title: d.text.headline,
        icon: this._icon,
      });
      this._marker.on("click", this._onMarkerClick, this);
      if (o.map_popup) {
        this._createPopup(d, o);
      }
    }
  },
  _addTo: function(m) {
    if (this.data.real_marker) {
      this._marker.addTo(m);
    }
  },
  _createPopup: function(d, o) {},
  _active: function(a) {
    var self = this;
    if (this.data.media && this.data.media.mediatype) {
      this.media_icon_class =
        "vco-mapmarker-icon vco-icon-" + this.data.media.mediatype.type;
    } else {
      this.media_icon_class = "vco-mapmarker-icon vco-icon-plaintext";
    }
    if (this.data.real_marker) {
      if (a) {
        this._marker.setZIndexOffset(100);
      } else {
        clearTimeout(this.timer);
        this._marker.setZIndexOffset(0);
      }
      if (this._custom_icon) {
        this._icon = this._createIcon();
      } else if (this._custom_image_icon) {
        this._icon = this._createImage(a);
      } else {
        this._icon = this._createDefaultIcon(a);
      }
      this._setIcon();
    }
  },
  _createIcon: function() {
    return new L.icon({
      iconUrl: this._custom_icon.url,
      iconSize: this._custom_icon.size,
      iconAnchor: this._custom_icon.anchor,
    });
  },
  _createImage: function(active) {
    var className = active
      ? "vco-mapmarker-image-icon-active"
      : "vco-mapmarker-image-icon";
    return new L.icon({
      iconUrl: url,
      iconSize: [48],
      iconAnchor: [24, 48],
      shadowSize: [68, 95],
      shadowAnchor: [22, 94],
      className: className,
    });
  },
  _createDefaultIcon: function(active) {
    // if (active) {
    //     ga('send', 'event', { eventCategory: 'StorymapJS', eventAction: 'storymap_click', eventLabel:'nova_reperta'});
    // }
    var className = active ? "vco-mapmarker-active" : "vco-mapmarker";
    return L.divIcon({
      className: className + " " + this.media_icon_class,
      iconAnchor: [10, 10],
    });
  },
  _customIconAnchor: function(size) {
    if (size) {
      return [size[0] * 0.5, size[1]];
    } else {
      return [24, 48];
    }
  },
  _openPopup: function() {
    this._marker.openPopup();
  },
  _setIcon: function() {
    this._marker.setIcon(this._icon);
  },
  _location: function() {
    if (this.data.real_marker) {
      return this._marker.getLatLng();
    } else {
      return {};
    }
  },
});
VCO.Map.Leaflet = VCO.Map.extend({
  includes: [VCO.Events],
  _createMap: function() {
    this._map = new L.map(this._el.map, {
      scrollWheelZoom: false,
      zoomControl: !this.options.map_mini,
    });
    this._map.on("load", this._onMapLoaded, this);
    this._map.on("moveend", this._onMapMoveEnd, this);
    this._map.attributionControl.setPrefix(
      "<a href='http://storymap.knightlab.com/' target='_blank' class='vco-knightlab-brand'><span>&#x25a0;</span> StoryMapJS</a>"
    );
    var map_type_arr = this.options.map_type.split(":");
    this._tile_layer = this._createTileLayer(this.options.map_type);
    this._tile_layer.on("load", this._onTilesLoaded, this);
    this._map.addLayer(this._tile_layer);
    if (this._image_layer) {
      this._map.addLayer(this._image_layer);
    }
    this._line = this._createLine(this._line);
    this._line.setStyle({ color: this.options.line_color_inactive });
    this._addLineToMap(this._line);
    this._line_active = this._createLine(this._line_active);
    this._line_active.setStyle({ opacity: 1 });
    this._addLineToMap(this._line_active);
    if (this.options.map_as_image) {
      this._line_active.setStyle({ opacity: 0 });
      this._line.setStyle({ opacity: 0 });
    }
  },
  _createMiniMap: function() {
    if (this.options.map_as_image) {
      this.zoom_min_max.min = 0;
    }
    if (!this.bounds_array) {
      this.bounds_array = this._getAllMarkersBounds(this._markers);
    }
    this._tile_layer_mini = this._createTileLayer(this.options.map_type);
    this._mini_map = new L.Control.MiniMap(this._tile_layer_mini, {
      width: 150,
      height: 100,
      position: "topleft",
      bounds_array: this.bounds_array,
      zoomLevelFixed: this.zoom_min_max.min,
      zoomAnimation: true,
      aimingRectOptions: {
        fillColor: "#FFFFFF",
        color: "#FFFFFF",
        opacity: 0.4,
        weight: 1,
        stroke: true,
      },
    }).addTo(this._map);
    this._mini_map.getContainer().style.backgroundColor = this.options.map_background_color;
  },
  _createBackgroundMap: function(tiles) {
    trace("CREATE BACKGROUND MAP");
    if (!this._image_layer) {
      this._image_layer = new L.layerGroup();
      this._map.addLayer(this._image_layer);
    } else {
      this._image_layer.clearLayers();
    }
    if (tiles) {
      for (x in tiles) {
        var target_tile = tiles[x],
          image = {},
          tile = {
            x: 0,
            y: 0,
            url: target_tile.src,
            height: parseInt(target_tile.style.height.split("px")[0]),
            width: parseInt(target_tile.style.width.split("px")[0]),
            pos: { start: 0, end: 0 },
          };
        if (target_tile.style.left || target_tile.style.top) {
          if (target_tile.style.left) {
            tile.x = parseInt(target_tile.style.left.split("px")[0]);
          }
          if (target_tile.style.top) {
            tile.y = parseInt(target_tile.style.top.split("px")[0]);
          }
        } else if (
          target_tile.style["-webkit-transform"] ||
          target_tile.style["transform"] ||
          target_tile.style["-ms-transform"]
        ) {
          var t_array;
          if (target_tile.style["-webkit-transform"]) {
            t_array = target_tile.style["-webkit-transform"]
              .split("3d(")[1]
              .split(", 0)")[0]
              .split(", ");
          } else if (target_tile.style["transform"]) {
            t_array = target_tile.style["transform"]
              .split("3d(")[1]
              .split(", 0)")[0]
              .split(", ");
          } else if (target_tile.style["-ms-transform"]) {
            t_array = target_tile.style["-ms-transform"]
              .split("3d(")[1]
              .split(", 0)")[0]
              .split(", ");
          }
          tile.x = parseInt(t_array[0].split("px")[0]);
          tile.y = parseInt(t_array[1].split("px")[0]);
        }
        if (tile.url.match("toner")) {
          tile.url = tile.url.replace("/toner-hybrid/", "/toner-lines/");
          tile.url = tile.url.replace("/toner/", "/toner-background/");
        }
        tile.pos.start = this._map.containerPointToLatLng([tile.x, tile.y]);
        tile.pos.end = this._map.containerPointToLatLng([
          tile.x + tile.width,
          tile.y + tile.height,
        ]);
        image = new L.imageOverlay(tile.url, [tile.pos.start, tile.pos.end]);
        this._image_layer.addLayer(image);
      }
    }
  },
  _createTileLayer: function(map_type, options) {
    var _tilelayer = null,
      _map_type_arr = map_type.split(":"),
      _options = {},
      _attribution_knightlab =
        "<a href='http://leafletjs.com' title='A JS library for interactive maps'>Leaflet</a> | ";
    if (options) {
      _options = options;
    }
    switch (_map_type_arr[0]) {
      case "mapbox":
        var mapbox_url;
        _options.attribution =
          _attribution_knightlab +
          "<div class='mapbox-maplogo'></div><a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a>";
        if (_map_type_arr.length > 2) {
          var this_mapbox_map = _map_type_arr[2].substr("//styles/".length);
          mapbox_url =
            "https://api.mapbox.com/styles/v1/" +
            this_mapbox_map +
            "/tiles/256/{z}/{x}/{y}@2x?access_token=" +
            this.options.map_access_token;
        } else {
          var mapbox_name = _map_type_arr[1];
          mapbox_url =
            "https://api.tiles.mapbox.com/v4/" +
            mapbox_name +
            "/{z}/{x}/{y}.png?access_token=" +
            this.options.map_access_token;
        }
        _tilelayer = new L.TileLayer(mapbox_url, _options);
        break;
      case "stamen":
        _tilelayer = new L.StamenTileLayer(
          _map_type_arr[1] || "toner-lite",
          _options
        );
        this._map.getContainer().style.backgroundColor = "#FFFFFF";
        break;
      case "zoomify":
        _options.width = this.options.zoomify.width;
        _options.height = this.options.zoomify.height;
        _options.tolerance = this.options.zoomify.tolerance || 0.9;
        _options.attribution =
          _attribution_knightlab + this.options.zoomify.attribution;
        _tilelayer = new L.tileLayer.zoomify(
          this.options.zoomify.path,
          _options
        );
        break;
      case "osm":
        _options.subdomains = "ab";
        _options.attribution =
          _attribution_knightlab +
          "© <a target='_blank' href='http://www.openstreetmap.org'>OpenStreetMap</a> and contributors, under an <a target='_blank' href='http://www.openstreetmap.org/copyright'>open license</a>";
        _tilelayer = new L.TileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          _options
        );
        break;
      case "http":
      case "https":
        _options.subdomains = this.options.map_subdomains;
        _options.attribution =
          _attribution_knightlab + this.options.attribution;
        _tilelayer = new L.TileLayer(this.options.map_type, _options);
        break;
      default:
        _tilelayer = new L.StamenTileLayer("toner", _options);
        break;
    }
    return _tilelayer;
  },
  _onMapMoveEnd: function(e) {},
  _onTilesLoaded: function(e) {
    this._createBackgroundMap(e.target._tiles);
    this._tile_layer.off("load", this._onTilesLoaded, this);
  },
  _onMapZoomed: function(e) {
    trace("FIRST ZOOM");
    this._map.off("zoomend", this._onMapZoomed, this);
  },
  _onMapZoom: function(e) {},
  _createMarker: function(d) {
    var marker = new VCO.MapMarker.Leaflet(d, this.options);
    marker.on("markerclick", this._onMarkerClick, this);
    this._addMarker(marker);
    this._markers.push(marker);
    marker.marker_number = this._markers.length - 1;
    this.fire("markerAdded", marker);
  },
  _addMarker: function(marker) {
    marker.addTo(this._map);
  },
  _removeMarker: function(marker) {},
  _markerOverview: function() {
    var _location, _zoom;
    this._line_active.setStyle({ opacity: 0 });
    if (this.options.map_type == "zoomify" && this.options.map_as_image) {
      var _center_zoom = this._tile_layer.getCenterZoom(this._map);
      _location = _center_zoom.center;
      if (
        (this.options.map_center_offset &&
          this.options.map_center_offset.left != 0) ||
        this.options.map_center_offset.top != 0
      ) {
        _center_zoom.zoom = _center_zoom.zoom - 1;
        _location = this._getMapCenterOffset(_location, _center_zoom.zoom);
      }
      this._map.setView(_location, _center_zoom.zoom, {
        pan: {
          animate: true,
          duration: this.options.duration / 1e3,
          easeLinearity: 0.1,
        },
        zoom: {
          animate: true,
          duration: this.options.duration / 1e3,
          easeLinearity: 0.1,
        },
      });
    } else {
      this.bounds_array = this._getAllMarkersBounds(this._markers);
      if (
        (this.options.map_center_offset &&
          this.options.map_center_offset.left != 0) ||
        this.options.map_center_offset.top != 0
      ) {
        var the_bounds = new L.latLngBounds(this.bounds_array);
        _location = the_bounds.getCenter();
        _zoom = this._map.getBoundsZoom(the_bounds);
        _location = this._getMapCenterOffset(_location, _zoom - 1);
        this._map.setView(_location, _zoom - 1, {
          pan: {
            animate: true,
            duration: this.options.duration / 1e3,
            easeLinearity: 0.1,
          },
          zoom: {
            animate: true,
            duration: this.options.duration / 1e3,
            easeLinearity: 0.1,
          },
        });
      } else {
        this._map.fitBounds(this.bounds_array, { padding: [15, 15] });
      }
    }
    if (this._mini_map) {
      this._mini_map.minimize();
    }
  },
  _getAllMarkersBounds: function(markers_array) {
    var bounds_array = [];
    for (var i = 0; i < markers_array.length; i++) {
      if (markers_array[i].data.real_marker) {
        bounds_array.push([
          markers_array[i].data.location.lat,
          markers_array[i].data.location.lon,
        ]);
      }
    }
    return bounds_array;
  },
  _calculateMarkerZooms: function() {
    for (var i = 0; i < this._markers.length; i++) {
      if (this._markers[i].data.location) {
        var marker = this._markers[i],
          prev_marker,
          next_marker,
          marker_location,
          prev_marker_zoom,
          next_marker_zoom,
          calculated_zoom;
        if (marker.data.type && marker.data.type == "overview") {
          marker_location = this._getMapCenter(true);
        } else {
          marker_location = marker.location();
        }
        if (i > 0) {
          prev_marker = this._markers[i - 1].location();
        } else {
          prev_marker = this._getMapCenter(true);
        }
        prev_marker_zoom = this._calculateZoomChange(
          prev_marker,
          marker_location
        );
        if (i < this._markers.length - 1) {
          next_marker = this._markers[i + 1].location();
        } else {
          next_marker = this._getMapCenter(true);
        }
        next_marker_zoom = this._calculateZoomChange(
          next_marker,
          marker_location
        );
        if (prev_marker_zoom && prev_marker_zoom < next_marker_zoom) {
          calculated_zoom = prev_marker_zoom;
        } else if (next_marker_zoom) {
          calculated_zoom = next_marker_zoom;
        } else {
          calculated_zoom = prev_marker_zoom;
        }
        if (
          (this.options.map_center_offset &&
            this.options.map_center_offset.left != 0) ||
          this.options.map_center_offset.top != 0
        ) {
          calculated_zoom = calculated_zoom - 1;
        }
        marker.data.location.zoom = calculated_zoom;
      }
    }
  },
  _createLine: function(d) {
    return new L.Polyline([], {
      clickable: false,
      color: this.options.line_color,
      weight: this.options.line_weight,
      opacity: this.options.line_opacity,
      dashArray: this.options.line_dash,
      lineJoin: this.options.line_join,
      className: "vco-map-line",
    });
  },
  _addLineToMap: function(line) {
    this._map.addLayer(line);
  },
  _addToLine: function(line, d) {
    line.addLatLng({ lon: d.location.lon, lat: d.location.lat });
  },
  _replaceLines: function(line, array) {
    line.setLatLngs(array);
  },
  _panTo: function(loc, animate) {
    this._map.panTo(
      { lat: loc.lat, lon: loc.lon },
      {
        animate: true,
        duration: this.options.duration / 1e3,
        easeLinearity: 0.1,
      }
    );
  },
  _zoomTo: function(z, animate) {
    this._map.setZoom(z);
  },
  _viewTo: function(loc, opts) {
    var _animate = true,
      _duration = this.options.duration / 1e3,
      _zoom = this._getMapZoom(),
      _location = { lat: loc.lat, lon: loc.lon };
    if (!this.options.map_as_image) {
      this._line_active.setStyle({ opacity: 1 });
    }
    if (loc.zoom) {
      _zoom = loc.zoom;
    }
    if (opts) {
      if (opts.duration) {
        if (opts.duration == 0) {
          _animate = false;
        } else {
          _duration = duration;
        }
      }
      if (opts.zoom && this.options.calculate_zoom) {
        _zoom = opts.zoom;
      }
    }
    if (this.options.map_center_offset) {
      _location = this._getMapCenterOffset(_location, _zoom);
    }
    this._map.setView(_location, _zoom, {
      pan: { animate: _animate, duration: _duration, easeLinearity: 0.1 },
      zoom: { animate: _animate, duration: _duration, easeLinearity: 0.1 },
    });
    if (this._mini_map && this.options.width > this.options.skinny_size) {
      if (_zoom - 1 <= this.zoom_min_max.min) {
        this._mini_map.minimize();
      } else {
        this._mini_map.restore();
      }
    }
  },
  _getMapLocation: function(m) {
    return this._map.latLngToContainerPoint(m);
  },
  _getMapZoom: function() {
    return this._map.getZoom();
  },
  _getMapCenter: function(offset) {
    if (offset) {
    }
    return this._map.getCenter();
  },
  _getMapCenterOffset: function(location, zoom) {
    var target_point, target_latlng;
    target_point = this._map
      .project(location, zoom)
      .subtract([
        this.options.map_center_offset.left,
        this.options.map_center_offset.top,
      ]);
    target_latlng = this._map.unproject(target_point, zoom);
    return target_latlng;
  },
  _getBoundsZoom: function(origin, destination, correct_for_center) {
    var _origin = origin,
      _padding = [
        Math.abs(this.options.map_center_offset.left) * 3,
        Math.abs(this.options.map_center_offset.top) * 3,
      ];
    if (correct_for_center) {
      var _lat = _origin.lat + (_origin.lat - destination.lat) / 2,
        _lng = _origin.lng + (_origin.lng - destination.lng) / 2;
      _origin = new L.LatLng(_lat, _lng);
    }
    var bounds = new L.LatLngBounds([_origin, destination]);
    if (this.options.less_bounce) {
      return this._map.getBoundsZoom(bounds, false, _padding);
    } else {
      return this._map.getBoundsZoom(bounds, true, _padding);
    }
  },
  _getZoomifyZoom: function() {},
  _initialMapLocation: function() {
    this._map.on("zoomend", this._onMapZoomed, this);
  },
  _updateMapDisplay: function(animate, d) {
    if (animate) {
      var duration = this.options.duration,
        self = this;
      if (d) {
        duration = d;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(function() {
        self._refreshMap();
      }, duration);
    } else {
      if (!this.timer) {
        this._refreshMap();
      }
    }
    if (
      this._mini_map &&
      this._el.container.offsetWidth < this.options.skinny_size
    ) {
      this._mini_map.true_hide = true;
    } else if (this._mini_map) {
      this._mini_map.true_hide = false;
    }
  },
  _refreshMap: function() {
    if (this._map) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this._map.invalidateSize();
      if (
        this._markers[this.current_marker].data.type &&
        this._markers[this.current_marker].data.type == "overview"
      ) {
        this._markerOverview();
      } else {
        this._viewTo(this._markers[this.current_marker].data.location, {
          zoom: this._getMapZoom(),
        });
      }
    }
  },
});
L.Map.include({
  _tryAnimatedPan: function(center, options) {
    var offset = this._getCenterOffset(center)._floor();
    this.panBy(offset, options);
    return true;
  },
  _tryAnimatedZoom: function(center, zoom, options) {
    if (typeof this._animateZoom == "undefined") {
      return false;
    }
    if (this._animatingZoom) {
      return true;
    }
    options = options || {};
    var scale = this.getZoomScale(zoom),
      offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
      origin = this._getCenterLayerPoint()._add(offset);
    this.fire("movestart").fire("zoomstart");
    this._animateZoom(center, zoom, origin, scale, null, true);
    return true;
  },
  getBoundsZoom: function(bounds, inside, padding) {
    bounds = L.latLngBounds(bounds);
    var zoom = this.getMinZoom() - (inside ? 1 : 0),
      minZoom = this.getMinZoom(),
      maxZoom = this.getMaxZoom(),
      size = this.getSize(),
      nw = bounds.getNorthWest(),
      se = bounds.getSouthEast(),
      zoomNotFound = true,
      boundsSize,
      zoom_array = [],
      best_zoom = { x: 0, y: 0 },
      smallest_zoom = {},
      final_zoom = 0;
    padding = L.point(padding || [0, 0]);
    size = this.getSize();
    for (var i = 0; i < maxZoom; i++) {
      zoom++;
      boundsSize = this.project(se, zoom)
        .subtract(this.project(nw, zoom))
        .add(padding);
      zoom_array.push({
        x: Math.abs(size.x - boundsSize.x),
        y: Math.abs(size.y - boundsSize.y),
      });
    }
    smallest_zoom = zoom_array[0];
    for (var j = 0; j < zoom_array.length; j++) {
      if (zoom_array[j].y <= smallest_zoom.y) {
        smallest_zoom.y = zoom_array[j].y;
        best_zoom.y = j;
      }
      if (zoom_array[j].x <= smallest_zoom.x) {
        smallest_zoom.x = zoom_array[j].x;
        best_zoom.x = j;
      }
    }
    final_zoom = Math.round((best_zoom.y + best_zoom.x) / 2);
    return final_zoom;
  },
});
L.TileLayer.include({
  getTiles: function() {
    return this._tiles;
  },
});
VCO.StoryMap = VCO.Class.extend({
  includes: VCO.Events,
  initialize: function(elem, data, options, listeners) {
    for (key in listeners) {
      var callbacks = listeners[key];
      if (typeof callbacks == "function") {
        this.on(key, callbacks);
      } else {
        for (var idx in callbacks) {
          this.on(key, callbacks[idx]);
        }
      }
    }
    var self = this;
    this.version = "0.1.16";
    this.ready = false;
    this._el = { container: {}, storyslider: {}, map: {}, menubar: {} };
    if (typeof elem === "object") {
      this._el.container = elem;
    } else {
      this._el.container = VCO.Dom.get(elem);
    }
    this._storyslider = {};
    this._map = {};
    this.map = {};
    this._menubar = {};
    this._loaded = { storyslider: false, map: false };
    this.data = {};
    this.options = {
      script_path: VCO.StoryMap.SCRIPT_PATH,
      height: this._el.container.offsetHeight,
      width: this._el.container.offsetWidth,
      layout: "landscape",
      base_class: "",
      default_bg_color: { r: 256, g: 256, b: 256 },
      map_size_sticky: 2.5,
      map_center_offset: null,
      less_bounce: false,
      start_at_slide: 0,
      call_to_action: false,
      call_to_action_text: "",
      menubar_height: 0,
      skinny_size: 650,
      relative_date: false,
      duration: 1e3,
      ease: VCO.Ease.easeInOutQuint,
      dragging: true,
      trackResize: true,
      map_type: "stamen:toner-lite",
      attribution: "",
      map_mini: true,
      map_subdomains: "",
      map_as_image: false,
      map_access_token:
        "pk.eyJ1IjoibnVrbmlnaHRsYWIiLCJhIjoiczFmd0hPZyJ9.Y_afrZdAjo3u8sz_r8m2Yw",
      map_background_color: "#d9d9d9",
      zoomify: {
        path: "",
        width: "",
        height: "",
        tolerance: 0.8,
        attribution: "",
      },
      map_height: 300,
      storyslider_height: 600,
      slide_padding_lr: 45,
      slide_default_fade: "0%",
      menubar_default_y: 0,
      path_gfx: "gfx",
      map_popup: false,
      zoom_distance: 100,
      calculate_zoom: true,
      line_follows_path: true,
      line_color: "#c34528",
      line_color_inactive: "#CCC",
      line_join: "miter",
      line_weight: 3,
      line_opacity: 0.8,
      line_dash: "5,5",
      show_lines: true,
      show_history_line: true,
      api_key_flickr: "8f2d5becf7b6ba46570741620054b507",
      language: "en",
    };
    this.current_slide = this.options.start_at_slide;
    this.animator_map = null;
    this.animator_storyslider = null;
    VCO.Util.mergeData(this.options, options);
    this._initData(data);
    return this;
  },
  _initData: function(data) {
    var self = this;
    if (typeof data === "string") {
      VCO.getJSON(data, function(d) {
        if (d && d.storymap) {
          VCO.Util.mergeData(self.data, d.storymap);
        }
        self._initOptions();
      });
    } else if (typeof data === "object") {
      if (data.storymap) {
        self.data = data.storymap;
      } else {
        trace("data must have a storymap property");
      }
      self._initOptions();
    } else {
      trace("data has unknown type");
      self._initOptions();
    }
  },
  _initOptions: function() {
    var self = this;
    VCO.Util.updateData(this.options, this.data);
    if (this.options.layout == "landscape") {
      this.options.map_center_offset = { left: -200, top: 0 };
    }
    if (this.options.map_type == "zoomify" && this.options.map_as_image) {
      this.options.map_size_sticky = 2;
    }
    if (this.options.map_as_image) {
      this.options.calculate_zoom = false;
    }
    if (this.options.relative_date) {
      if (typeof moment !== "undefined") {
        self._loadLanguage();
      } else {
        VCO.Load.js(
          this.options.script_path + "/library/moment.js",
          function() {
            self._loadLanguage();
            trace("LOAD MOMENTJS");
          }
        );
      }
    } else {
      self._loadLanguage();
    }
    if (VCO.Browser.chrome) {
      VCO.Load.css(
        VCO.Util.urljoin(
          this.options.script_path,
          "../css/fonts/font.emoji.css"
        ),
        function() {
          trace("LOADED EMOJI CSS FOR CHROME");
        }
      );
    }
  },
  _loadLanguage: function() {
    var self = this;
    if (this.options.language == "en") {
      this.options.language = VCO.Language;
      self._onDataLoaded();
    } else {
      VCO.Load.js(
        VCO.Util.urljoin(
          this.options.script_path,
          "/locale/" + this.options.language + ".js"
        ),
        function() {
          self._onDataLoaded();
        }
      );
    }
  },
  goTo: function(n) {
    if (n != this.current_slide) {
      this.current_slide = n;
      this._storyslider.goTo(this.current_slide);
      this._map.goTo(this.current_slide);
    }
  },
  updateDisplay: function() {
    if (this.ready) {
      this._updateDisplay();
    }
  },
  _initLayout: function() {
    var self = this;
    this._el.container.className += " vco-storymap";
    this.options.base_class = this._el.container.className;
    this._el.menubar = VCO.Dom.create("div", "vco-menubar", this._el.container);
    this._el.map = VCO.Dom.create("div", "vco-map", this._el.container);
    this._el.storyslider = VCO.Dom.create(
      "div",
      "vco-storyslider",
      this._el.container
    );
    this.options.width = this._el.container.offsetWidth;
    this.options.height = this._el.container.offsetHeight;
    this._el.map.style.height = "1px";
    this._el.storyslider.style.top = "1px";
    this._map = new VCO.Map.Leaflet(this._el.map, this.data, this.options);
    this.map = this._map._map;
    this._map.on("loaded", this._onMapLoaded, this);
    this._el.map.style.backgroundColor = this.options.map_background_color;
    this._menubar = new VCO.MenuBar(
      this._el.menubar,
      this._el.container,
      this.options
    );
    this._storyslider = new VCO.StorySlider(
      this._el.storyslider,
      this.data,
      this.options
    );
    this._storyslider.on("loaded", this._onStorySliderLoaded, this);
    this._storyslider.on("title", this._onTitle, this);
    this._storyslider.init();
    if (this.options.layout == "portrait") {
      this.options.map_height =
        this.options.height / this.options.map_size_sticky;
      this.options.storyslider_height =
        this.options.height -
        this._el.menubar.offsetHeight -
        this.options.map_height -
        1;
      this._menubar.setSticky(0);
    } else {
      this.options.menubar_height = this._el.menubar.offsetHeight;
      this.options.map_height = this.options.height;
      this.options.storyslider_height =
        this.options.height - this._el.menubar.offsetHeight - 1;
      this._menubar.setSticky(this.options.menubar_height);
    }
    this._updateDisplay(this.options.map_height, true, 2e3);
    this._menubar.show(2e3);
  },
  _initEvents: function() {
    this._menubar.on("collapse", this._onMenuBarCollapse, this);
    this._menubar.on("back_to_start", this._onBackToStart, this);
    this._menubar.on("overview", this._onOverview, this);
    this._storyslider.on("change", this._onSlideChange, this);
    this._storyslider.on("colorchange", this._onColorChange, this);
    this._map.on("change", this._onMapChange, this);
  },
  _updateDisplay: function(map_height, animate, d) {
    var duration = this.options.duration,
      display_class = this.options.base_class,
      self = this;
    if (d) {
      duration = d;
    }
    this.options.width = this._el.container.offsetWidth;
    this.options.height = this._el.container.offsetHeight;
    if (this.options.width <= this.options.skinny_size) {
      this.options.layout = "portrait";
    } else {
      this.options.layout = "landscape";
    }
    if (map_height) {
      this.options.map_height = map_height;
    }
    if (VCO.Browser.touch) {
      this.options.layout = VCO.Browser.orientation();
      display_class += " vco-mobile";
    }
    if (this.options.layout == "portrait") {
      display_class += " vco-skinny";
      this._map.setMapOffset(0, 0);
      this.options.map_height =
        this.options.height / this.options.map_size_sticky;
      this.options.storyslider_height =
        this.options.height - this.options.map_height - 1;
      this._menubar.setSticky(0);
      display_class += " vco-layout-portrait";
      if (animate) {
        if (this.animator_map) {
          this.animator_map.stop();
        }
        this.animator_map = VCO.Animate(this._el.map, {
          height: this.options.map_height + "px",
          duration: duration,
          easing: VCO.Ease.easeOutStrong,
          complete: function() {
            self._map.updateDisplay(
              self.options.width,
              self.options.map_height,
              animate,
              d,
              self.options.menubar_height
            );
          },
        });
        if (this.animator_storyslider) {
          this.animator_storyslider.stop();
        }
        this.animator_storyslider = VCO.Animate(this._el.storyslider, {
          height: this.options.storyslider_height + "px",
          duration: duration,
          easing: VCO.Ease.easeOutStrong,
        });
      } else {
        this._el.map.style.height = Math.ceil(this.options.map_height) + "px";
        this._el.storyslider.style.height =
          this.options.storyslider_height + "px";
      }
      this._menubar.updateDisplay(
        this.options.width,
        this.options.height,
        animate
      );
      this._map.updateDisplay(this.options.width, this.options.height, false);
      this._storyslider.updateDisplay(
        this.options.width,
        this.options.storyslider_height,
        animate,
        this.options.layout
      );
    } else {
      display_class += " vco-layout-landscape";
      this.options.menubar_height = this._el.menubar.offsetHeight;
      this.options.map_height = this.options.height;
      this.options.storyslider_height = this.options.height;
      this._menubar.setSticky(this.options.menubar_height);
      this._menubar.setSticky(this.options.menubar_height);
      this._el.map.style.height = this.options.height + "px";
      this._map.setMapOffset(-(this.options.width / 4), 0);
      this._el.storyslider.style.top = 0;
      this._el.storyslider.style.height =
        this.options.storyslider_height + "px";
      this._menubar.updateDisplay(
        this.options.width,
        this.options.height,
        animate
      );
      this._map.updateDisplay(
        this.options.width,
        this.options.height,
        animate,
        d
      );
      this._storyslider.updateDisplay(
        this.options.width / 2,
        this.options.storyslider_height,
        animate,
        this.options.layout
      );
    }
    if (this.options.language.direction == "rtl") {
      display_class += " vco-rtl";
    } else if (VCO.Language.direction == "rtl") {
      display_class += " vco-rtl";
    }
    this._el.container.className = display_class;
  },
  _onDataLoaded: function(e) {
    this.fire("dataloaded");
    this._initLayout();
    this._initEvents();
    this.ready = true;
  },
  _onTitle: function(e) {
    this.fire("title", e);
  },
  _onColorChange: function(e) {
    if (e.color || e.image) {
      this._menubar.setColor(true);
    } else {
      this._menubar.setColor(false);
    }
  },
  _onSlideChange: function(e) {
    if (this.current_slide != e.current_slide) {
      this.current_slide = e.current_slide;
      this._map.goTo(this.current_slide);
      this.fire("change", { current_slide: this.current_slide }, this);
    }
  },
  _onMapChange: function(e) {
    if (this.current_slide != e.current_marker) {
      this.current_slide = e.current_marker;
      this._storyslider.goTo(this.current_slide);
      this.fire("change", { current_slide: this.current_slide }, this);
    }
  },
  _onOverview: function(e) {
    this._map.markerOverview();
  },
  _onBackToStart: function(e) {
    this.current_slide = 0;
    this._map.goTo(this.current_slide);
    this._storyslider.goTo(this.current_slide);
    this.fire("change", { current_slide: this.current_slide }, this);
  },
  _onMenuBarCollapse: function(e) {
    this._updateDisplay(e.y, true);
  },
  _onMouseClick: function(e) {},
  _fireMouseEvent: function(e) {
    if (!this._loaded) {
      return;
    }
    var type = e.type;
    type =
      type === "mouseenter"
        ? "mouseover"
        : type === "mouseleave"
        ? "mouseout"
        : type;
    if (!this.hasEventListeners(type)) {
      return;
    }
    if (type === "contextmenu") {
      VCO.DomEvent.preventDefault(e);
    }
    this.fire(type, { latlng: "something", layerPoint: "something else" });
  },
  _onMapLoaded: function() {
    this._loaded.map = true;
    this._onLoaded();
  },
  _onStorySliderLoaded: function() {
    this._loaded.storyslider = true;
    this._onLoaded();
  },
  _onLoaded: function() {
    if (this._loaded.storyslider && this._loaded.map) {
      this.fire("loaded", this.data);
    }
  },
});
(function(_) {
  var scripts = document.getElementsByTagName("script"),
    src = scripts[scripts.length - 1].src;
  _.SCRIPT_PATH = src.substr(0, src.lastIndexOf("/"));
})(VCO.StoryMap);
function gaSendEvent(){
  console.log('ga function running')
  ga('send', 'event', { eventCategory: 'StorymapJS', eventAction: 'storymap_click', eventLabel:'nova_reperta'});
}