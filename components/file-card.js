export default function FileCard({ item }) {
  const src = item?.mp4Url || item?.secureUrl
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
      <div className="bg-neutral-900">
        <video className="w-full h-full" controls playsInline preload="metadata" controlsList="nodownload">
          <source src={src} type="video/mp4" />
          {"Your browser does not support the video tag."}
        </video>
      </div>
    </div>
  )
}
