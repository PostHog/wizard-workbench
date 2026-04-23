export async function keepingScrollPosition(element, promise) {
  const originalPosition = element.getBoundingClientRect()

  await promise

  const currentPosition = element.getBoundingClientRect()

  const yDiff = currentPosition.top - originalPosition.top
  const xDiff = currentPosition.left - originalPosition.left

  findNearestScrollableYAncestor(element).scrollTop += yDiff
  findNearestScrollableXAncestor(element).scrollLeft += xDiff
}

export function isFullyVisible(element, container = document.documentElement) {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  return elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.left >= containerRect.left &&
    elementRect.right <= containerRect.right
}

export function isScrolledToBottom(element, threshold = 100) {
  return (element.scrollHeight - element.scrollTop - element.clientHeight) < threshold
}

export function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight
}

export function scrollIntoView(element, options = { inline: "center", block: "center", behavior: "instant" }) {
  element.scrollIntoView(options)
}

// Private

function findNearestScrollableYAncestor(refElement) {
  return findNearest(refElement, (element) => {
    const largerThanVisibleArea = element.scrollHeight > element.clientHeight

    const overflowY = getComputedStyle(element).overflowY
    const scrollableStyle = overflowY === "scroll" || overflowY === "auto"

    return largerThanVisibleArea && scrollableStyle
  })
}

function findNearestScrollableXAncestor(refElement) {
  return findNearest(refElement, (element) => {
    const largerThanVisibleArea = element.scrollWidth > element.clientWidth

    const overflowX = getComputedStyle(element).overflowX
    const scrollableStyle = overflowX === "scroll" || overflowX === "auto"

    return largerThanVisibleArea && scrollableStyle
  })
}

function findNearest(element, fn) {
  while (element) {
    if (fn(element)) {
      return element
    } else {
      element = element.parentElement
    }
  }

  return document.documentElement
}
