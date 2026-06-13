export function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase())
}
