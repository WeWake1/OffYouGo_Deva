import { useEffect } from 'react';
import content from './config/content';
import { Sky } from './components/Sky';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { TimeApart } from './components/TimeApart';
import { Memories } from './components/Memories';
import { OpenWhen } from './components/OpenWhen';
import { Music } from './components/Music';
import { Letter } from './components/Letter';
import { MarblesGame } from './components/MarblesGame';
import { Footer } from './components/Footer';

/**
 * Page shell. The fixed <Sky> sits behind everything; all readable content lives
 * in <main> above it. The `grain` + `vignette` classes layer texture over the
 * whole page (see index.css). Section order follows the emotional arc:
 *   send-off → the countdown → the days apart → what we already shared → notes → a song → the letter.
 */
export function App() {
  useEffect(() => {
    document.title = content.siteTitle;
  }, []);

  return (
    <div className="relative grain vignette">
      <Sky />
      <main className="relative z-10">
        <Hero />
        <Countdown />
        <TimeApart />
        <Memories />
        <OpenWhen />
        <Music />
        <Letter />
        <MarblesGame />
        <Footer />
      </main>
    </div>
  );
}

export default App;
