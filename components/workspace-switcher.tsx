"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";

export function WorkspaceSwitcher() {
  return (
    <OrganizationSwitcher
      hidePersonal={true}
      afterSelectOrganizationUrl="/workspace/:slug/tasks"
      afterCreateOrganizationUrl="/workspace/:slug/tasks"
    />
  );
}
