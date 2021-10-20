---
title: '스프레드 문법'
date: 2021-10-01 16:21:13
category: 'JavaScript'
draft: false
---

ES6에서 도입된 스프레드 문법은 `...` 하나로 뭉쳐 있는 여러 값들의 집합을 펼쳐서 개별적인 값들의 목록으로 만들 수있다

```jsx
console.log(...[1, 2, 3]) // 1,2,3
console.log(...'Hello') // H e l l o
```

참고로 스프레드 문법의 결과물은 값으로 사용할 수 없고 쉼표로 구분한 값의 목록을 사용하는 문백에서만 사용 가능하다 천천히 알아보자

### 함수 호출문의 인수 목록

배열을 펼쳐서 개별적인 값들의 목록으로 만든 후 이를 함수의 인수로 목록으로 전달해야 하는 경우

```jsx
const arr = [1, 2, 3]

const max = Math.max(arr) // NaN
```

먼저 `Math.max` 는 매개변수 개수를 확정할 수 없는 가변 인자 함수다 개수가 정해져 있지 않는 여러 개의 숫자를 인수로 전달받아 인수 중에서 최대 값을 반환한다 위 코드 처럼 `Math.max` 메서드에 숫자가 아닌 배열로 인수를 전달하면 최대값을 구할 수 없어 `NaN` 을 반환하는데 이 문제를 해결하기 위해서는 요소들을 개별적인 값들의 목록으로 만든 후 인수로 전달해야한다

```jsx
const arr = [1, 2, 3]

// 스프레드 문법이 나오기 전
const max = Math.max.apply(null, arr) // 3

// 스프레드 문법 사용
const max = Math.max(...arr) // 3
```

---

### 가변 인자 함수란? <br>

<span class ="hilight-container" style="background: #fbfea4">매개변수의 최대 갯수가 지정되지 않은 함수를 말합니다</span><br>
스프레드 문법과 Rest 파라미터 형태가 동일하여 혼동할 수 있으므로 주의가 필요하다 `Rest` 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받기 위해 매개변수 이름 앞에 `...`을 붙이는 것이다

```jsx
function foo(...rest) {
  console.log(rest) // [1,2,3] 인수들의 목록을 배열로 전달받는다
}

foo(1, 2, 3)
```

스프레드 문법은 여러 개의 값이 하나로 뭉쳐 있는 배열과 같은 이터러블을 펼쳐서 갤별적인 값들의 목록을 만드는 것이다

---

### 배열 리터럴의 요소 목록

2개의 배열을 1개의 배열로 결합하고 싶을때

```jsx
//ES5
var arr = [1, 2].concat([3, 4])
console.log(arr) // [1,2,3,4]

//ES6
const arr = [...[1, 2], ...[3, 4]]
consoel.log(arr) // [1,2,3,4]
```

어떤 배열의 중간에 다른 배열의 요소들을 추가하거나 제거하려면 splice메서드를 사용하는데 이때 세 번째 인수로 배열을 전달하면 배열 자체가 추가된다

```jsx
//ES5
var arr1 = [1, 4]
var arr2 = [2, 3]
arr1.splice(1, 0, arr2)

console.log(arr1) // [1,[2,3],4]

Array.prototype.splice.apply(arr1, [1, 0].concat(arr2))
console.log(arr1) // [1,2,3,4]

//ES6
arr1.splice(1, 0, ...arr2)
console.log(arr1) // [1,2,3,4]
```

---

### 배열 복사

```jsx
//ES5
var origin = [1, 2]
var copy = origin.slice()

console.log(copy) // [1,2]

//ES6
const origin = [1, 2]
const copy = [...origin]

console.log(copy) // [1,2]
```

---

### 객체 리터럴의 프로퍼티 목록

객체 리터럴의 프로퍼티 목록에서도 스프레드 문법을 사용 할 수 있다

```jsx
// 객체의 얕은 복사
const obj = { x: 1, y: 2 }
const copy = { ...obj }
console.log(copy) // { x:1, y:2 }

// 객체 병학
const merged = { x: 1, y: 2, ...{ a: 1, b: 2 } }
consoel.log(merged) // {x:1, y:2, a:3, b:4}
```

<span class ="hilight-container" style="background: #ebb8c1"><strong class="strong-container">[ " 모던 자바스크립트 Deep Dive " 책을 읽고 정리한 글입니다 ]</strong></span>
