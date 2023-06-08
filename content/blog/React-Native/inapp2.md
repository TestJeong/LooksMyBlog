---
title: 'RN에서 인앱결제 구현하기 2 -  react-native-iaphub 연동'
date: 2023-06-08 18:21:13
category: 'React-Native'
draft: false
---

### 결제 코드 구현

---

인앱결제 부분은 [react-native-iaphub](https://github.com/iaphub/react-native-iaphub) 라는 대행사를 이용하였고 이곳에서 서버 검증을 모두 처리해 주었습니다 공식 문서를 보게 되면 초기설정하는 부분이 조금 어렵긴 하지만 문서 사용법이 자세히 잘 나와 있어 큰 어려움 없이 초기 설정을 할 수 있었습니다. 결제 관련 코드들은 하나의 클래스로 만들어 관리하였습니다. 아래 코드 예시들은 webview를 통해 개발을 진행하고 있기 때문에 모든 사항들이 **webview**와 통신을 하면서 로직들이 처리가 됩니다.

아래 코드들을 통해서 기능들을 세부적으로 살펴보겠습니다.

#### 1. Payment init

```jsx
import Iaphub from 'react-native-iaphub'

class IAPStore {
  // 초기화
  async init() {
    await Iaphub.start({
      appId: '', // <- IAPHUB AppID
      apiKey: '', // <- IAPHUB apiKey
      allowAnonymousPurchase: true,
      environment: 'development', // <--------- 개발모드
    })

    // 유저가 앱에서 결제를 눌렀다가 취소 할경우 및 결제 에러 발생시 트리거 되는 event
    Iaphub.addEventListener('onError', async err => {
      console.log('-> Got err: ', err)
    })
  }
}

export default new IAPStore()
```

앱이 실행될 때 최초에 실행해야 하는 코드입니다. 그리고 하나의 이벤트가 있는데 결제창에서 취소를 할 경우 실행되는 이벤트입니다. 즉 취소를 할 경우 실행되는 코드를 작성하면 됩니다. 추가로 다양한 이벤트가 있으므로 필요한 이벤트를 찾아 추가할 수 있습니다

`environment` 를 통해 개발 환경을 따로 구축할 수 있습니다. 실제 서버에 연결되어 있는 결제 환경 말고 개발 서버에 연결되어 있는 개발 환경을 만들 수 있으며 **"development"** 라는 이름을 직접 설정할 수 있습니다.

<br/>

#### 2. Payment Login & Logout

```jsx
import Iaphub from "react-native-iaphub"

class IAPStore {
	// 초기화
	async init() {
	 .....
	}

    // 로그인
    async login(userId: string) {
        await Iaphub.login(userId)
    }

    // 로그아웃
    async logout() {
        await Iaphub.logout()
    }
}

export default new IAPStore()
```

해당 상품의 권한을 주려면 어떤 유저가 구매하였는지 알아야 하는데 이때 사용되는 것이 login 함수입니다. 웹뷰 환경에서 고유한 **userId** 값을 넘겨주어 결제 전에 login 함수를 실행시켜 웹뷰 환경에서 전달받은 유저 Id로 로그인합니다. 쉽게 말해 결제용 아이디로 로그인하여 상품을 구매한다고 생각하시면 됩니다.

<br/>

#### 3. Payment Buy

```jsx
import Iaphub from "react-native-iaphub"

class IAPStore {

	// 초기화
	async init() {
	 .....
	}

	// 로그인
	async login(userId: string) {
	 .....
	}

	// 로그아웃
	async logout() {
	 .....
	}

    // 상품 구매
    async buy(productSku: string) {
        try {
		    // 웹으로 로딩중 메시지를 보냅니다.
            webviewRef.current.postMessage(JSON.stringify({
                type: "PAYMENT_LOADING",
                data: true
            }))

            const transaction = await Iaphub.buy(productSku)
            console.log("결제 성공: ", transaction)

			// 웹으로 로딩 완료 메시지를 보냅니다.
            webviewRef.current.postMessage(JSON.stringify({
                type: "PAYMENT_LOADING",
                data: false
            }))

			// 웹으로 결제 완료 메시지를 보냅니다.
            webviewRef.current.postMessage(JSON.stringify({
                type: "PAYMENT_COMPLETE"
            }))
        } catch (err) {
            const errors: any = {
                // 과거에 구매했지만 소비되지 않아 제품을 구매할 수 없음(복원 필요)
                product_already_owned: "이미 소유한 제품입니다. 문제를 해결하려면 구매를 복원하세요.",
                // 결제가 연기되었습니다(최종 상태는 '구매 요청'과 같은 외부 조치 보류중임)
                deferred_payment: "구매가 승인 대기 중입니다. 구매가 처리되었지만 승인 대기 중입니다.",
                // 결제 불가 (아이폰은 애플 앱스토어 접근이 제한될 수 있음)
                billing_unavailable: "인앱 구매 불가",
                // 원격 서버에 제대로 연결할 수 없습니다
                network_error: "네트워크 오류입니다. 나중에 구매를 복원하거나 고객센터에 문의하세요.",
                /*
                 * IAPHUB에서 영수증을 처리했지만 문제가 발생했습니다.
                 * 앱 구성 문제 또는 실패한 Itunes/GooglePlay API 호출 때문일 수 있습니다.
                 * IAPHUB는 가능한 경우 영수증 처리를 자동으로 재시도합니다(오류에 따라 다름).
                 */
                receipt_failed: "거래를 확인하는데 문제가 있습니다. 최대한 빨리 거래 확인을 하도록 하겠습니다.",

                unexpected: "구매를 처리할 수 없습니다. 나중에 다시 시도하거나 고객센터로 문의해주세요.",
            }
            let errorsToIgnore = ["user_cancelled", "product_already_purchased"]
            let errorMessage = errors[err.code]

            if (!errorMessage && errorsToIgnore.indexOf(err.code) == -1) {
                errorMessage = errors["unexpected"]
            }
            if (errorMessage) {
                Alert.alert("Error", errorMessage)
            }
        }
    }

}

export default new IAPStore()
```

이제 상품을 구매할 수 있는 함수입니다. `productSku`는 상품을 등록할 때 작성했던 **제품 ID** 값이며 이 id 값을 넘겨주기만 하면 됩니다. 결제가 정상적으로 완료가 되면 console.log를 통해서 결제한 상품을 확인할 수 있습니다. 그리고 결제가 진행되고 있다는 표시를 위해 로딩창을 추가하였습니다. "구매하기"를 클릭할 경우 로딩창이 보이도록 웹뷰에게 메시지를 보냈으며 결제가 완료 되거나 취소가 될 경우 또한 로딩창이 사라지도록 웹뷰에게 메시지를 보내 로딩창을 컨트롤하였습니다.

catch 문에서는 결제 중 에러가 발생하면 반환되는 객체 중에서 err.code에 맞는 에러가 경고 창에 나타납니다. errors 객체에는 해당 에러가 났을 경우 처리해야 하는 로직을 작성할 수 있습니다.

결제 완료 또는 실패가 될 경우 서버에 자동으로 **webhook**이 전송되는데 그 안에 `login()` 을 통해 로그인한 유저 아이디, 구매한 시간과 상품정보 등이 있어 이 값 기준으로 백엔드에서 권한을 부여하고 결제 처리를 할 수 있습니다. 그리고 웹뷰로 메시지를 보내 결제 완료에 맞는 로직을 처리합니다.

<br/>

#### 4. Payment Restore

```jsx
import Iaphub from "react-native-iaphub"

class IAPStore {

	// 초기화
	async init() {
	 .....
	}

	// 로그인
	async login(userId: string) {
	 .....
	}

	// 로그아웃
	async logout() {
	 .....
	}

	// 상품 구매
	async buy() {
	 .....
	}

    // 구매 복원
    async restore() {
	    // 웹으로 로딩중 메시지를 보냅니다.
        webviewRef.current.postMessage(JSON.stringify({
            type: "RESTORE_LOADING",
            data: true
        }))
        const response = await Iaphub.restore()
        const productList = await response.transferredActiveProducts.map((item) => item.sku)

		// 웹으로 로딩 완료 메시지를 보냅니다.
        webviewRef.current.postMessage(JSON.stringify({
            type: "RESTORE_LOADING",
            data: false
        }))

		// 웹으로 복원 완료 메시지를 보냅니다.
        webviewRef.current.postMessage(JSON.stringify({
            type: "RESTORE_COMPLETE",
            data: productList
        }))
    }
}

export default new IAPStore()
```

이번에는 구매 복원입니다. 비소품에 한해서 구매한 상품들을 전부 복원할 수 있는 기능이며 `restore()`를 할 경우 구매한 내역을 받을 수 있습니다. 이 데이터에서 **sku** 즉 상품 ID 값만 받아 백엔드에 데이터를 넘긴 후 해당 상품을 복원하도록 구현하였습니다.

<br/>

### 결제 해보기

---

결제 관련 코드들을 class로 만들어 추상화하였고 이제 webview와 RN에서 소통하며 결제를 진행해 보겠습니다.

#### 1. payment.init()

##### **[React-Native]**

```jsx
import WebView from "react-native-webview"
import payment from "./payment" // <- IAPStore() 클래스가 있는 곳

const WebviewHome = () => {
	useEffect(() => {
		payment.init()
	}, [])


	return(
		<WebView .../>
	)
}
```

react-native 환경에서 웹뷰가 있는 곳에 `payment.init()` 을 실행합니다.

<br/>

#### 2. payment.login()

##### **[webview]**

```tsx
const paymentLogin = () => {
  // userid값은 숫자로 된 고유의 아이디 값입니다.
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: 'PAYMENT_LOGIN', data: userid })
  )
}
```

##### **[React-Native]**

```tsx
import payment from "./payment" // <- IAPStore() 클래스가 있는 곳

PAYMENT_LOGIN: async (id) => {
	await payment.login(id)
},
```

webview에서 결제 로그인을 실행하여 RN에서 payment.login()을 실행하게 합니다. 웹에서 **PAYMENT_LOGIN**이라는 타입이 오면 전달받은 userid 값을 `payment.login()`을 사용하여 로그인하였습니다.

<br/>

#### 3. payment.buy()

##### **[webview]**

```tsx
const InAppPayment = ({ productID }) => {
  useEffect(() => {
    window.addEventListener('message', onListener)
    document.addEventListener('message', onListener)
  }, [])

  const onListener = ({ data }: MessageEvent) => {
    try {
      if (JSON.parse(data).type === 'PAYMENT_LOADING') {
        // 결제 중일때..
      }

      if (JSON.parse(data).type === 'PAYMENT_COMPLETE') {
        // 결재 완료 후 이동 페이지 및 처리 로직..
      }

      if (JSON.parse(data).type === 'NOT_USERID') {
        // 결제 로그인이 제대로 되지 않았을 경우 처리 로직..
      }
    } catch (error) {
      console.log('PAYMENT ERROR => ', error)
    }
  }

  const onPurchaseInapp = async () => {
    const verify = await verifyPayment(productID) // <-- 중복결제 검증 함수
    if (!verify)
      return alert(
        '이미 결제가 완료되었습니다.\n앱 재실행 후에도 상품이 열리지 않는다면\n고객센터로 문의해 주세요!'
      )

    return tryPay()
  }

  const tryPay = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'PAYMENT_PAY', data: productID })
    )
  }

  return (
    <div>
      <button onClick={onPurchaseInapp}>구매하기</button>
    </div>
  )
}
```

웹뷰 환경에서 RN으로 결제 요청을 하기 전 중복 결제를 막기 위해 이미 결제가 되었는지 검증을 한 후 결제를 진행합니다.

##### **[ React-Native ]**

```tsx
  import payment from "./payment" // <- IAPStore() 클래스가 있는 곳

  PAYMENT_PAY: async (data) => {
    const id = await payment.getUserId()
    if (!id.includes("a")) return payment.buy(data)
    return webviewRef.current.postMessage(JSON.stringify({ type: "NOT_USERID" }))
  },
```

결제를 진행하기 전 `payment.login()` 을 통해 제대로 로그인되어 userid 값이 들어왔는지 확인을 합니다. 혹여나 id 값이 제대로 들어오지 않고 임의로 a로 시작하는 userid 가 생성이 되면 결제가 되지 않도록 하였습니다. 결제 로그인이 되지 않을 경우 웹뷰 환경으로 다시 메시지를 보냈습니다. 정상적으로 payment.login()이 되었다면 payment 클래스의 buy 함수를 실행하여 결제를 진행합니다

결제 진행 상황에 따라 메시지를 다시 웹뷰로 보내 `onListener()` 함수에 해당 메시지 타입에 따라 로직을 처리하면 됩니다.

<br/>

#### 4. payment.restore()

웹뷰 환경에서 구매 복원 함수를 실행하여 메시지를 RN 쪽으로 전송합니다.

##### **[ webview ]**

```tsx
const Mypage = () => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.addEventListener('message', onListener)
    document.addEventListener('message', onListener)
  }, [])

  const onListener = ({ data }: MessageEvent) => {
    try {
      if (JSON.parse(data).type === 'RESTORE_LOADING') {
        // 복원 중일때..
        setIsLoading(Boolean(JSON.parse(data).data))
      }

      if (JSON.parse(data).type === 'RESTORE_COMPLETE') {
        // 복원 완료 후 처리 로직..
      }
    } catch (error) {
      console.log('RESTORE ERROR => ', error)
    }
  }

  const onPurchaseRestore = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'PAYMENT_RESTORE' })
    )
  }

  return (
    <div>
      <button onClick={onPurchaseRestore}>복원하기</button>
    </div>
  )
}
```

##### **[ React-Native ]**

```tsx
import payment from './payment' // <- IAPStore() 클래스가 있는 곳

PAYMENT_RESTORE: async () => {
  payment.resotre()
}
```

웹뷰 환경에서 구매 복원 메시지인 `PAYMENT_RESTORE` 메시지를 받게 되면 payment 클래스의 restore 함수를 실행시킵니다. 또한 웹 환경에서 `isLoading` 이라는 **useState**를 만들어 복원 중에는 로딩 창을 볼 수 있도록 하였습니다.
<br/>
<br/>
<br/>
