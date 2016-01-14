'use strict';

const
  createPipe = require('../index'),
  assert = require('assert');

describe('A pipe with context', () => {
  const
    context = {},
    pipe = createPipe({
      getContext: function () {
        return this;
      }
    }, { context });

  describe('when run', () => {
    const promise = pipe().getContext();

    it('"this" should be the context', done => {
      promise.then(result => {
        assert.equal(result, context);
        done();
      }).catch(done);
    });
  });
});
