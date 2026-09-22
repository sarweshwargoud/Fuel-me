import { Bot, Code, Rocket } from 'lucide-react';

const REASONS = [
  {
    icon: Bot,
    title: 'AI Projects',
    description: 'Building practical AI applications that solve real problems.',
  },
  {
    icon: Code,
    title: 'Open Source',
    description: 'Experimenting and sharing projects with the community.',
  },
  {
    icon: Rocket,
    title: 'Keep Building',
    description: 'Your support helps fund future projects and experiments.',
  },
];

export function WhySupport() {
  return (
    <section className="py-12 md:py-16">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
        Why Support? 🤔
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {REASONS.map((reason) => (
          <div
            key={reason.title}
            className="
              bg-bg-card rounded-2xl p-6 border border-warm-100
              shadow-sm hover:shadow-md hover:border-primary-200
              transition-all duration-300
            "
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 mb-4">
              <reason.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1.5">
              {reason.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
