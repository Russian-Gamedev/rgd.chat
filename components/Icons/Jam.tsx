import { IconProps } from './type';

export default function JamIcon({ width, height }: IconProps) {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width || 32}
      height={height || 32}
      fill="none"
      aria-label="Иконка радостного джема"
    >
      <path
        fill="currentColor"
        d="M13 21a2.988 2.988 0 00.882 2.121 3.013 3.013 0 002.13.879 3.023 3.023 0 002.131-.879A2.999 2.999 0 0019.026 21H13z"
      />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <circle cx="20" cy="18" r="1" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7l-3 5c2.225 1.216 3.532 1.245 6 0h2c2.274 1.209 3.613 1.271 6 0h2c2.337 1.23 3.662 1.229 6 0l-3-5"
      />
      <rect
        width="20"
        height="15"
        x="6"
        y="13"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        rx="2"
      />
      <rect
        width="18"
        height="4"
        x="7"
        y="4"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        rx="1"
      />
    </svg>
  );
}
