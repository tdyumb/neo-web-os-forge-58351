import { Monitor, Palette, Info, HardDrive, Download, Upload, User, Mail, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

export const Settings = () => {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  const accentColors = [
    { name: "Purple", value: "purple", color: "hsl(250 100% 65%)" },
    { name: "Blue", value: "blue", color: "hsl(217 91% 60%)" },
    { name: "Green", value: "green", color: "hsl(142 76% 36%)" },
    { name: "Orange", value: "orange", color: "hsl(25 95% 53%)" },
    { name: "Pink", value: "pink", color: "hsl(330 81% 60%)" },
  ];

  const exportData = () => {
    const allData = {
      files: localStorage.getItem("neo-os-files"),
      windows: localStorage.getItem("neo-os-windows"),
      theme: localStorage.getItem("neo-theme"),
      accentColor: localStorage.getItem("neo-accent-color"),
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neo-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.files) localStorage.setItem("neo-os-files", data.files);
          if (data.windows) localStorage.setItem("neo-os-windows", data.windows);
          if (data.theme) localStorage.setItem("neo-theme", data.theme);
          if (data.accentColor) localStorage.setItem("neo-accent-color", data.accentColor);

          toast.success("Data imported successfully! Reloading...");
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          toast.error("Failed to import data. Invalid file format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const clearAllData = () => {
    localStorage.clear();
    toast.success("All data cleared! Reloading...");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* User Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your profile</h2>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-center gap-6">
              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-semibold shadow-lg shadow-orange-500/30">
                {localStorage.getItem("os-username")?.charAt(0).toUpperCase() || "U"}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {localStorage.getItem("os-username") || "User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">Local account</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">user@forge.local</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Administrator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Theme Mode</Label>
              <RadioGroup value={theme} onValueChange={(value) => setTheme(value as "dark" | "light" | "system")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="cursor-pointer">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="cursor-pointer">System</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Accent Color Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Accent Color</Label>
              <div className="grid grid-cols-5 gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      setAccentColor(color.value);
                      toast.success(`Accent color changed to ${color.name}`);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      accentColor === color.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Storage Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Storage</h2>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Backup & Restore</Label>
              <p className="text-sm text-muted-foreground">
                Export or import all your files, windows, and settings
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportData}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={importData}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-base font-medium">Clear All Data</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete all saved windows, settings, and app data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={clearAllData}
            >
              Clear All Data
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">About Forge</h2>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">Forge 1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engine</span>
              <span className="font-medium">React v18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build</span>
              <span className="font-medium">2024.01</span>
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-center text-muted-foreground">
              © 2024 Forge Operating System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
