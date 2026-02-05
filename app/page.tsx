import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center px-8 py-5 border-b border-border">
        <div className="font-semibold text-lg">Job Readiness Mapper</div>
        <nav className="flex gap-6">
          <a href="#how" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            How it works
          </a>
          <Link href="/analyzer" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Check readiness
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <section className="mb-16">
          <h1 className="text-4xl font-semibold leading-tight mb-4 tracking-tight text-balance">
            Are you actually ready for this software job?
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Check your real job readiness for Backend, Full Stack, or Data roles — beyond just resumes. See where you
            stand and what to learn next.
          </p>
          <Link
            href="/analyzer"
            className="inline-block bg-primary text-primary-foreground px-7 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Check My Job Readiness
          </Link>
        </section>

        <section id="how" className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">How it works</h2>
          <div className="flex flex-col gap-8">
            <div className="flex gap-5 items-start">
              <span className="flex items-center justify-center w-9 h-9 bg-primary/15 text-primary rounded-lg font-semibold text-sm shrink-0">
                1
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1">Resume or job description</h3>
                <p className="text-muted-foreground">
                  Paste your resume or a job description you're targeting. No sign-up required.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <span className="flex items-center justify-center w-9 h-9 bg-primary/15 text-primary rounded-lg font-semibold text-sm shrink-0">
                2
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1">Pick your target role</h3>
                <p className="text-muted-foreground">
                  Choose Backend, Full Stack, or Data Engineer. We compare your profile to what's expected.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <span className="flex items-center justify-center w-9 h-9 bg-primary/15 text-primary rounded-lg font-semibold text-sm shrink-0">
                3
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1">Get your gaps and next steps</h3>
                <p className="text-muted-foreground">
                  See a readiness score, skill gaps by area, and how to close them with structured learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-12 border-t border-border">
          <p className="text-muted-foreground mb-4">Free. No sign-up. Takes under a minute.</p>
          <Link
            href="/analyzer"
            className="inline-block border-2 border-primary text-primary px-7 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
          >
            Check My Job Readiness
          </Link>
        </section>
      </main>

      <footer className="text-center py-8 text-muted-foreground text-sm">
        <p>Built to help job seekers see real skill gaps and take focused next steps.</p>
      </footer>
    </div>
  )
}
