import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const collaborators = [
  {
    name: "Alex Chen",
    avatar: "/diverse-student-portraits.png",
    initials: "AC",
    role: "Team Lead",
  },
  {
    name: "Sarah Kim",
    avatar: "/diverse-female-student.png",
    initials: "SK",
    role: "Developer",
  },
  {
    name: "Marcus Johnson",
    avatar: "/male-student-studying.png",
    initials: "MJ",
    role: "Designer",
  },
  {
    name: "Elena Rodriguez",
    avatar: "/latina-student.jpg",
    initials: "ER",
    role: "Researcher",
  },
  {
    name: "David Park",
    avatar: "/asian-male-student.png",
    initials: "DP",
    role: "Tester",
  },
  {
    name: "Maya Patel",
    avatar: "/indian-female-student.png",
    initials: "MP",
    role: "Writer",
  },
  {
    name: "Jordan Lee",
    avatar: "/diverse-students-studying.png",
    initials: "JL",
    role: "Analyst",
  },
  {
    name: "Zoe Chen",
    avatar: "/diverse-female-student.png",
    initials: "ZC",
    role: "Editor",
  },
  {
    name: "Zoe Chen",
    avatar: "/diverse-female-student.png",
    initials: "ZC",
    role: "Editor",
  },
];

const positions = [
  { left: "50%", top: "50%" }, // center
  { left: "30%", top: "20%" }, // top-left
  { left: "70%", top: "20%" }, // top-right
  { left: "80%", top: "50%" }, // right
  { left: "70%", top: "80%" }, // bottom-right
  { left: "30%", top: "80%" }, // bottom-left
  { left: "20%", top: "50%" }, // left
  { left: "50%", top: "5%" }, // top-center
  { left: "50%", top: "95%" }, // bottom-center
];

export function NetworkGraph() {
  return (
    <div className="relative w-full bg-background rounded-lg p-8 overflow-hidden">
      <div className="relative h-96 flex items-center justify-center">
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
        <div
          className="absolute"
          style={{ left: "40%", top: "35%", zIndex: 1 }}
        >
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
        </div>
        <div
          className="absolute"
          style={{ left: "60%", top: "40%", zIndex: 1 }}
        >
          <div
            className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
        <div
          className="absolute"
          style={{ left: "45%", top: "65%", zIndex: 1 }}
        >
          <div
            className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div
          className="absolute"
          style={{ left: "25%", top: "60%", zIndex: 1 }}
        >
          <div
            className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

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
                alt={collaborators[0].name}
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
                  alt={collaborator.name}
                />
                <AvatarFallback className="bg-primary/60 text-primary-foreground text-sm">
                  {collaborator.initials}
                </AvatarFallback>
              </Avatar>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-background border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                  <p className="font-medium">{collaborator.name}</p>
                  <p className="text-muted-foreground">{collaborator.role}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
