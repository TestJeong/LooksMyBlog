---
title: '프로퍼티 어트리뷰트'
date: 2021-09-29 16:21:13
category: 'JavaScript'
draft: false
---

### **내부 슬롯과 내부 메서드**

프로퍼티 어트리뷰트를 알아보기 전에 내부 슬롯과 내무 메서드에 대한 이해가 필요하다

내부 슬롯 과 내부 메서드는 자바스크립트 엔진 내부 로직이므로 원칙적으로 자바스크립트는 내부 슬록과 내부 메서드에 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지는 않는다 하지만 모든 객체는 `[[Prototpye]]` 이라는 내부 슬롯을 갖는데 이 슬롯에 있는 `proto` 를 통해 간접적으로 접근 할 수 있다

```jsx
const o = {}
o.[[Prototype]] // err!

o.__proto__ // Object.prototype
```

### **프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체**

자바스크립트 엔진은 프로퍼티를 생성할 때 프로퍼티의 상태를 나타내는 프로퍼티 어트리뷰트를 기본값으로 자동 정의를 한다

프로퍼티 상태는 크게 4가지가 있으며 아래와 같다

- 프로퍼티 값 (Value)
- 값의 갱신 가능여부 (Writable)
- 열거 가능 여부 (Enumerable)
- 재정의 가능 여부 (Configurable)

프로퍼티 어트리뷰트에 직접 접근할 수 없지만 `Object.getOwnPropertyDescriptor` 메서드를 사용하여 간접적으로 확인이 가능하다

```jsx
const person = {
  name: 'Lee',
}

console.log(Object.getOwnPropertyDescriptor(person, 'name'))
// 프로퍼티 디스크립터 객체가 반환된다
// {value: "Lee", writable: true, enumerable: true, configurable: ture}
```

`Object.getOwnPropertyDescriptor` 메서드를 호출할 때 첫 번째 매개변수에는 객체츼 참조를 전달하고 두 번째 매개변수에는 프로퍼티 키를 문자열로 전달한다 `Object.getOwnPropertyDescriptor` 메서드는 프로퍼티 어트리뷰트 정보를 제공하는 프로퍼티 디스크립터 객체를 반환하며 만약 존재하지 않는 프로퍼티나 상속받은 프로퍼티에 대한것을 요구하면 `undefined` 가 반환된다

`Object.getOwnPropertyDescriptor` 메서드는 하나의 프로퍼티에 대해서만 프로퍼치 디스크립터 객체를 반환하지만 ES8에서 도입된 `Object.getOwnPropertyDescriptors` 메서드는 모든 프로퍼티의 프로퍼티 어트리뷰트 정보를 제공하는 프로퍼티 디스크립터 객체들을 반환한다

### **데이터 프로퍼티와 접근자 프로퍼티**

- 데이터 프로퍼티<br>
  <span class ="hilight-container" style="background: #fbfea4">키와 값으로 구성된 일반적인 프로퍼티이며 위 코드에 나온 예시가 여기에 속한다</span><br>

  #### 프로퍼티 어트리뷰트 → 프로퍼티 디스크립터 <br>

  `[[Value]] → value` : 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값<br>
  `[[Writable]] → writable` : 프로퍼티 값의 변경 가능 여부를 나타내는 불리언 값 false 이면 value 값 변경 불가능<br>
  `[[Enumerable]] → enumerable` : 프로퍼티 열거 가능 여부를 나타내는 불리언 값 fasle 인 경우 for... in, Object.keys 메서드 사용 불가<br>
  `[[Configurable]] → configurable` : 프러퍼티 재정의 가능 여부를 나타내는 불리언 값 fasle 인경우 해당 프로퍼티 삭제, 값 변경이 금지된다<br>
  <br>

- 접근자 프로퍼티<br>
  <span class ="hilight-container" style="background: #fbfea4">자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수로 구성된 프로퍼티.</span>

  #### 프로퍼티 어트리뷰트 → 프로퍼티 디스크립터

  `[[Get]] → get` : 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 읽을 때 호출되는 접근자 함수이며 getter 함수가 호출되고 그 결과가 프로퍼티 값으로 반환된다<br>
  `[[Set]] → set` : 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 저장할 때 호출되는 접근자 함수이며 setter 함수가 호출되고 그 결과가 프로퍼티 값으로 저장된다

```jsx
const person = {
	firstName: "Ungmo",
	lastName: "Lee"

	get fullName() {
		return `${this.firstName} ${this.lastName}`
	}

	set fullName(name) { // 매개 변수로 하나의 값만 받을 수 있습니다
		[this.firstName, this.lastName] = name.split(" ")
	}
}

console.log(person.firstName + " " + person.lastName) // Ungmo Lee

// 접근자 프로퍼티를 통한 프로퍼티 값을 저장하며 setter 함수인 fullName(name) 이 호출된다
person.fullName = "Heegun Lee"
console.log(person) // {firstName: "Heegun", lastName: "Lee"}

// 접근자 프로퍼티를 통한 프로퍼티 값을 참조하며 getter 함수인 fullName() 이 호출 된다
console.log(person.fullName) // Heegun Lee
```

<span class ="hilight-container" style="background: #ebb8c1"><strong class="strong-container">[ " 모던 자바스크립트 Deep Dive " 책을 읽고 정리한 글입니다 ]</strong></span>
