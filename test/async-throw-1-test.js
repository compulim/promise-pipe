'use strict';

const
  createPipe = require('../index'),
  assert = require('assert'),
  ERROR = new Error();

describe('A pipe which reject asynchronously', () => {
  const pipe = createPipe({
    throwAsync: () =>
      new Promise((resolve, reject) =>
        reject(ERROR)
      )
  });

  describe('when run', () => {
    const promise = pipe().throwAsync();

    it('should reject', done =>
      promise.catch(err => {
        assert.equal(err, ERROR);
        done();
      })
    );
  });
});
