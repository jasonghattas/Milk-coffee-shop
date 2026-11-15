import type { Photo as PhotoData } from "@/data/gallery";

/** A lazily loaded photo with reserved space, so nothing jumps while it loads. */
export function Photo({
  photo,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  photo: PhotoData;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-[var(--radius-media)] bg-ink/10 ${className}`}>
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
