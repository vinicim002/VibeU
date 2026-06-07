import { ProfileForm } from '@/components/forms/ProfileForm'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-4xl tracking-wider text-white">PERFIL</h1>
      <Card className="mt-8 p-6" glow>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/30 font-display text-2xl text-white">
            {user?.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-text-muted">{user?.email}</p>
            <Badge variant="purple" className="mt-2">
              {user?.role}
            </Badge>
          </div>
        </div>
        <ProfileForm />
      </Card>
    </div>
  )
}
