import Link from "next/link";

const dashboardCards = [
  {
    title: "Categories",
    href: "/dashboard/categories",
    gradient: "from-blue-400 via-blue-300 to-blue-500",
  },
  {
    title: "Problems",
    href: "/dashboard/problems",
    gradient: "from-pink-400 via-pink-300 to-pink-500",
  },
  {
    title: "Solutions",
    href: "/dashboard/solutions",
    gradient: "from-green-400 via-green-300 to-green-500",
  },
  {
    title: "Create Category",
    href: "/dashboard/categories/new",
    gradient: "from-yellow-400 via-yellow-300 to-yellow-500",
  },
  {
    title: "Create Problem",
    href: "/dashboard/problems/new",
    gradient: "from-purple-400 via-purple-300 to-purple-500",
  },
  {
    title: "Create Solution",
    href: "/dashboard/problems",
    gradient: "from-indigo-400 via-indigo-300 to-indigo-500",
  },
];

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center pt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl p-8">
        {dashboardCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`
              relative rounded-2xl shadow-xl overflow-hidden group transition-transform hover:scale-105
              flex items-center justify-center h-48
            `}
          >
            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70 z-0`}
            />
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-5" />
            {/* Centered Text */}
            <span className="relative z-7 text-2xl font-bold text-gray-900 drop-shadow-lg text-center">
              {card.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}