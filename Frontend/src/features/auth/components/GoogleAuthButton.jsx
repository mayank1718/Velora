import { googleAuthUrl } from "../services/auth.service";

const GoogleAuthButton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[var(--border-subtle)]" />
      <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        Or continue with
      </span>
      <span className="h-px flex-1 bg-[var(--border-subtle)]" />
    </div>

    <a
      href={googleAuthUrl}
      className="w-full h-12 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-medium tracking-[0.08em] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-muted)] flex items-center justify-center gap-3"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="w-4 h-4"
      >
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.79 7.18l7.73 6C44.39 37.96 46.98 31.8 46.98 24.55Z" transform="translate(0 0)" />
        <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.52 2.56 10.78l7.97-6.19Z" transform="translate(0 0)" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 0)" />
      </svg>
      <span>Continue with Google</span>
    </a>
  </div>
);

export default GoogleAuthButton;