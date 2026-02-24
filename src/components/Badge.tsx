interface BadgeProps {
  label: string;
  variant: "specialty" | "animal" | "emergency" | "language";
}

const variantClasses: Record<BadgeProps["variant"], string> = {
  specialty: "bg-blue-100 text-blue-800",
  animal: "bg-green-100 text-green-800",
  emergency: "bg-red-100 text-red-800",
  language: "bg-gray-100 text-gray-700",
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
