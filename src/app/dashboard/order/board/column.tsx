import { useDroppable } from "@dnd-kit/core";

export function Column({
  id,
  status,
  children,
}: {
  id: string;
  status: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      status,
    },
  });

  return (
    <div ref={setNodeRef} className={`bg-muted/50 p-4 rounded-lg flex-1`}>
      {children}
    </div>
  );
}
