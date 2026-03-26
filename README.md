diff --git a/README.md b/README.md
index 640380bf57a36f95c05484b10dbae552fde2a22f..2e8068658464335eaee57393449f8757f4dbc259 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,57 @@
-# Organigram-HR-IT
\ No newline at end of file
+# Organigram-HR-IT
+
+## Ziel (Variante 1)
+
+Diese Version ist für **lokale Nutzung auf Android** ausgelegt:
+
+- App läuft als statische Website (GitHub Pages)
+- Einträge werden **lokal im Browser** gespeichert (`localStorage`)
+- Optional als **PWA** installierbar (Startbildschirm)
+- **Keine Cloud-Synchronisierung** in dieser Variante
+
+## GitHub Pages Setup
+
+Das Repository ist für statisches Hosting über GitHub Pages vorbereitet.
+
+1. Repository öffnen.
+2. **Settings → Pages**.
+3. Unter **Build and deployment** als **Source**: **GitHub Actions** auswählen.
+4. Änderungen auf `main` pushen.
+5. Nach erfolgreichem Workflow ist die Seite unter
+   `https://<org-oder-user>.github.io/Organigram-HR-IT/` erreichbar.
+
+Workflow-Datei: `.github/workflows/pages.yml`.
+
+## Speicherverhalten
+
+### Wird gespeichert?
+
+Ja. Einträge werden unter dem Key `organigram_hr_it_entries_v1` in `localStorage` gespeichert.
+
+### Wo wird gespeichert?
+
+- Lokal auf dem Gerät in der Browser-Sandbox
+- Bei Android z. B. im Speicher von Chrome/Firefox
+
+### Temporär oder persistent?
+
+- Persistent zwischen Browser-/Geräteneustarts
+- Daten bleiben erhalten, bis Browserdaten gelöscht werden oder „Alle löschen“ in der App gedrückt wird
+
+## PWA-Status (für Android)
+
+Enthalten:
+
+- `manifest.webmanifest`
+- `sw.js` (Service Worker mit einfachem Offline-Caching)
+- App-Icons (`icon-192.svg`, `icon-512.svg`)
+
+Installation auf Android (Chrome):
+
+1. URL öffnen
+2. Browser-Menü → **Zum Startbildschirm hinzufügen** / **App installieren**
+3. App startet danach im Standalone-Modus
+
+## Nächster Schritt (optional, später)
+
+Wenn Cloud-Sync gewünscht ist (z. B. Google Sheets), ergänzen wir in einem nächsten Schritt ein sicheres Backend (Function/API), damit keine Zugangsdaten im Frontend liegen.
