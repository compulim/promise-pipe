'use strict';

const
  createPipe = require('../index'),
  assert = require('assert');

describe('A pipe which throw async error', () => {
  const pipe = createPipe({
    throwSync: () => {
      throw new Error('hello');
    }
  });

  describe('when run synchronously', () => {
    const promise = pipe().throwSync();

    it('should returns error', done => {
      promise.catch(err => done(!err));
    });
  });
});
