import { getWorkspaces } from '@/actions/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function DashboardPage() {
  const workspaces = await getWorkspaces()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Your Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workspaces.map((ws) => (
          <Link href={`/workspace/${ws.id}/tasks`} key={ws.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{ws.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{ws.slug}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
