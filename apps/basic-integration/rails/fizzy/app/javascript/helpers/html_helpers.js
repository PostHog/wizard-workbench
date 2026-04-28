export function createElement(name, properties) {
  const element = document.createElement(name)

  for (var key in properties) {
    element.setAttribute(key, properties[key])
  }

  return element
}
