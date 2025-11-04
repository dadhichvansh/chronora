export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
