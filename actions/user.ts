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

      // Create a personal workspace for the new user
      await prisma.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          isPersonal: true,
          members: {
            create: {
              userId: existUser.id,
              role: 'ADMIN',
            },
          },
        },
      })
    }

    const { orgId } = await auth()

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
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) return []

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    })

    if (!user) return []

    const personalWorkspace = user.workspaces.find(
      (w) => w.workspace.isPersonal
    )?.workspace
    const orgWorkspaces = user.workspaces
      .filter((w) => !w.workspace.isPersonal)
      .map((w) => w.workspace)

    return [personalWorkspace, ...orgWorkspaces].filter(Boolean)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    return []
  }
}