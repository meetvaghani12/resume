import dynamic from 'next/dynamic';

// Dynamically import components with SSR disabled
const AboutSection = dynamic(() => import("./components/homepage/about"), {
  ssr: false
});
const ContactSection = dynamic(() => import("./components/homepage/contact"), {
  ssr: false
});
const Education = dynamic(() => import("./components/homepage/education"), {
  ssr: false
});
const Experience = dynamic(() => import("./components/homepage/experience"), {
  ssr: false
});
const HeroSection = dynamic(() => import("./components/homepage/hero-section"), {
  ssr: false
});
const Projects = dynamic(() => import("./components/homepage/projects"), {
  ssr: false
});
const Skills = dynamic(() => import("./components/homepage/skills"), {
  ssr: false
});

export default function Home() {
  return (
    <div suppressHydrationWarning>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <ContactSection />
    </div>
  );
}