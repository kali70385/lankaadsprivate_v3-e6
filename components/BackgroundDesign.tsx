"use client"

export function BackgroundDesign() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-magenta-50 to-white" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(194, 24, 91, 0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-magenta-200/20 to-transparent rounded-bl-full transform translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-magenta-200/20 to-transparent rounded-tr-full transform -translate-x-1/4 translate-y-1/4" />

      {/* Floating circles */}
      <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-magenta-500/5 blur-3xl animate-float" />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-magenta-300/5 blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />
    </div>
  )
}
