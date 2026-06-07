import { Link, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <span className="font-display text-8xl leading-none text-white/10">VIBEU</span>
          <p className="mt-4 font-heading text-2xl uppercase text-white">
            Sua universidade, sua vibe.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <Link to={ROUTES.HOME} className="mb-8 font-display text-3xl tracking-widest text-white">
          VIBE<span className="text-accent">U</span>
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
