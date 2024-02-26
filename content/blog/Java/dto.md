---
title: 'DTO는 무엇이며 어디서 변환하는게 좋을까?'
date: 2024-2-26 16:21:13
category: 'Java'
draft: false
---

## DTO란?

> 데이터 전송 객체 (Data Transfer Object) 는 프로세스 또는 계층 간에 데이터를 전달하는 객체

DTO라는 단어는 마틴 파울러에 의해 처음 소개되었으며 말 그대로 데이터 전송 객체로, 메서드 호출 수를 줄이기 위해 프로세스 간에 데이터를 전송하기 위해 사용된다고 하였습니다. 데이터양이 많거나 여러 가지 데이터가 필요할 경우, 각각의 데이터를 개별적으로 요청하고 응답하는 과정에서 많은 네트워크 트래픽이 발생하게 됩니다

이때 DTO는 여러 매개변수를 하나의 객체로 묶어서 한 번에 서버로 보내는 방식으로 동작하는데 예를 들어 여러 개의 매개변수가 필요한 경우, DTO를 사용하여 이들을 하나의 객체로 묶고, 이 객체를 한 번에 서버로 보내어 처리하는 것을 말합니다

이렇게 하면 여러 매개변수를 모두 처리하여 한 번의 호출로 필요한 모든 데이터를 처리할 수 있습니다 이는 여러 번의 왕복 통신을 줄여 네트워크 통신 비용을 줄일 수 있습니다. 또한 DTO는 데이터를 캡슐화하여 관련 데이터를 하나로 묶기 때문에, 데이터 전달 과정에서의 오류 가능성을 줄이고 데이터 일관성을 유지하는 데에도 도움이 됩니다

![](./images/dtoa.png)

## DTO를 사용하는 이유

DTO는 데이터를 전송하는 객체라고 알아봤습니다 그러면 왜 사용하는 걸까요? 사용하게 되면 어떤 점이 좋은 걸까요?

### 1. DTO를 통해 원하는 정보만 보여 줄 수 있습니다

```java
public class User {
	public Long id;
	public String username;
	public String email;
	public String password; //외부에 노출되면 안되는 값
	public String info; //외부에 노출되면 안되는 값
}
```

```java
// UserController.java

@GetMapping("/{id}")
public ResponseEntity<User> requestUserDetail(@PathVariable long id){
	User user = userService.findById(id);
	return ResponseEntity.ok().body(user); // 엔티티를 그대로 반환
}
```

만약 유저 정보 조회를 위해 조회 후 엔티티를 그대로 클라이언트에게 전달이 된다면 비밀번호와 정보가 그대로 노출이 됩니다 이때 DTO를 사용하게 된다면 클라이언트에게 비밀번호와 같은 민감한 정보들은 노출하지 않고 원하는 정보만 전달할 수 있습니다

```java
public class UserDto {
	public final String username;
	public final String email;

	public static UserDto toDto(User user){
		return new UserDto(user.getName(), user.getEmail());
	}
}
```

위 코드에서 민감한 정보를 제외하고 username과 email만 전달할 수 있도록 DTO를 만들어서 클라이언트에게 이 정보만 전달합니다

### 2. API 스펙 유지

```java
@Entity
@Getter
public class Membership {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Long id;

	@Enumerated(EnumType.STRING)
	private MembershipType membershipType;

	@Column(nullable = false)
	private String userId;

	@Column(nullable = false)
	@ColumnDefault("0")
	private Integer point;
}
```

```json
{
  "id": "15",
  "membershipType": "NAVER",
  "userId": "NC10523",
  "point": "10000"
}
```

예를 들어 내부 정책 변경으로 인해 userId를 memberId로 변경해야 하는 상황에서 DTO를 사용하지 않았다면 userId가 memberId로 변경됨에 따라 API 스펙이 변경되 클라이언트에게 보내는 응답 값이 변경되고, 기존 API를 사용하고 있던 사용자들은 모두 장애를 겪게 됩니다 물론 @JsonProperty를 이용해 반환되는 값의 이름을 변경할 수 있지만, 이는 결국 Entity를 무겁게 만들어 근본적인 해결책이 될 수 없습니다

또 한 가지 추가적인 요구 사항으로 인해 테이블에 컬럼이 추가될 경우 엔티티에 새로운 변수가 추가되어 별도로 처리를 하지 않는 이상 API 스펙이 변경됩니다 이러한 상황을 위해 **DTO를 이용해 엔티티와 분리하여 독립성을 높임으로써 엔티티 변경으로 인해 클라이언트에게 전달되는 API 스펙가지 변경되는 것을 방지 할 수 있습니다**

### 3. 순환참조 예방

JPA로 개발할 때, 양방향 참조를 하여 해당 엔티티를 그대로 반환하게 된다면 순환 참조가 발생이 됩니다

> 순환참조란?
> JPA에서 양방향으로 연결된 엔티티를 JSON 형태로 직렬화하는 과정에서, 서로의 정보를 계속 순환하며 참조하여 스택오버플로 에러를 발생하는 현상을 말합니다

순환참조가 일어나는 과정

1. `A Entity`와 `B Entity`가 양방향으로 연결된 상태입니다 <br/>
2. `A`를 JSON으로 직렬화하기 위해 `A`가 참조하고 있는 `B`를 조회합니다 <br/>
3. `B`를 조회하는 과정에서 `B`가 참조하고 있는 `A`를 조회홥니다 <br/>
4. `A`를 조회하는 과정에서 `A`가 참조하고 있는 `B`를 조회합니다 <br/>
5..무한 반복이 발생됩니다

사실 이 순환 참조의 근본적인 원인은 양방향 매핑 자체에 있다고도 할 수 있지만, 양방향 참조가 부득이한 상황이라면 순환 참조가 일어나지 않도록 응답 값을 DTO로 만드는 것이 좋습니다

순환 참조는 객체를 JSON 형태로 변화하는 직렬화하는 과정에서 발생 되는데 DTO를 사용하여 직렬화하는 객체에 연관관계의 필드를 넣지 않도록하여 이 문제를 해결할 수 있습니다

예를 들어, `Post`와 `Comment` 간의 양방향 참조가 있는 경우, `PostDto`와 `CommentDto`를 만들어 직렬화 과정에서 사용합니다 `PostDto`에서는 `CommentDto`의 리스트를 포함시킬 수 있지만, `CommentDto`에서는 `PostDto`를 참조하지 않도록 합니다 또는, `CommentDto`가 반드시 `Post`의 정보를 포함해야 한다면, 그 정보를 `Post`의 전체 데이터가 아닌, Id나 제목 같은 최소한의 정보로 제한할 수 있습니다

```java
public class PostDto {
    private Long id;
    private String title;
    private List<CommentDto> comments; // Post에 속한 Comment의 리스트
}

public class CommentDto {
    private Long id;
    private String content;
    private Long postId; // Comment가 속한 Post의 ID만 포함
}
```

---

## 그러면 어떤 계층에서 변환을 해야할까? Controller 계층? Service 계층?

### 1. Service 계층에서의 DTO 변환

Service 계층에서 Entity를 DTO로 변환하여 Controller 계층에게 반환하는 방법을 말합니다 저도 이 방식을 사용하고 있습니다 Service 계층에서 DTO를 바로 반환하면 Controller 계층이 간단해지고 비즈니스 로직이나 데이터 변환 로직에 전혀 신경 쓸 필요 없이 http 요청 및 응답 처리에만 집중할 수 있으며 엔티티가 외부로 노출되는 것을 막을 수 있는 장점이 있습니다

하지만 DTO는 View에 의존하고 있는 데이터입니다 만약 기획이 변경되거나 상황에 따라 유저에게 보여줄 데이터가 변경이 된다면  Service 계층까지 코드를 수정을 해야 합니다 Service 계층에서 View에게 전달할 정보를 모두 알고 있는 상황입니다

**이렇게 되면 핵심 비즈니스 로직을 처리하는 Service가 view를 담당하는 Controller에 너무 의존적인 상황이 생기게 되어 Service 계층의 자유도가 떨어지게 됩니다**

### 2. Controller계층에서의 DTO 변환

Service 계층에서 엔티티를 반환하여 Controller 계층에서 DTO로 변환하여 view에게 전달하는 방법입니다 이렇게 사용하게 된다면 **View를 담당하는 Controller와의 의존성이 최소화됩니다 보통 Service 계층에 DTO가 들어오지 않아야 여러 종류의 Controller에서 해당 Service를 사용할 수 있게 됩니다 이러면 Service 레이어의 자유도가 높아집니다**

여러 방법을 찾다가 여러 종류의 Controller가 한 Service를 사용하는 경우가 있고 한 종류의 Controller만 Service를 사용하는 경우가 있을 수 있는데 두번째의 경우 Service계층으로 request DTO를 허용하되 Service 계층 메소드 상위에서 DTO를 Entity로 변환 후에는 dto를 사용하지 않고 Entity만 사용하여 Controller 계층에 내보내어 Controller 계층에서 DTO로 변환하는 방법도 있었습니다

즉 해당 Service에서 메소드의 파라미터는 request DTO로 받지만 response 값은 DTO가 아닌 엔티티 형태 그대로 Controller 계층에 전달하여 Controller 계층에서 DTO로 변환하는 것을 말합니다

하지만 이 방법도 문제점은 있습니다

Service 계층에서 Entity를 그대로 넘기게 될 경우 View에는 반환할 필요가 없는 데이터까지 Controller 계층까지 전달이 됩니다.
**하나의 Entity로 DTO를 만들지 못할 경우 여러 엔티티를 조합하여 DTO를 생성해야 하는데 이렇게 되면 하나의 Controller가 의존하는 Service의 개수가 많아지게 되며 이러면 결국 여러 Service 계층이 Controller 계층에 의존하게 됩니다**

## 마무리

각각의 방법마다 트레이드오프가 있어 어떤 방식으로 해야 할지 고민이 많이 되었습니다 현재 개인 프로젝트에서는 첫 번째 방법을 사용하였습니다 DTO 변환도 비즈니스 로직의 일부라 생각했고 도메인 객체를 최대한 노출시키지 않기 위해서 Service 계층에서 하는게 좋다고 생각이 들었습니다

하지만 Controller 레이어와 Service 레이어가 강하게 의존이 된다면 좋지 않다는 글이 많아 다시 생각을 해보게 되었습니다 Controller 와 Service가 강하게 의존되어 있게 되면 Service 부분의 재사용 면이 떨어지는 문제가 있습니다 다만 아직 현재 개인 프로젝트가 규모가 작은 상태이다 보니 해당 Service를 다른 곳에서 재사용하게 되는 경우가 극히 드무렀었습니다 그래서 프로젝트가 더 확장이 되거나 Service 계층에 다른 곳애서 재사용 되는 곳이 많아지면 Mapper를 사용하거나 두 번째 방법 등을 활용하여 리팩토링 할 예정입니다

DTO는 **데이터를 전송하는 객체** 라는 본질적인 의미로 시작해서 왜 사용하는지 그리고 어디서 이것을 변환을 하는지 어떤 방식으로 변환하는지에 대해 다양하게 공부할 수 있는 기회가 되었습니다 단순 데이터를 전송하는 객체이지만 이것을 어디서 어떻게 쓰냐에 따라 재사용면과 확장성 유지 보수 측면에서 많이 차이가 나는 것을 배웠습니다

<br/>
<br/>
