/**
 * Transform snake_case or kebab-case strings to camelCase ones
 *
 * @see {@link https://stackoverflow.com/questions/40710628/how-to-convert-snake-case-to-camelcase-in-my-app#comment111891858_61375162}
 */
export function snakeCaseToCamelCase(s: string): string {
  return s.toLowerCase().replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase())
}
