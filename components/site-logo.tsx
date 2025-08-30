export function SiteLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M15 50C15 35 25 20 50 20C75 20 85 35 85 50C85 65 75 80 50 80C25 80 15 65 15 50Z"
          fill="#FF6B00"
          stroke="#FF6B00"
          strokeWidth="2"
        />
        <circle cx="40" cy="50" r="10" fill="#0066CC" />
        <circle cx="60" cy="50" r="10" fill="#CC0000" />
      </svg>
      <span className="text-xl font-bold text-orange-600">LankaFriendsChat</span>
    </div>
  )
}
