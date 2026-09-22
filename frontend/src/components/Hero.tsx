import { Coffee } from 'lucide-react';

export function Hero() {
  return (
    <section className="text-center py-12 md:py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 mb-6">
        <Coffee className="w-10 h-10 text-primary-600" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
        Buy Me a Coffee
      </h1>

      <p className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed mb-3">
        Your support helps me keep building AI projects, experimenting with new
        technologies, and sharing what I learn.
      </p>

      <p className="text-sm text-text-muted">
        Even ₹1 helps fuel the next project. ❤️
      </p>
    </section>
  );
}
