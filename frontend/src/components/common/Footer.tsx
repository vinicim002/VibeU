import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-slate">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <span className="font-display text-3xl tracking-widest text-white">
              VIBE<span className="text-accent">U</span>
            </span>
            <p className="mt-4 text-sm text-text-muted">
              Sua universidade, sua vibe. A plataforma premium para eventos universitários.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Links Rápidos
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to={ROUTES.EVENTS} className="text-sm text-text-muted hover:text-white">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LOGIN} className="text-sm text-text-muted hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="text-sm text-text-muted hover:text-white">
                  Cadastro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h4>
            <p className="mt-4 text-sm text-text-muted">
              Receba os melhores eventos universitários na sua caixa de entrada.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="seu@email.edu"
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <button
                type="button"
                className="rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-white"
              >
                Inscrever
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} VibeU. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
