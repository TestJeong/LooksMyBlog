---
title: '프로그래머스 : 소수 만들기 [JS]'
date: 2021-06-29 16:21:13
category: 'Algorithm'
draft: false
---

### 문제 설명
주어진 숫자 중 3개의 수를 더했을 때 소수가 되는 경우의 개수를 구하려고 합니다. 숫자들이 들어있는 배열 nums가 매개변수로 주어질 때, nums에 있는 숫자들 중 서로 다른 3개를 골라 더했을 때 소수가 되는 경우의 개수를 return 하도록 solution 함수를 완성해주세요.

***

### 제한사항
nums에 들어있는 숫자의 개수는 3개 이상 50개 이하입니다.
nums의 각 원소는 1 이상 1,000 이하의 자연수이며, 중복된 숫자가 들어있지 않습니다.

***

#### 소수란? 1과 자기 자신 이외에는 다를 약수를 갖지 않으며 1보다 큰 자연수를 말합니다

#### 약수란? 어떤 수를 나누었을 때나머지가 0인 수를 그 수의 약수라 합니다

```jsx
function solution(nums) {

     let answer = 0;
    
    //1. 3자리 숫자 만들기
    const len = nums.length;
    for (let i = 0; i < len; i++)
    {
        for (let j = i+1; j < len; j++)
        {
            for (let k = j+1; k < len; k++)
            {
                const number = nums[i]+nums[j]+nums[k];
                if (numcheck(number))
                    answer++;
            }
        }
    }

    //2. 소수 판별
    function numcheck(number)
    {
        if (number < 2) return true;
        for (let i = 2; i < number; i++)
        {
            if (number % i == 0) return false;
        }
        return true;
    }
    
    return answer;

}
```