export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-blue-900 text-white px-4 sm:px-8 flex items-center z-50 shadow">
      <h1 className="text-2xl font-bold absolute left-1/2 -translate-x-1/2">G-Scores</h1>
      <button
        className="sm:hidden text-white text-2xl focus:outline-none ml-auto"
        onClick={onMenuClick}
      >
        &#9776;
      </button>
    </header>
  );
}