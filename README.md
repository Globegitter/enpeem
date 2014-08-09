enpeem
======

Lightweight wrapper for accessing npm programmatically (alternative to adding `npm` as a dependency)

`require('npm')` seems like a good idea, but it adds tons of weight to your module, since it takes a long time to install.  Why not use the `npm` your users already have?


> NOTE:
> re: `cache-min`, see: https://github.com/isaacs/npm/issues/2568#issuecomment-30626394
> re: `loglevel`, see: https://github.com/isaacs/npm/pull/4320



## Usage

```shell
$ npm install enpeem --save
```

```javascript
var npm = require('enpeem');
```

#### npm install

```javascript
npm.install({
  dependencies: [
    'sails@0.10.1',
    'sails-disk@git://github.com/balderdashy/sails-disk.git#associations',
    'lodash'
  ]
  loglevel: 'silent',
  'cache-min': 999999999
}, function (err) { /* ... */ });
```


#### npm update

```javascript
npm.update({
  loglevel: 'silent'
}, function (err) { /* ... */ });
```


