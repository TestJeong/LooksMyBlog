---
title: '프로그래머스 : 두 개 뽑아서 더하기 [JS]'
date: 2021-07-05 19:21:13
category: 'Algorithm'
draft: false
---

### 문제 설명
정수 배열 numbers가 주어집니다. numbers에서 서로 다른 인덱스에 있는 두 개의 수를 뽑아 더해서 만들 수 있는 모든 수를 배열에 오름차순으로 담아 return 하도록 solution 함수를 완성해주세요.

***

### 제한사항
- numbers의 길이는 2 이상 100 이하입니다.
  - numbers의 모든 수는 0 이상 100 이하입니다.

![](./images/10.png)

***

### 나의 풀이

```jsx
function solution(numbers) {
  var answer = [];

  numbers.sort((a, b) => a - b);

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      answer.push(numbers[i] + numbers[j]);
    }
  }
  let sortArray = new Set(answer);
  answer = [...sortArray].sort((a, b) => a - b);

  return answer;
}
```