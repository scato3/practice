// 기존 timerRef가 남아있을 때 입력이 들어오면 그냥 넘어가고 제한시간이 끝나면 callback을 실행한다.

"use client";
import { useRef } from "react";

export const useThrottle = (delay: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return (callback: () => void) => {
    if (timerRef.current) return;

    timerRef.current = setTimeout(() => {
      callback();
      timerRef.current = null;
    }, delay);
  };
};
