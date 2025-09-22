import { checkUser } from "@/actions/user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkUser();
  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <WorkspaceSwitcher />
        <div className="flex items-center gap-4">
          <Link href="/organization-profile">
            <Button variant="outline">Manage Workspace</Button>
          </Link>
          <UserButton />
        </div>
      </div>
      {children}
    </div>
  );
}
