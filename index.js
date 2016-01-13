'use strict';

module.exports = function (actions, context) {
  return input => {
    const promise = new Promise(resolve => resolve(input));

    return decoratePromise(promise, actions);
  }
};

function decoratePromise(promise, actions) {
  Object.keys(actions).forEach(name => {
    promise[name] = function () {
      const args = [].slice.call(arguments);

      const newPromise = new Promise((resolve, reject) => {
        promise.then(output => {
          args.unshift(output);

          const result = actions[name].apply(null, args);

          if (result instanceof Promise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        })
        .catch(reject);
      });

      return decoratePromise(newPromise, actions);
    };
  });

  return promise;
};
