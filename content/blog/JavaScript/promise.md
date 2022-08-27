---
title: '비동기 프로그래밍 - 콜백함수(Callback), Promise(프로미스)'
date: 2021-12-25 16:21:13
category: 'JavaScript'
draft: false
---

1편에서는 싱글쓰레드인 자바스크립트가 어떻게 비동기 처리를 할 수 있는지 알아봤으며 이번에는 비동기 처리 방법 중 **콜백 함수**와 **Promise**에 대해 알아보도록 하겠습니다.

## 콜백 함수란?

> 다른 함수에 매개변수로 넘기는 함수를 말하며 이벤트가 발생할 때 또는 특정 시점에 실행되는 함수라는 의미에서 콜백 함수라고 불립니다.

```jsx
function print(callback) {
  callback()
}
```

위 코드에서 `print()` 함수는 매개변수로서 또 다른 함수(callback)를 받고 있으며 함수 내부에서 호출하고 있습니다. 여기서 매개변수로 전달된 함수를 콜백 함수라고 말하며 이 콜백 함수를 원하는 시점에 실행할 수도 있습니다.

이제 이 콜백 함수를 통해 비동기 처리하는 방법을 알아보겠습니다.
먼저 비동기 작업에서 콜백 함수를 사용하는 이유는 예를 들어 서버로부터 받아온 데이터를 추가적으로 연산처리를 한다고 가정했을 때 데이터를 받아온 후에 연산 작업을 해야 합니다. **즉, A 동작이 완료된 후 B를 실행하여야 합니다. 이럴 때 콜백 함수를 이용하여 처리할 수 있습니다.**

```jsx
const printString = (string, callback) => {
  setTimeout(() => {
    console.log(string)
    callback()
  }, 1000)
}

const print = () => {
  printString('A', () => {
    console.log('B')
  })
}

print()

// A => printString의 첫번쨰 매개변수
// B => 콜백 함수
```

1초 후 `printString()` 의 첫 번째 매개변수 A가 출력 된 후 콜백 함수가 실행되어 B가 출력된다.

## 콜백지옥

```jsx
const print = () => {
  printString('A', () => {
    printString('B', () => {
      printString('C', () => {
        printString('D', () => {
          printString('E', () => {
            // 콜백지옥...
          })
        })
      })
    })
  })
}

print()
```

위 코드처럼 **콜백 함수를 계속 호출하는 상황을 콜백 지옥** 이라고 합니다. 단어 그대로 지옥이라고 표현할 만큼 콜백 함수의 중첩된 사용은 가독성과 유지 보수성을 떨어트리기 때문에 이러한 코딩 방식은 지양해야 합니다. 다음은 이런한 콜백 함수의 단점들을 보완해 준 Promise에 대해 알아보겠습니다.

---

## Promise란?

비동기적으로 실행하는 **작업의 결과(성공 또는 실패)를 나타내는 객체입니다.** new 연산자를 사용하여 Promise를 생성할 수 있으며 콜백 함수 보다 비동기 처리 시점을 명확하게 표현할 수 있고 또 연속된 비동기 처리 작업을 수정, 삭제, 추가하는 것이 더 편하고 가독성이 좋으며 비동기 작업 상태를 쉽게 확인할 수 있어 유지 보수성이 좋은 장점들이 있습니다.

</br>

### Promise의 상태

Promise는 대표적으로 다음과 같은 **3가지 상태**를 가집니다.

- <span class ="hilight-container" style="background: #fbfea4">Pending 상태</span>

아래와 같이 Promise를 호출하면 Pending 상태가 되며 아직 미완료인 상태를 말합니다. 이때 콜백 함수의 인자로 resolve, reject에 접근할 수 있습니다.

```jsx
new Promise(function(resolve, reject) {
  // ...
})
```

- <span class ="hilight-container" style="background: #fbfea4">Fulfilled 상태</span>

콜백 함수의 인자 `resolve`를 실행하면 Fulfilled 상태가 되는데 비동기 처리가 완료되어 결과값을 반환해 준 상태를 말합니다.

```jsx
new Promise(function(resolve, reject) {
  resolve()
})
```

이후 이행 상태가 되면 `then()`을 이용해 처리 결과 값을 받을 수 있습니다.

- <span class ="hilight-container" style="background: #fbfea4">Rejected 상태</span>

콜백 함수의 인자 `reject`를 실행하면 Rejected 상태가 되는데 비동기 처리가 실패하거나 오류가 발생한 상태이며 이후 `catch()`를 이용해 error를 다룰 수 있습니다.

```jsx
new Promise(function(resolve, reject) {
  reject()
})
```

### Promise 생성자를 이용한 사용법

생성자 함수와 동일하게 new로 Promise 객체를 만들 수 있는데 이때 인자로는 Executor(콜백 함수)가 들어갑니다. `Executor`(콜백 함수) 는 `resolve` 와 `reject` 라는 두 개의 함수를 매개변수로 받는 실행 함수입니다. `Executor` 는 비동기 작업을 시작하고 모든 작업을 끝낸 후, 해당 작업이 성공적으로 이행이 되었으면 `resolve` 함수를 호출하고, 중간에 오류가 발생한 경우 `reject` 함수를 호출합니다.

```jsx
const promise1 = new Promise((resolve, reject) => {
  // 비동기 작업
  resolve('작업 성공')
})

promise1.then(data => {
  console.log(data) // "작업 성공"
})

// 실패하는 상황에서는 reject 를 사용하여, .catch 를 통하여 실패했을시 작업을 설정 할 수 있습니다.
const promise2 = new Promise((resolve, reject) => {
  // 비동기 작업
  reject('작업 실패')
})

promise2
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error) // 작업 실패
  })
```

위 코드에서 사용하였던 then, catch를 후속 처리 메서드라 하는데 이 부분에 대해 조금 더 알아보도록 하겠습니다.

---

#### Promise.prototype.then

then 메서드는 2개의 콜백 함수를 인자로 전달받는데 첫 번째 콜백 함수는 Promise 상태 값이 fulfilled(resolve: 성공) 인 경우 전달되며 두 번째 콜백 함수는 Promise 상태 값이 rejected(reject: 실패) 인 경우 전달됩니다.

```jsx
const promise = () =>
  new Promise((resolve, reject) => {
    let a = 1 + 1

    if (a == 3) {
      resolve('성공입니다')
    } else {
      reject('실패입니다')
    }
  })

// 두개의 콜백함수가 전달
promise().then(
  message => {
    console.log('resolve(성공) => ' + message)
  },
  error => {
    console.log('reject(실패) => ' + error)
  }
)
```

---

#### Promise.prototype.catch

catch 메서드는 한 개의 콜백 함수를 인자로 전달받으며 Promise 상태 값이 rejected(reject: 실패) 인 경우에만 전달됩니다.

```jsx
const promise = () =>
  new Promise((resolve, reject) => {
    let a = 1 + 1

    if (a == 3) {
      resolve('성공입니다')
    } else {
      reject('실패입니다')
    }
  })

promise().catch(error => {
  console.log('reject(실패) => ' + error)
})
```

then 메소드에서 두 번째 콜백 함수에서 에러를 처리하는 것보다 catch 메서드를 이용하여 에러를 처리하는 것이 더 좋은데 **그 이유는 then 메소드에서 첫 번째 콜백 함수에서 에러가 발생할 시 두 번째 콜백 함수에서 캐치하지 못하며 코드가 복잡해지고 가독성이 좋지 않습니다 그래서 에러를 처리할 때 catch 메소드를 이용하는 것을 더 권장합니다.**

```jsx
// catch문을 이용한 에러처리
promise()
  .then(message => console.log('resolve(성공) => ' + message))
  .catch(error => console.log('reject(실패) => ' + error))
```

---

#### Promise.prototype.finally

finally 메서드는 한 개의 콜백 함수를 인자로 전달받으며 Promise 상태 값과 상관없이 무조건 한 번은 전달되며 보통 Promise 상태와 상관없이 공통적으로 수행해야 할 경우 사용됩니다.

```jsx
promise()
  .then(message => console.log('resolve(성공) => ' + message))
  .catch(error => console.log('reject(실패) => ' + error))
  .finally(() => console.log('성공, 실패와 상관없이 무조건 실행!'))
```

</br>

## 프로미스 체이닝(Promise Chaining)으로 여러개 연결하기

Promise는 콜백과 달리 `결과를 값으로 받아서 저장`할 수 있습니다. 그래서 Promise는 결과 그 자체를 값으로 받기 때문에, **연속으로 실행하는 코드 즉 비동기 작업을 순차적으로 처리할 상황**에서 유용하게 사용 할 수 있습니다.

```jsx
// 후속 처리 메소드 then을 이용하여 순차적으로 사용 하였습니다.

const fetchNumber = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000)
})

fetchNumber
  .then(num => num * 2) // 값이나 promise를 전달
  .then(num => num * 3)
  .then(num => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(num - 1), 1000)
    })
  })
  .then(num => console.log(num))
```

then 메소드는 값뿐만 아니라 Promise도 전달할 수 있으며 결과적으로 2초 후 2가 출력됩니다.

<br/>
