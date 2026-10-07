"""Generate public/og-image.png, the Open Graph share card.

Run from the `web` directory, after any change to the brand palette or the
headline copy:

    python scripts/make-og-image.py

Requires Pillow and the Segoe UI fonts shipped with Windows. Colors and the
grid overlay are copied from tailwind.config.js and app/globals.css so the card
matches the PageHero banner exactly; keep them in sync by hand if the palette
moves. The output must stay 1200x630 — that is what every scraper expects, and
`OG_IMAGE` in lib/site.ts declares those dimensions to Next.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
PAD = 80

# tailwind.config.js -> theme.extend.colors.primary
FROM = (0x0b, 0x6c, 0x79)   # primary.gradientFrom
VIA = (0x0e, 0x8a, 0x9d)    # primary.DEFAULT
TO = (0x1a, 0xa4, 0xb4)     # primary.gradientTo

FONT_DIR = "C:/Windows/Fonts/"
bold = lambda s: ImageFont.truetype(FONT_DIR + "segoeuib.ttf", s)
light = lambda s: ImageFont.truetype(FONT_DIR + "segoeui.ttf", s)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# --- diagonal gradient (bg-gradient-to-br: from -> via -> to) ---
base = Image.new("RGB", (W, H))
px = base.load()
for y in range(H):
    for x in range(W):
        t = (x / W + y / H) / 2
        px[x, y] = lerp(FROM, VIA, t * 2) if t < 0.5 else lerp(VIA, TO, (t - 0.5) * 2)

# --- soft light blooms, mirroring the hero's blurred circles ---
bloom = Image.new("L", (W, H), 0)
bd = ImageDraw.Draw(bloom)
bd.ellipse([W * 0.10, H * 0.05, W * 0.10 + 380, H * 0.05 + 380], fill=46)
bd.ellipse([W * 0.68, H * 0.48, W * 0.68 + 300, H * 0.48 + 300], fill=38)
bloom = bloom.filter(ImageFilter.GaussianBlur(110))
base = Image.composite(Image.new("RGB", (W, H), (255, 255, 255)), base, bloom)

# --- grid overlay: rgba(255,255,255,0.06) every 60px (app/globals.css) ---
grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(grid)
for x in range(0, W, 60):
    gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 15))
for y in range(0, H, 60):
    gd.line([(0, y), (W, y)], fill=(255, 255, 255, 15))
img = Image.alpha_composite(base.convert("RGBA"), grid)
d = ImageDraw.Draw(img)

# --- logo ---
logo = Image.open("public/logo.png").convert("RGBA").resize((92, 92), Image.LANCZOS)
img.paste(logo, (PAD, 66), logo)

# Single-line wordmark, vertically centred on the 92px logo (66..158). The product
# was renamed from "SQL Performance Intelligence" on 2026-10-04.
d.text((PAD + 116, 112), "SQLPerformance AI", font=bold(40), fill=(255, 255, 255, 240), anchor="lm")

# --- headline ---
d.text((PAD, 258), "Read-only, local-first", font=bold(72), fill=(255, 255, 255, 255))
d.text((PAD, 340), "SQL Server investigation", font=bold(72), fill=(255, 255, 255, 255))

# --- supporting line ---
d.text(
    (PAD, 452),
    "Find the root cause of SQL Server performance problems. Cloud AI is optional.",
    font=light(29),
    fill=(255, 255, 255, 220),
)

# --- footer rule + domain ---
d.line([(PAD, 528), (W - PAD, 528)], fill=(255, 255, 255, 60), width=1)
d.text((PAD, 549), "sqlperformance.ai", font=bold(27), fill=(255, 255, 255, 240))
d.text((W - PAD - 224, 552), "Windows 10 / 11", font=light(24), fill=(255, 255, 255, 190))

img.convert("RGB").save("public/og-image.png", format="PNG", optimize=True)
print("written public/og-image.png", img.size)
