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

describe("nested true", () => {
  test("diff added", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 2, c: 3 } }

    const patch = diff(from, to, true)

    expect(patch.do).toEqual({
      b: { c: 3 }
    })

    expect(patch.undo).toEqual({
      b: { c: undefined }
    })

    const future = { ...from, ...patch.do }
    future.b = { ...from.b, ...patch.do.b }

    expect(future).toEqual(to)

    const past = { ...from, ...patch.undo }
    past.b = { ...from.b, ...patch.undo.b }

    expect(past).toEqual(from)
  })

  test("diff deleted", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1 } }

    const patch = diff(from, to, true)

    expect(patch.do).toEqual({
      b: { b: undefined }
    })

    expect(patch.undo).toEqual({
      b: { b: 2 }
    })

    const future = { ...from, ...patch.do }
    future.b = { ...from.b, ...patch.do.b }

    expect(future).toEqual(to)

    const past = { ...from, ...patch.undo }
    past.b = { ...from.b, ...patch.undo.b }

    expect(past).toEqual(from)
  })

  test("diff updated", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 1 } }

    const patch = diff(from, to, true)

    expect(patch.do).toEqual({
      b: { b: 1 }
    })

    expect(patch.undo).toEqual({
      b: { b: 2 }
    })

    const future = { ...from, ...patch.do }
    future.b = { ...from.b, ...patch.do.b }

    expect(future).toEqual(to)

    const past = { ...from, ...patch.undo }
    past.b = { ...from.b, ...patch.undo.b }

    expect(past).toEqual(from)
  })

  test("diff kept", () => {
    const from = { a: 1, b: { a: 1, b: 2 } }

    const to = { a: 1, b: { a: 1, b: 2 } }

    const patch = diff(from, to, true)

    expect(patch.do).toEqual({})

    expect(patch.undo).toEqual({})

    const future = { ...from, ...patch.do }
    future.b = { ...from.b, ...patch.do.b }

    expect(future).toEqual(to)

    const past = { ...from, ...patch.undo }
    past.b = { ...from.b, ...patch.undo.b }

    expect(past).toEqual(from)
  })
})

describe("array", () => {
  test("diff added", () => {
    const from = [1, 2]

    const to = [1, 2, 3]

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      2: 3, length: 3
    })

    expect(patch.undo).toEqual({
      2: undefined, length: 2
    })

    expect(Array.from({ ...from, ...patch.do })).toEqual(to)

    expect(Array.from({ ...to, ...patch.undo })).toEqual(from)
  })

  test("diff deleted", () => {
    const from = [1, 2]

    const to = [1]

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      1: undefined, length: 1
    })

    expect(patch.undo).toEqual({
      1: 2, length: 2
    })

    expect(Array.from({ ...from, ...patch.do })).toEqual(to)

    expect(Array.from({ ...to, ...patch.undo })).toEqual(from)
  })

  test("diff updated", () => {
    const from = [1, 2]

    const to = [1, 1]

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      1: 1, length: 2
    })

    expect(patch.undo).toEqual({
      1: 2, length: 2
    })

    expect(Array.from({ ...from, ...patch.do })).toEqual(to)

    expect(Array.from({ ...to, ...patch.undo })).toEqual(from)
  })

  test("diff kept", () => {
    const from = [1, 2]

    const to = [1, 2]

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      length: 2
    })

    expect(patch.undo).toEqual({
      length: 2
    })

    expect(Array.from({ ...from, ...patch.do })).toEqual(to)

    expect(Array.from({ ...to, ...patch.undo })).toEqual(from)
  })
})

describe("empty", () => {
  test("empty from", () => {
    const from = {}

    const to = { a: 1 }

    const patch = diff(from, to)

    expect(patch.do).toEqual(to)

    expect(patch.undo).toEqual({
      a: undefined
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("empty to", () => {
    const from = { a: 1 }

    const to = {}

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      a: undefined
    })

    expect(patch.undo).toEqual(from)

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })
})

describe("empty array", () => {
  test("empty from", () => {
    const from = []

    const to = [1]

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      0: 1,
      length: 1
    })

    expect(patch.undo).toEqual({
      0: undefined,
      length: 0
    })

    expect(Array.from({ ...from, ...patch.do })).toEqual(to)

    expect(Array.from({ ...to, ...patch.undo })).toEqual(from)
  })

  test("empty to", () => {
    const from = [1]

    const to = []

    const patch = diff(from, to)

    expect(patch.do).toEqual({
      0: undefined,
      length: 0
    })

    expect(patch.undo).toEqual({
      0: 1,
      length: 1
    })

    expect(Array.from({ ...from, ...patch.do })).toEqual(to)

    expect(Array.from({ ...to, ...patch.undo })).toEqual(from)
  })
})

describe("deep empty", () => {
  test("deep empty object", () => {
    const from = {}

    const to = { a: { b: 1 } }

    const patch = diff(from, to, true)

    expect(patch.do).toEqual(to)

    expect(patch.undo).toEqual({
      a: undefined
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })

  test("deep empty array", () => {
    const from = {}

    const to = { a: [1] }

    const patch = diff(from, to, true)

    expect(patch.do).toEqual(to)

    expect(patch.undo).toEqual({
      a: undefined
    })

    expect({ ...from, ...patch.do }).toEqual(to)

    expect({ ...to, ...patch.undo }).toEqual(from)
  })
})
