/** Placeholder partner logo cloud — neutral wordmarks until real partners land. */
export function LogoCloud({ names }: { names: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
      {names.map((name) => (
        <div
          key={name}
          className="flex h-12 items-center justify-center rounded-lg text-sm font-medium tracking-tight text-subtle transition-colors hover:text-muted-foreground"
        >
          {name}
        </div>
      ))}
    </div>
  );
}
