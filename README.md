
<h1 align="center"> T(a)rdis </h1>

<div align="center">
  The <bold>most known way</bold> to travel in <italic>space and time</italic>
</div>

<br/>

<div align="center">
  <a href="https://www.npmjs.com/package/trdis">
    <img src="https://img.shields.io/npm/v/trdis.svg?label=release&style=flat-square" alt="npm version"/>
  </a>
  <a href="https://github.com/Swizz/trdis/blob/master/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="mit license"/>
  </a>
  <a href="https://travis-ci.org/Swizz/trdis">
    <img src="https://img.shields.io/travis/Swizz/trdis/develop.svg?style=flat-square" alt="travis build"/>
  </a>
</div>

<br/>

## Table of Contents

<details>
<summary>Table of Contents</summary>

  - [Getting started](#getting-started)
  - [Usage](#usage)
  - - [Recomended](#usage)
  - - [Using Object.assign](#using-object-assign)
  - - [Using your own merge](#using-your-own-merge)
  - [API](#api)
  - - [interface patch](#interface-patch)
  - - [function diff](#function-diff)
  - [Recipes](#recipes)
  - - [With dob](#with-dob)
  - - [With hyperapp](#with-hyperapp)
  - [Misc](#misc)
</details>

## Getting started

- **1.** To use T(a)rdis you need to download it thanks to your favorite
JavaScript Package Manager.
  ```sh
  yarn add trdis
  ```

  ```sh
  npm install --save trdis
  ```

- **2.** Now you need to import explicitly the exported `diff` function.
  ```js
  import { diff } from 'trdis'
  ```

- **3.** Use the diff function to generate the patch object.
  ```js
  const patch = diff(from, to)
  ```

## Usage

The diff function is your way to obtain the patch object, the present.
By providing both the source object, the past, and the target object, the futur.

```js
const present = diff(past, futur)
```

The patch object will contain two properties the do and the undo inscructions.  
Both of them are mergeable objects. That way you are able to use your favorite
merge function to apply the patch.  
Lets use the objects spread operator as merge function.

The undo object allow you to travel to the previous state of the object.

```js
const past = { ...futur, ...present.undo }
```

Yes! You have understood! The do object is for the futur.

```js
const futur = { ...past, ...present.do }
```

Here we have seen that the do and the undo patch are compliant with the objects
spread operator.  
You are right! The both patch functions are plain object ready to overide the
present object properties to apply the patch.

So as we discovered earlier every merge functions will a be great candidates as
our patch function.

### Using Object.assign

Object.assign is a JS function used to copy the values from one (or more) object(s)
into another one.  
This function could be used in two way the first one will mutate the source object,
and the second one, will use an empty object to create a copy.

```js
Object.assign(present, futur.undo)
Object.assign{present, futur.do)
```

Using Object.assign that way will mutate the present object acordingly to the 
futur patch.

The following one, will by opposition, create a new object by applying the patch.

```js
let past = Object.assign({}, futur, present.undo)
let futur = Object.assign({}, past, present.do)
```

### Using your own merge

Now you understood, we are now able to generalise using only one function, your
own merge function.

```js
let past = merge(futur, present.undo)
let futur = merge(past, present.do)
```

## API

#### interface patch: { do: object, undo: object }

This is the patch object, it will hold two properties :

| **do**   | The patch to use to apply the change to a previous state   |  
| **undo** | The patch to use to undo the change from the current state |  

#### function diff: (from: object, to: object) => patch

The diff function will return the patch object by comparing the second object to
the first one. The patch will help to undo the changes or to redo them later.

## Recipes

### With [dob](https://github.com/dobjs/dob)

Needs
```js
import { observable, observe } from "dob"
import { diff } from "trdis"
```

Collect patchs using dob
```js
const past = { a:1, b: 2 }
const present = observable(past)

const patchs = []

const futur = observe(() => {
  patch.push(diff(past, present))
  past = present
})

present.a = 3
delete present.b
```

Apply patch undo using dob
```js
futur.unobserve()

patchs.reverse().forEarh((patch) => {
  present = { ...present, ...patch.undo }
})
```

### With [hyperapp](https://github.com/hyperapp/hyperapp)

Needs
```js
import { app } from "hyperapp"
import { app } from "@hyperapp/html"
import { diff } from "trdis"
```

Collect patchs using hyperapp
```js
app({
  state: {
    patchs: [],
    runtime: { 
      a: 1,
      b: 2
    }
  },
  actions: {
    start: (state) => ({ patchs: [diff({}, state.runtime)] }),
    collect: (state) => ({ patchs: [...state.patchs, diff(state.patchs[0].do, state.runtime)] })
  },
  view(state, actions) {
    actions.collect()
  }
}).start()
```

Apply patchs using hyperapp
```js
app({
  state: {
    patchs: [],
    runtime: { 
      a: 1,
      b: 2
    }
  },
  actions: {
    undo: (state) => ({ runtime: ...state.runtime, ...state.patchs[-1].undo }),
    redo: (state) => ({ runtime: ...state.runtime, ...state.patchs[-1].do })
  }
})
```

Please add yours !

## Misc

- T(a)rdis follows the [Compatible Versioning: major.minor only](https://github.com/staltz/comver)
convention.