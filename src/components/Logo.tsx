/** The Milk wordmark, traced from the shop sign. It takes the current text colour. */
export function Logo({ className = "" }: { className?: string }) {
  return <span className={`wordmark ${className}`} role="img" aria-label="Milk Concept Store" />;
}
