interface CloseCircleIconProps {
  width?: number;
  height?: number;
  stroke?: string;
}

function CloseCircleIcon(props: CloseCircleIconProps) {
  return (
    <svg
      data-v-06dbba32=""
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1053_133272)">
        <path
          d="M7.99992 15.1668C11.6666 15.1668 14.6666 12.1668 14.6666 8.50016C14.6666 4.8335 11.6666 1.8335 7.99992 1.8335C4.33325 1.8335 1.33325 4.8335 1.33325 8.50016C1.33325 12.1668 4.33325 15.1668 7.99992 15.1668Z"
          stroke={props.stroke || "#383D41"}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M6.11328 10.3866L9.88661 6.61328"
          stroke={props.stroke || "#383D41"}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M9.88661 10.3866L6.11328 6.61328"
          stroke={props.stroke || "#383D41"}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_1053_133272">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.5)"
          ></rect>
        </clipPath>
      </defs>
    </svg>
  );
}

export default CloseCircleIcon;
