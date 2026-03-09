import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [installable, setInstallable] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setInstallable(false);
    setDeferred(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setInstallable(false);
  };

  if (!installable || dismissed) return null;

  return (
    <div className="install-prompt">
      <p>Instala la agenda en tu móvil para acceder rápido.</p>
      <div className="install-prompt-actions">
        <button type="button" onClick={handleInstall}>Instalar</button>
        <button type="button" onClick={handleDismiss} className="secondary">Ahora no</button>
      </div>
    </div>
  );
}
