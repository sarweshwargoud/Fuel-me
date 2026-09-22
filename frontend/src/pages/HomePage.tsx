import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { DonationCard } from '../components/DonationCard';
import { WhySupport } from '../components/WhySupport';
import { RecentSupporters } from '../components/RecentSupporters';
import { AboutMe } from '../components/AboutMe';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <Layout>
      <Hero />
      <DonationCard />
      <WhySupport />
      <RecentSupporters />
      <AboutMe />
      <Footer />
    </Layout>
  );
}
