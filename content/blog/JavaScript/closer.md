---
title: '클로저란 무엇인가?'
date: 2021-05-30 16:21:13
category: 'JavaScript'
draft: false
---

### **클로저란?**

---

내부 함수가 선언되었을 때의 환경인 스코프를 기억해서 선언되었던 환경 밖에서 호출되어도 그 환경에 접근할 수 있는 함수이다. 즉 원래 선언되어 있던 **환경(렉시컬 스코프)**를 기억하고 접근할 수 있도록 하는 특성이 있습니다.

```jsx
function getClosure() {
  const text = 'variable 1'
  return function() {
    return text
  }
}

const closure = getClosure()
console.log(closure()) // 'variable 1'
```

<br/>
위 코드를 살펴보면 `getClosure()` 는 함수를 반환하고, 반환된 함수는 `getClosure()` 내부에서 선언된 변수를 참조하고 있다. 또한 이렇게 참조된 변수는 함수 실행이 끝났다고 해서 사라지지 않았고, 여전히 제대로 된 값을 반환하고 있는 걸 알 수 있다. 다른 예시를 한번 보자
<br/>

```jsx
var Car = 'My car is '

function sayBrand(name) {
  var introduce = Car + name

  return function() {
    console.log(introduce)
  }
}

var myCar1 = sayBrand('KIA')
var myCar2 = sayBrand('HYUNDAI')
var myCar3 = sayBrand('BMW')

myCar1() // My car is 'KIA'
myCar2() // My car is 'HYUNDAI'
myCar3() // My car is 'BMW'
```

여기서 myCar1, myCar2, myCar3을 호출한 결과를 보면 `introduce` 변수가 동적으로 바뀌어 있는 것처럼 보이지만, 같은 함수를 통해 받은 리턴 값이어도 각각 다른 스코프 체인을 가지기 때문에 실제로는 `introduce` 라는 변수가 여러 번 생성된 것이다. 즉 클로저를 통해 서로 다른 환경을 가진다는 뜻이다

일반적으로 우리가 알고 있는 지역변수는 함수의 라이프사이클과 함께하며, 본인의 역할을 다 하면 가지고 있던 지역변수도 같이 없어지게 되는데 내부 함수를 통해 접근한 외부 함수의 지역변수들의 값은 외부함수의 실행이 끝나서 소멸된 이후에도 외부에서 저장한 내부 함수를 통해 접근이 가능한 것을 클로저라 한다 한 가지 주의 할 점은 실행될 때마다 각자의 참조 영역을 유지해야 하기 때문에 메모리 사용량이 늘어나기 때문에 메모리 관리가 필요하다
<br/><br/>

### **캡슐화**

---

캡슐화란 **정보 은닉**의 개념으로, 해당 정보들을 외부로 노출시키지 않는 것이다.

만약 다른 함수에서 배열에 쉽게 접근하여 값을 바꾸고, 또 실수로 같은 이름의 변수를 만들면 버그가 생길 수 있다 이런한 가능성을 대비해 클로저의 캡슐화를 활용해보자

```jsx
function Car(name) {
  var _name = name
  return function() {
    console.log(_name, 'is the best car company! ')
  }
}

var Brand = Car('Hyundai')

Brand() // 'Hyundai is the best car company!'
```

JAVA에서는 변수명에 `_`를 앞에 붙여줌으로써 **외부 접근 불가(Private)**의 의미를 가지는데 자바스크립트에서는 private, public, protected 같은 접근 수정자를 제공하지 않기 때문에 이렇게 따로 `_name` 의 변수를 만들어 사용하면 `name` 을 변경할 방법이 없다
<br/>
<br/>
