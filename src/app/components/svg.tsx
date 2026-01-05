type IconProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
};
export function ArrowRightSquare({ size = 24, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 1L8 1V2L2 2L2 13H8V14H1L1 1ZM10.8536 4.14645L14.1932 7.48614L10.8674 11.0891L10.1326 10.4109L12.358 8L4 8V7L12.2929 7L10.1464 4.85355L10.8536 4.14645Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function EyeIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m15.71 7.77c-1.22-3.19-4.3-5.29-7.71-5.26-3.44-.07-6.54 2.04-7.72 5.27-.04.15-.04.3 0 .44 1.19 3.22 4.29 5.33 7.72 5.27 3.42.03 6.49-2.07 7.72-5.26.04-.15.04-.31-.01-.46zm-7.71 4.24c-2.7.1-5.18-1.51-6.2-4.01 1.01-2.51 3.49-4.11 6.2-4.01 2.69-.06 5.15 1.53 6.19 4.01-1.05 2.48-3.5 4.07-6.19 4.01zm0-6.66c-.18 0-.36.02-.53.06.26.35.4.77.4 1.21-.05 1.25-1.1 2.21-2.35 2.16-.01 0-.03 0-.04 0h-.07c.42 1.41 1.9 2.21 3.31 1.79s2.21-1.9 1.79-3.31c-.33-1.13-1.35-1.9-2.51-1.91z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EyeOffIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Eye */}
      <path
        d="m15.71 7.77c-1.22-3.19-4.3-5.29-7.71-5.26-3.44-.07-6.54 2.04-7.72 5.27-.04.15-.04.3 0 .44 1.19 3.22 4.29 5.33 7.72 5.27 3.42.03 6.49-2.07 7.72-5.26.04-.15.04-.31-.01-.46zm-7.71 4.24c-2.7.1-5.18-1.51-6.2-4.01 1.01-2.51 3.49-4.11 6.2-4.01 2.69-.06 5.15 1.53 6.19 4.01-1.05 2.48-3.5 4.07-6.19 4.01zm0-6.66c-.18 0-.36.02-.53.06.26.35.4.77.4 1.21-.05 1.25-1.1 2.21-2.35 2.16-.01 0-.03 0-.04 0h-.07c.42 1.41 1.9 2.21 3.31 1.79s2.21-1.9 1.79-3.31c-.33-1.13-1.35-1.9-2.51-1.91z"
        fill="currentColor"
      />

      {/* Diagonal Slash */}
      <line
        x1="2"
        y1="14"
        x2="14"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
