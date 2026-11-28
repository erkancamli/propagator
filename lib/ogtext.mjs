// Share images are drawn in a headless browser that has Geist, the emoji font and two maths fonts, but not every
// decorative script members use in their Discord names. Maths letters (𝕻𝖆, 𝓜𝓲𝓷𝓪) fall back to the maths fonts;
// hieroglyph brackets and other ornaments with no font are left out of the picture only, never out of the register.
export const OG_FONTS = `:root{--sans:Geist,'DejaVu Math TeX Gyre','Latin Modern Math','Noto Color Emoji',sans-serif}`;
export const ogName = (name) => String(name).replace(/[\u{13000}-\u{1345F}\u{A9C1}\u{A9C2}\u{09D7}\u{09E3}]/gu, '').replace(/\s+/g, ' ').trim() || String(name);
export const ogMember = (m) => ({ ...m, name: ogName(m.name) });
