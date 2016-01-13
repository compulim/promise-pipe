'use strict';

const
  createPipe = require('../index'),
  assert = require('assert');

describe('A pipe which throw async error', () => {
  const pipe = createPipe({
    throwAsync: () => new Promise((resolve, reject) => reject(new Error('hello')))
  });

  describe('when run asynchronously', () => {
    const promise = pipe().throwAsync();

    it('should returns error', done => {
      promise.catch(err => done(!err));
    });
  });
});
