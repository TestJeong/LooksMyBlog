---
title: '프로그래머스 : 완주하지 못한 선수 [JS]'
date: 2021-07-01 16:21:13
category: 'Algorithm'
draft: false
---

### 문제 설명
수많은 마라톤 선수들이 마라톤에 참여하였습니다. 단 한 명의 선수를 제외하고는 모든 선수가 마라톤을 완주하였습니다.

마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.

***

### 제한사항
- 마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.<br>
- completion의 길이는 participant의 길이보다 1 작습니다.<br>
- 참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.<br>
- 참가자 중에는 동명이인이 있을 수 있습니다.<br>

***

```jsx
function solution(participant, completion) {

  let num = participant.length;

  // 완주하지 못한 선수와 완주한 선수를 정렬합니다
  participant.sort();
  completion.sort();

  for (let i = 0; i < num; i++) {
    if (participant[i] !== completion[i]) { // 정렬한 후 for문을 통해 비교합니다

      return participant[i]; // 같지 않은 선수가 있다면 출력합니다
    }
  }   
}
```