'use strict';

const FUNCTION = 'function';

module.exports = function (actions, options) {
  options = Object.assign({ Promise: Promise }, options);

  const
    PromiseClass = options.Promise,
    context = options.context,
    decorators = mapMap(actions, (action, name) => function () {
      const
        that = this,
        args = makeArray(arguments),
        action = actions[name];

      return decoratePromise(
        new PromiseClass((resolve, reject) =>
          that
            .then(output => {
              const result = action.apply(context, [output].concat(args));

              if (isPromise(result)) {
                result.then(resolve, reject);
              } else {
                resolve(result);
              }
            })
            .catch(reject)
        ),
        decorators,
        options
      );
    });

  return input => decoratePromise(new PromiseClass(resolve => resolve(input)), decorators, options);
};

function decoratePromise(promise, decorators, options) {
  Object.keys(decorators).forEach(name => {
    promise[name] = decorators[name].bind(promise);
  });

  const modifier = result => decoratePromise(result, decorators, options);

  ['catch', 'then'].forEach(name => {
    promise[name] = intervene(promise[name], modifier);
  });

  return promise;
};

function intervene(fn, modifier) {
  return function () {
    return modifier(fn.apply(this, arguments));
  };
}

function isPromise(obj) {
  return obj && typeof obj.then === FUNCTION && typeof obj.catch === FUNCTION;
}

function mapMap(map, selector) {
  return Object.keys(map).reduce((newMap, name) => {
    newMap[name] = selector.call(map, map[name], name);

    return newMap;
  }, {});
}

function makeArray(arrayLike) {
  return [].slice.call(arrayLike);
}
