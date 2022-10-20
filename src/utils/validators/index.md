---
title: validators
subtitle: 表单验证器
category: utils
order: 8
---

包含一些常用的表单验证器。

## required

必填项。

```ts
validators.required();
```

## phone

手机号码，宽松模式。

```ts
validators.phone();
```

## phoneCommonly

手机号码，普通模式。

```ts
validators.phoneCommonly();
```

## phoneStrict

手机号码，严格模式。

```ts
validators.phoneStrict();
```

## notContainEmoji

不能包含 emoji 表情。

```ts
validators.notContainEmoji();
```

## noSymbol

只能包含汉字、字母和数字。

```ts
validators.noSymbol();
```

## noSpecialSymbol

不能包含特殊字符 ，如下：

`，。.？：；’‘”“！\w\u4e00-\u9fa5`

```ts
validators.noSpecialSymbol();
```

## email

邮箱地址。

```ts
validators.email();
```
