---
title: '생성자 함수 와 생성자 함수를 통해 객체 생성'
date: 2021-09-28 16:21:13
category: 'JavaScript'
draft: false
---

<span style="background: #fbfea4"><strong> 이글을 보기 전에 this에 관한 이해가 필요합니다 this에 대해 모르시면 [여기](https://looksmyblog.netlify.app/JavaScript/this/) 글을 한번 보고 와주세요!</strong></span>

객체 리터럴에 의한 객체 생성 방식은 가장 일반적이고 간단한 생성 방식이다 하지만 객체 리터럴 이외에도 다양한 방법으로 생성할 수 있는데 여기서는 생성자 함수를 통해 객체를 생성하는 방식을 알아보자

생성자 함수란 new 연산자와 함께 호출하여 객체를 생성하는 함수를 말하며 생성자 함수에 의해 생성된 객체를 인스턴스라 한다

```jsx
// 빈 객체의 생성
const person = new Object()

//프로퍼티 추가
person.name = 'Lee'
person.sayHello = function() {
  console.log('Hi My name is' + this.name)
}

console.log(person) // {name : "Lee", sayHello: f}
person.sayHello() // Hi! My name is Lee
```

또한 Object 생성자 함수 이외에도 자바스크립트는 String, Number, Boolean, Function, Array, Date, RegExp, Promise 등의 빌트인 생성자 함수를 제공하여 객체를 만들 수 있다

```jsx
const strObj = new String('Lee')
console.log(strObj) // String {"Lee"}

const boolObj = new Boolean(true)
console.log(boolObj) // Boolean {true}

const arr = new Array(1, 2, 3)
console.log(arr) // [1,2,3]
```

이처럼 객체 리터럴에 의한 객체 생성 방식이 더 직관적이고 간편한데 생성자 함수를 쓰는 경우는 언제일까? 바로 객체를 여러 개 생성할때 사용되는데 객체 리터럴의 경우 매번 같은 프로퍼티를 기술해야 하기 때문에 비효율 적이다

```jsx
const circle1 = {
  radius: 5,
  getDiameter() {
    return 2 * this.radius
  },
}

const circle2 = {
  radius: 10,
  getDiameter() {
    return 2 * this.radius
  },
}

console.log(circle1.getDiameter()) // 10
console.log(circle1.getDiameter()) // 20
```

객체는 프로퍼티를 통해 객체 고유의 상태를 표현하고 메서드를 통해 프로퍼티를 참조하고 작동하는 동작을 표현하는 편인데 프로퍼티는 객체마다 프로퍼티 값이 다를 수 있지만 메서드는 내용이 동일 한 경우가 대부분이라 생성자 함수를 사용하여 프로퍼티 구조가 동일한 객체를 간편하게 여러개 생성할 수 있다

```jsx
function Circle(radius) {
  this.radiius
  this.getDiameter = function() {
    return 2 * this.radius
  }
}

const circle1 = new Circle(5)
const circle2 = new Circle(10)

console.log(circle1.getDiameter()) // 10
console.log(circle2.getDiameter()) // 20
```

생성자 함수의 인스턴스 생성 과정

생성 과정은 크게 인스턴스를 생성하는 것과 생성된 인스턴스를 초기화 하는 것으로 나뉘어 진다 아래 코드를 보며 살펴보자

1. 인스턴스 생성과 this 바인딩

   ```jsx
   function Circle(radius) {
     console.log(this) // Circle {} 암묵적으로 인스턴스 생성!

     this.radius = radius
     this.getDiameter = function() {
       return 2 * this.radius
     }
   }
   ```

   암묵적으로 인스턴스가 생성되고 this에 바인딩된다. 생성자 함수에서의 this는 생성자 함수가 생성할 인스턴스를 가리킨다

   <span style="background: #fbfea4"> <u>바인딩이란?</u> 식별자와 값을 연결하는 과정</span>

2. 인스턴스 초기화

   ```jsx
   function Circle(radius) {
     // 인스턴스 초기화
     this.radius = radius
     this.getDiameter = function() {
       return 2 * this.radius
     }
   }
   ```

   this에 바인딩되어 있는 인스턴스에 프로퍼티나 메서드를 추가하고 생서자 함수가 인수로 전달받은 초기값을 인스턴스 프로퍼티에 할당하여 초기화 또는 고정값을 할당한다

3. 인스턴스 반환

```jsx
function Circle(radius) {
  this.radius = radius
  this.getDiameter = function() {
    return 2 * this.radius
  }
  // 완성된 인스턴스가 바인딩된 this를 암묵적으로 반환이 됩니다
}

const circle = new Circle(1) // 인스턴스를 생성합니다
console.log(circle) // Circle { radius: 1, getDiameter: f}
```

생성자 함수 내부에 모든 처리가 끝나면 완성된 인스턴스가 바인딩 된 this가 암묵적으로 반환이 됩니다 하지만 여기서 주의할 사항이 있는데 this가 아닌 다른 객체를 명시적으로 반환하면 return 문에 입력한 객체가 반환이 된다

```jsx
function Circle(radius) {
  this.radius = radius
  this.getDiameter = function() {
    return 2 * this.radius
  }
  return {} // return문을 통해 빈 객체({})을 반환
}

const circle = new Circle(1)
console.log(circle) // {}
```

하지만 명시적을 원시 값을 반화하면 원시 값 반환은 무시되고 암묵적으로 this가 반환된다

```jsx
function Circle(radius) {
  this.radius = radius
  this.getDiameter = function() {
    return 2 * this.radius
  }
  return 100 // return문에 원시값
}

const circle = new Circle(1)
console.log(circle) // Circle { radius: 1, getDiameter: f}
// 원시 값은 무시되고 this가 반환
```
