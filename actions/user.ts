'use server'
import { currentUser, auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function checkUser() {
  const user = await currentUser()
  if (!user) return null

  try {
    let existUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    })

    if (!existUser) {
      const name = `${user.firstName} ${
        user.lastName != null ? user.lastName : ''
      }`

      existUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          name,
          imageUrl: user.imageUrl as string,
          email: user.emailAddresses[0].emailAddress,
        },
      })
    }

    const { orgId } = auth()

    if (orgId) {
      const org = await clerkClient.organizations.getOrganization({
        organizationId: orgId,
      })

      if (org) {
        const workspace = await prisma.workspace.findUnique({
          where: {
            clerkId: org.id,
          },
        })

        if (!workspace) {
          await prisma.workspace.create({
            data: {
              clerkId: org.id,
              name: org.name,
              slug: org.slug as string,
              imageUrl: org.imageUrl,
            },
          })
        }
      }
    }

    return existUser
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
  }
}

export async function getWorkspaces() {
  const { userId } = auth()
  if (!userId) return []

  try {
    const orgs = await clerkClient.users.getOrganizationMembershipList({
      userId,
    })

    const workspaceIds = orgs.map((org) => org.organization.id)

    const workspaces = await prisma.workspace.findMany({
      where: {
        clerkId: {
          in: workspaceIds,
        },
      },
    })

    return workspaces
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    return []
  }
}