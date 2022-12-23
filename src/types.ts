// https://github.com/Microsoft/TypeScript/issues/25760#issuecomment-1250630403

//  All props are required but some are optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

// All prop are optional but some of those are required
export type PartialWithRequired<T, K extends keyof T> = Pick<T, K> & Partial<T>;
