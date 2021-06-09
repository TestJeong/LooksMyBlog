---
title: '프로토타입이란?'
date: 2021-06-07 16:21:13
category: 'JavaScript'
draft: false
---


모든 객체에는 하나의 프로토타입이 존재하는데 이는 생성자 함수와 연결되어있습니다 그리고 어떤 객체를 원형으로 삼고 이를 복제함으로써 상속을 구현하는 방식입니다.

**프로토타입의 개념은 프로토타입 객체(Prototype Object), 프로토타입 링크(Prototype Link)**를 통틀어 말하며 한 가지씩 자세히 알아봅시다 

<br>

***
<br>

### 1. 프로토타입 객체(Prototype Object)

 자신이 다른 객체의 원형이 되는 객체이다 사전 그대로 원형을 뜻하며 원래의 모습이라는 것이다. 같은 생성자로부터 만들어진 객체들은 모두 이 원형 객체를 공유하며 `prototype` 이라는 속성을 통해 프로토타입 객체에 접근하여 값을 추가,삭제를 할 수 있다

```jsx
function Car(){}
var Hyundai = new Car();  
var Kia = new Car();

Car.prototype.getType = function (){  
    return "kona"; 
};
console.log(Hyundai.getType());   // Kona  
console.log(Kia.getType());  // Kona
```

위 코드와 같이 `Person` 의 `prototype` 객체에 `getType` 이라는 메소드를 넣으면 `Person`  생성자로 만든 모든 객체는 이 메소드 사용이 가능합다

![](./images/console.png)

Car 함수의 `prototype` 이라는 속성을 통해 프로토타입 객체(prototype object)에 접근할 수 있다

![](./images/11.png)

Car 함수의 프로토타입 객체 생성 및 연결을 위 사진과 같이 표현하였다그리고 위 사진처럼 프로토타입 객체안에는 기본적인 속성으로 `__proto__` 와 `constructor` 를 가지고 있다

`__proto__` = 자신을 만들어낸 객체의 `prototype.object` 을 가리키는데 이 프로퍼티를 프로토타입 링크라고 부른다

`constructo` = 자신을 만들어낸 객체와 연결된 속성이며 `prototype.object` 와 같이 생성된 함수를 가리킨다.

<br>

***
<br>

### 2. 프로토타입 링크(Prototype Link)

생성된 객체와 부모 **객체와의 참조를 이어주는 링크이며**  `__ proto __` 라는 속성이 모든 객체에 있고 객체가 생성 될때 조상이었던 함수의 `prototype object` 를 가리킨다.

 이 속성을 통해 상위 프로토타입과 연결되어 있는 형태를 프로토타입 체인 이라고 한다

그림과 코드를 이용하여 자세히 알아보자 프로토타입 객체때 사용했던 코드를 다시보자

```jsx
function Car(){}
var Hyundai = new Car();  
var Kia = new Car();

Car.prototype.getType = function (){  
    return "kona"; 
};
console.log(Hyundai.getType());   // Kona  
console.log(Kia.getType());  // Kona
```

![](./images/22.png)

Hyundai에는 위 사진과 같이 getType() 속성이 없는데 사용 할 수있는 것은 `__proto__` 라는 속성때문인데 Hyundai는 Car()를 통해 생성되었으니 Car()의 프로토타입 객체(prototype Object)를 가리켜 getType()을 사용 할 수 있게 된다

![](./images/33.png)

이렇게 `__proto__` 속성을 통해 특정 객체의 메서드나 프로퍼티에 접근하고자할 때, 해당 객체에 접근하려고 하는 프로퍼티나 객체가 없다면 프로토타입 링크([[Prototype]] 프로퍼티)를 따라 자신의 부모 역할을 하는 프로토타입 객체를 차례로 검색한다. 이를 프로토타입 체인이라 한다.