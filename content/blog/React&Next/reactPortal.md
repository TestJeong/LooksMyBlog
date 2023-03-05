---
title: 'NextJS에서 React-Portal과 Framer-Motion을 이용하여 멋진 Modal창 만들기!'
date: 2022-09-04 16:21:13
category: 'React&Next'
draft: false
---

React-Portal을 이용하여 모달창을 만들어 보자. 거기다 Framer-motion을 이용하여 애니메이션을 적용시켜보자

> **framer-motion이란?** React에서 애니메이션과 제스처를 쉽게 다룰 수 있도록 해주는 라이브러리.

<br/>

### **Portal 이란?**

---

React 공식 문서에 따르면, Portal은 **부모 컴포넌트의 DOM 계층 구조 바깥에 있는 DOM 노드로 자식을 렌더링** 하는 최고의 방법이다. 라고 적혀있다. 즉 외부에 존재하는 **DOM 노드**가 **React App DOM 계층 안에 존재하는 것처럼 연결**을 해주는 것을 말한다

![](./images/portaldom.png)

이처럼 `portal` 과 `next` 은 **같은 관계처럼 보이지만 실제로는 portal 안에서 볼 수 있는 자식 컴포넌트이며 렌더링만** `next` 의 밖에서 이루어지고 있는 것이다. DOM 트리 상에서는 최상위 계층에 있기 때문에 보다 side effect에서 자유로울 수 있고 CSS 상의 방해를 받지 않을 수 있다.

<br/>

### **사용법 (TS + Tailwind CSS + Framer-motion)**

---

modal이 렌더링 될 위치 설정해야 한다. `nextjs` 에서는 `_document.tsx` 파일에 새로운 DOM id 값은 **protal** 를 추가합니다.

```jsx
import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
const Document = () => {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div id="portal" />
      </body>
    </Html>
  )
}

export default Document
```

**portal** 은 DOM 트리에 어느 곳에서 나 있을 수 있지만, 일반적인 React의 하위 컴포넌트들처럼 작동하기 때문에 `ContextAPI` 같은 기능은 DOM 트리의 위치에 관계없이 React 트리에 있으므로 다른 컴포넌트들과 동일하게 작동한다.

<br/>

### **공통으로 사용할 레이아웃 portal-container 컴포넌트 만들기**

---

**createportal** 을 통해 `#portal` **에 자식 컴포넌트를 렌더링**해주는 **Container 컴포넌트**를 만들어보자.

**`createPortal()`** 에는 렌더링할 **컴포넌트**와 **타겟노드** 이렇게 2개의 인자가 필요하다. 첫 번째 인자의 컴포넌트를 사용하여 우리가 원하는 `id=portal`(타켓노드) 을 가진 DOM에 렌더링 할 수 있게 된다.

```jsx
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import _ from 'lodash'

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0vh',
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    y: '-100vh',
    opacity: 0,
  },
}

const backdrop = {
  hidden: {
    y: '0vh',
    opacity: 0,
  },
  visible: {
    y: '0vh',
    opacity: 1,
  },
}

const ModalPortal = ({ onModal, setOnModal, children }) => {
  // 연속 클릭 방지를 위해 lodash를 사용
  const setOnModalClose = _.throttle(() => {
    setOnModal(false)
  }, 250)

  if (typeof window === 'undefined') return null
  return createPortal(
    <AnimatePresence exitBeforeEnter>
      {onModal && (
        <div
          className={`flex fixed top-0 left-0 z-20 w-full h-full justify-center ${
            type === 'center' ? 'items-center' : 'items-end '
          }`}
        >
          <motion.div
            key="backdrop"
            initial={backdrop.visible}
            animate={backdrop.visible}
            exit={backdrop.hidden}
            className="absolute w-full h-full bg-[#000000a1] z-10"
            onClick={setOnModalClose}
          />
          <motion.div
            key="modal"
            initial={dropIn.hidden}
            animate={dropIn.visible}
            exit={dropIn.hidden}
            style={{ width: '100%' }}
            className={
              'w-full rounded-tl-3xl rounded-tr-3xl justify-between flex flex-col z-10 bg-white border-2'
            }
          >
            <div className={'flex p-[1rem]'}>
              {React.cloneElement(children, { setOnModalClose })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.getElementById('portal')
  )
}

export default ModalPortal
```

**한 가지** 알아둬야 할 것이 있는데 DOM 트리에서 해당 노드가 상위가 아니라 하더라도 **portal** 내부에서 발생한 이벤트는 React 트리에 포함된 상위로 전달된다. 왜냐하면 **portal**은 DOM 트리에서의 위치에 상관없이 React 트리에 존재하기 때문이다. 예를 들면 모달을 소환한 부모 컴포넌트(ModalProtal 컴포넌트) 가 가지고 있던 스타일들이 그대로 전달받는다.

**ModalPortal** 에서 자식 컴포넌트에게 모달을 닫을 수 있는 함수를 넘겨줘야 하는 방법을 찾아야 하는데 이때 `cloneElemet` 를 사용하여 모달을 닫을 수 있는 `setOnModalClose` 을 넘겨주었다. 아래에서 조금 더 자세히 알아보자.

### [CloneElement란?]

공식 문서 정의를 읽어보자면

> **선택한 요소(element)**를 복사하여 새로운 객체를 반환 해 줄 때, 요소 고유의 key나 ref 이외에 새롭게 정의한 속성(config)을 전달하여 생성할 수 있습니다.
> <br/>

쉽게 이야기하자면 지정한 Element를 복사해 반환하며 **children**과 **props**를 같이 넘겨줄 수 있어 필요시에 부모에서의 props를 자식에게 props를 전달해야 하는 경우 사용할 수 있다.

인자로 어떤 것을 받는지 않아보며 각자의 역할을 알아보자.

```jsx
React.cloneElement(element, [config], [...children])
```

- element : 복제할 요소
- [config]: 원본 요소 외에 복제된 요소에 추가될 Props
- [...children]: 복제된 개체의 자식 (원본 element의 props와 새로 추가된 props을 합친 요소)

</br>

**ModalPortal** 에서 props로 받는 `setOnModalClose()` 함수를 children element에 새로운 props을 추가하여 사용할 수 있게 된다.
<br/><br/>

### **최종 완성 코드**

---

useState를 이용하여 **modal**을 열고 닫을 수 있게 state 값을 `boolean` 으로 설정하여 생성한다. 그리고 modal을 open 하는 버튼에 **setOnModal**을 추가하여 **modal**을 컨트롤할 수 있게 만든다. 그리고 modal 안에 보일 내용을 컴포넌트화하여 **ModalPortal** 컴포넌트 안에 자식 컴포넌트로 추가한다.

```jsx
const Home = () => {
  const [onModal, setOnModal] = useState(false)

  return (
    <div>
      <button onClick={() => setOnModal(true)}>열려라 모달창!</button>

      <ModalPortal onModal={onModal} setOnModal={setOnModal}>
        <ModalTest />
      </ModalPortal>
    </div>
  )
}
```

**modal** 창 안에 보일 내용은 컴포넌트화 하여 따로 만들어 두었고 **ModalPortal**에서 **cloneElement**를 사용하여 `setOnModalClose()` 함수를 자식 컴포넌트 props에 전달하였기 때문에 여기서 props에 modal을 닫을 수 있는 함수를 추가하여 사용할 수 있다.

모달을 닫을 수 있는 함수를 버튼에 추가하여 **modal**을 닫을 때 이용한다.

```jsx
const ModalTest = ({ setOnModalClose }) => {
  return (
    <div className="min-h-[20rem] w-full relative">
      <button onClick={setOnModalClose}>닫기</button>

      <div className="flex justify-center items-center h-full">
        <span>열렸다 모달!</span>
      </div>
    </div>
  )
}
```

<br/>

### **완성 결과물**

---

닫기 버튼을 누르거나 배경화면쪽을 눌러도 모달창이 잘 닫기는 것을 확인 할 수 있다.

<p align="center"><img src="./images/modalportal.gif" ></p>

<br/><br/>
