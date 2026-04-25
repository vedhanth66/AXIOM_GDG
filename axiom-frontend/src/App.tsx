import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { UploadPortal } from './components/UploadPortal';
import { AuditPulse } from './components/AuditPulse';
import { BiasTopologyMap } from './components/BiasTopologyMap';
import { VerdictDashboard } from './components/VerdictDashboard';
import { RemediationLab } from './components/RemediationLab';

type AppState = 'upload' | 'pulse' | 'map' | 'verdict' | 'lab';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [sessionId, setSessionId] = useState('');
  const [auditData, setAuditData] = useState<any>(null);

  const handleStartAudit = async (domain: string) => {
    try {
      const formData = new FormData();
      formData.append("domain", domain);

      const res = await fetch("http://localhost:8000/api/audit/start", {
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
    // Auto-transition to the Map, the WOW moment
    setAppState('map');
  };

  return (
    <div className="min-h-screen bg-axiom-bg text-white overflow-hidden selection:bg-purple-500/30">
      <AnimatePresence mode="wait">

        {appState === 'upload' && (
          <UploadPortal key="upload" onStart={handleStartAudit} />
        )}

        {appState === 'pulse' && (
          <AuditPulse key="pulse" sessionId={sessionId} onComplete={handleAuditComplete} />
        )}

        {appState === 'map' && (
          <div key="map" className="h-screen w-screen p-8 flex flex-col relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/10 via-axiom-bg to-axiom-bg pointer-events-none" />
            <div className="flex-1 max-w-[1600px] w-full mx-auto relative z-10">
              <BiasTopologyMap topologyData={auditData.topology_data} />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => setAppState('verdict')}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all"
                >
                  View Executive Verdict
                </button>
              </div>
            </div>
          </div>
        )}

        {appState === 'verdict' && (
          <VerdictDashboard key="verdict" data={auditData} onNext={() => setAppState('lab')} />
        )}

        {appState === 'lab' && (
          <RemediationLab key="lab" explanation={auditData.explanation} />
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;
