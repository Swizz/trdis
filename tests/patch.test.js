import { diff, patch } from "../src";

describe("flat", () => {
  test("patch added", () => {
    const from = { a: 1, b: 2 };

    const to = { a: 1, b: 2, c: 3 };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });

  test("patch deleted", () => {
    const from = { a: 1, b: 2 };

    const to = { a: 1 };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });

  test("patch updated", () => {
    const from = { a: 1, b: 2 };

    const to = { a: 1, b: 1 };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });

  test("patch kept", () => {
    const from = { a: 1, b: 2 };

    const to = { a: 1, b: 2 };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });
});

describe("nested", () => {
  test("patch added", () => {
    const from = { a: 1, b: { a: 1, b: 2 } };

    const to = { a: 1, b: { a: 1, b: 2, c: 3 } };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });

  test("patch deleted", () => {
    const from = { a: 1, b: { a: 1, b: 2 } };

    const to = { a: 1, b: { a: 1 } };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });

  test("patch updated", () => {
    const from = { a: 1, b: { a: 1, b: 2 } };

    const to = { a: 1, b: { a: 1, b: 1 } };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });

  test("patch kept", () => {
    const from = { a: 1, b: { a: 1, b: 2 } };

    const to = { a: 1, b: { a: 1, b: 2 } };

    const present = diff(from, to);

    expect(patch(from, present.do)).toEqual(to);

    expect(patch(to, present.undo)).toEqual(from);
  });
});

describe("array", () => {
  test("patch added", () => {
    const from = [1, 2];

    const to = [1, 2, 3];

    const present = diff(from, to);

    expect(Array.from(patch(from, present.do))).toEqual(to);

    expect(Array.from(patch(to, present.undo))).toEqual(from);
  });

  test("patch deleted", () => {
    const from = [1, 2];

    const to = [1];

    const present = diff(from, to);

    expect(Array.from(patch(from, present.do))).toEqual(to);

    expect(Array.from(patch(to, present.undo))).toEqual(from);
  });

  test("patch updated", () => {
    const from = [1, 2];

    const to = [1, 1];

    const present = diff(from, to);

    expect(Array.from(patch(from, present.do))).toEqual(to);

    expect(Array.from(patch(to, present.undo))).toEqual(from);
  });

  test("patch kept", () => {
    const from = [1, 2];

    const to = [1, 2];

    const present = diff(from, to);

    expect(Array.from(patch(from, present.do))).toEqual(to);

    expect(Array.from(patch(to, present.undo))).toEqual(from);
  });
});

describe("array option", () => {
  test("transform array", () => {
    const from = [1, 2];

    const to = [1, 2, 3];

    const present = diff(from, to);

    expect(patch(from, present.do, undefined, true)).toEqual(to);

    expect(patch(to, present.undo, undefined, true)).toEqual(from);
  });

  test("do not transform object", () => {
    const from = { a: 1, b: 1 };

    const to = { a: 1, b: 2, c: 3 };

    const present = diff(from, to);

    expect(patch(from, present.do, undefined, true)).toEqual(to);

    expect(patch(to, present.undo, undefined, true)).toEqual(from);
  });
});

describe("clean option", () => {
  test("deleted properties", () => {
    const from = { a: 1, b: 1 };

    const to = { a: 1, c: 3 };

    const present = diff(from, to);

    const past = patch(to, present.undo);
    const past_clean = patch(to, present.undo, undefined, undefined, true);

    const future = patch(from, present.do);
    const future_clean = patch(from, present.do, undefined, undefined, true);

    expect(future).toEqual(to);
    expect(future_clean).toEqual(to);

    expect("b" in future).toBe(true);
    expect("b" in future_clean).toBe(false);

    expect(past).toEqual(from);
    expect(past_clean).toEqual(from);

    expect("c" in past).toBe(true);
    expect("c" in past_clean).toBe(false);
  });

  test("array intact", () => {
    const from = [1, 2];

    const to = [1, undefined, 3];

    const present = diff(from, to);

    expect(patch(from, present.do, undefined, true, true)).toEqual(to);

    expect(patch(to, present.undo, undefined, true, true)).toEqual(from);
  });
});

describe("deep option", () => {
  test("deep object", () => {
    const from = { a: 1, b: { a: 1, b: 2 } };

    const to = { a: 1, b: { a: 1, b: 2, c: 3 } };

    const present = diff(from, to, true);

    expect(patch(from, present.do, true)).toEqual(to);

    expect(patch(to, present.undo, true)).toEqual(from);
  });

  test("deep array", () => {
    const from = { a: 1, b: [1, 2] };

    const to = { a: 1, b: [1, 2, 3] };

    const present = diff(from, to, true);

    expect(patch(from, present.do, true, true)).toEqual(to);

    expect(patch(to, present.undo, true, true)).toEqual(from);
  });
});
