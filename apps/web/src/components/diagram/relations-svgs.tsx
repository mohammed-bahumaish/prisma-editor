export const RelationSVGs = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <marker
          id="relation-one"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-[#5c7194]"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            points="-10,-8 -10,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-[#5c7194]"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="relation-one-selected"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-black"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            points="-10,-8 -10,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-black"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>

        <marker
          id="relation-many"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-[#5c7194]"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
            points="0,-8 -10,0 0,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-[#5c7194]"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="relation-many-selected"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-black"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
            points="0,-8 -10,0 0,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-black"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>

        <marker
          id="relation-one-dark"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="text-edge stroke-current"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            points="-10,-8 -10,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="text-edge stroke-current"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="relation-one-selected-dark"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-white"
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            points="-10,-8 -10,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-white"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>

        <marker
          id="relation-many-dark"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-[#5c7194]"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
            points="0,-8 -10,0 0,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-[#5c7194]"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="relation-many-selected-dark"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            className="stroke-current text-white"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
            points="0,-8 -10,0 0,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            className="stroke-current text-white"
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
      </defs>
    </svg>
  );
};
