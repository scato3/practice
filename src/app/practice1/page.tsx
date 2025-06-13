"use client";

import { useDebounce } from "../hooks/debounce";
import { useThrottle } from "../hooks/useThrottle";

export default function Practice1() {
  const debounce = useDebounce(1000);
  const throttle = useThrottle(1000);

  return (
    <div>
      <h1>Debounce</h1>
      <input
        type="text"
        onChange={(e) => {
          debounce(() => {
            console.log(e.target.value);
          });
        }}
      />
      <h1>Throttle</h1>
      <input
        type="text"
        onChange={(e) => {
          throttle(() => {
            console.log(e.target.value);
          });
        }}
      />
    </div>
  );
}
