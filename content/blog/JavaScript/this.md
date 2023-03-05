---
title: 'this란 무엇인가?'
date: 2021-05-29 16:21:13
category: 'JavaScript'
draft: false
---

`this` 는 상황에 따라 달라지며 함수를 호출할 때 결정된다고 볼 수 있는데 즉 함수를 어떤 방식으로 호출하느냐에 따라 값이 달라진다는 것이다 **상황은 크게 5가지가 있는데** 아래와 같다
<br><br>

#### **1. 객체의 메서드를 호출할때**

메서드란 객체의 프로퍼티에 할당된 함수로 알고 있지만 함수를 객체의 프로퍼티에 할당한다고 해서 그 자체로서 무조건 메서드는 아니다. 객체의 메서드로서 호출할 경우에만 메서드로 동작하고 그게 아니면 함수로 동작한다

```jsx
let obj1 = {
  name: 'Jeong',
  sayName: function() {
    console.log(`My name is ${this.name}.`)
  },
}

let obj2 = {
  name: 'Park',
}

// obj2 객체에 sayName() 메서드를 만들고 이 메서드에 obj.sayName()을 할당한다
obj2.sayName = obj1.sayName

obj1.sayName() // My name is Jeong.
obj2.sayName() // My name is Park
```

이렇게 객체의 메서드로 호출된 경우 `this` 는 자신을 호출한 객체에 바인딩 되는데 쉽게 말해 점 앞에 명시된 객체가 `this` 가 되는 것이다
<br>
<br>

#### 2. **함수를 호출할때**

함수를 호출하는 경우 해당 함수 내부의 this는 전역 객체를 가리킨다

```jsx
const name = 'YunJ'

function sayHi() {
  console.log(this.name, 'Nice to Meet You!')
}

sayHi() //YunJ Nice to Meet You!
```

`sayHi` 함수를 실행하게 되면 `this` 는 전역 객체인 `name` 을 가리킨다 하지만 여기서 주의할 점이 있는데 아래 와 같이 내부 함수에서도 `this` 는 전역 객체를 가리킨다는 점에서 주의를 해야 한다

```jsx
    var value = 100;

    var obj = {
      value: 1,
      firstFunc: function () {
     ㅓ   this.value += 1;
        consoㅍle.log(this.value); // obj를 가리키므로 2가 출력된다

    		//내부함수
        function secondFunc() {
          this.value += 1
          console.log(this.value); //this가 지정되지 않아 전역객체에 있는 value 값이 적용되어 101이 출력
        }

        secondFunc();
      },
    };

    obj.firstFunc();
```

이렇게 내부 함수에 있는 `this` 가 전역 객체를 참조하는 상황을 극복하기 위해서는 부모 함수의 `this` 를 내부 함수가 접근할 수 있게 변수에 저장하는 방법을 사용할 수 있습니다 보통 변수명을 **_this, that, _** 등 많이 있지만 통상적으로 `self` 를 많이 사용합니다.

```jsx
var value = 100

var obj = {
  value: 1,
  firstFunc: function() {
    this.value += 1
    console.log(this.value) // 2 출력

    var self = this

    //내부함수
    function secondFunc() {
      self.value += 2
      console.log(self.value) // 4 출력
    }

    secondFunc()
  },
}

obj.firstFunc()
```

<br>

#### **3. 생성자를 통해 호출할때**

생성자 함수는 말 그대로 JS의 객체를 새로 생성하는 역할을 하는데 기존 함수에 `new` 를 붙여서 호출하면 해당 함수는 생성자 함수로 동작한다.

```jsx
function Car(name) {
  // 함수 코드 (여기에서는 this.name = name;) 실행 전
  this.name = name
  // 함수 리턴
}

// brand 객체 생성
let brand = new Car('KIA')
console.log(brand.name) // KIA
```

1. Car() 함수가 생성자로 호출되면, 함수 코드가 실행되기 전에 빈 객체가 생성됩니다. 여기서 생성된 빈 객체는 Car() 생성자 함수의 prototype 프로퍼티가 가리키는 객체(Car.prototype 객체)를 **proto** 링크로 연결해서 자신의 프로토타입으로 설정합니다. 그리고 이렇게 생성된 객체는 생성자 함수 코드에서 사용되는 this로 바인딩 됩니다.
2. this가 가리키는 빈 객체에 'brand'를 인자로 넘겨 name 이라는 프로퍼티를 생성했습니다.
3. 리턴 값이 특별히 없으므로 this로 바인딩 한 객체가 생성자 함수의 리턴 값으로 반환되어 brand 변수에 저장됩니다.
   <br><br>

#### **4. 명시적으로 this를 바인딩하는 방법**

#### call 메서드

메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령어이다 call 메서드의 첫 번째를 `this` 로 바인딩하고, 두 번째 인자들을 호출할 함수의 매개변수다. 함수를 그냥 실행하면 `this` 는 전역 객체를 참조하지만 call 메서드를 이용하면 임의의 객체를 `this` 로 지정 할 수 있다.

```jsx
function say(greetings, ask) {
  console.log(greetings + ' ' + this.name + ' ' + ask)
}

let foo = { name: 'YunJae' }

say.call(foo, 'Hello!', 'How old are you?') // Hello! YunJae How old are you?
```

이렇게 say 함수에 call을 사용하면 첫 번째 인자로 foo를 `this` 로 바인딩 하며 두 번째 인자는 say 함수들의 인자들을 호출할 매개변수들이다

#### apply 메서드

apply 메서드는 call 메서드와 기능적으로 완전히 동일하다 다른 점은 두 번째 인자가 배열로 받는다는 점이다

```jsx
function say(greetings, ask){
  console.log(greetings + " " + this.name + " " + ask);
}

let foo = {name: 'YunJae'};

say.call(foo, [Hello!, How old are you?]);  // Hello! YunJae How old are you?
```

call 메서드와 같지만 두번째 인자가 배열로 받는 다는 점을 기억하자.
<br/>

#### bind 메서드

bind 메서드는 바로 함수를 호출하지 않고 바인딩된 새로운 함수를 만들기만 하는 메서드 이다

```jsx
function say(greetings, ask) {
  console.log(greetings + ' ' + this.name + ' ' + ask)
}

let foo = { name: 'YunJae' }
let add = say.bind(foo)

add('Hello!', 'Nice to meet you') // Hello! YunJae Nice to meet you
```

이렇게 `say.bind(foo);` 는 add 객체를 함수 say의 this로 설정한 새로운 함수를 만들어서 반환한다 하지만 bind 메서드는 함수의 동작을 영구적으로 변경하므로 찾기 어려운 버그가 될 수 있으니 함수의 `this` 가 어디에 묶이는지 정확히 파악하고 사용해야 한다
<br><br>

#### 5. **화살표 함수의 this**

화살표 함수는 `this` 가 없는데 이게 무슨 말이냐면 화살표 함수에서 `this` 를 사용하면 가장 가까운 스코프에서 `this` 를 가져온다 그러므로 화살표 함수의 `this` 는 언제나 상위 스코프(부모)의 `this` 를 가리키기 때문에 일반 함수처럼 `this` 를 바인딩 하지 않고 편하게 쓸 수 있다

```jsx
// 첫번째 예제
function testThis() {
  this.name = 'm9'

  return {
    name: '이름이 변경되었습니다',
    arrowFunction: () => {
      console.log(this.name) // 화살표 함수이므로 부모 this를 받아온다
    },
    normalFunction: function() {
      console.log(this.name)
    },
  }
}

const test = new testThis()
test.arrowFunction() //결과: m9
test.normalFunction() //결과: 이름이 변경되었습니다.

// 두번째 예제
function obj() {
  return {
    test: () => {
      console.log('1st', this) // obj을 가리킨다
      const inner = () => {
        console.log('2nd', this) // obj을 가리킨다
      }
      return inner()
    },
  }
}

const test2 = new obj()
```

#### [화살표 함수를 쓰면 안되는 경우]

#### 메소드

자신을 둘러싸고 있는 상위 환경의 this를 그대로 계승하는 lexical this를 따르므로 메소드에 사용하면 문제가 생긴다

```jsx
const person = {
  name: 'Lee',
  sayHi: () => console.log(`Hi ${this.name}`),
}

person.sayHi() // Hi undefined
```

<br/>

#### prototype

메소드를 prototype에 할당을 하면 안된다

```jsx
const person = {
  name: 'Lee',
}

Object.prototype.sayHi = () => console.log(`Hi ${this.name}`)

person.sayHi() // Hi undefined
```

<br/>

#### 생성자

화살표 함수는 prototype 프로퍼티를 가지고 있지 않기 때문에 사용 할 수 없다

```jsx
const Foo = () => {
  console.log(this)
}

const foo = new Foo() // TypeError: Foo is not a constructor
```

<br/>
<br/>
