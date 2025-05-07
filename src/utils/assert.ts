export function ASSERT<T>(value: T, message = 'Value is null or undefined'): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
      throw new Error(message);
    }
}