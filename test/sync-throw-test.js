'use strict';

const
  createPipe = require('../index'),
  assert = require('assert'),
  ERROR = new Error();

describe('A pipe which throw error synchronously', () => {
  const pipe = createPipe({
    throwSync: () => {
      throw ERROR;
    }
  });

  describe('when run', () => {
    const promise = pipe().throwSync();

    it('should reject', done => {
      promise.catch(err => {
        assert.equal(err, ERROR);
        done();
      });
    });
  });
});
