(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Thread"] = factory();
	else
		root["Thread"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _shortid = __webpack_require__(1);
	
	var _shortid2 = _interopRequireDefault(_shortid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Thread = function () {
	  function Thread() {
	    _classCallCheck(this, Thread);
	
	    this.threadId = (0, _shortid2.default)();
	    console.log('Init thread ' + this.threadId);
	    this.worker = null;
	  }
	
	  _createClass(Thread, [{
	    key: 'createWorker',
	    value: function createWorker() {
	      var fnString = this.run.toString();
	      var blob = new Blob(['\n      console.log(\'Running worker with threadId: ' + this.threadId + '\');\n      (async () => {\n        const context = JSON.parse(`' + JSON.stringify(this).replace(/\\"/g, '"') + '`);\n        async function ' + fnString + '\n        run = run.bind(context);\n        const result = await run();\n        self.postMessage({result, context, threadId: \'' + this.threadId + '\'});\n      })();\n      '], { type: 'text/javascript' });
	      var url = URL.createObjectURL(blob);
	      this.worker = new Worker(url);
	    }
	  }, {
	    key: 'run',
	    value: function run() {}
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this = this;
	
	      // run the run method in a worker
	      console.log('Starting ' + this.threadId);
	      return new Promise(function (resolve, reject) {
	        _this.createWorker();
	        _this.worker.onmessage = function (event) {
	          var _event$data = event.data,
	              result = _event$data.result,
	              context = _event$data.context,
	              threadId = _event$data.threadId;
	
	          if (threadId === _this.threadId) {
	            Object.assign(_this, context);
	            _this.worker.terminate();
	            return resolve(result);
	          }
	        };
	      });
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this.worker.terminate();
	    }
	  }]);
	
	  return Thread;
	}();
	
	exports.default = Thread;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var alphabet = __webpack_require__(3);
	var build = __webpack_require__(5);
	var isValid = __webpack_require__(9);
	
	// if you are using cluster or multiple servers use this to make each instance
	// has a unique value for worker
	// Note: I don't know if this is automatically set when using third
	// party cluster solutions such as pm2.
	var clusterWorkerId = __webpack_require__(10) || 0;
	
	/**
	 * Set the seed.
	 * Highly recommended if you don't want people to try to figure out your id schema.
	 * exposed as shortid.seed(int)
	 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
	 */
	function seed(seedValue) {
	    alphabet.seed(seedValue);
	    return module.exports;
	}
	
	/**
	 * Set the cluster worker or machine id
	 * exposed as shortid.worker(int)
	 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
	 * returns shortid module so it can be chained.
	 */
	function worker(workerId) {
	    clusterWorkerId = workerId;
	    return module.exports;
	}
	
	/**
	 *
	 * sets new characters to use in the alphabet
	 * returns the shuffled alphabet
	 */
	function characters(newCharacters) {
	    if (newCharacters !== undefined) {
	        alphabet.characters(newCharacters);
	    }
	
	    return alphabet.shuffled();
	}
	
	/**
	 * Generate unique id
	 * Returns string id
	 */
	function generate() {
	  return build(clusterWorkerId);
	}
	
	// Export all other functions as properties of the generate function
	module.exports = generate;
	module.exports.generate = generate;
	module.exports.seed = seed;
	module.exports.worker = worker;
	module.exports.characters = characters;
	module.exports.isValid = isValid;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var randomFromSeed = __webpack_require__(4);
	
	var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
	var alphabet;
	var previousSeed;
	
	var shuffled;
	
	function reset() {
	    shuffled = false;
	}
	
	function setCharacters(_alphabet_) {
	    if (!_alphabet_) {
	        if (alphabet !== ORIGINAL) {
	            alphabet = ORIGINAL;
	            reset();
	        }
	        return;
	    }
	
	    if (_alphabet_ === alphabet) {
	        return;
	    }
	
	    if (_alphabet_.length !== ORIGINAL.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
	    }
	
	    var unique = _alphabet_.split('').filter(function(item, ind, arr){
	       return ind !== arr.lastIndexOf(item);
	    });
	
	    if (unique.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
	    }
	
	    alphabet = _alphabet_;
	    reset();
	}
	
	function characters(_alphabet_) {
	    setCharacters(_alphabet_);
	    return alphabet;
	}
	
	function setSeed(seed) {
	    randomFromSeed.seed(seed);
	    if (previousSeed !== seed) {
	        reset();
	        previousSeed = seed;
	    }
	}
	
	function shuffle() {
	    if (!alphabet) {
	        setCharacters(ORIGINAL);
	    }
	
	    var sourceArray = alphabet.split('');
	    var targetArray = [];
	    var r = randomFromSeed.nextValue();
	    var characterIndex;
	
	    while (sourceArray.length > 0) {
	        r = randomFromSeed.nextValue();
	        characterIndex = Math.floor(r * sourceArray.length);
	        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
	    }
	    return targetArray.join('');
	}
	
	function getShuffled() {
	    if (shuffled) {
	        return shuffled;
	    }
	    shuffled = shuffle();
	    return shuffled;
	}
	
	/**
	 * lookup shuffled letter
	 * @param index
	 * @returns {string}
	 */
	function lookup(index) {
	    var alphabetShuffled = getShuffled();
	    return alphabetShuffled[index];
	}
	
	function get () {
	  return alphabet || ORIGINAL;
	}
	
	module.exports = {
	    get: get,
	    characters: characters,
	    seed: setSeed,
	    lookup: lookup,
	    shuffled: getShuffled
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	
	// Found this seed-based random generator somewhere
	// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)
	
	var seed = 1;
	
	/**
	 * return a random number based on a seed
	 * @param seed
	 * @returns {number}
	 */
	function getNextValue() {
	    seed = (seed * 9301 + 49297) % 233280;
	    return seed/(233280.0);
	}
	
	function setSeed(_seed_) {
	    seed = _seed_;
	}
	
	module.exports = {
	    nextValue: getNextValue,
	    seed: setSeed
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var generate = __webpack_require__(6);
	var alphabet = __webpack_require__(3);
	
	// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
	// This number should be updated every year or so to keep the generated id short.
	// To regenerate `new Date() - 0` and bump the version. Always bump the version!
	var REDUCE_TIME = 1459707606518;
	
	// don't change unless we change the algos or REDUCE_TIME
	// must be an integer and less than 16
	var version = 6;
	
	// Counter is used when shortid is called multiple times in one second.
	var counter;
	
	// Remember the last time shortid was called in case counter is needed.
	var previousSeconds;
	
	/**
	 * Generate unique id
	 * Returns string id
	 */
	function build(clusterWorkerId) {
	    var str = '';
	
	    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);
	
	    if (seconds === previousSeconds) {
	        counter++;
	    } else {
	        counter = 0;
	        previousSeconds = seconds;
	    }
	
	    str = str + generate(version);
	    str = str + generate(clusterWorkerId);
	    if (counter > 0) {
	        str = str + generate(counter);
	    }
	    str = str + generate(seconds);
	    return str;
	}
	
	module.exports = build;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var alphabet = __webpack_require__(3);
	var random = __webpack_require__(7);
	var format = __webpack_require__(8);
	
	function generate(number) {
	    var loopCounter = 0;
	    var done;
	
	    var str = '';
	
	    while (!done) {
	        str = str + format(random, alphabet.get(), 1);
	        done = number < (Math.pow(16, loopCounter + 1 ) );
	        loopCounter++;
	    }
	    return str;
	}
	
	module.exports = generate;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';
	
	var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto
	
	var randomByte;
	
	if (!crypto || !crypto.getRandomValues) {
	    randomByte = function(size) {
	        var bytes = [];
	        for (var i = 0; i < size; i++) {
	            bytes.push(Math.floor(Math.random() * 256));
	        }
	        return bytes;
	    };
	} else {
	    randomByte = function(size) {
	        return crypto.getRandomValues(new Uint8Array(size));
	    };
	}
	
	module.exports = randomByte;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * Secure random string generator with custom alphabet.
	 *
	 * Alphabet must contain 256 symbols or less. Otherwise, the generator
	 * will not be secure.
	 *
	 * @param {generator} random The random bytes generator.
	 * @param {string} alphabet Symbols to be used in new random string.
	 * @param {size} size The number of symbols in new random string.
	 *
	 * @return {string} Random string.
	 *
	 * @example
	 * const format = require('nanoid/format')
	 *
	 * function random (size) {
	 *   const result = []
	 *   for (let i = 0; i < size; i++) {
	 *     result.push(randomByte())
	 *   }
	 *   return result
	 * }
	 *
	 * format(random, "abcdef", 5) //=> "fbaef"
	 *
	 * @name format
	 * @function
	 */
	module.exports = function (random, alphabet, size) {
	  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
	  var step = Math.ceil(1.6 * mask * size / alphabet.length)
	
	  var id = ''
	  while (true) {
	    var bytes = random(step)
	    for (var i = 0; i < step; i++) {
	      var byte = bytes[i] & mask
	      if (alphabet[byte]) {
	        id += alphabet[byte]
	        if (id.length === size) return id
	      }
	    }
	  }
	}
	
	/**
	 * @callback generator
	 * @param {number} bytes The number of bytes to generate.
	 * @return {number[]} Random bytes.
	 */


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var alphabet = __webpack_require__(3);
	
	function isShortId(id) {
	    if (!id || typeof id !== 'string' || id.length < 6 ) {
	        return false;
	    }
	
	    var nonAlphabetic = new RegExp('[^' +
	      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
	    ']');
	    return !nonAlphabetic.test(id);
	}
	
	module.exports = isShortId;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = 0;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=threadjs.js.map