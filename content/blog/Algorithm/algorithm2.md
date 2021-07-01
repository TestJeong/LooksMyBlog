---
title: '프로그래머스 : 키패드 누르기 [JS]'
date: 2021-07-01 16:21:13
category: 'Algorithm'
draft: false
---
### 문제 설명
이 전화 키패드에서 왼손과 오른손의 엄지손가락만을 이용해서 숫자만을 입력하려고 합니다.
맨 처음 왼손 엄지손가락은 * 키패드에 오른손 엄지손가락은 # 키패드 위치에서 시작하며, 엄지손가락을 사용하는 규칙은 다음과 같습니다.

엄지손가락은 상하좌우 4가지 방향으로만 이동할 수 있으며 키패드 이동 한 칸은 거리로 1에 해당합니다.<br>
왼쪽 열의 3개의 숫자 1, 4, 7을 입력할 때는 왼손 엄지손가락을 사용합니다.<br>
오른쪽 열의 3개의 숫자 3, 6, 9를 입력할 때는 오른손 엄지손가락을 사용합니다.<br>
가운데 열의 4개의 숫자 2, 5, 8, 0을 입력할 때는 두 엄지손가락의 현재 키패드의 위치에서 더 가까운 엄지손가락을 사용합니다.<br>
4-1. 만약 두 엄지손가락의 거리가 같다면, 오른손잡이는 오른손 엄지손가락, 왼손잡이는 왼손 엄지손가락을 사용합니다.<br>
순서대로 누를 번호가 담긴 배열 numbers, 왼손잡이인지 오른손잡이인 지를 나타내는 문자열 hand가 매개변수로 주어질 때, 각 번호를 누른 엄지손가락이 왼손인 지 오른손인 지를 나타내는 연속된 문자열 형태로 return 하도록 solution 함수를 완성해주세요.

***

### 제한사항
- `numbers` 배열의 크기는 1 이상 1,000 이하입니다.<br>
- `numbers` 배열 원소의 값은 0 이상 9 이하인 정수입니다.<br>
- `hand`는 **"left"** 또는 **"right"** 입니다.<br>
- **"left"**는 왼손잡이, **"right"**는 오른손잡이를 의미합니다.<br>
- 왼손 엄지손가락을 사용한 경우는 L, 오른손 엄지손가락을 사용한 경우는 R을 순서대로 이어붙여 문자열 형태로 return 해주세요.<br>

***

#### Match.abs 는 절대값을 표시합니다.

```jsx
function solution(numbers, hand) {
    
let answer = "";
    
   let keypad = {
    1: [1, 1],
    2: [1, 2],
    3: [1, 3],
    4: [2, 1],
    5: [2, 2],
    6: [2, 3],
    7: [3, 1],
    8: [3, 2],
    9: [3, 3],
    "*": [4, 1],
    0: [4, 2],
    "#": [4, 3]
  }; // 키패드를 객체안에 key, value 형태로 생성합니다 그리고 value 값에 배열로 키패드 숫자의 위치를 넣습니다

  let currentL = [4, 1]; //맨 처음 오른손 위치
  let currentR = [4, 3]; // 맨 처음 왼손 위치

  numbers.forEach((num) => {
    let numberLocation = keypad[num];

    // 왼손
    if (numberLocation[1] === 1) {
      currentL = numberLocation;
      answer += "L";

    // 오른손
    } else if (numberLocation[1] === 3) {
      currentR = numberLocation;
      answer += "R";

    
    } else {
      let currentLocationL = getLocation(currentL, numberLocation);
      let currentLocationR = getLocation(currentR, numberLocation);

      //왼손 오른손 엄지손가락이 거리가 같을경우 손잡이 방향에 따라 문자열 추가
      if (currentLocationL === currentLocationR) {
        if (hand === "right") {
          currentR = numberLocation;
          answer += "R";
        } else {
          currentL = numberLocation;
          answer += "L";
        }

      // 거리가 다를경우 더 짧은 곳을 택합니다
      } else if (currentLocationL < currentLocationR) {
        currentL = numberLocation;
        answer += "L";
      } else {
        currentR = numberLocation;
        answer += "R";
      }
    }
  });

//왼손 오른손 엄지 손가락의 위치가 같은지 비교하는 함수
function getLocation(arr1, arr2) {
  let result = Math.abs(arr1[0] - arr2[0]) + Math.abs(arr1[1] - arr2[1]);
  return result;
}



    return answer;
}
```