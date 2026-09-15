import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.healthypetchecker",
  appName: "Healthy Pet Checker",
  // Static client build produced by `npm run build` (see ANDROID.md).
  webDir: "dist/client",
  android: {
    backgroundColor: "#f4f7f5",
  },
};

export default config;
