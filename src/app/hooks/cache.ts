"use client";

import { useCallback, useRef } from "react";

class SimpleCache {
  private cache = new Map();

  set(key: string, value: unknown): void {
    this.cache.set(key, value);
  }

  get(key: string) {
    return this.cache.get(key) || null;
  }
}

// React Hook으로 캐시 사용
export function useCache<T = unknown>() {
  const cacheRef = useRef<SimpleCache>(new SimpleCache());

  const set = useCallback((key: string, value: T) => {
    cacheRef.current?.set(key, value);
  }, []);

  const get = useCallback((key: string): T | null => {
    return cacheRef.current?.get(key) ?? null;
  }, []);

  return {
    set,
    get,
  };
}

// 전역 캐시 인스턴스
const globalCache = new SimpleCache();

export const cache = {
  set: globalCache.set.bind(globalCache),
  get: globalCache.get.bind(globalCache),
};
