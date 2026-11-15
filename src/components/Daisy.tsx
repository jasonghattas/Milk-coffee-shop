/** A daisy like the ones painted on the terrace paving: white petals, yellow heart. */
export function Daisy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden focusable="false">
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d="M0 -22 C 15 -50, 13 -84, 0 -96 C -13 -84, -15 -50, 0 -22 Z"
          fill="currentColor"
          transform={`rotate(${i * 40 + (i % 2 ? 3 : -2)})`}
        />
      ))}
      <circle r="17" fill="var(--color-sign)" />
    </svg>
  );
}
