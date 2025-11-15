export default function Avatar({ src, alt, size = 56 }) {
    const s = `${size}px`
    return (
      <div style={{ width: s, height: s }} className="rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>}
      </div>
    )
  }
  