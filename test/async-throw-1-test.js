'use strict';

const
  createPipe = require('../index'),
  assert = require('assert');

describe('A pipe which reject', () => {
  const pipe = createPipe({
    throwAsync: () =>
      new Promise((resolve, reject) =>
        reject(new Error('hello'))
      )
  });

  describe('when run', () => {
    const promise = pipe().throwAsync();

    it('should returns error', done =>
      promise.catch(err => done(!err))
    );
  });
});
