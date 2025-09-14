import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";

const collaborators = [
  {
    avatar: "/diverse-student-portraits.png",
    initials: "AC",
  },
  {
    avatar: "/images/github-profile-1.jpg",
    initials: "SK",
  },
  {
    avatar: "/images/github-profile-2.png",
    initials: "MJ",
  },
  {
    avatar: "/images/github-profile-3.png",
    initials: "ER",
  },
  {
    avatar: "/asian-male-student.png",
    initials: "DP",
  },
  {
    avatar: "/indian-female-student.png",
    initials: "MP",
  },
  {
    avatar: "/diverse-students-studying.png",
    initials: "JL",
  },
  {
    avatar: "/diverse-female-student.png",
    initials: "ZC",
  },
  {
    avatar: "/diverse-female-student.png",
    initials: "ZC",
  },
];

const positions = [
  { left: "50%", top: "50%" }, // center
  { left: "25%", top: "25%" }, // top-left
  { left: "75%", top: "25%" }, // top-right
  { left: "85%", top: "50%" }, // right
  { left: "75%", top: "75%" }, // bottom-right
  { left: "25%", top: "75%" }, // bottom-left
  { left: "15%", top: "50%" }, // left
  { left: "50%", top: "15%" }, // top-center
  { left: "50%", top: "85%" }, // bottom-center
];

export function NetworkGraph() {
  // Generate dots along the connection lines
  const floatingDots = useMemo(() => {
    const dots: Array<{
      id: number;
      left: string;
      top: string;
      size: string;
      opacity: string;
      delay: string;
    }> = [];
    let dotId = 0;

    // Generate dots for each connection line
    positions.forEach((pos1, i) => {
      positions.slice(i + 1).forEach((pos2, j) => {
        // Calculate how many dots to place on this line
        const dotsPerLine = Math.round(Math.random() * 3);

        for (let k = 0; k < dotsPerLine; k++) {
          // Calculate position along the line (0 to 1)
          const progress = (k + 1) / (dotsPerLine + 1);

          // Convert percentage strings to numbers
          const x1 = parseFloat(pos1.left);
          const y1 = parseFloat(pos1.top);
          const x2 = parseFloat(pos2.left);
          const y2 = parseFloat(pos2.top);

          // Interpolate position along the line
          const left = x1 + (x2 - x1) * progress;
          const top = y1 + (y2 - y1) * progress;

          // Random sizes
          const sizes = ["w-1 h-1", "w-1.5 h-1.5", "w-2 h-2"];
          const size = sizes[Math.floor(Math.random() * sizes.length)];

          // Random opacity levels
          const opacities = [
            "bg-primary/20",
            "bg-primary/30",
            "bg-primary/40",
            "bg-primary/50",
            "bg-primary/60",
          ];
          const opacity =
            opacities[Math.floor(Math.random() * opacities.length)];

          // Random animation delays
          const delay = Math.random() * 2; // 0 to 2 seconds

          dots.push({
            id: dotId++,
            left: `${left}%`,
            top: `${top}%`,
            size,
            opacity,
            delay: `${delay}s`,
          });
        }
      });
    });

    return dots;
  }, []);

  return (
    <div className="relative w-full rounded-lg overflow-hidden aspect-square">
      <div className="relative w-full h-full">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {/* Generate lines for each pair of positions */}
          {positions.map((pos1, i) =>
            positions.slice(i + 1).map((pos2, j) => {
              const isCentralConnection =
                (pos1.left === "50%" && pos1.top === "50%") ||
                (pos2.left === "50%" && pos2.top === "50%");
              return (
                <line
                  key={`${i}-${j}`}
                  x1={pos1.left}
                  y1={pos1.top}
                  x2={pos2.left}
                  y2={pos2.top}
                  stroke="oklch(0.705 0.213 47.604)"
                  strokeWidth={isCentralConnection ? "2" : "1"}
                  opacity={isCentralConnection ? "0.4" : "0.2"}
                />
              );
            })
          )}
        </svg>

        {/* Floating connection dots */}
        {floatingDots.map((dot) => {
          // Calculate offset based on dot size to center it
          const getSizeOffset = (size: string) => {
            switch (size) {
              case "w-1 h-1":
                return "0.125rem"; // 2px
              case "w-1.5 h-1.5":
                return "0.1875rem"; // 3px
              case "w-2 h-2":
                return "0.25rem"; // 4px
              default:
                return "0.125rem";
            }
          };

          const offset = getSizeOffset(dot.size);

          return (
            <div
              key={dot.id}
              className="absolute"
              style={{
                left: dot.left,
                top: dot.top,
                zIndex: 1,
                transform: `translate(-${offset}, -${offset})`,
              }}
            >
              <div
                className={`${dot.size} ${dot.opacity} rounded-full animate-pulse`}
                style={{ animationDelay: dot.delay }}
              ></div>
            </div>
          );
        })}

        {/* Central avatar - highlighted */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 3 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <Avatar className="w-16 h-16 border-3 border-primary shadow-lg relative">
              <AvatarImage
                src={collaborators[0].avatar || "/placeholder.svg"}
                alt={collaborators[0].initials}
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {collaborators[0].initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Surrounding avatars positioned in constellation */}
        {collaborators.slice(1).map((collaborator, index) => {
          const position = positions[index + 1] || positions[1]; // Skip center position (index 0)
          const size = index < 4 ? "w-12 h-12" : "w-10 h-10";

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: position.left, top: position.top, zIndex: 2 }}
            >
              <Avatar
                className={`${size} border-2 border-primary/60 shadow-md hover:border-primary transition-all hover:scale-110`}
              >
                <AvatarImage
                  src={collaborator.avatar || "/placeholder.svg"}
                  alt={collaborator.initials}
                />
                <AvatarFallback className="bg-primary/60 text-primary-foreground text-sm">
                  {collaborator.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}
      </div>
    </div>
  );
}
