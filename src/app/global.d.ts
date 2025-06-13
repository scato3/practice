declare global {
  type CustomPick<T extends object, K extends keyof T> = {
    [P in K]: T[P];
  };

  type CustomOmit<T extends object, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
  };

  type CustomPartial<T> = {
    [P in keyof T]?: T[P];
  };

  type CustomExclude<T, K> = T extends K ? never : T;

  type CustomExtract<T, K> = T extends K ? T : never;

  type CustomNonNullable<T> = T extends null | undefined ? never : T;
}

export {};
