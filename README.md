# Anastasia Kh. - Personal Landing Page & Art Showcase 🎨✨

A bespoke, artist-grade personal landing page and mini-portfolio designed to replace Linktree for **Anastasia Kh.** (`@anastasia.kh.artist`).

Built with clean, ultra-fast vanilla HTML5, CSS3, and JavaScript — zero dependencies, zero build steps, and ready to host anywhere for free.

---

## 🌟 Key Features

1. **Atelier & Paper Design Aesthetic**:
   - Editorial typography using *Cormorant Garamond* and *Plus Jakarta Sans*.
   - Fine-art paper backdrop tones, delicate ambient gradients, and refined shadows.
   - Built-in **Light / Dark Mode** toggle (Paper Atelier vs. Night Gallery Exhibition).

2. **"Link-in-Bio" Action Hub (Linktree Alternative)**:
   - 🎁 **Free Downloads & Goodies** (`https://gum.co/u/evhvz7ht`) — prominent gold-accented callout.
   - 🛍️ **Gumroad Art Shop** (`https://anastasiakhartist.gumroad.com/`) — brush packs, textures & prints.
   - 🎨 **Cara Portfolio** (`https://cara.app/anastasiakh`) — full digital illustration portfolio.
   - 🎥 **YouTube Channel** (`https://www.youtube.com/@anastasiakhart`) — speedpaints & drawing tutorials.
   - 📸 **Instagram** (`https://www.instagram.com/an.kh.arts`) — daily works in progress & community.
   - 📌 **Pinterest** (`https://www.pinterest.com/anastasiakhartist/`) — inspiration boards & color palettes.

3. **Interactive Art Gallery with Lightbox**:
   - 4 featured artworks (`Art1.jpg`, `ARt2.jpg`, `Art3.jpg`, `Art4.jpg`) with titles and medium descriptions.
   - Click to open a full-screen Lightbox modal with:
     - Keyboard navigation (`←` / `→` arrows, `Esc` to close).
     - Touch swipe support for mobile visitors.
     - Smooth zoom and image preloading.

4. **Behind the Scenes / Artist Studio**:
   - Editorial showcase of Anastasia’s workspace and tools (`Photo1.jpg` & `Photo2.jpg`).
   - Artist statement highlighting digital watercolor and Procreate craftsmanship.

5. **Direct Inquiries & Licensing**:
   - Contact call-to-action for commercial licensing, commissions, and book illustrations.

---

## 🚀 How to Run the Local Web Server

### Option 1: Double-Click Launcher (Windows)
Just double-click **`start_server.bat`** in `D:\Anastasia website`.
It will start the server and automatically launch your browser to `http://localhost:8000`!

### Option 2: Python Command
Run in your terminal:
```bash
python server.py
```
*(Use `python server.py --no-browser` if you don't want it to automatically launch the browser, or `python server.py --port 3000` for a custom port).*

### Option 3: Direct File
You can also directly double-click `index.html` to view it locally in any web browser without a server.

---

## 🌐 Free Hosting & Deployment Options

You can host this website completely free with a custom domain or free subdomain:

### Option A: GitHub Pages (Recommended)
1. Push this folder to a GitHub repository (e.g. `anastasiakh-links`).
2. In GitHub, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and `/root`, then click **Save**.
4. Your site will be live at `https://<username>.github.io/anastasiakh-links/` or your custom domain!

### Option B: Netlify Drop (Instant 30-Second Drag-and-Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the entire `D:\Anastasia website` folder.
3. Your site will be live immediately with free HTTPS and a custom domain option.

### Option C: Cloudflare Pages or Vercel
Connect your GitHub repository to Cloudflare Pages or Vercel with zero configuration required.

---

## 📁 File Structure

```
D:\Anastasia website\
├── index.html       # Semantic layout, meta tags, and structured content
├── style.css        # Responsive styling, light/dark themes, animations
├── app.js           # Lightbox modal, theme switcher, keyboard/touch support
├── server.py        # Local web server with auto-port and UTF-8 support
├── start_server.bat # Double-click launcher for Windows
├── README.md        # Documentation and deployment guide
├── avatar.jpg       # Optimized anti-aliased profile avatar
├── Photo1.jpg       # Artist studio portrait (iPad & drawing glove)
├── Photo2.jpg       # Artist portrait (sketchbook & pens)
├── Photo3.jpg       # Original artist portrait
├── Art1.jpg         # "Borscht Case Scenario"
├── ARt2.jpg         # "Crab Claw & Blue Rose"
├── Art3.jpg         # "Monstera in Pink"
└── Art4.jpg         # "Stacked Teacups"
```
