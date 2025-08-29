import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3c-6.1 0-9 4.8-9 4.8s2.9 4.8 9 4.8 9-4.8 9-4.8-2.9-4.8-9-4.8z" />
      <path d="M12 12v9" />
      <path d="M4 21h16" />
      <path d="M12 12a3 3 0 0 0-3 3" />
    </svg>
  ),
};
