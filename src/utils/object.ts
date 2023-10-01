/* eslint-disable @typescript-eslint/no-explicit-any */
type DeepMapFunction<T, K> = (value: T) => K

export function deepObjectMap<T, K>(
  input: any,
  mapper: DeepMapFunction<T, K>,
): any {
  if (typeof input !== 'object' || input === null) {
    // Base case: input is not an object, or it's null
    return mapper(input)
  }

  if (Array.isArray(input)) {
    // Case: input is an array
    return input.map((item) => deepObjectMap(item, mapper))
  }

  // Case: input is an object
  const result: { [key: string]: any } = {}
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      result[key] = deepObjectMap(input[key], mapper)
    }
  }
  return result
}
