import { useState, useEffect, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadPortal } from './components/UploadPortal';
import { AuditPulse } from './components/AuditPulse';
import { BiasTopologyMap } from './components/BiasTopologyMap';
import { VerdictDashboard } from './components/VerdictDashboard';
import { RemediationLab } from './components/RemediationLab';
import { Sun, Moon } from 'lucide-react';

type AppState = 'upload' | 'pulse' | 'map' | 'verdict' | 'lab';
type Theme = 'dark' | 'light';

export const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [sessionId, setSessionId] = useState('');
  const [auditData, setAuditData] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartAudit = async (domain: string) => {
    try {
      const formData = new FormData();
      formData.append("domain", domain);
      const res = await fetch("/api/audit/start", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setAppState('pulse');
    } catch (e) {
      console.error("Failed to start audit", e);
      alert("Backend is not running! Please start the FastAPI server.");
    }
  };

  const handleAuditComplete = (data: any) => {
    setAuditData(data);
    setAppState('map');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-axiom-bg text-text-primary overflow-hidden selection:bg-iris/20 selection:text-iris relative">
        <div className="dot-grid" />

        <motion.button
          onClick={toggleTheme}
          className="fixed top-5 right-5 z-100 p-3 rounded-full border backdrop-blur-md"
          style={{
            background: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-sand" />
          ) : (
            <Moon className="w-4 h-4 text-iris" />
          )}
        </motion.button>

        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <UploadPortal key="upload" onStart={handleStartAudit} />
          )}

          {appState === 'pulse' && (
            <AuditPulse key="pulse" sessionId={sessionId} onComplete={handleAuditComplete} />
          )}

          {appState === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-screen w-screen p-8 flex flex-col relative"
            >
              <div className="flex-1 max-w-[1600px] w-full mx-auto relative z-10">
                <BiasTopologyMap topologyData={auditData.topology_data} />
                <motion.div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    onClick={() => setAppState('verdict')}
                    className="px-8 py-3 rounded-full font-medium tracking-wide"
                    style={{
                      background: 'var(--theme-cta-bg)',
                      color: 'var(--theme-cta-text)',
                    }}
                    whileHover={{ scale: 1.05, background: 'var(--theme-cta-hover)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Executive Verdict
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {appState === 'verdict' && (
            <VerdictDashboard key="verdict" data={auditData} onNext={() => setAppState('lab')} />
          )}

          {appState === 'lab' && (
            <RemediationLab key="lab" explanation={auditData.explanation} />
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
