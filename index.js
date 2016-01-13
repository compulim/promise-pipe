'use strict';

module.exports = function (actions, options) {
  options = Object.assign({ Promise: Promise }, options);

  return input => {
    const promise = new options.Promise(resolve => resolve(input));

    return decoratePromise(promise, actions, options);
  }
};

function decoratePromise(promise, actions, options) {
  Object.keys(actions).forEach(name => {
    promise[name] = function () {
      const args = [].slice.call(arguments);

      const newPromise = new options.Promise((resolve, reject) => {
        promise.then(output => {
          args.unshift(output);

          const result = actions[name].apply(null, args);

          if (isPromise(result)) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        })
        .catch(reject);
      });

      return decoratePromise(newPromise, actions, options);
    };
  });

  return promise;
};

function isPromise(obj) {
  return typeof obj.then === 'function';
}
