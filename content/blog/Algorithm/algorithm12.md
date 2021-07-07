---
title: '프로그래머스 : 가운데 글자 가져오기 [JS]'
date: 2021-07-07 20:21:13
category: 'Algorithm'
draft: false
---

### 문제 설명
단어 s의 가운데 글자를 반환하는 함수, solution을 만들어 보세요. 단어의 길이가 짝수라면 가운데 두글자를 반환하면 됩니다.

***


### 제한사항
- s는 길이가 1 이상, 100이하인 스트링입니다.

![](./images/12.png)

***

### 나의 풀이

```jsx
function solution(s) {
  var answer = "";
  let a = s.length;
  if (a % 2 === 0) {
    answer = s.substr(a / 2 - 1, 2);
  } else {
    answer = s.substr(Math.round(a / 2 - 1), 1);
  }
  return answer;
}
```