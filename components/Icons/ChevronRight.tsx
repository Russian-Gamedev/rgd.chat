import { IconProps } from './type';

export default function ChevronRight({ width, height }: IconProps) {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width || 24}
      height={height || 24}
      fill="none"
      aria-label="Иконка следовать"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M9 18l6-6-6-6"
      />
    </svg>
  );
}
