import { User } from 'lucide-react';

export function AboutMe() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warm-100 mb-5">
          <User className="w-8 h-8 text-warm-600" />
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-3">
          About Me 👋
        </h2>

        <p className="text-text-secondary leading-relaxed">
          I'm <span className="font-semibold text-text-primary">Sarweshwar</span>, a final-year
          Computer Science student focused on AI/ML and full-stack development.
          I build projects to learn, experiment, and solve real-world problems.
        </p>

        <p className="text-sm text-text-muted mt-4">
          Every coffee helps me dedicate more time to building and sharing. Thank you! 🙏
        </p>
      </div>
    </section>
  );
}
