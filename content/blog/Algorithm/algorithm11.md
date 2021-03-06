---
title: '프로그래머스 : 비밀지도 [JS]'
date: 2021-07-07 19:21:13
category: 'Algorithm'
draft: false
---

### 문제 설명
네오는 평소 프로도가 비상금을 숨겨놓는 장소를 알려줄 비밀지도를 손에 넣었다. 그런데 이 비밀지도는 숫자로 암호화되어 있어 위치를 확인하기 위해서는 암호를 해독해야 한다. 다행히 지도 암호를 해독할 방법을 적어놓은 메모도 함께 발견했다.

1. 지도는 한 변의 길이가 n인 정사각형 배열 형태로, 각 칸은 "공백"(" ") 또는 "벽"("#") 두 종류로 이루어져 있다.<br>
2. 전체 지도는 두 장의 지도를 겹쳐서 얻을 수 있다. 각각 "지도 1"과 "지도 2"라고 하자. 지도 1 또는 지도 2 중 어느 하나라도 벽인 부분은 전체 지도에서도 벽이다. 지도 1과 지도 2에서 모두 공백인 부분은 전체 지도에서도 공백이다.<br>
3. "지도 1"과 "지도 2"는 각각 정수 배열로 암호화되어 있다.<br>
4. 암호화된 배열은 지도의 각 가로줄에서 벽 부분을 1, 공백 부분을 0으로 부호화했을 때 얻어지는 이진수에 해당하는 값의 배열이다.<br>

네오가 프로도의 비상금을 손에 넣을 수 있도록, 비밀지도의 암호를 해독하는 작업을 도와줄 프로그램을 작성하라.<br>

![](./images/11.png)

### 입출력 형식

![](./images/11a.png)

***

### 나의 풀이

- 10진수를 2진수로 변경하기 위해 `toString(2)` 를 사용하였습니다
- `padStart()` 는 현재 문자열의 시작을 다른 문자열로 채워, 주어진 길이를 만족하는 새로운 문자열을 반환합니다. 채워넣기는 대상 문자열의 시작(좌측)부터 적용됩니다. 아래 코드와 같이 사용 할 수 있습니다.
```jsx
const num = "5"
num.padStart(2, "0") // 05  
```

```jsx
function solution(n, arr1, arr2) {
  var answer = [];
  let list1 = [];
  let list2 = [];

  arr1.map((x) => {
    let result = x.toString(2).padStart(n, "0").split("");
    list1.push(result);
  });

  arr2.map((x) => {
    let results = x.toString(2).padStart(n, "0").split("");
    list2.push(results);
  });

  for (let i = 0; i < n; i++) {
    let value = "";
    for (let j = 0; j < n; j++) {
      if (list2[i][j] === "1") {
        list1[i][j] = "1";
      }
      if (list1[i][j] === "1") {
        value += "#";
      } else {
        value += " ";
      }
    }
    answer.push(value);
  }
  return answer;
}
```

### 다른 사람 풀이

비트 연산자를 사용하여 2진수로 변환 후 한번에 arr1, arr2번을 합쳐 정규표현식을 사용하여 # 과 공백을 추가하였습니다

```jsx
var solution=(n,a,b)=>
  a.map((a,i)=>
    (a|b[i]).toString(2).padStart(n,0).replace(/0/g,' ').replace(/1/g,'#'))
```