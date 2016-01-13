'use strict';

const
  createPipe = require('../index'),
  assert = require('assert');

describe('A pipe which throw error', () => {
  const pipe = createPipe({
    throwSync: () => {
      throw new Error('hello');
    }
  });

  describe('when run', () => {
    const promise = pipe().throwSync();

    it('should returns error', done => {
      promise.catch(err => done(!err));
    });
  });
});
