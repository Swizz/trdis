import { diff, patch } from "../src"

describe("flat", () => {
  test("patch added", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1, b: 2, c: 3 }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })

  test("patch deleted", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1 }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })

  test("patch updated", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1, b: 1 }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })

  test("patch kept", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1, b: 2 }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })
})

describe("nested", () => {
  test("patch added", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 2, c: 3 } }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })

  test("patch deleted", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1 } }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })

  test("patch updated", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 1 } }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })

  test("patch kept", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 2 } }

    const future = diff(from, to)

    expect(patch(from, future.do)).toEqual(to)

    expect(patch(to, future.undo)).toEqual(from)
  })
})

describe("array", () => {
  test("patch added", () => {
    const from = [1, 2]

    const to = [1, 2, 3]

    const future = diff(from, to)

    expect(Array.from(patch(from, future.do))).toEqual(to)

    expect(Array.from(patch(to, future.undo))).toEqual(from)

    expect(patch(from, future.do, true)).toEqual(to)

    expect(patch(to, future.undo, true)).toEqual(from)
  })

  test("patch deleted", () => {
    const from = [1, 2]

    const to = [1]

    const future = diff(from, to)

    expect(Array.from(patch(from, future.do))).toEqual(to)

    expect(Array.from(patch(to, future.undo))).toEqual(from)

    expect(patch(from, future.do, true)).toEqual(to)

    expect(patch(to, future.undo, true)).toEqual(from)
  })

  test("patch updated", () => {
    const from = [1, 2]

    const to = [1, 1]

    const future = diff(from, to)

    expect(Array.from(patch(from, future.do))).toEqual(to)

    expect(Array.from(patch(to, future.undo))).toEqual(from)

    expect(patch(from, future.do, true)).toEqual(to)

    expect(patch(to, future.undo, true)).toEqual(from)
  })

  test("patch kept", () => {
    const from = [1, 2]

    const to = [1, 2]

    const future = diff(from, to)

    expect(Array.from(patch(from, future.do))).toEqual(to)

    expect(Array.from(patch(to, future.undo))).toEqual(from)

    expect(patch(from, future.do, true)).toEqual(to)

    expect(patch(to, future.undo, true)).toEqual(from)
  })

  test("do not transform object", () => {
    const from = { a: 1, b: 1 }

    const to = { a: 1, b: 2, c: 3 }

    const future = diff(from, to)

    expect(patch(from, future.do, true)).toEqual(to)

    expect(patch(to, future.undo, true)).toEqual(from)
  })
})