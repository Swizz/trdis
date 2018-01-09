export function diff(from, to, deep) {
  var done = {}
  var patch = {
    do: {},
    undo: {}
  }

  for (var key in to) {
    if (key in done || from[key] === to[key]) continue

    if (deep && (typeof from[key] === "object" || typeof to[key] === "object")) {
      var deep_patch = diff(from[key], to[key], deep)

      if (Object.keys(deep_patch.do).length) {
        patch.do[key] = deep_patch.do
        patch.undo[key] = deep_patch.undo
      }
    } else {
      patch.do[key] = to[key]
      patch.undo[key] = from[key]
    }

    done[key] = true
  }

  for (var key in from) {
    if (key in done || from[key] === to[key]) continue

    patch.do[key] = to[key]
    patch.undo[key] = from[key]

    done[key] = true
  }

  if ("length" in from || "length" in to) {
    patch.do["length"] = to["length"]
    patch.undo["length"] = from["length"]
  }

  return patch
}

export function patch(from, diff, deep, array, clean) {
  var to = {}
  for (var key in from) {
    if (!(clean && from[key] === undefined)) {
      to[key] = from[key]
    }
  }
  for (var key in diff) {
    if (!(clean && diff[key] === undefined)) {
      if (deep && typeof diff[key] === "object") {
        to[key] = patch(to[key], diff[key], deep, array, clean)
      } else {
        to[key] = diff[key]
      }
    } else {
      delete to[key]
    }
  }
  return array && "length" in to ? Array.from(to) : to
}