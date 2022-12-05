import { IconProps } from './type';

export default function CrownIcon({ width, height }: IconProps) {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width || 32}
      height={height || 32}
      fill="none"
      viewBox="0 0 32 32"
      aria-label="Иконка короны"
    >
      <path fill="currentColor" d="M5 21h22v2H5z" />
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 12L4 6v18c0 2 1 3 3 3h18c2 0 3-1 3-3V6l-7 6-5-6-5 6z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.5 17l-.086-.086a2 2 0 00-2.828 0L10.5 17M21.5 17l-.086-.086a2 2 0 00-2.828 0L18.5 17"
      />
    </svg>
  );
}
