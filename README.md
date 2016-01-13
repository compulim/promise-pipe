# promise-pipe

[<img src="https://travis-ci.org/compulim/promise-pipe.svg?branch=master" />](https://travis-ci.org/compulim/promise-pipe)

Background
---

We <3 Promise and functional programming.

But having multiple `.then()` makes code difficult to read and hard to reuse. `promise-pipe` is targeted to solve both issues in an elegant way.

Use it
---

In the old days, you write,

```js
new Promise(
  (resolve, reject) =>
    fs.readFile(
      'input.txt',
      (err, buffer) => err ? reject(err) : resolve(buffer)
    )
)
.then(buffer => buffer.toString('utf8'))
.then(text => console.log(text));
```

The code is not easy to read or reusable.

With `promise-pipe`, you can chain your Promise actions and make them reusable.

First, we build a pipe with two actions, `readFile`, and `decodeBuffer`.

```js
const pipe = require('promise-pipe')({
  readFile: filename =>
    new Promise((resolve, reject) => {
      fs.readFile(
        filename,
        (err, buffer) => {
          err ? reject(err) : resolve(buffer);
        }
      );
    }),
  decodeBuffer: (buffer, encoding) => buffer.toString(encoding)
});
```

Then we use this pipe with different input arguments. For example, we want to read from `input.txt` with `utf8` encoding.

```js
pipe('input.txt')
  .readFile()
  .decodeBuffer('utf8')
  .then(text => console.log(text));
```

Analogous to waterfall pattern, first argument of every pipe action is the result from the last action. Since we first initialize the pipe with `input.txt`, the first `.readFile()` call will receive `'input.txt'` as its `filename` argument.

Similar, in `decodeBuffer(buffer, encoding)` action, `buffer` is the Node.js Buffer received thru `fs.readFile` call after completing `readFile` action. In addition to `buffer`, pipe caller can also specify `encoding` argument. This allow pipe to be easily customizable.

How it works
---

When actions are called, they return a new Promise object decorated with actions. For example, `pipe('input.txt').readFile()` will returns a Promise object like this,

```js
{
  then: function () { ... }, // native Promise function
  catch: function () { ... }, // native Promise function
  readFile: function () {
    let promise = new Promise((resolve, reject) => {
      this
        .then(output => {
          fs.readFile(output, (err, buffer) {
            err ? reject(err) : resolve(buffer);
          })
        })
        .catch(reject);
    });

    // Recursively decorate the new Promise object
    promise.readFile = ...
    promise.decodeBuffer = ...

    return promise;
  },
  decodeBuffer: function () { ... }
}
```

ES6 Promise
---

By default, `promise-pipe` use ES6 Promise interface, i.e. global `Promise` object. You can specify your favorite Promise library thru options, for example,

```js
const pipe = require('promise-pipe')({
  // your actions
}, {
  Promise: require('q')
});
```

Contribution
---

Please file bugs to [issues](issues). To include your bug as regression test, you are recommended to provide a minimal failing test case.
