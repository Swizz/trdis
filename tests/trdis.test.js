import { diff } from "../src"

describe("flat", () => {
  test("diff added", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1, b: 2, c: 3 }

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      c: 3
    })

    expect(patch.undo).toEqual({
      c: undefined
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("diff deleted", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1 }

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      b: undefined
    })

    expect(patch.undo).toEqual({
      b: 2
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("diff updated", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1, b: 1 }

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      b: 1
    })

    expect(patch.undo).toEqual({
      b: 2
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("diff kept", () => {
    const from = { a: 1, b: 2 }

    const to = { a: 1, b: 2 }

    const patch = diff(from, to)

    expect(patch.do).toEqual({})

    expect(patch.undo).toEqual({})

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })
})

describe("nested", () => {
  test("diff added", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 2, c: 3 } }

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      b: { a: 1, b: 2, c: 3 }
    })

    expect(patch.undo).toEqual({
      b: { a: 1, b: 2 }
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("diff deleted", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1 } }

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      b: { a: 1 }
    })

    expect(patch.undo).toEqual({
      b: { a: 1, b: 2 }
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("diff updated", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 1 } }

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      b: { a: 1, b: 1 }
    })

    expect(patch.undo).toEqual({
      b: { a: 1, b: 2 }
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("diff kept", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 2 } }

    const patch = diff(from, to)

    // cause there is no deep equality check
    expect(patch.do).toEqual({
      b: { a: 1, b: 2 }
    })

    // cause there is no deep equality check
    expect(patch.undo).toEqual({
      b: { a: 1, b: 2 }
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })
})
