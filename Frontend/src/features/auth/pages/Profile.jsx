import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, error,  handleLogout } = useAuth();


  const initials = (user?.fullname || user?.email || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to load your profile right now.";

  const handleSignOut = async () => {
    await handleLogout();
    navigate("/login");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-9 h-9 text-[var(--text-primary)] animate-spin" />
          <p className="text-sm font-medium tracking-[0.12em] uppercase text-[var(--text-secondary)]">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 border-b border-[var(--border-subtle)]/70">
        <div className="flex items-center justify-between gap-4">
          <Link
            to={user?.role === "seller" ? "/seller/products" : "/"}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Back</span>
          </Link>

          <div className="flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">
              VELORA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] ml-1 mb-2 inline-block" />
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="mb-6 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-xs text-[var(--text-secondary)]">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
          <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--btn-primary)] text-lg font-semibold text-[var(--btn-text)]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  My account
                </p>
                <h1 className="mt-1 truncate text-xl font-medium text-[var(--text-primary)]">
                  {user.fullname || "Velora Member"}
                </h1>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-primary)] w-fit">
              {user.role === "seller" ? (
                <Store className="w-3.5 h-3.5 text-[var(--accent-gold)]" strokeWidth={1.75} />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-[var(--accent-gold)]" strokeWidth={1.75} />
              )}
              <span>{user.role === "seller" ? "Seller account" : "Buyer account"}</span>
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Contact
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                  {user.contact || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Status
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" strokeWidth={1.75} />
                  Verified member
                </p>
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Profile details
                </p>
                <h2 className="mt-2 text-2xl font-light tracking-[-0.03em] text-[var(--text-primary)]">
                  Account overview
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <div className="rounded-full bg-[var(--bg-muted)] p-2 text-[var(--text-primary)]">
                  <User className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Full name
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)] truncate">
                    {user.fullname || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <div className="rounded-full bg-[var(--bg-muted)] p-2 text-[var(--text-primary)]">
                  <Mail className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)] truncate">
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <div className="rounded-full bg-[var(--bg-muted)] p-2 text-[var(--text-primary)]">
                  <Phone className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Phone number
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)] truncate">
                    {user.contact || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                to={user.role === "seller" ? "/seller/products" : "/"}
                className="inline-flex items-center justify-center h-12 rounded-full bg-[var(--btn-primary)] text-[var(--btn-text)] text-[10px] uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
              >
                {user.role === "seller" ? "Open atelier" : "Continue shopping"}
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center h-12 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[10px] uppercase tracking-[0.18em] text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
