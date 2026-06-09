import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Logo } from '@/components/common/Logo'

export function AuthLayout() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="absolute top-4 right-4 z-10 lg:left-auto lg:right-6">
        <ThemeToggle />
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Logo className="h-16 brightness-0 invert opacity-20" linkToHome={false} />
          <p className="mt-4 font-heading text-2xl uppercase text-on-media">
            Sua universidade, sua vibe.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mb-8">
          <Logo className="h-10" />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
