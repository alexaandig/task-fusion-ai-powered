'use client'

import { OrganizationSwitcher, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function WorkspaceSwitcher() {
  const { orgId } = useAuth()
  const router = useRouter()

  const handlePersonalWorkspace = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={!orgId ? 'secondary' : 'ghost'}
        onClick={handlePersonalWorkspace}
      >
        Personal
      </Button>
      <OrganizationSwitcher
        afterSelectOrganizationUrl="/workspace/:id/tasks"
        hidePersonal={true}
      />
    </div>
  )
}
