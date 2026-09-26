export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-(--accent-transparent) border-t-(--accent) rounded-full animate-spin motion-reduce:animate-none" />
    </div>
  );
}
