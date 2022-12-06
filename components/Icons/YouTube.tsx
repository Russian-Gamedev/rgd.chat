import { IconProps } from './type';

export default function YouTubeIcon({ width, height }: IconProps) {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width || 20}
      height={height || 14}
      fill="none"
      viewBox="0 0 20 14"
      aria-label="Иконка соц сети YouTube"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M17.814.418c.86.23 1.538.908 1.768 1.768C20 3.746 20 7 20 7s0 3.254-.418 4.814a2.505 2.505 0 01-1.768 1.768C16.254 14 10 14 10 14s-6.254 0-7.814-.418a2.505 2.505 0 01-1.768-1.768C0 10.254 0 7 0 7s0-3.254.418-4.814c.23-.86.908-1.538 1.768-1.768C3.746 0 10 0 10 0s6.254 0 7.814.418zM13.182 7L7.955 9.955v-5.91L13.182 7z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
