import sharp from "sharp";

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f1e30"/>
      <stop offset="100%" style="stop-color:#162c48"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#5393d7"/>
      <stop offset="100%" style="stop-color:#fbbf24"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative blurred circles -->
  <circle cx="950" cy="150" r="200" fill="#1e3a5f" opacity="0.5"/>
  <circle cx="200" cy="500" r="160" fill="#f59e0b" opacity="0.08"/>

  <!-- Dot grid pattern -->
  <g fill="#5393d7" opacity="0.15">
    <circle cx="900" cy="80" r="4"/>
    <circle cx="940" cy="80" r="4"/>
    <circle cx="980" cy="80" r="4"/>
    <circle cx="1020" cy="80" r="4"/>
    <circle cx="1060" cy="80" r="4"/>
    <circle cx="900" cy="120" r="4"/>
    <circle cx="940" cy="120" r="4"/>
    <circle cx="980" cy="120" r="4"/>
    <circle cx="1020" cy="120" r="4"/>
    <circle cx="1060" cy="120" r="4"/>
    <circle cx="900" cy="160" r="4"/>
    <circle cx="940" cy="160" r="4"/>
    <circle cx="980" cy="160" r="4"/>
    <circle cx="1020" cy="160" r="4"/>
    <circle cx="1060" cy="160" r="4"/>
    <circle cx="900" cy="200" r="4"/>
    <circle cx="940" cy="200" r="4"/>
    <circle cx="980" cy="200" r="4"/>
    <circle cx="1020" cy="200" r="4"/>
    <circle cx="1060" cy="200" r="4"/>
  </g>

  <!-- Accent line at top -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>

  <!-- Company name -->
  <text x="100" y="270" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="700" fill="white">
    Bollenstreek Digitaal
  </text>

  <!-- Tagline -->
  <text x="100" y="340" font-family="Inter, system-ui, sans-serif" font-size="32" fill="#a9c9eb">
    Slimmer ondernemen met AI
  </text>

  <!-- Divider line -->
  <rect x="100" y="380" width="80" height="4" rx="2" fill="#fbbf24"/>

  <!-- Description -->
  <text x="100" y="430" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#7eaee1">
    AI-advies, digitale transformatie en webontwikkeling
  </text>
  <text x="100" y="465" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#7eaee1">
    voor MKB-bedrijven in de Duin- en Bollenstreek
  </text>

  <!-- Location -->
  <g transform="translate(100, 530)">
    <circle cx="8" cy="-5" r="4" fill="#fbbf24"/>
    <text x="20" y="0" font-family="Inter, system-ui, sans-serif" font-size="18" fill="#5393d7">
      Noordwijk · Katwijk · Leiden · Lisse · Hillegom
    </text>
  </g>

  <!-- URL -->
  <text x="1100" y="590" font-family="Inter, system-ui, sans-serif" font-size="18" fill="#5393d7" text-anchor="end">
    bollenstreekdigitaal.nl
  </text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png()
  .toFile("public/og-default.png");

console.log("Created public/og-default.png (1200x630)");
