export default function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-brand-blue-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
