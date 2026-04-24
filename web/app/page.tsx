import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import LogoStrip from '@/components/LogoStrip'
import Ticker from '@/components/Ticker'
import Problem from '@/components/Problem'
import HowItWorks from '@/components/HowItWorks'
import WhoItsFor from '@/components/WhoItsFor'
import Manifesto from '@/components/Manifesto'
import JoinSection from '@/components/JoinSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <LogoStrip />
        <Ticker />
        <HowItWorks />
        <WhoItsFor />
        <Manifesto />
        <JoinSection />
      </main>
      <Footer />
    </>
  )
}
