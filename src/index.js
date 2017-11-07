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

  return patch
}
