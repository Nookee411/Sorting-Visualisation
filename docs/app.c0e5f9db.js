// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"app/model/SortingAlgorithms/BubbleSorter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BubbleSorter = BubbleSorter;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function BubbleSorter(context) {
  this.sortArray = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var array, i, j;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            array = context.getArray();
            i = 0;

          case 2:
            if (!(i < array.length)) {
              _context.next = 16;
              break;
            }

            j = 0;

          case 4:
            if (!(j < array.length - i - 1)) {
              _context.next = 13;
              break;
            }

            _context.next = 7;
            return context.compareAndDispatch(j, j + 1);

          case 7:
            if (!_context.sent) {
              _context.next = 10;
              break;
            }

            _context.next = 10;
            return context.swapAndDispatch(j, j + 1);

          case 10:
            j++;
            _context.next = 4;
            break;

          case 13:
            i++;
            _context.next = 2;
            break;

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}
},{}],"app/model/SortingAlgorithms/InsertionSorter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsertionSorter = InsertionSorter;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function InsertionSorter(context) {
  this.sortArray = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var array, i, indexOfEle;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            array = context.getArray(); //Taking each element to the left until it starts to fit comparer

            i = 1;

          case 2:
            if (!(i < array.length)) {
              _context.next = 18;
              break;
            }

            indexOfEle = i;

          case 4:
            _context.t0 = indexOfEle > 0;

            if (!_context.t0) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return context.compareAndDispatch(indexOfEle, indexOfEle - 1);

          case 8:
            _context.t0 = !_context.sent;

          case 9:
            if (!_context.t0) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return context.swapAndDispatch(indexOfEle - 1, indexOfEle);

          case 12:
            indexOfEle--;
            _context.next = 4;
            break;

          case 15:
            i++;
            _context.next = 2;
            break;

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}
},{}],"app/model/core/constants/sortingState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortingState = void 0;
var sortingState = {
  sorting: "SORTING",
  stopped: "STOPPED"
};
exports.sortingState = sortingState;
},{}],"app/model/SortingAlgorithms/SelectionSorter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectionSorter = SelectionSorter;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function SelectionSorter(context) {
  var array;
  this.sortArray = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var i, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            array = context.getArray();
            i = 0;

          case 2:
            if (!(i < array.length)) {
              _context.next = 11;
              break;
            }

            _context.next = 5;
            return findMaxValue(i);

          case 5:
            res = _context.sent;
            _context.next = 8;
            return context.swapAndDispatch(i, res);

          case 8:
            i++;
            _context.next = 2;
            break;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  var findMaxValue = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(startIndex) {
      var maxIndex, i;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              maxIndex = startIndex;
              i = startIndex;

            case 2:
              if (!(i < array.length)) {
                _context2.next = 10;
                break;
              }

              _context2.next = 5;
              return context.compareAndDispatch(i, maxIndex);

            case 5:
              if (!_context2.sent) {
                _context2.next = 7;
                break;
              }

              maxIndex = i;

            case 7:
              i++;
              _context2.next = 2;
              break;

            case 10:
              return _context2.abrupt("return", maxIndex);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function findMaxValue(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
}
},{}],"app/model/core/constants/sortEvent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortEvent = void 0;
var sortEvent = {
  ItemSwapped: "ITEMS_SORTED",
  SortingFinished: "SORTING_FINISHED",
  ItemScanned: "ITEM_SCANNED"
};
exports.sortEvent = sortEvent;
},{}],"app/model/core/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var config = {
  ComparisonTime: 20,
  SwapTime: 100
};
exports.config = config;
},{}],"app/model/SortingAlgorithms/MergeSorter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MergeSorter = MergeSorter;

var _sortEvent = require("../core/constants/sortEvent");

var _sortingState = require("../core/constants/sortingState");

var _config = require("../core/config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function MergeSorter(context) {
  var array;
  this.sortArray = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var mergeSort, _mergeSort, mergeArrays, _mergeArrays;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _mergeArrays = function _mergeArrays3() {
              _mergeArrays = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(leftArr, rightArr, startIndex) {
                var mergedArray, i, j, _loop, _i;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        mergedArray = [];
                        i = 0;
                        j = 0; //Two finger method

                      case 3:
                        if (!(i < leftArr.length && j < rightArr.length)) {
                          _context2.next = 8;
                          break;
                        }

                        _context2.next = 6;
                        return context.sleepDuration(_config.config.ComparisonTime).then(function () {
                          if (leftArr[i] < rightArr[j]) mergedArray.push(leftArr[i++]);else mergedArray.push(rightArr[j++]);
                          context.dispatch(_sortEvent.sortEvent.ItemScanned, {
                            indexOne: startIndex + mergedArray.length,
                            indexTwo: startIndex
                          });
                        });

                      case 6:
                        _context2.next = 3;
                        break;

                      case 8:
                        mergedArray = mergedArray.concat(leftArr.slice(i).concat(rightArr.slice(j)));

                        _loop = function _loop(_i) {
                          context.sleepDuration(_config.config.SwapTime).then(function (resolve) {
                            array[_i + startIndex] = mergedArray[_i];
                            context.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                              indexOne: _i + startIndex
                            });
                          });
                        };

                        for (_i = 0; _i < mergedArray.length && context.state == _sortingState.sortingState.sorting; _i++) {
                          _loop(_i);
                        }

                        return _context2.abrupt("return", mergedArray);

                      case 12:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _mergeArrays.apply(this, arguments);
            };

            mergeArrays = function _mergeArrays2(_x3, _x4, _x5) {
              return _mergeArrays.apply(this, arguments);
            };

            _mergeSort = function _mergeSort3() {
              _mergeSort = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(splittedArray, startIndex) {
                var middle, leftArr, rightArr;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(splittedArray.length <= 1)) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return", splittedArray);

                      case 2:
                        middle = Math.floor(splittedArray.length / 2);
                        leftArr = splittedArray.slice(0, middle);
                        rightArr = splittedArray.slice(middle);
                        _context.t0 = mergeArrays;
                        _context.next = 8;
                        return mergeSort(leftArr, startIndex);

                      case 8:
                        _context.t1 = _context.sent;
                        _context.next = 11;
                        return mergeSort(rightArr, startIndex + middle);

                      case 11:
                        _context.t2 = _context.sent;
                        _context.t3 = startIndex;
                        return _context.abrupt("return", (0, _context.t0)(_context.t1, _context.t2, _context.t3));

                      case 14:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _mergeSort.apply(this, arguments);
            };

            mergeSort = function _mergeSort2(_x, _x2) {
              return _mergeSort.apply(this, arguments);
            };

            array = context.getArray();
            _context3.next = 7;
            return mergeSort(array, 0);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
}
},{"../core/constants/sortEvent":"app/model/core/constants/sortEvent.js","../core/constants/sortingState":"app/model/core/constants/sortingState.js","../core/config":"app/model/core/config.js"}],"app/model/SortingAlgorithms/QuickSorter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuickSorter = QuickSorter;

var _sortEvent = require("../core/constants/sortEvent");

var _sortingState = require("../core/constants/sortingState");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function QuickSorter(context) {
  var array;
  this.sortArray = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var partition, _partition, quickSort, _quickSort, swap;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            swap = function _swap(leftIndex, rightIndex) {
              var temp = array[leftIndex];
              array[leftIndex] = array[rightIndex];
              array[rightIndex] = temp;
            };

            _quickSort = function _quickSort3() {
              _quickSort = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(left, right) {
                var index;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(array.length > 1)) {
                          _context2.next = 10;
                          break;
                        }

                        _context2.next = 3;
                        return partition(left, right);

                      case 3:
                        index = _context2.sent;

                        if (!(left < index - 1)) {
                          _context2.next = 7;
                          break;
                        }

                        _context2.next = 7;
                        return quickSort(left, index - 1);

                      case 7:
                        if (!(index < right)) {
                          _context2.next = 10;
                          break;
                        }

                        _context2.next = 10;
                        return quickSort(index, right);

                      case 10:
                        return _context2.abrupt("return", array);

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _quickSort.apply(this, arguments);
            };

            quickSort = function _quickSort2(_x3, _x4) {
              return _quickSort.apply(this, arguments);
            };

            _partition = function _partition3() {
              _partition = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(left, right) {
                var pivot, i, j;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        pivot = array[Math.floor((right + left) / 2)]; //middle element

                        i = left; //left pointer

                        j = right; //right pointer

                      case 3:
                        if (!(i <= j)) {
                          _context.next = 17;
                          break;
                        }

                      case 4:
                        if (!(array[i] < pivot && context.state == _sortingState.sortingState.sorting)) {
                          _context.next = 9;
                          break;
                        }

                        _context.next = 7;
                        return context.sleepDuration(20).then(function () {
                          context.dispatch(_sortEvent.sortEvent.ItemScanned, {
                            indexOne: i,
                            indexTwo: j
                          });
                          i++;
                        });

                      case 7:
                        _context.next = 4;
                        break;

                      case 9:
                        if (!(pivot < array[j] && context.state == _sortingState.sortingState.sorting)) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 12;
                        return context.sleepDuration(20).then(function () {
                          context.dispatch(_sortEvent.sortEvent.ItemScanned, {
                            indexOne: i,
                            indexTwo: j
                          });
                          j--;
                        });

                      case 12:
                        _context.next = 9;
                        break;

                      case 14:
                        //console.log(i + " : " + j);
                        if (i <= j) {
                          swap(i, j);
                          context.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                            indexOne: i,
                            indexTwo: j
                          });
                          i++;
                          j--;
                        }

                        _context.next = 3;
                        break;

                      case 17:
                        return _context.abrupt("return", i);

                      case 18:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _partition.apply(this, arguments);
            };

            partition = function _partition2(_x, _x2) {
              return _partition.apply(this, arguments);
            };

            array = context.getArray();
            _context3.next = 8;
            return quickSort(0, array.length - 1);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
}
},{"../core/constants/sortEvent":"app/model/core/constants/sortEvent.js","../core/constants/sortingState":"app/model/core/constants/sortingState.js"}],"app/model/SortingAlgorithms/HeapSorter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeapSorter = HeapSorter;

var _sortEvent = require("../core/constants/sortEvent");

var _sortingState = require("../core/constants/sortingState");

var _config = require("../core/config");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function HeapSorter(context) {
  var array;
  this.sortArray = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var heapSort, _heapSort, makeMaxHeap, _makeMaxHeap, applyHeapSort, _applyHeapSort, pushToMaxArray, _pushToMaxArray;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _pushToMaxArray = function _pushToMaxArray3() {
              _pushToMaxArray = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(array, i) {
                var leftChildIndex, rightChildInex, maxChildIndex, _ref2;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        leftChildIndex = (i + 1) * 2 - 1;
                        rightChildInex = (i + 1) * 2;
                        maxChildIndex = array[leftChildIndex] > array[rightChildInex] ? leftChildIndex : rightChildInex; //max of child if element exists, undefined if element has no child

                        if (!(array[maxChildIndex] != undefined && array[i] < array[maxChildIndex])) {
                          _context4.next = 11;
                          break;
                        }

                        _ref2 = [array[maxChildIndex], array[i]];
                        array[i] = _ref2[0];
                        array[maxChildIndex] = _ref2[1];
                        context.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                          indexOne: maxChildIndex,
                          indexTwo: i
                        });
                        pushToMaxArray(array, maxChildIndex);
                        _context4.next = 11;
                        return context.sleepDuration(_config.config.SwapTime);

                      case 11:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));
              return _pushToMaxArray.apply(this, arguments);
            };

            pushToMaxArray = function _pushToMaxArray2(_x, _x2) {
              return _pushToMaxArray.apply(this, arguments);
            };

            _applyHeapSort = function _applyHeapSort3() {
              _applyHeapSort = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var heapContainer, i;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        heapContainer = _toConsumableArray(array);
                        i = 0;

                      case 2:
                        if (!(heapContainer.length > 0)) {
                          _context3.next = 13;
                          break;
                        }

                        array[i] = heapContainer[0]; //Extracting max

                        heapContainer[0] = heapContainer[heapContainer.length - 1]; //swap small element to the top

                        heapContainer.pop();
                        pushToMaxArray(heapContainer, 0);
                        _context3.next = 9;
                        return context.sleepDuration(_config.config.ComparisonTime);

                      case 9:
                        context.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                          indexOne: i
                        });

                      case 10:
                        i++;
                        _context3.next = 2;
                        break;

                      case 13:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));
              return _applyHeapSort.apply(this, arguments);
            };

            applyHeapSort = function _applyHeapSort2() {
              return _applyHeapSort.apply(this, arguments);
            };

            _makeMaxHeap = function _makeMaxHeap3() {
              _makeMaxHeap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var middle, i;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        middle = Math.floor(array.length / 2);
                        i = middle;

                      case 2:
                        if (!(i >= 0)) {
                          _context2.next = 8;
                          break;
                        }

                        _context2.next = 5;
                        return pushToMaxArray(array, i);

                      case 5:
                        i--;
                        _context2.next = 2;
                        break;

                      case 8:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _makeMaxHeap.apply(this, arguments);
            };

            makeMaxHeap = function _makeMaxHeap2() {
              return _makeMaxHeap.apply(this, arguments);
            };

            _heapSort = function _heapSort3() {
              _heapSort = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return makeMaxHeap();

                      case 2:
                        _context.next = 4;
                        return applyHeapSort();

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _heapSort.apply(this, arguments);
            };

            heapSort = function _heapSort2() {
              return _heapSort.apply(this, arguments);
            };

            array = context.getArray();
            _context5.next = 11;
            return heapSort();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
}
},{"../core/constants/sortEvent":"app/model/core/constants/sortEvent.js","../core/constants/sortingState":"app/model/core/constants/sortingState.js","../core/config":"app/model/core/config.js"}],"app/model/SortingAlgorithms/SorterFactory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SorterFactory = SorterFactory;

var _BubbleSorter = require("./BubbleSorter");

var _InsertionSorter = require("./InsertionSorter");

var _sortingState = require("../core/constants/sortingState");

var _SelectionSorter = require("./SelectionSorter");

var _MergeSorter = require("./MergeSorter");

var _QuickSorter = require("./QuickSorter");

var _HeapSorter = require("./HeapSorter");

var _sortEvent = require("../core/constants/sortEvent");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function SorterFactory(context) {
  this.applySort = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(currentSortName) {
      var sortResult, sorter;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              context.state = _sortingState.sortingState.sorting;
              _context.t0 = currentSortName;
              _context.next = _context.t0 === "Bubble" ? 4 : _context.t0 === "Insertion" ? 6 : _context.t0 === "Selection" ? 8 : _context.t0 === "Merge" ? 10 : _context.t0 === "Quick" ? 12 : _context.t0 === "Heap" ? 14 : 16;
              break;

            case 4:
              sorter = new _BubbleSorter.BubbleSorter(context);
              return _context.abrupt("break", 16);

            case 6:
              sorter = new _InsertionSorter.InsertionSorter(context);
              return _context.abrupt("break", 16);

            case 8:
              sorter = new _SelectionSorter.SelectionSorter(context);
              return _context.abrupt("break", 16);

            case 10:
              sorter = new _MergeSorter.MergeSorter(context);
              return _context.abrupt("break", 16);

            case 12:
              sorter = new _QuickSorter.QuickSorter(context);
              return _context.abrupt("break", 16);

            case 14:
              sorter = new _HeapSorter.HeapSorter(context);
              return _context.abrupt("break", 16);

            case 16:
              sorter.sortArray().then(function () {
                return context.dispatch(_sortEvent.sortEvent.SortingFinished, {});
              });
              return _context.abrupt("return", sortResult);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}
},{"./BubbleSorter":"app/model/SortingAlgorithms/BubbleSorter.js","./InsertionSorter":"app/model/SortingAlgorithms/InsertionSorter.js","../core/constants/sortingState":"app/model/core/constants/sortingState.js","./SelectionSorter":"app/model/SortingAlgorithms/SelectionSorter.js","./MergeSorter":"app/model/SortingAlgorithms/MergeSorter.js","./QuickSorter":"app/model/SortingAlgorithms/QuickSorter.js","./HeapSorter":"app/model/SortingAlgorithms/HeapSorter.js","../core/constants/sortEvent":"app/model/core/constants/sortEvent.js"}],"app/model/core/SortManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortManager = SortManager;

var _SorterFactory = require("../SortingAlgorithms/SorterFactory");

var _sortEvent = require("./constants/sortEvent");

var _sortingState = require("./constants/sortingState");

var _config = require("./config");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function SortManager(n, sortName) {
  var getRandomValue = function getRandomValue(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var initArray = function initArray(size) {
    var array = new Array(size);

    for (var i = 0; i < size; i++) {
      array[i] = getRandomValue(10, 500);
    }

    return array;
  };

  var array = initArray(n);
  var events = {};
  var protectedMethods = {};
  var sortState = _sortingState.sortingState.stopped;
  var currentSortName = sortName;

  this.getArray = function () {
    return array;
  };

  this.setCurrentSort = function (sortName) {
    currentSortName = sortName;
  };

  this.remakeArray = function (newSize) {
    array = initArray(newSize);
  };

  Object.defineProperty(this, "size", {
    get: function get() {
      return array.length;
    },
    set: function set(value) {
      this.array = initArray(value);
    }
  });

  this.addEventListener = function (eventName, callback) {
    events[eventName] = callback;
  };

  this.removeEventListener = function (eventName) {
    delete events[eventName];
  };

  protectedMethods.dispatch = function (eventName, params) {
    var callback = events[eventName];

    if (callback) {
      callback(params);
    }
  };

  Object.defineProperty(this, "state", {
    get: function get() {
      return sortState;
    },
    set: function set(value) {
      sortState = value;
    }
  });

  this.stopSorting = function () {
    sortState = _sortingState.sortingState.stopped;
  };

  this.applySort = function () {
    var sorter = new _SorterFactory.SorterFactory(Object.assign(this, protectedMethods));
    var sortResult;
    this.state = _sortingState.sortingState.sorting;
    sorter.applySort(currentSortName); // sortResult.then(() =>
    //   protectedMethods.dispatch(sortEvent.SortingFinished, {})
    // );
  };

  var partition = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(left, right) {
      var pivot, i, j;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pivot = array[Math.floor((right + left) / 2)]; //middle element

              i = left; //left pointer

              j = right; //right pointer

            case 3:
              if (!(i <= j)) {
                _context.next = 17;
                break;
              }

            case 4:
              if (!(array[i] < pivot && sortState == _sortingState.sortingState.sorting)) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return protectedMethods.sleepDuration(_config.config.ComparisonTime).then(function () {
                protectedMethods.dispatch(_sortEvent.sortEvent.ItemScanned, {
                  indexOne: i,
                  indexTwo: j
                });
                i++;
              });

            case 7:
              _context.next = 4;
              break;

            case 9:
              if (!(pivot < array[j] && sortState == _sortingState.sortingState.sorting)) {
                _context.next = 14;
                break;
              }

              _context.next = 12;
              return protectedMethods.sleepDuration(_config.config.ComparisonTime).then(function () {
                protectedMethods.dispatch(_sortEvent.sortEvent.ItemScanned, {
                  indexOne: i,
                  indexTwo: j
                });
                j--;
              });

            case 12:
              _context.next = 9;
              break;

            case 14:
              //console.log(i + " : " + j);
              if (i <= j) {
                swap(i, j);
                protectedMethods.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                  indexOne: i,
                  indexTwo: j
                });
                i++;
                j--;
              }

              _context.next = 3;
              break;

            case 17:
              return _context.abrupt("return", i);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function partition(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var quickSort = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(left, right) {
      var index;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(array.length > 1)) {
                _context2.next = 10;
                break;
              }

              _context2.next = 3;
              return partition(left, right);

            case 3:
              index = _context2.sent;

              if (!(left < index - 1)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return quickSort(left, index - 1);

            case 7:
              if (!(index < right)) {
                _context2.next = 10;
                break;
              }

              _context2.next = 10;
              return quickSort(index, right);

            case 10:
              return _context2.abrupt("return", array);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function quickSort(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var heapSort = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return makeMaxHeap();

            case 2:
              _context3.next = 4;
              return applyHeapSort();

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function heapSort() {
      return _ref3.apply(this, arguments);
    };
  }();

  var makeMaxHeap = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var middle, i;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              middle = Math.floor(array.length / 2);
              i = middle;

            case 2:
              if (!(i >= 0)) {
                _context4.next = 8;
                break;
              }

              _context4.next = 5;
              return pushToMaxArray(array, i);

            case 5:
              i--;
              _context4.next = 2;
              break;

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function makeMaxHeap() {
      return _ref4.apply(this, arguments);
    };
  }();

  var applyHeapSort = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var heapContainer, i;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              heapContainer = _toConsumableArray(array);
              i = 0;

            case 2:
              if (!(heapContainer.length > 0)) {
                _context5.next = 12;
                break;
              }

              array[i] = heapContainer[0]; //Extracting max

              heapContainer[0] = heapContainer[heapContainer.length - 1]; //swap small element to the top

              heapContainer.pop();
              pushToMaxArray(heapContainer, 0);
              _context5.next = 9;
              return protectedMethods.sleepDuration(_config.config.ComparisonTime);

            case 9:
              i++;
              _context5.next = 2;
              break;

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function applyHeapSort() {
      return _ref5.apply(this, arguments);
    };
  }();

  var pushToMaxArray = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(array, i) {
      var leftChildIndex, rightChildInex, maxChildIndex, _ref7;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              leftChildIndex = (i + 1) * 2 - 1;
              rightChildInex = (i + 1) * 2;
              maxChildIndex = array[leftChildIndex] > array[rightChildInex] ? leftChildIndex : rightChildInex; //max of child if element exists, undefined if element has no child

              if (!(array[maxChildIndex] != undefined && array[i] < array[maxChildIndex])) {
                _context6.next = 11;
                break;
              }

              _ref7 = [array[maxChildIndex], array[i]];
              array[i] = _ref7[0];
              array[maxChildIndex] = _ref7[1];
              protectedMethods.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                indexOne: maxChildIndex,
                indexTwo: i
              });
              pushToMaxArray(array, maxChildIndex);
              _context6.next = 11;
              return protectedMethods.sleepDuration(_config.config.SwapTime);

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function pushToMaxArray(_x5, _x6) {
      return _ref6.apply(this, arguments);
    };
  }();

  var swap = function swap(leftIndex, rightIndex) {
    var temp = array[leftIndex];
    array[leftIndex] = array[rightIndex];
    array[rightIndex] = temp;
  };

  protectedMethods.sleepDuration = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(durationTime) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return new Promise(function (resolve) {
                return setTimeout(resolve, durationTime);
              });

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x7) {
      return _ref8.apply(this, arguments);
    };
  }();

  protectedMethods.swapAndDispatch = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(firstIndex, secondIndex) {
      var _ref10;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(sortState == _sortingState.sortingState.sorting)) {
                _context8.next = 7;
                break;
              }

              _context8.next = 3;
              return protectedMethods.sleepDuration(_config.config.SwapTime);

            case 3:
              _ref10 = [array[secondIndex], array[firstIndex]];
              array[firstIndex] = _ref10[0];
              array[secondIndex] = _ref10[1];
              protectedMethods.dispatch(_sortEvent.sortEvent.ItemSwapped, {
                indexOne: firstIndex,
                indexTwo: secondIndex
              });

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x8, _x9) {
      return _ref9.apply(this, arguments);
    };
  }();

  protectedMethods.compareAndDispatch = /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(firstIndex, secondIndex) {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (!(sortState == _sortingState.sortingState.sorting)) {
                _context9.next = 5;
                break;
              }

              _context9.next = 3;
              return protectedMethods.sleepDuration(_config.config.ComparisonTime);

            case 3:
              protectedMethods.dispatch(_sortEvent.sortEvent.ItemScanned, {
                indexOne: firstIndex,
                indexTwo: secondIndex
              });
              return _context9.abrupt("return", array[firstIndex] > array[secondIndex]);

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x10, _x11) {
      return _ref11.apply(this, arguments);
    };
  }();
}
},{"../SortingAlgorithms/SorterFactory":"app/model/SortingAlgorithms/SorterFactory.js","./constants/sortEvent":"app/model/core/constants/sortEvent.js","./constants/sortingState":"app/model/core/constants/sortingState.js","./config":"app/model/core/config.js"}],"app/view/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timer = Timer;
exports.TimerEvents = void 0;
var TimerEvents = {
  tick: "TICK"
};
exports.TimerEvents = TimerEvents;

function Timer() {
  var interval;
  var tickRate = 1000 / 20;
  var elapsedTime;
  var events = {};

  this.start = function () {
    elapsedTime = 0;
    defineInterval();
  };

  var defineInterval = function defineInterval() {
    interval = setInterval(function () {
      dispatch(TimerEvents.tick, {
        elapsedTime: elapsedTime += tickRate
      });
    }, tickRate);
  };

  this.stop = function () {
    clearInterval(interval);
  };

  this.addEventListener = function (eventName, callback) {
    events[eventName] = callback;
  };

  this.removeEventListener = function (eventName) {
    delete events[eventName];
  };

  var dispatch = function dispatch(eventName, params) {
    var callback = events[eventName];
    if (callback) callback(params);
  };
}
},{}],"app/view/Visualizer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Visualizer = Visualizer;
exports.colors = void 0;

var _timer = require("./timer");

var colors = {
  unsorted: "cadetblue",
  sorted: "green",
  swapped: "purple",
  scanned: "pink"
};
exports.colors = colors;
var elementIDs = {
  COLUMN_CONTAINER: "visualizer",
  TIMER_VALUE: "timerValue",
  SWAP_VALUE: "shiftsValue",
  COMPARATIONS_VALUE: "comparisonsValue",
  SORT_LIST: "sortList",
  ACTIVE_SORT_ALGO: "active",
  NEW_ARRAY_BUTTON: "newArray",
  ARRAY_SIZE_SLIDER: "slider",
  START_SORT_BUTTON: "sortButton"
};

function Visualizer() {
  var columnContainer = document.getElementById(elementIDs.COLUMN_CONTAINER);
  var timerValue = document.getElementById(elementIDs.TIMER_VALUE);
  var swapValue = document.getElementById(elementIDs.SWAP_VALUE);
  var compValue = document.getElementById(elementIDs.COMPARATIONS_VALUE);
  var columns;
  var columnWidth;
  var shifts = 0;
  var comp = 0;
  this.sortList = document.getElementById(elementIDs.SORT_LIST);
  this.currentSort = document.getElementById(elementIDs.ACTIVE_SORT_ALGO);
  this.newArrayButton = document.getElementById(elementIDs.NEW_ARRAY_BUTTON);
  this.slider = document.getElementById(elementIDs.ARRAY_SIZE_SLIDER);
  this.sortButton = document.getElementById(elementIDs.START_SORT_BUTTON);
  this.timer = new _timer.Timer();
  this.timer.addEventListener(_timer.TimerEvents.tick, function (params) {
    timerValue.innerText = "".concat(Math.round(params.elapsedTime / 1000), "s ").concat(params.elapsedTime % 1000, "ms");
  });

  this.resetStats = function () {
    shifts = 0;
    swapValue.innerText = "0";
    timerValue.innerText = "0s 0ms";
    comp = 0;
    compValue.innerText = "0";
  };

  this.increaseSwapCounter = function () {
    swapValue.innerText = (++shifts).toString();
  };

  this.updateComparisons = function () {
    compValue.innerText = (++comp).toString();
  };

  this.updateVisual = function (array, indexOfHighlightedElement, color) {
    defineColumnNumber();
    defineColumnWidth(array.length);

    for (var i = 0; i < array.length; i++) {
      setColumnStyle(array, i);
    }

    if (indexOfHighlightedElement.indexTwo < array.length && indexOfHighlightedElement.indexTwo > 0) columns[indexOfHighlightedElement.indexTwo].style.backgroundColor = color;
    if (indexOfHighlightedElement.indexOne < array.length && indexOfHighlightedElement.indexOne > 0) columns[indexOfHighlightedElement.indexOne].style.backgroundColor = color;
  };

  var defineColumnNumber = function defineColumnNumber() {
    columns = columnContainer.childNodes;
  };

  var defineColumnWidth = function defineColumnWidth(arrayLength) {
    columnWidth = columnContainer.offsetWidth / arrayLength;
  };

  var setColumnStyle = function setColumnStyle(array, columnIndex) {
    var currentColor = colors.unsorted;
    columns[columnIndex].style.height = array[columnIndex] + "px";
    columns[columnIndex].style.backgroundColor = currentColor;
    if (columnWidth > 40) columns[columnIndex].innerText = array[columnIndex];
  };

  this.createVisual = function (array) {
    defineColumnWidth(array.length);
    columnContainer.innerHTML = "";

    for (var i = 0; i < array.length; i++) {
      var column = createColumnFromValue(array[i]);
      columnContainer.appendChild(column);
    }
  };

  var createColumnFromValue = function createColumnFromValue(value) {
    var column = document.createElement("div");
    column.style.height = value + "px";
    column.style.width = columnWidth + "px";
    column.style.backgroundColor = colors.unsorted;
    column.style.marginLeft = "3px";
    column.style.borderRadius = columnWidth / 3 + "px";
    column.style.display = "flex";
    column.style.justifyContent = "center";
    column.style.alignItems = "center";
    if (columnWidth > 40) column.innerText = value;
    return column;
  };
}
},{"./timer":"app/view/timer.js"}],"app/index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _SortManager = require("./model/core/SortManager");

var _sortEvent = require("./model/core/constants/sortEvent");

var _Visualizer = require("./view/Visualizer");

var _sortingState = require("./model/core/constants/sortingState");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var vis = new _Visualizer.Visualizer();
var currentSize = vis.slider.value;
var sort = new _SortManager.SortManager(currentSize, "Bubble");
vis.createVisual(sort.getArray());
sort.addEventListener(_sortEvent.sortEvent.ItemSwapped, function (params) {
  vis.updateVisual(sort.getArray(), {
    indexOne: params.indexOne,
    indexTwo: params.indexTwo
  }, _Visualizer.colors.swapped);
  vis.increaseSwapCounter();
});
sort.addEventListener(_sortEvent.sortEvent.ItemScanned, function (params) {
  vis.updateVisual(sort.getArray(), {
    indexOne: params.indexOne,
    indexTwo: params.indexTwo
  }, _Visualizer.colors.scanned);
  vis.updateComparisons();
});
sort.addEventListener(_sortEvent.sortEvent.SortingFinished, function (params) {
  vis.updateVisual(sort.getArray(), {
    indexOne: -1,
    indexTwo: -1
  });
  vis.timer.stop();
});
vis.slider.addEventListener("input", function (e) {
  newArray();
});
vis.newArrayButton.addEventListener("click", function (e) {
  newArray();
});
vis.sortButton.addEventListener("click", function (e) {
  if (sort.state == _sortingState.sortingState.stopped) {
    vis.timer.start();
    sort.applySort();
  }
});
vis.sortList.addEventListener("click", function (e) {
  var _iterator = _createForOfIteratorHelper(vis.sortList.children),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var child = _step.value;
      child.className = "foldMenu__item";
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  e.target.className = "foldMenu__item active";
  sort.setCurrentSort(e.target.id);
  newArray();
});

function newArray() {
  vis.timer.stop();
  vis.resetStats();
  sort.stopSorting();
  currentSize = vis.slider.value;
  sort.remakeArray(currentSize);
  vis.createVisual(sort.getArray());
}
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./model/core/SortManager":"app/model/core/SortManager.js","./model/core/constants/sortEvent":"app/model/core/constants/sortEvent.js","./view/Visualizer":"app/view/Visualizer.js","./model/core/constants/sortingState":"app/model/core/constants/sortingState.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64638" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","app/index.js"], null)
//# sourceMappingURL=/app.c0e5f9db.js.map