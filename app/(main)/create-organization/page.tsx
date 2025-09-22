import { CreateOrganization } from '@clerk/nextjs'

export default function CreateOrganizationPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <CreateOrganization
        afterCreateOrganizationUrl="/tasks"
        skipInvitationScreen
      />
    </div>
  )
}
