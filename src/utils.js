const indices = ['First', 'Second', 'Third']

function validateArguments(args, func, options) {
  Object.keys(options).map((name, index) => {
    const [expected, required] = options[name]
    const value = args[index]
    const type = Array.isArray(value) ? 'array' : typeof value
    const matches = type === expected

    return invariant(
      required ? matches : value === undefined || matches,
      `${indices[index]} argument of ${func} should be the ${name} of type "${expected}", got "${typeof value}".`
    )
  })
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function find(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      return arr[i]
    }
  }
}

function includes(arr, value) {
  return find(arr, v => v === value)
}

module.exports = {
  validateArguments,
  invariant,
  includes,
  find
}
