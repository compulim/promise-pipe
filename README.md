# promise-pipe

Chain promise calls in an elegant way

[<img src="https://travis-ci.org/compulim/promise-pipe.svg?branch=master" />](https://travis-ci.org/compulim/promise-pipe)

In the old days

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

Elegantly, with `promise-pipe`,

```js
const pipe = require('promise-pipe')({
  readFile: filename => new Promise((resolve, reject) => {
    fs.readFile(
      filename,
      (err, buffer) => {
        err ? reject(err) : resolve(buffer);
      }
    );
  }),
  decodeBuffer: (buffer, encoding) => buffer.toString(encoding)
});

pipe('input.txt')
  .readFile()
  .decodeBuffer('utf8')
  .then(text => console.log(text));
```

Contribution
---

Please file bugs to [issues](issues). To include your bug as regression test, you are recommended to provide a minimal failing test case.
