import React from "react";

interface CheckMarkProps {
  width?: number;
  height?: number;
  stroke?: string;
}

const CheckMark: React.FC<CheckMarkProps> = ({
  width = 15,
  height = 15,
  stroke = "#FE8149",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 3.83L3.83 6.66L9.5 1"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckMark;
