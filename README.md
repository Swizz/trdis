
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

T(a)dis is a 290 Bytes `diff` function returning a patch object, allowing you to
perform time traveling to an object or an array using your own merge functions with ease.

```js
import { diff } from 'trdis'

const patch = diff({
  type: "Fiat", model: "Punto"
}, {
  type: "Fiat", model: "500", color: "red"
})

const newCar = {
  type: "Fiat", model: "Punto", ...patch.do
}

const prevCar = {
  type: "Fiat", model: "500", color: "red", ...patch.undo
}
```

## Table of Contents

<details>
<summary>Table of Contents</summary>

  - [Getting started](#getting-started)
  - [Usage](#usage)
   - [Recomended](#usage)
   - [Using Object.assign](#using-objectassign)
   - [Using your own merge](#using-your-own-merge)
   - [Understand the patch](#understand-the-patch)
  - [API](#api)
   - [interface patch](#interface-patch--do-object-undo-object-)
   - [function diff](#function-diff-from-object-array-to-object-array--patch)
   - [function patch](#function-patch-from-object-array-diff-patch--object)
  - [Recipes](#recipes)
   - [Operation type](#operation-type)
   - [Array time traveling](#array-time-traveling)
   - [Objects equality](#objects-equality)
   - [Object copy](#object-copy)
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
By providing both the source object or array, the past, and the target object or array, the future.

```js
const present = diff(past, future)
```

The patch object will contain two properties the do and the undo inscructions.  
Both of them are mergeable objects. That way you are able to use your favorite
merge function to apply the patch.  
Lets use the objects spread operator as merge function.

The undo object allow you to travel to the previous state of the object or array.

```js
const past = { ...future, ...present.undo }
```

Yes! You have understood! The do object is for the future.

```js
const future = { ...past, ...present.do }
```

Here we have seen that the do and the undo patch are compliant with the objects
spread operator.  
You are right! The both patch functions are plain object ready to overide the
present object or array properties to apply the patch.

So as we discovered earlier every merge functions will a be great candidates as
our patch function.

### Using patch function

T(a)rdis provide you a patch function, ready to counter all the T(a)rdis diff
function features. This function is aligned with the diff signature to allow you
to take all benefits of T(a)rdis with a sanitized experience.

```js
let past = patch(future, present.undo)
let future = patch(past, present.do)
```

### Using Object.assign

Object.assign is a JS function used to copy the values from one (or more) object(s)
into another one.  
This function could be used in two way the first one will mutate the source object,
and the second one, will use an empty object to create a copy.

```js
Object.assign(present, future.undo)
Object.assign{present, future.do)
```

Using Object.assign that way will mutate the present object acordingly to the 
future patch.

The following one, will by opposition, create a new object by applying the patch.

```js
let past = Object.assign({}, future, present.undo)
let future = Object.assign({}, past, present.do)
```

### Using your own merge

Now you understood, we are now able to generalise using only one function, your
own merge function.

```js
let past = merge(future, present.undo)
let future = merge(past, present.do)
```

### Understand the patch

Lets dig a bit futher into our understanding of the patch object.  
The patch hold two properties, the do and the undo.

Both are simple objects, ready to be merged with the current object to move
forward or backward your changes.  
Looking at do and undo, you will be able to understand what kind of operation it
was performed on the object.  

To sum up, there is only three kind of operation : insert, update, delete.

## API

#### interface patch: { do: object, undo: object }

This is the patch object, it will hold two properties :

 * do : The patch to use to apply the change to a previous state
 * undo : The patch to use to undo the change from the current state

#### function diff: (from: object | array, to: object | array) => patch

The diff function will return the patch object by comparing the second object to
the first one. The patch will help to undo the changes or to redo them later.

#### function patch: (from: object | array, diff: patch) => object

The patch function is an helpful function to merge the from object with the given
diff patch. Object will be merge into a new object. The patch function return
an object with all the keys, the deleted properties will appear as undefined.

## Recipes

### Operation type

Remember how we [understood the patch](#understand-the-patch) ?
We seen we can easily write a function to return the kind of operation we performed on
a given key.

Lets try it.

```js
function kind(patch, key) {
  if(!(key in patch.do) && !(key in patch.undo)) {
    return "kept"
  } else if (patch.do[key] === undefined && patch.undo[key] !== undefined) {
    return "deleted"
  } else if (patch.do[key] !== undefined && patch.undo[key] === undefined) {
    return "added"
  } else {
    return "updated"
  }
}
```

Here we are testing all the possibilities, by making a simple statement :
> If for performing the do patch I need to make undefined the value and to apply
> the undo patch I need a value, so at start I deleted the value

As you see, we can simplify the statement with :
> If for performing the do patch I need to make undefined the value,
> so at start I deleted the value

So, a more simple kind function could be the following one.

```js
function kind(patch, key) {
  if(!(key in patch.do) && !(key in patch.undo)) {
    return "kept"
  } else if (patch.do[key] === undefined) {
    return "deleted"
  } else if (patch.undo[key] === undefined) {
    return "added"
  } else {
    return "updated"
  }
}
```

### Array time traveling

With T(a)rdis you are ready to time travel with an array too, as in JavaScript
arrays are objects. T(a)rdis is aware of all array properties and will perform
diff checking that allow you to reconscruct an array with ease.

```js
const past = [1, 2, 3]
const future = [1, 2, 3, 4]

const present = diff(past, future)

const future = Array.from({ ...past, ...present.do })
// present: (4)[1, 2, 3, 4]
```

### Objects equality

Just as said earlier, T(a)rdis help you to obtain a patch representing the
differences between two objects.

Now, we are able to make a simple statement : 
> If the diff of two objects is empty, this is because the two objects are equals!

```js
function equality (a, b) {
  const patch = diff(a, b)
  return Object.keys(patch.do).length === 0 && Object.keys(patch.undo).length === 0
}
```

### Object copy

Using the patch returned the diff function of T(a)rdis, you are also able to perform
a lot of amuzing kind of operation on you object.

For example, you are able to create a copy of your source object, apply and undoing the patch!

```js
const from = { a: 1, b: 2 }
const patch = diff(from, {})

const copy = { ...from, ...patch.do, ...patch.undo }
// copy: { a: 1, b:2 }
```


**Pretty easy! Now, add yours!**

---

T(a)rdis is made by Swizz.