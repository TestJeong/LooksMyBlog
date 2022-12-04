---
title: '🪢 NextJS 환경에서 SSR로 인피니티 스크롤 구현하는법 (feat. React Query)'
date: 2022-06-15 16:21:13
category: 'React&Next'
draft: false
---

먼저 `SSR` 에서 react query를 사용하려면 두 가지 방법이 있는데 어떤 것이 있는지 살펴보겠습니다.

## initialData 사용

Next.js의 **getStaticProps** 또는 **getServerSideProps** 사용하여 가져온 데이터를 useQuery의 `initialData` 옵션에 전달하여 사용할 수 있습니다. 아래 코드는 **getStaticProps** 를 사용하여 `initialData` 를 만들어 useQuery에 전달하는 코드입니다.

```jsx
export async function getStaticProps() {
  const posts = await getPosts()
  return { props: { posts } }
}

function Posts(props) {
  const { data } = useQuery('posts', getPosts, { initialData: props.posts })

  // ...
}
```

<span style="color: #b11e31">[주의 사항]</span>

- useQuery 여러 위치에서 동일한 쿼리로 호출하는 경우 `initialData` 모든 위치에 전달해야 합니다.
  즉 여러 컴포넌트에서 해당 데이터를 SSR를 통해 보여주려고 한다면 모든 컴포넌트에 `initialData` 를 넘겨줘야 됩니다.
- 컴포넌트 트리가 깊어질 경우, 관리가 어렵고 값을 넘겨주기도 어려워집니다.
- 요청한 정보가 언제 서버에서 오는지 알 수 없습니다. 그러므로 요청한 정보를 다시 가져와야 할지 여부를 결정하는 건 페이지가 로드된 시간을 기준으로 하게 됩니다.

## Hydration 사용

React Query는 Next.js의 서버에서 여러 쿼리를 미리 가져올 수 있는 prefetching 기능을 제공하는데 이 기능을 사용하여 미리 불러온 query를 queryClient에서 `dehydrating` 을 할 수 있게 됩니다.

> **dehydrating란?** 캐시의 고정된 표현을 만드는 것을 말합니다. 이것은 나중에 React Query의 hydrated 방법으로 브라우저에서 hydrate 될 수 있다. 이 기능은 나중에 사용할 수 있도록 캐시를 저장하려는 경우(예: 로컬 스토리지에 저장하거나, 캐시를 서버에서 클라이언트로 보내는 경우) 유용합니다.

> **Hydrate란?** Server Side 단에서 렌더링 된 정적 페이지와 번들링 된 js 파일(Webpack)을 클라이언트에게 보낸 뒤, 클라이언트 단에서 HTML 코드와 React인 js 코드를 서로 매칭 시키는 과정을 말합니다.
> <br/><br/>

---

<br/>

아래 코드는 hydration을 사용하여 `getStaticProps` 에서 prefetch하는 예제 코드입니다 서버사이드에서 데이터를 불러온 후 props로 넘겨준 dehydrateState는 `_app`에서 받아서 Hydration으로 내려주어 prefetch에서 사용한 키를 useQuery 훅을 이용하여 호출하여 사용할 수 있습니다.

```jsx
import { dehydrate, QueryClient, useQuery } from 'react-query'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery('posts', getPosts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

function Posts() {
  const { data } = useQuery('posts', getPosts)
  // ...
}
```

---

이제 Next.js의 `SSR` 환경에서 어떻게 **useInfinitQuery** 를 사용했는지 알아보겠습니다.

필요한 api를 호출한 후 받아온 데이터를 변경했는데 data는 result에 추가하고 nextPage (다음 페이지) 와 isLast(마지막 여부)를 추가로 만들어 작성하였습니다. 그 후 `prefetchInfiniteQuery` 를 이용하여 데이터를 불러옵니다

여기서 props로 넘겨주는 dehydratedState의 dehydrate 부분에서 stringfy 후 parse를 하는 이유는 `useInfiniteQuery` 에 맨 처음 페이지에 해당하는 데이터의 `pageParam` 는 undefined로 설정되기 때문에 hydration 과정에서 직렬화가 되지 않아서 아래와 같이 적용해 주어야 합니다. <span style="color: #b11e31">(현재 react-query에서 가지고 있는 이슈입니다!)</span>

> **직렬화란?** 컴퓨터 메모리 상에 존재하는 객체(Object) -> 문자열(string)로 변환하는 것

```jsx
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient()

  const FetchList = async () => {
    const { data } = await axios.get(`/images`, { params: { page: 1 } })

    return {
      result: data,
      nextPage: 2,
      isLast: false,
    }
  }

  await queryClient.prefetchInfiniteQuery(['images'], FetchList, {
    staleTime: 1000,
  })

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  }
}
```

아래 코드는 `SSR` 에서 prefetch를 통해 불러온 후 컴포넌트 안에서 **useQuery** 훅을 이용하여 키값을 통해 사용하는 코드입니다.

```jsx
const FetchList = async ({pageParam = 1}) => {
    const {data} = await axios.get(`/images`, {params: {page: 1}})
    return {
      result: result,
      nextPage: pageParam + 1,
      isLast: Object.keys(result[1].images).length > 0 ? true : false
    }
  }

  const {data, isLoading, fetchNextPage, refetch} = useInfiniteQuery<InfinitePageType, AxiosError>(["images"], FetchList, {
    getNextPageParam: (lastPage: InfinitePageType) => {
      if (lastPage.isLast) {
        return lastPage.nextPage
      } else {
        return undefined
      }
    }
  })
```

API를 호출하는 FetchList 함수에서 인자 값으로 받는 pageParam는 현재 어떤 페이지에 있는지 확인할 수 있는 파라미터 값이며 초기 페이지를 1 페이지로 설정을 하였습니다

`useInfiniteQuery` 에서 사용할 수 있는 옵션 들을 알아보겠습니다.

- getPreviousPageParam :
  이전 페이지에 있는 데이터를 조회할 때 사용할 수 있으며 params로 firstPage(호출된 첫 번째 페이지) , allPages(호출된 모든 페이지)를 불러올 수 있습니다.
  <br/><br>
- getNextPageParam :
  다음 페이지를 호출할지 안 할지를 결정할 수 있으며 또 몇 번째 페이지를 불러와야 하는지 결정할 수 있습니다. 이 함수는 params로 lastPage(호출된 가장 마지막에 있는 페이지에 있는 데이터) , allPages(호출된 모든 페이지에 있는 데이터)를 불러올 수 있습니다.

```jsx
// 예제
useInfiniteQuery('projects', fetchProjects, {
  // 다음 페이지를 불러올때 사용
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  // 이전 페이지를 불러올때 사용
  getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
})
```

그다음 **useInfiniteQuery** 에서 사용할 수 있는 함수가 여러 있는데 대표적인 함수들을 소개하겠습니다.

- fetchNextPage : 다음 페이지를 불러오는 함수
- fetchPreviousPage : 이전 페이지를 불러오는 함수
- hasNextPage : 다음 페이지 조회 가능 여부 (boolen 타입) 즉, 다음 페이지가 있을 경우 `true` 를 리턴 getNextPageParam 이 undefined 말고 값을 리턴할 경우 true 가 됩니다.
- hasPreviousPage : 이전 페이지 조회 가능 여부 (boolen 타입) 즉, 이전 페이지가 있을 경우 `true` 를 리턴
- isFetchingNextPage: fetchNextPage를 통해 페칭이 되고 있는 상태인지 여부(boolen타입)
- isFetchingPreviousPage: fetchPreviousPage 를 통해 페칭이 되고 있는 상태인지 여부(boolen타입)

**useInfiniteQuery** 를 사용하여 어떻게 데이터를 불러오는지 알았다면 이제 어떻게 화면에서 무한 스크롤을 만들 수 있을지에 대해 알아보자 구현하는 방법은 여러 가지가 있겠지만 여기서는 `IntersectionObserver` 을 사용했고 `IntersectionObserver` 을 조금 더 편하게 사용할 수 있는 react-intersection-observer 라이브러리를 사용했다

> **IntersectionObserver란?** 대상이 화면에 보이면 callback 함수를 실행하여 원하는 동작을 수행할 수 있도록 타겟을 비동기적으로 감시하는 API입니다.

<br/>

해당 페이지의 데이터 마지막에 button을 만들고 이 button에다가 ref를 걸어주면 해당 요소가 보이면 inView가 true로, 안 보이면 false로 자동으로 변경됩니다.

전체코드

```jsx
import {useInView} from "react-intersection-observer"

const InfinityScroll = () => {
	const {ref, inView} = useInView()

  const FetchList = async ({pageParam = 1}) => {
	  const {data} = await axios.get(`/images`, {params: {page: 1}})

	    return {
	      result: result,
	      nextPage: pageParam + 1,
	      isLast: Object.keys(result[1].images).length > 0 ? true : false
	    }
	  }
  }

  const {data, isLoading, fetchNextPage, refetch} = useInfiniteQuery<InfinitePageType, AxiosError>(["images"], FetchList, {
    getNextPageParam: (lastPage: InfinitePageType) => {
      if (lastPage.isLast) {
        return lastPage.nextPage
      } else {
        return undefined
      }
    }
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])


  return (
          <div>
            {!isLoading &&
              data.pages.map((list: InfinitePageType) => list.result[1].images.map((item, index) => <ImageItem key={index} item={item} />))
	           }
            <button ref={ref} />
          </div>
  )
}
```
