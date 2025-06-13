// timerRef가 있을 때는 아무 액션도 하지 않다가 없으면 callback을 실행한다.
// 커링 형식으로 구현한다.

"use client";

export const useDebounce = (func: () => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func();
      timer = null;
    }, delay);
  };
};
