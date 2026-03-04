type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

export type SnakeToCamelKeys<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K]
};