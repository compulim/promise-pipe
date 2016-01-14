'use strict';

const
  createPipe = require('../index'),
  assert = require('assert');

describe('A pipe which reject asynchronously', () => {
  const
    ERROR = new Error(),
    pipe = createPipe({
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
