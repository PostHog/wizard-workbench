export function getPostHogDistinctId(value: string): string {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0
  }

  return `user_${Math.abs(hash).toString(36)}`
}
