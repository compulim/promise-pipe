'use strict';

const FUNCTION = 'function';

module.exports = function (actions, options) {
  options = Object.assign({ Promise: Promise }, options);

  return input => decoratePromise(new options.Promise(resolve => resolve(input)), actions, options);
};

function decoratePromise(promise, actions, options) {
  const Promise = options.Promise;

  Object.keys(actions).forEach(name => {
    promise[name] = function () {
      const args = [].slice.call(arguments);

      return decoratePromise(
        new Promise((resolve, reject) =>
          promise
            .then(output => {
              args.unshift(output);

              const result = actions[name].apply(null, args);

              if (isPromise(result)) {
                result.then(resolve, reject);
              } else {
                resolve(result);
              }
            })
            .catch(reject)
        ),
        actions,
        options
      );
    };
  });

  return promise;
};

function isPromise(obj) {
  return typeof obj.then === FUNCTION && typeof obj.catch === FUNCTION;
}
