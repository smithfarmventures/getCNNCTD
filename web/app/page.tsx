import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import LogoStrip from '@/components/LogoStrip'
import Ticker from '@/components/Ticker'
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
