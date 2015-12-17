"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

let sleep = (function () {
  var ref = _asyncToGenerator(function* (timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve();
      }, timeout);
    });
  });

  return function sleep(_x) {
    return ref.apply(this, arguments);
  };
})();

_asyncToGenerator(function* () {
  console.log('Do some thing, ' + new Date());
  yield sleep(3000);
  console.log('Do other things, ' + new Date());
})();