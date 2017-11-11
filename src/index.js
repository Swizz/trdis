export function diff(from, to) {
  var done = {}
  var patch = {
    do: {},
    undo: {}
  }

  for (var key in to) {
    if (key in done || from[key] === to[key]) continue

    patch.do[key] = to[key]
    patch.undo[key] = from[key]

    done[key] = true
  }

  for (var key in from) {
    if (key in done || from[key] === to[key]) continue

    patch.do[key] = to[key]
    patch.undo[key] = from[key]

    done[key] = true
  }

  if (length in from || length in to) {
    patch.do["length"] = to["length"]
    patch.undo["length"] = from["length"]
  }

  return patch
}

export function patch(from, diff, array) {
  var to = {}
  for (var key in from) {
    to[key] = from[key]
  }
  for (var key in diff) {
    to[key] = diff[key]
  }
  return array && "length" in to ? Array.from(to) : to
}