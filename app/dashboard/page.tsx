import { CreateOrganization, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage = async () => {
  const clerkUser = await currentUser();
  const userId = clerkUser?.id;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      workspaces: {
        include: {
          workspace: true,
        },
      },
    },
  });

  const workspaces = user?.workspaces.map((w) => w.workspace) || [];

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <UserButton />
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Workspaces</h2>
        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => (
              <Link href={`/workspace/${ws.clerkOrgId}`} key={ws.id}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{ws.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click to open</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p>You are not a member of any workspaces yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Create a new workspace</h2>
        <div className="max-w-md">
          <CreateOrganization />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
