import { forwardRef } from "react";

interface TransitionShapeProps {
  color: string;
}

export const TransitionShape = forwardRef<HTMLDivElement, TransitionShapeProps>(
  function TransitionShape({ color }, ref) {
    return (
      <div ref={ref} className="transition-shape" aria-hidden="true">
        <svg viewBox="0 0 700 1200" preserveAspectRatio="none">
          <path
            fill={color}
            d="M172-90C510 77 632 214 451 359 301 478 216 505 292 635c80 138 385 106 364 352-18 216-280 222-488 341L-68 1200V-60Z"
          />
        </svg>
      </div>
    );
  },
);
