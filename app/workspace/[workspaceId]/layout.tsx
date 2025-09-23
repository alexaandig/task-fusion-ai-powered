import { TaskProvider } from "@/components/task-provider";
import { auth } from "@clerk/nextjs/server";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const { orgId } = auth();

  if (!orgId || orgId !== params.workspaceId) {
    // This case should be handled by middleware, but as a fallback:
    return (
      <div className="flex items-center justify-center h-full">
        <p>Unauthorized or invalid workspace.</p>
      </div>
    );
  }

  return <TaskProvider workspaceId={params.workspaceId}>{children}</TaskProvider>;
}
