'use strict';

const
  createPipe = require('../index'),
  fs = require('fs'),
  assert = require('assert');

describe('A pipe to read file', () => {
  const pipe = createPipe({
    readFile: filename => new Promise((resolve, reject) => {
      fs.readFile(filename, (err, buffer) => {
        err ? reject(err) : resolve(buffer);
      });
    }),
    decodeBuffer: (buffer, encoding) => buffer.toString(encoding)
  });

  describe('when run asynchronously', () => {
    const promise =
      pipe(module.filename)
        .readFile()
        .decodeBuffer('utf8');

    it('should returns no error', done => {
      promise.then(() => done()).catch(done);
    });

    it('should returns text content', done => {
      promise.then(text => {
        assert(typeof text === 'string');
        assert(/^'use strict';/.test(text));
        done();
      }).catch(done);
    });
  });
});
