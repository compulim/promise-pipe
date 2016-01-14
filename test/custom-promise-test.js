'use strict';

const
  createPipe = require('../index'),
  assert = require('assert'),
  Q = require('q');

describe('A pipe with custom Promise interface', () => {
  const pipe = createPipe({}, { Promise: Q.Promise });

  describe('when created', () => {
    const promise = pipe();

    it('should be instance of Q.makePromise', () => assert(promise instanceof Q.makePromise));
  });
});
