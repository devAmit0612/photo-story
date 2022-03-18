/**
 * Photo Story is a Modern light box plugin for images and videos
 * @version 1.0.0
 * @author Amit Chauhan
 * @email chauhanammy@gmail.com
 * @license The MIT License (MIT)
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PhotoStory = factory());
})(this, (function () { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var arrayLikeToArray = createCommonjsModule(function (module) {
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(arrayLikeToArray);

	var arrayWithoutHoles = createCommonjsModule(function (module) {
	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return arrayLikeToArray(arr);
	}

	module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(arrayWithoutHoles);

	var iterableToArray = createCommonjsModule(function (module) {
	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}

	module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(iterableToArray);

	var unsupportedIterableToArray = createCommonjsModule(function (module) {
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}

	module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(unsupportedIterableToArray);

	var nonIterableSpread = createCommonjsModule(function (module) {
	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(nonIterableSpread);

	var toConsumableArray = createCommonjsModule(function (module) {
	function _toConsumableArray(arr) {
	  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
	}

	module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _toConsumableArray = unwrapExports(toConsumableArray);

	var classCallCheck = createCommonjsModule(function (module) {
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	var createClass = createCommonjsModule(function (module) {
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}

	module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _createClass = unwrapExports(createClass);

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
	}

	module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _typeof = unwrapExports(_typeof_1);

	var typeName = ['image', 'video', 'youtube', 'vimeo', 'dailymotion'];

	function checkPassiveListener() {
	  var supportsPassive = false;

	  try {
	    var opts = Object.defineProperty({}, 'passive', {
	      get: function get() {
	        supportsPassive = true;
	      }
	    });
	    window.addEventListener("testPassive", null, opts);
	    window.removeEventListener("testPassive", null, opts);
	  } catch (e) {}

	  return supportsPassive;
	}

	function deleteProps(obj) {
	  var object = obj;
	  Object.keys(object).forEach(function (key) {
	    try {
	      object[key] = null;
	    } catch (e) {}

	    try {
	      delete object[key];
	    } catch (e) {}
	  });
	}

	function extend() {
	  var obj = {};

	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  var options = Object(args[0]);
	  var defaults = args[args.length - 1];
	  obj = Object.assign.apply(Object, [obj].concat(args));

	  for (var key in defaults) {
	    if (key === 'gallery' && isObject(options[key])) {
	      var gallery = {
	        gallery: options[key]
	      };
	      Object.assign(defaults[key], gallery[key]);
	    } else {
	      if (isObject(defaults[key]) && isObject(options[key])) {
	        Object.assign(defaults[key], options[key]);
	      }
	    }
	  }

	  return obj;
	}

	function getCurrentObj(list, el) {
	  var currentObj = {};

	  if (list && list.size) {
	    Array.from(list.entries()).forEach(function (obj) {
	      var key = obj[0];
	      var values = obj[1];

	      if (values.indexOf(el) > -1) {
	        currentObj['index'] = values.indexOf(el);
	        currentObj['id'] = key;
	      }
	    });
	  } else {
	    var rel = el.getAttribute('rel');
	    currentObj['index'] = 0;

	    if (rel) {
	      currentObj['id'] = rel;
	    } else if (el.dataset.galleryId) {
	      currentObj['id'] = el.dataset.galleryId;
	    }
	  }

	  return currentObj;
	}

	function getFileType(value) {
	  var imgReg = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
	  var videoReg = /\.(mp4|mkv|wmv|m4v|mov|avi|flv|webm|flac|mka|m4a|aac|ogg)$/i;

	  if (imgReg.test(value)) {
	    return typeName[0];
	  } else if (videoReg.test(value)) {
	    return typeName[1];
	  } else if (value.indexOf('youtu') > -1) {
	    return typeName[2];
	  } else if (value.indexOf('vimeo') > -1) {
	    return typeName[3];
	  } else if (value.indexOf('dailymotion') > -1) {
	    return typeName[4];
	  }
	}

	function getElement(obj) {
	  if (isElement(obj)) {
	    return obj.jquery ? obj[0] : obj;
	  }

	  if (typeof obj === 'string' && obj.length > 0) {
	    return document.querySelectorAll(obj);
	  }

	  return null;
	}

	function getGallery(group) {
	  var gallery = {};
	  Array.from(group.entries()).forEach(function (obj) {
	    var array = [];
	    var key = obj[0];
	    var values = obj[1];
	    values.forEach(function (val) {
	      var o = {
	        main: val.getAttribute('href'),
	        thumb: getThumb(val),
	        title: getTitle(val),
	        captions: val.dataset.psCaptions
	      };
	      array.push(o);
	    });
	    gallery[key] = array;
	  });
	  return gallery;
	}

	function getGalleryGroup(el) {
	  var group = groupBy(el, function (element) {
	    var rel = element.getAttribute('rel');

	    if (rel && rel !== false && rel !== 'nofollow') {
	      return rel;
	    }
	  });
	  return group;
	}

	function getGalleryType(obj) {
	  for (var key in obj) {
	    if (Object.hasOwnProperty.call(obj, key)) {
	      var gallery = obj[key];
	      Array.from(gallery).forEach(function (gal) {
	        gal.type = getFileType(gal.main);

	        if (!gal.thumb) {
	          gal.thumb = gal.main;
	        }
	      });
	    }
	  }

	  return obj;
	}

	function getRel(el) {
	  var rel = el.getAttribute('rel');

	  if (rel && rel !== false && rel !== 'nofollow') {
	    return rel;
	  } else {
	    return 'gallery';
	  }
	}

	function getThumb(el) {
	  var img = el.getElementsByTagName('img');

	  if (img = isCollection(img)) {
	    return img.getAttribute('src');
	  } else if (typeof el.dataset.psThumb !== 'undefined') {
	    return el.dataset.psThumb;
	  } else {
	    return el.getAttribute('href');
	  }
	}

	function getTitle(el) {
	  var title = el.getAttribute('title');

	  if (title) {
	    return title;
	  } else if (typeof el.dataset.psTitle !== 'undefined') {
	    return el.dataset.psTitle;
	  }
	}

	function groupBy(list, keyGetter) {
	  var map = new Map();
	  list.forEach(function (item) {
	    var key = keyGetter(item) || getRel(item);
	    var collection = map.get(key);

	    if (!collection) {
	      map.set(key, [item]);
	    } else {
	      collection.push(item);
	    }
	  });
	  return map;
	}

	function isElement(obj) {
	  if (!obj || _typeof(obj) !== 'object') {
	    return false;
	  }

	  if (typeof obj.jquery !== 'undefined') {
	    obj = obj[0];
	  }

	  return typeof obj.nodeType !== 'undefined';
	}

	function isObject(obj) {
	  return _typeof(obj) === 'object' && obj !== null && obj.constructor && Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
	}

	function isCollection(collection) {
	  if (collection instanceof HTMLCollection && HTMLCollection.prototype.isPrototypeOf(collection)) {
	    return collection = collection[0];
	  }
	}

	var dom = {
	  createEl: function createEl(classes, tag) {
	    var _this = this;

	    var el = document.createElement(tag || 'div');

	    if (classes) {
	      classes.split(' ').forEach(function (className) {
	        _this.addClass(el, className);
	      });
	    }

	    return el;
	  },
	  counter: function counter() {
	    var counter = document.getElementById(this.getIdName('current_slide'));
	    counter.innerHTML = this.currentIndex + 1;
	  },
	  downloadURL: function downloadURL() {
	    var item = this.options.gallery[this.galleryId][this.currentIndex];
	    this.tools.download.href = item.main;
	  },
	  addClass: function addClass(el, className) {
	    if (!this.hasClass(el, className)) {
	      el.className += (el.className ? ' ' : '') + this.getClassName(className);
	    }
	  },
	  hasClass: function hasClass(el, className) {
	    return el.className && new RegExp('(^|\\s)' + this.getClassName(className) + '(\\s|$)').test(el.className);
	  },
	  removeClass: function removeClass(el, className) {
	    var reg = new RegExp('(\\s|^)' + this.getClassName(className) + '(\\s|$)');
	    el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	  },
	  getCSSVariable: function getCSSVariable(varName) {
	    var root = window.getComputedStyle(document.documentElement);
	    var property = '--ps-' + varName;
	    return root.getPropertyValue(property).replace(' ', '');
	  },
	  setCSS: function setCSS(el, varName, varValue) {
	    el.style.setProperty(varName, varValue);
	  },
	  getClassName: function getClassName(name) {
	    if (name && this.getCSSVariable('prefix')) {
	      return this.getCSSVariable('prefix') + name;
	    }

	    return name;
	  },
	  getIdName: function getIdName(name) {
	    if (name && this.getCSSVariable('prefix')) {
	      var prefix = this.getCSSVariable('prefix');
	      prefix = prefix.replace("-", "_");
	      return prefix + name;
	    }

	    return name;
	  },
	  getChildByClassName: function getChildByClassName(name) {
	    var child = this.el.children;
	    var childEl = [];

	    for (var i = 0; i < child.length; i++) {
	      if (this.hasClass(child[i], name)) {
	        childEl.push(child[i]);
	      }
	    }

	    return childEl;
	  }
	};

	var events = {
	  attachEvents: function attachEvents(element, events, handler) {
	    events.split(' ').forEach(function (event) {
	      if (!element.namespaces) {
	        element.namespaces = {};
	      }

	      var touch = ['touchstart', 'touchmove'].indexOf(event) >= 0;
	      var passive = checkPassiveListener();
	      var param = false;

	      if (touch && passive) {
	        param = {
	          passive: true
	        };
	      }

	      element.namespaces[event] = handler;
	      element.addEventListener(event, handler, param);
	    });
	  },
	  detachEvents: function detachEvents(element, events) {
	    events.split(' ').forEach(function (event) {
	      if (element.namespaces && element.namespaces[event]) {
	        element.removeEventListener(event, element.namespaces[event]);
	        delete element.namespaces[event];
	      }
	    });
	  }
	};

	var eventEmitter = {
	  on: function on(events, handler) {
	    var _this = this;

	    if (typeof handler !== 'function') {
	      return this;
	    }

	    events.split(' ').forEach(function (event) {
	      if (!_this.eventsListeners[event]) {
	        _this.eventsListeners[event] = [];
	      }

	      _this.eventsListeners[event].push(handler);
	    });
	    return this;
	  },
	  off: function off(events, handler) {
	    var _this2 = this;

	    if (!this.eventsListeners) {
	      return this;
	    }

	    events.split(' ').forEach(function (event) {
	      if (typeof handler === 'undefined') {
	        _this2.eventsListeners[event] = [];
	      } else if (_this2.eventsListeners[event]) {
	        _this2.eventsListeners[event].forEach(function (eventHandler, index) {
	          if (eventHandler === handler) {
	            _this2.eventsListeners[event].splice(index, 1);
	          }
	        });
	      }
	    });
	    return this;
	  },
	  emit: function emit(event, data) {
	    if (!this.eventsListeners) {
	      this.eventsListeners = {};
	    } // console.log('this.eventsListeners :>> ', this.eventsListeners);


	    if (typeof event === 'string') {
	      data = event;
	    }

	    if (this.eventsListeners && this.eventsListeners[event]) {
	      this.eventsListeners[event].forEach(function (eventHandler) {
	        eventHandler(data);
	      });
	    }

	    return this;
	  }
	};

	var fullscreen = {
	  enterFullscreen: function enterFullscreen() {
	    var doc = document;
	    var docEl = doc.documentElement;
	    var enter = docEl.requestFullScreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;

	    if (enter) {
	      enter.call(docEl);
	    } else if (typeof window.ActiveXObject !== "undefined") {
	      // Older IE.
	      var shell = new ActiveXObject("WScript.Shell");

	      if (shell !== null) {
	        shell.SendKeys("{F11}");
	      }
	    }

	    this.tools.fullscreen.innerHTML = this.options.template.exitFullscreen;
	  },
	  exitFullscreen: function exitFullscreen() {
	    var doc = document;
	    var exit = doc.cancelFullScreen || doc.webkitCancelFullScreen || doc.mozCancelFullScreen || doc.exitFullscreen || doc.webkitExitFullscreen;

	    if (exit) {
	      exit.call(doc);
	    } else if (typeof window.ActiveXObject !== "undefined") {
	      // Older IE.
	      var shell = new ActiveXObject("WScript.Shell");

	      if (shell !== null) {
	        shell.SendKeys("{F11}");
	      }
	    }

	    this.tools.fullscreen.innerHTML = this.options.template.enterFullscreen;
	  },
	  fullscreen: function fullscreen() {
	    var isEnter = document.fullScreenElement && document.fullScreenElement !== null || document.mozFullScreen || document.webkitIsFullScreen;

	    if (isEnter) {
	      this.exitFullscreen();
	    } else {
	      this.enterFullscreen();
	    }
	  }
	};

	function fadeIn(el, cb, duration) {
	  if (!el) {
	    return false;
	  }

	  if (!duration) {
	    duration = 300;
	  }

	  el.style.opacity = 0;
	  el.style.display = 'block';
	  var opacity = 1;
	  var step = 16.66666 * opacity / duration;

	  var fade = function fade() {
	    var currentOpacity = parseFloat(el.style.opacity);

	    if (!((currentOpacity += step) > opacity)) {
	      el.style.opacity = currentOpacity;
	      requestAnimationFrame(fade);
	    } else {
	      el.style.opacity = opacity;
	      cb && cb.call();
	    }
	  };

	  fade();
	}

	function fadeOut(el, cb, duration) {
	  if (!el) {
	    return false;
	  }

	  if (!duration) {
	    duration = 300;
	  }

	  el.style.opacity = 1;
	  var opacity = 0;
	  var step = 16.66666 / duration;

	  var fade = function fade() {
	    var currentOpacity = parseFloat(el.style.opacity || 1);

	    if ((currentOpacity -= step) < opacity) {
	      el.style.opacity = opacity;
	      el.style.display = 'none';
	      cb && cb.call();
	    } else {
	      el.style.opacity = currentOpacity;
	      requestAnimationFrame(fade);
	    }
	  };

	  fade();
	}

	var animation = {
	  fadeIn: fadeIn,
	  fadeOut: fadeOut
	};

	function setSlides(gallery) {
	  console.log('object :>> ', gallery);
	}

	var slide = {
	  setSlides: setSlides
	};

	function Navigation(_ref) {
	  var ps = _ref.ps,
	      moduleDefaults = _ref.moduleDefaults,
	      on = _ref.on;
	      _ref.emit;
	  moduleDefaults({
	    navigation: {
	      next: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n                    <path fill=\"currentColor\" d=\"M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z\"/>\n                </svg>",
	      prev: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n                    <path fill=\"currentColor\" d=\"M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z\"/>\n                </svg>"
	    }
	  });
	  var options = ps.options;

	  if (!options.navigation.enable) {
	    return false;
	  }

	  ps.navigation = {
	    nextEl: null,
	    prevEl: null
	  };

	  function init() {
	    var _ps$navigation = ps.navigation,
	        nextEl = _ps$navigation.nextEl,
	        prevEl = _ps$navigation.prevEl;
	    nextEl = ps.createEl('button button--next', 'button');
	    prevEl = ps.createEl('button button--prev', 'button');
	    nextEl.type = prevEl.type = 'button';
	    nextEl.innerHTML = options.navigation.next;
	    prevEl.innerHTML = options.navigation.prev;
	    nextEl.ariaLabel = 'Next slide';
	    prevEl.ariaLabel = 'Prev slide';
	    ps.attachEvents(nextEl, ps.events.click, function () {
	      ps.currentIndex++;
	      ps.counter();
	    });
	    ps.attachEvents(prevEl, ps.events.click, function () {
	      ps.currentIndex--;
	      ps.counter();
	    });
	    ps.el.append(nextEl, prevEl);
	    Object.assign(ps.navigation, {
	      nextEl: nextEl,
	      prevEl: prevEl
	    });
	  }

	  function destroy() {
	    var navigation = ps.navigation;
	    Object.keys(navigation).forEach(function (nav) {
	      ps.detachEvents(navigation[nav], ps.events.click);
	      navigation[nav] = null;
	    });
	  }

	  on('init', function () {
	    init();
	  });
	  on('destroy', function () {
	    destroy();
	  });
	}

	function Resize() {}

	function Video(_ref) {
	  _ref.ps;
	      var moduleDefaults = _ref.moduleDefaults;
	  moduleDefaults({
	    video: {
	      enable: true,
	      autoplay: false,
	      frame: 'SD'
	    }
	  }); // extendModuleOptions({
	  //     navigation: {
	  //         next: '<svg class="next"></svg>',
	  //         prev: '<svg class="prev"></svg>',
	  //     }
	  // });
	}

	var Modules = [Navigation, Resize, Video];
	var Modules$1 = {
	  Modules: Modules
	};

	function extendModuleDefaults() {
	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  return function extendOptions() {
	    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var moduleOptionName = Object.keys(obj)[0];
	    var moduleOptions = obj[moduleOptionName];
	    var options = args[0];
	    var ps = args[args.length - 1];

	    if (_typeof(moduleOptions) !== 'object' || moduleOptions === null) {
	      return false;
	    }

	    if (options[moduleOptionName] === true) {
	      options[moduleOptionName] = {
	        enable: true
	      };
	    }

	    if (_typeof(options[moduleOptionName]) === 'object' && !('enable' in options[moduleOptionName])) {
	      options[moduleOptionName].enabled = true;
	    }

	    if (options[moduleOptionName] === false) {
	      options[moduleOptionName] = {
	        enable: false
	      };
	    }

	    ps.options = extend(options, args[1], obj);
	  };
	}

	var defaults = {
	  gallery: {},
	  // Lightbox options
	  fullscreen: true,
	  showCounter: true,
	  download: true,
	  captions: false,
	  loop: false,
	  // Bullets
	  bullets: false,
	  // Set image loader and amount of preload image
	  loader: true,
	  preload: 1,
	  // Effects
	  effect: 'default',
	  // 'default' | 'Slide' | 'fade' | 'scale'
	  // Right to left
	  rtl: false,
	  template: {
	    enterFullscreen: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n            <path fill=\"currentColor\" d=\"M20 3h2v6h-2V5h-4V3h4zM4 3h4v2H4v4H2V3h2zm16 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z\"/>\n        </svg>",
	    exitFullscreen: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n            <path fill=\"currentColor\" d=\"M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z\"/>\n        </svg>",
	    download: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n            <path fill=\"currentColor\" d=\"M3 19h18v2H3v-2zm10-5.828L19.071 7.1l1.414 1.414L12 17 3.515 8.515 4.929 7.1 11 13.17V2h2v11.172z\"/>\n        </svg>",
	    close: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n            <path fill=\"currentColor\" d=\"M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z\"/>\n        </svg>"
	  }
	};

	var prototypes = {
	  dom: dom,
	  events: events,
	  eventEmitter: eventEmitter,
	  fullscreen: fullscreen,
	  animation: animation,
	  slide: slide
	};

	var PhotoStory = /*#__PURE__*/function () {
	  function PhotoStory() {
	    var _this = this;

	    _classCallCheck(this, PhotoStory);

	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var initial = args[0];

	    if (initial.constructor && isObject(initial)) {
	      this.options = args[0];
	      this.element = args[1];
	    } else {
	      this.element = args[0];
	      this.options = args[1];
	    }

	    if (this.element) {
	      if (typeof this.element === 'string' || this.element instanceof String) {
	        this.element = getElement(this.element);
	      }
	    } else {
	      alert("Element is undefined");
	      return false;
	    }

	    this.options = extend(this.options, defaults);
	    this.currentIndex = 0;
	    this.originalGallery = {};
	    this.eventsListeners = {};
	    this.modules = _toConsumableArray(this.__modules);
	    var ps = this;
	    this.modules.forEach(function (initial) {
	      initial({
	        ps: ps,
	        moduleDefaults: extendModuleDefaults(_this.options, defaults, ps),
	        on: ps.on.bind(ps),
	        off: ps.off.bind(ps),
	        emit: ps.emit.bind(ps)
	      });
	    });
	    var links = [];
	    this.element.forEach(function (el) {
	      if (el && el.nodeName === 'A') {
	        links.push(el);
	      } else {
	        var anchor = el.getElementsByTagName('a');
	        links.push.apply(links, _toConsumableArray(anchor));
	      }
	    }); // Build gallery object

	    var gallery = this.options.gallery;

	    if (gallery && Object.keys(gallery).length === 0 && Object.getPrototypeOf(gallery) === Object.prototype) {
	      this.originalGallery = getGalleryGroup(links);
	      gallery = getGallery(this.originalGallery);
	    } // Bind type of gallery with gallery


	    gallery = getGalleryType(gallery);
	    Object.assign(this.options.gallery, gallery);
	    this.events = {
	      click: 'click touchstart'
	    };
	    links.forEach(function (link) {
	      _this.attachEvents(link, _this.events.click, function (event) {
	        event.preventDefault();
	        _this.currentIndex = getCurrentObj(_this.originalGallery, event.currentTarget).index;
	        _this.galleryId = getCurrentObj(_this.originalGallery, event.currentTarget).id;

	        _this.open();
	      });
	    });
	  }

	  _createClass(PhotoStory, [{
	    key: "build",
	    value: function build() {
	      var gallery = this.options.gallery[this.galleryId];
	      var backdrop = this.createEl('lightbox__backdrop');
	      this.el = this.createEl('lightbox');
	      this.el.append(backdrop, this.toolbar(gallery));
	      this.setSlides(gallery);
	      document.body.appendChild(this.el);
	      this.fadeIn(backdrop);
	    }
	  }, {
	    key: "toolbar",
	    value: function toolbar(gallery) {
	      var _this2 = this;

	      this.tools = {};
	      var toolbar = this.createEl('lightbox__toolbar');
	      var options = this.createEl('lightbox__toolbar__options');
	      this.tools.close = this.createEl('button button--close', 'button');
	      this.tools.close.type = 'button';
	      this.tools.close.ariaLabel = 'Close gallery';
	      this.tools.close.innerHTML = this.options.template.close;
	      this.attachEvents(this.tools.close, this.events.click, function () {
	        _this2.close();
	      });

	      if (this.options.showCounter) {
	        var galleryItems = gallery.length;
	        var html = "<span id=\"".concat(this.getIdName('current_slide'), "\">").concat(ps.currentIndex + 1, "</span><span> / ").concat(galleryItems, "</span>");
	        this.tools.counter = this.createEl('lightbox__counter');
	        this.tools.counter.innerHTML = html;
	        toolbar.appendChild(this.tools.counter);
	      }

	      if (this.options.fullscreen) {
	        this.tools.fullscreen = this.createEl('button button--fullscreen', 'button');
	        this.tools.fullscreen.type = 'button';
	        this.tools.fullscreen.ariaLabel = 'Fullscreen';
	        this.tools.fullscreen.innerHTML = this.options.template.enterFullscreen;
	        this.attachEvents(this.tools.fullscreen, this.events.click, function () {
	          _this2.fullscreen();
	        });
	        options.appendChild(this.tools.fullscreen);
	      }

	      if (this.options.download) {
	        this.tools.download = this.createEl('button button--download', 'a');
	        this.downloadURL();
	        this.tools.download.innerHTML = this.options.template.download;
	        this.tools.download.download = '';
	        this.tools.download.ariaLabel = 'Download image';
	        options.appendChild(this.tools.download);
	      } // Append elements


	      options.appendChild(this.tools.close);
	      toolbar.appendChild(options);
	      return toolbar;
	    }
	  }, {
	    key: "init",
	    value: function init() {
	      if (!isObject(this)) {
	        alert("Photo story is undefined");
	        return false;
	      }

	      this.emit('beforeInit');
	      this.build();
	      this.emit('init');
	      this.emit('afterInit');
	    }
	  }, {
	    key: "open",
	    value: function open() {
	      if (!isObject(this.options.gallery)) {
	        alert("Gallery is undefined");
	        return false;
	      }

	      if (!this.galleryId) {
	        this.galleryId = Object.keys(this.options.gallery)[0];
	      }

	      this.init();
	    }
	  }, {
	    key: "close",
	    value: function close() {
	      var _this3 = this;

	      this.exitFullscreen();
	      this.currentIndex = 0;
	      this.galleryId = null;
	      Object.keys(this.tools).forEach(function (tool) {
	        _this3.detachEvents(_this3.tools[tool], ps.events.click);

	        _this3.tools[tool] = null;
	      });
	      this.tools = null;
	      var toolbar = this.getChildByClassName('lightbox__toolbar')[0];
	      var backdrop = this.getChildByClassName('lightbox__backdrop')[0];
	      var buttons = this.getChildByClassName('button');
	      toolbar.style.opacity = 0;
	      buttons.forEach(function (button) {
	        button.style.opacity = 0;
	      });
	      this.fadeOut(backdrop, function () {
	        document.body.removeChild(_this3.el);
	      });
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      var _this4 = this;

	      this.emit('destroy'); // Detach emitter events

	      Object.keys(this.eventsListeners).forEach(function (eventName) {
	        _this4.off(eventName);
	      });
	      this.close();
	      deleteProps(this);
	    }
	  }], [{
	    key: "install",
	    value: function install(initial) {
	      if (!PhotoStory.prototype.__modules) {
	        PhotoStory.prototype.__modules = [];
	      }

	      var modules = PhotoStory.prototype.__modules;

	      if (typeof initial === 'function' && modules.indexOf(initial) < 0) {
	        modules.push(initial);
	      }
	    }
	  }, {
	    key: "module",
	    value: function module(_module) {
	      if (Array.isArray(_module)) {
	        _module.forEach(function (m) {
	          return PhotoStory.install(m);
	        });

	        return PhotoStory;
	      }
	    }
	  }]);

	  return PhotoStory;
	}();

	Object.keys(prototypes).forEach(function (prototypeGroup) {
	  Object.keys(prototypes[prototypeGroup]).forEach(function (protoMethod) {
	    PhotoStory.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
	  });
	});
	PhotoStory.module(Modules$1.Modules);

	return PhotoStory;

}));
//# sourceMappingURL=photo-story.js.map
