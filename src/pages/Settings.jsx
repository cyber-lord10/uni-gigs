import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { Bell, Lock, Eye, Globe, Moon } from "lucide-react";

export default function Settings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    publicProfile: true,
    darkMode: true,
  });

  function handleToggle(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast("Settings saved", "success");
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-lg">Settings</h1>

      <div className="card space-y-lg">
        <section>
          <h2 className="text-lg font-semibold mb-md flex items-center gap-sm">
            <Bell size={20} /> Notifications
          </h2>
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted">
                  Receive emails about new gigs
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="toggle"
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted">
                  Receive push notifications on your device
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={() => handleToggle("pushNotifications")}
                className="toggle"
              />
            </div>
          </div>
        </section>

        <hr className="border-[var(--color-border)]" />

        <section>
          <h2 className="text-lg font-semibold mb-md flex items-center gap-sm">
            <Lock size={20} /> Privacy
          </h2>
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-muted">
                  Allow others to see your profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.publicProfile}
                onChange={() => handleToggle("publicProfile")}
                className="toggle"
              />
            </div>
          </div>
        </section>

        <hr className="border-[var(--color-border)]" />

        <section>
          <h2 className="text-lg font-semibold mb-md flex items-center gap-sm">
            <Eye size={20} /> Appearance
          </h2>
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted">Toggle dark theme</p>
              </div>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
                className="toggle"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
