export function toPojo(object) {
  return JSON.parse(
    JSON.stringify(
      object
    )
  )
}
