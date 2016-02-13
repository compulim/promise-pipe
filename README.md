# promise-pipe [<img src="https://travis-ci.org/compulim/promise-pipe.svg?branch=master" />](https://travis-ci.org/compulim/promise-pipe)

Background
---

We love Promise and functional programming.

But having multiple `.then()` makes code difficult to read and hard to reuse. `promise-pipe` is targeted to solve both issues in an elegant way.

Usage
---

In the old days, you would write the following code.

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

First, we build a pipe with two actions:

* `readFile(filename)` will read file `filename` and return content as `Buffer` asynchronously
* `decodeBuffer(buffer, encoding)` will decode `Buffer` into `string` synchronously

```js
const pipe = require('promise-pipe')({
  readFile: filename =>
    new Promise((resolve, reject) =>
      fs.readFile(
        filename,
        (err, buffer) => err ? reject(err) : resolve(buffer)
      )
    ),
  decodeBuffer: (buffer, encoding) => buffer.toString(encoding)
});
```

Then we use this pipe with different input arguments. For example, we will read from `"input.txt"` with `"utf8"` encoding.

```js
pipe('input.txt')
  .readFile()
  .decodeBuffer('utf8')
  .then(text => console.log(text));
```

Analogous to waterfall pattern, first argument of every pipe action is the result from the last action. First, we initialize the pipe with `"input.txt"`, thus, the first `readFile()` action will receive `"input.txt"` as its `filename` argument.

Then, `readFile()` returned a `Buffer` object and it will then passed (or piped) into `decodeBuffer` action. In addition to `Buffer` object, we also appended `"utf8"` into the `decodeBuffer` call and it become `encoding` argument.

How it works
---

When actions are called, a new Promise object decorated with actions will be returned. For example, `pipe('input.txt').readFile()` will return a Promise object similar to this.

```js
{
  then: function () { ... }, // native Promise function
  catch: function () { ... }, // native Promise function
  readFile: function () {
    // When the current Promise is resolved, call fs.readFile and return a new Promise
    // The new Promise instance will also be decorated with readFile and decodeBuffer
  },
  decodeBuffer: function () { ... }
}
```

When we create the pipe, all actions are converted into decorators. To save memory footprint, these decorators will be reused across multiple Promise objects, we use `function.bind()` to make sure these decorators are resolving their respective Promise object.

Options
===

Using Promise other than ES6 Promise
---

By default, `promise-pipe` use your global `Promise` object, which is probably ES6 native Promise interface. You can specify your favorite Promise library thru `options.Promise`. Your Promise library should has both `.then()` and `.catch()` functions. The example below shows we use [Q](http://npmjs.org/package/q) as Promise library.

```js
const pipe = require('promise-pipe')({
  // your actions
}, {
  Promise: require('q').Promise
});
```

When the pipe is created by calling `pipe()`, the Promise object returned will be instance of `Q.makePromise`. See [custom-promise-test.js](test/custom-promise-test.js) for details.

Context
---

If you want the action to run under different "`this`" context, you can specify it in `options.context`.

```js
const pipe = require('promise-pipe')({
  getContext: function () {
    return this;
  }
}, {
  context: { hello: 'World!' }
});
```

When `pipe().getContext()` is resolved, it will return `{ hello: 'World!' }`. Note that actions defined with ES6 arrow function do not support "`this`". See [context-test.js](test/context-test.js) for details.


Contributions
---

There are few ways you can contribute to this project:
* Like us? Please [star us](../../stargazers/)
* Make it even more awesome? Please [send us your wish](https://github.com/compulim/promise-pipe/issues/new/)
* Don't like how it's doing? Please [file a bug](https://github.com/compulim/promise-pipe/issues/) to us
  * Please provide a minimal failing test case
