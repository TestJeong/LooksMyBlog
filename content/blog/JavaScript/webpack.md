---
title: 'Webpack이 해결하는 문제'
date: 2023-02-12 16:21:13
category: 'JavaScript'
draft: false
---

### **웹팩이란?**

---

웹팩을 설명하기 전에 모듈이 무엇인지부터 알아야 합니다

### **모듈(Module)이란?**

---

모듈은 작은 코드 단위를 파일 단위로 분리하여 관리하는 방식으로, 프로그램의 규모가 커질수록 파일의 분리가 필요하게 되고, 이때 각각의 파일을 모듈이라 부른다. 모듈화는 목적에 따라 기능별로 파일을 분리하고 관리하는 과정을 의미합니다.

### **자바스크립트의 모듈 시스템**

---

```html
// 옛날 코드

<html>
  <head>
    <script src="javascript_file_1.js" />
    <script src="javascript_file_1.js" />
    <script src="javascript_file_1.js" />
    ...
    <script src="javascript_file_1.js" />
  </head>
</html>
```

자바스크립트 초창기에는 몇 개의 파일만 있으면 충분하여 모듈 관리나 번들러가 필요하지 않았습니다. 그러나 **싱글 페이지 애플리케이션(SPA)**이 등장하면서 수십, 수백 개의 자바스크립트 파일을 관리해야 하게 되었습니다. 이러한 파일들을 관리하면서 실행 순서와 전역 변수를 신경써야 하므로 매우 복잡해졌습니다.

웹 애플리케이션을 구성하는 HTML, CSS, JS, 이미지, SVG 등 모든 웹 자원을 각각의 모듈로 보고, 이를 하나로 병합하고 압축하여 최종 결과물을 만드는 역할을 하는 것이 `모듈 번들러`입니다.

자바스크립트 파일의 규모가 점점 커지면서 모듈 시스템의 필요성을 느껴, CommonJS, AMD, UMD, ES6 Module 등의 모듈 시스템이 등장하게 되었습니다.

#### CJS(CommonJS)

서버 사이드에서 주로 사용하고 동기적으로 작동이 됩니다 그리고 **require / exports** 키워드를 사용합니다

```js
// require를 통해 모듈을 변수에 담을 수 있습니다
var lib = require('package/lib')

// 가져온 모듈을 아래와 같이 사용 할 수 있습니다
function foo() {
  lib.log('hello world!')
}

// foo 함수를 다른 파일에서 사용할 수 있도록, 다른 모듈로 추출할 수도 있습니다
exports.foobar = foo
```

#### AMD

비동기 방식으로 사용할 수 있는 모듈입니다
CommonJS는 동기적으로 처리하기 때문에 브라우저에서 사용하게 되면 필요한 모듈을 모두 다운로드 될 때까지 아무것도 할 수가 없는데 AMD 방식을 사용하면 비동기 방식으로 모듈을 불러올 수 있습니다

```js
// myModule.js

// define을 이용해 첫번째 인자인 배열에 새로운 모듈을 추가하여,
// 두번째 인자인 콜백함수로 전달한다.
define(['package/lib'], function(lib) {
  // 콜백함수에서 매개변수로 받는 모듈을 이용해서, 불러온 모듈을 사용할 수 있다
  function foo() {
    lib.log('hello world!')
  }

  // 다른파일에서 foo함수를, foobar이란 이름의 모듈로 불러올 수 있게 만듬
  return {
    foobar: foo,
  }
})

// 위에서 선언한 모듈 불러오기
require(['package/myModule'], function(myModule) {
  myModule.foobar()
})
```

#### UMD

CJS 와 AMD 모듈을 모두 사용할 수 있는 하나의 패턴이며 브라우저 환경과 Node.js 환경에서 모듈화된 코드를 모두 사용할 수 있습니다

```js
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // define.amd가 존재할 경우 AMD 모듈을 사용한다
    define(['exports'], factory)
  } else if (
    typeof exports === 'object' &&
    typeof exports.nodeName !== 'string'
  ) {
    // export가 객체이고, export.nodeName이 문자열이 아닐경우 CommonJS를 사용한다
    factory(exports)
  } else {
    // Browser globals
    factory((root.Calculator = {}))
  }
})(typeof self !== 'undefined' ? self : this, function(exports) {
  // Calculator 모듈 객체
  var Calculator = {
    add: function(a, b) {
      return a + b
    },
    subtract: function(a, b) {
      return a - b
    },
    multiply: function(a, b) {
      return a * b
    },
    divide: function(a, b) {
      return a / b
    },
  }

  // 모듈의 exports 설정한다
  exports.Calculator = Calculator
})
```

#### ESM(ES6 Module)

import, export 방식을 사용한 자바스크립트 공식 모듈 시스템입니다

```js
// Calculator 모듈 객체
const Calculator = {
  add: function(a, b) {
    return a + b
  },
  subtract: function(a, b) {
    return a - b
  },
  multiply: function(a, b) {
    return a * b
  },
  divide: function(a, b) {
    return a / b
  },
}

// 모듈의 exports 설정
export { Calculator }
```

위에서 작성한 모듈을 export 하여 아래 코드처럼 import 하여 모듈을 불러와 사용할 수 있다

```js
import { Calculator } from './Calculator.js'

console.log(Calculator.add(1, 2)) // 3
console.log(Calculator.subtract(4, 2)) // 2
console.log(Calculator.multiply(2, 3)) // 6
console.log(Calculator.divide(8, 4)) // 2
```

<br/>

### **다시 웹팩이란?**

![](./images/webpack.png)

<br/>

자바스크립트의 모듈화로 유지 보수와 확장성은 개선되었지만, 규모가 커질수록 여러 문제점이 발생하였습니다. 많은 JS 파일들을 로드할 경우 HTTP 요청 수가 증가하여 초기 로딩 속도가 느려지고 병목 현상이 발생하였으며, 모듈 간 의존성이 불분명하여 코드 분리가 어렵고 변수의 유효 범위가 전역을 갖는 문제도 있었습니다.

이러한 문제들을 해결하기 위해 나온 것이 **모듈 번들러**입니다. 모듈 번들러를 사용하면 여러 모듈을 하나의 번들로 묶어 HTTP 요청 수를 줄이고 초기 로딩 속도를 향상시킬 수 있으며, 번들링 기능을 통해 모듈 간 서로 의존성 있는 파일들을 묶어 코드 분리를 할 수 있습니다. 또한, 번들링 된 파일을 압축 및 최적화하여 파일 크기를 줄여 페이지 로딩을 빠르게 할 수 있습니다.

웹팩은 모듈 번들러 중 하나로서, `엔트리` 포인트를 시작으로 연결된 모든 모듈을 하나로 합쳐서 `아웃풋`으로 결과물을 저장합니다. 이 때, 자바스크립트 뿐만 아니라 CSS, 이미지 파일도 모듈로 제공하여 처리할 수 있습니다. 또한, `로더와 플러그인`을 사용하여 자바스크립트 번들링과 최적화를 할 수 있습니다.

### 웹팩의 구성

---

![webpack anatomy](https://www.hanl.tech/wp-content/uploads/2022/09/webpack-anatomy-fixed.png)

#### **엔트리 (Entry)**

엔트리는 번들링을 하기 위한 시작점입니다. 웹팩은 이 시작점으로부터 재귀적으로 의존적인 모듈을 전부 찾아내는데 이때 모듈 간의 의존 관계로 생기는 구조를 디펜던시 그래프(Dependency Graph)라고 합니다. 이런 방식으로 웹팩은 이미지 또는 웹 글꼴과 같이 코드가 아닌 리소스도 디펜던시로 관리할 수 있습니다

```javascript
module.exports = () => {
    entry: "./src/index.js",

    // or

    entry: ['./src/index.js'],

    // or

    entry: {
      bundle: './src/index.js'
    },
}
```

html에서 사용할 자바스크립트의 진입점을 `entry` 에 넣어줍니다.  `entry` 가 여러개일 경우 배열로 작성할 수 있으며 `entry` 의 이름을 따로 지정해주고 싶다면 object로 작성할 수 도 있습니다

<br/>

#### **아웃풋 (Output)**

엔트리를 시작으로 의존되어 있는 모든 모듈을 하나로 묶어 하나의 결과물로 만들면 이것을 저장하는 경로를 아웃풋이라고 합니다.

```javascript
const path = require('path');

module.exports = () => {
  output: {
    path: "./dist",
    filename: "bundle.js",

    // or

    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
}
```

위 코드에서, `path`는 번들링 된 파일이 저장될 경로를 지정하며, `filename`은 번들링된 파일의 이름을 나타냅니다.

보통, 아래 코드처럼 현재 작업 중인 파일의 디렉토리 경로에 **dist** 폴더를 추가하여 최종 경로를 설정해 주는 코드를 많이 사용합니다. 이를 위해 Node.js의 전역 변수인 `__dirname`을 사용하여 **webpack.config.js** 파일이 위치한 디렉토리 경로를 알아냅니다.

예를 들어, **webpack.config.js** 파일이 `\my-project\src\webpack.config.js` 경로에 있다면, `__dirname`은 `\my-project\src` 경로가 됩니다. 따라서 `path.join(__dirname, 'dist')` 코드를 사용하면, 최종 경로는 `\my-project\src\dist`가 됩니다.

이뿐만이 아니라 아래와 같이 output에 다양한 옵션을 설정할 수 있습니다

- **path**: 빌드된 파일이 저장될 경로를 설정합니다. 일반적으로 path.join(\_\_dirname, 'dist')와 같은 방법으로 현재 작업 중인 파일의 경로에 dist 폴더를 추가하여 지정합니다.
- **filename**: 빌드된 파일의 이름을 설정합니다. [name], [hash], [chunkhash] 등의 웹팩 매직 덩어리를 사용하여 동적으로 파일 이름을 생성할 수 있습니다.
- **chunkFilename**: 청크 파일의 이름을 설정합니다. 동적으로 생성되는 청크 파일의 이름을 [id], [name], [hash], [chunkhash] 등의 웹팩 매직 덩어리를 사용하여 설정할 수 있습니다.
- **assetModuleFilename**: 모듈에서 생성된 asset 파일의 이름을 설정합니다. [name], [hash], [contenthash] 등의 웹팩 매직 덩어리를 사용하여 동적으로 파일 이름을 생성할 수 있습니다.
- **library**: 라이브러리를 번들링할 때 라이브러리를 나타내는 전역 변수의 이름을 설정합니다.
- **libraryTarget**: 라이브러리를 번들링할 때 라이브러리가 노출되는 방식을 설정합니다. var, umd, commonjs, commonjs2, amd, this, window, global, jsonp 등의 값을 설정할 수 있습니다.
- **globalObject**: 라이브러리가 브라우저에서 실행될 때 전역 객체를 나타내는 문자열을 설정합니다. 기본값은 window입니다.
- **pathinfo**: 빌드된 파일의 모듈 경로를 주석으로 추가합니다. 개발 모드에서는 기본값으로 활성화되어 있습니다.
- **sourceMapFilename**: 소스맵 파일의 이름을 설정합니다.
- **devtoolFallbackModuleFilenameTemplate**: devtool 옵션에서 filename이 설정되지 않은 모듈의 소스맵 파일 이름을 설정합니다.
- **devtoolLineToLine**: true 로 설정하면 소스맵에서 행 매핑 정보를 표시합니다.
- **hotUpdateChunkFilename**: 빌드된 모듈이 수정될 때 HMR 업데이트 청크 파일의 이름을 설정합니다.
- **hotUpdateMainFilename**: 빌드된 모듈이 수정될 때 HMR 메인 파일의 이름을 설정합니다.

더 다양한 옵션은 webpack5 공식문서에 보면 자세히 알 수 있습니다

<br/>

#### **로더 (Loader)**

웹팩은 모든 파일을 모듈로 봅니다. 하지만 웹팩은 자바스크립트 밖에 읽지 못하는데 TypeScript와 같은 다른 언어에서 JS로 변환하거나 HTML, CSS, Images, 폰트 등을 웹팩이 읽을 수 있게 변환하는 역할을 하는 것이 로더이다
<br/><br/>
예시로 CSS를 자바스크립트에서 불러와 사용할 수 있도록 로더를 설정해 보도록 하겠습니다
CSS를 번들링 하기 위해서는 css-loader 와 style-loader 를 함께 사용해 합니다 css-loader 는 CSS를 자바스크립트 코드로만 변경해 주기만 하고 자바스크립트로 변경된 CSS를 돔에 추가하기 위해서 style-loader 가 필요합니다

먼저 css-loader와 style-loader 를 설치합니다

```text
$ npm install css-loader style-loader -D
```

그다음 css-loader 와 style-loader 에 관련된 설정을 추가해 합니다

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

`test`는 로더를 적용할 파일 형식으로 일반적으로 정규 표현식을 사용합니다. `use`는 해당 파일을 처리할 로더의 이름입니다

배열로 설정하면 뒤에서부터 앞으로 순서대로 로더가 동작합니다. 이제 웹팩은 .css 확장자로 끝나는 모듈을 읽어 들여 css-loader를 적용하고 그다음 style-loader를 적용하게 됩니다

<br/>

#### **플러그인 (Plugin)**

**플러그인(Plugin)**은 로더(Loader)가 처리할 수 없는 다양한 작업을 수행할 수 있도록 해주는 webpack의 확장 기능입니다. 로더는 파일을 해석하고 변환하는 역할을 수행하지만, 플러그인은 번들링 된 결과물에 대해 추가적인 처리를 수행할 수 있습니다

가장 많이 사용되는 webpack 플러그인 중 하나인 `HtmlWebpackPlugin`을 추가해 보겠습니다
HtmlWebpackPlugin는 webpack으로 빌드 된 JS 파일을 HTML 파일에 자동으로 추가해 주는 플러그인이다 즉 HTML 파일에 script 태그를 수동으로 추가하지 않아도 빌드 된 JS 파일이 자동으로 HTML 파일에 포함되는 것을 말한다 사용법에 대해 알아보겠습니다

먼저 HtmlWebpackPlugin 을 설치합니다

```text
$ npm install html-webpack-plugin -D
```

그 다음 HtmlWebpackPlugin 에 관련된 설정을 추가합니다

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [new HtmlWebpackPlugin()],
}
```

로더에 비해서 플러그인은 설정이 간단한 편인데 플러그인의 배열에는 생성자 함수로 생성한 객체 인스턴스만 추가하면 됩니다

<br/><br/>
