"""
Generate the repository social preview (1280x630) for dsh-solids-world.

    python scripts/make-social-preview.py

Rendered at 2x and downsampled so text and glow stay crisp. The art direction
follows the atlas itself: a "physics lecture hall" palette, an isometric NaCl
lattice bleeding off the right edge, and thin orbital rings behind the type.
"""

import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "social-preview.png")

W, H = 1280, 630
S = 2
CW, CH = W * S, H * S

FONT = r"C:\Windows\Fonts"

INK = (7, 19, 24)
INK_2 = (18, 48, 56)
TEAL = (95, 216, 200)
TEAL_BRIGHT = (140, 238, 224)
TEAL_DIM = (111, 227, 210)
AMBER = (242, 179, 76)
MUTED = (168, 192, 200)
FAINT = (109, 133, 143)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT, name), size)


def vgradient(size, top, bottom, diagonal=0.35):
    w, h = size
    ys = np.linspace(0.0, 1.0, h)[:, None]
    xs = np.linspace(0.0, 1.0, w)[None, :]
    t = np.clip(ys * (1 - diagonal) + (ys * 0.5 + xs * 0.5) * diagonal, 0, 1)
    out = np.zeros((h, w, 3), dtype=np.float32)
    for i in range(3):
        out[:, :, i] = top[i] + (bottom[i] - top[i]) * t
    return Image.fromarray(out.astype(np.uint8), "RGB")


def radial_layer(size, center, radius, color, strength=1.0, power=2.0):
    """Additive radial glow as an RGB image."""
    w, h = size
    ys = np.arange(h, dtype=np.float32)[:, None] - center[1]
    xs = np.arange(w, dtype=np.float32)[None, :] - center[0]
    d = np.sqrt(xs * xs + ys * ys) / max(radius, 1.0)
    falloff = np.clip(1.0 - d, 0, 1) ** power * strength
    out = np.zeros((h, w, 3), dtype=np.float32)
    for i in range(3):
        out[:, :, i] = color[i] * falloff
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


def add(base, layer):
    return Image.fromarray(
        np.clip(
            np.asarray(base, dtype=np.int16) + np.asarray(layer, dtype=np.int16), 0, 255
        ).astype(np.uint8),
        "RGB",
    )


def screen(base, layer, opacity=1.0):
    b = np.asarray(base, dtype=np.float32) / 255.0
    l = np.asarray(layer, dtype=np.float32) / 255.0 * opacity
    out = 1.0 - (1.0 - b) * (1.0 - l)
    return Image.fromarray((out * 255).astype(np.uint8), "RGB")


def text_tracked(draw, xy, text, fnt, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def tracked_width(draw, text, fnt, tracking=0):
    return sum(draw.textlength(ch, font=fnt) for ch in text) + tracking * max(len(text) - 1, 0)


def sphere_sprite(radius, color, light=(-0.45, -0.62, 0.65), rim=0.32):
    """Shaded sphere with a soft edge and a rim light, as an RGBA image."""
    r = int(radius)
    size = r * 2 + 2
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    cx = cy = size / 2.0
    nx = (xx - cx) / r
    ny = (yy - cy) / r
    d2 = nx * nx + ny * ny
    mask = d2 <= 1.0
    nz = np.sqrt(np.clip(1.0 - d2, 0, 1))

    lx, ly, lz = light
    ln = math.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / ln, ly / ln, lz / ln
    diff = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)

    # Rim brightening near the silhouette.
    edge = np.clip((np.sqrt(np.clip(d2, 0, 1)) - 0.72) / 0.28, 0, 1) ** 1.6

    # Occlusion at the silhouette keeps densely packed spheres readable.
    shade = (0.12 + 1.02 * diff ** 1.25) * (1.0 - 0.55 * edge ** 1.8)
    rgb = np.zeros((size, size, 3), dtype=np.float32)
    for i in range(3):
        base = color[i] / 255.0
        rgb[:, :, i] = base * shade + edge ** 2.4 * rim * base * 0.55

    # Specular highlight.
    spec = np.clip(diff, 0, 1) ** 26
    rgb = rgb + spec[:, :, None] * 0.55

    alpha = mask.astype(np.float32) * 255.0
    alpha = np.where(mask, alpha, 0)
    rgba = np.dstack([np.clip(rgb, 0, 1) * 255.0, alpha]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def draw_lattice(base, center, spacing, radii):
    """Isometric NaCl lattice, depth sorted, bonds first then atoms with glow."""
    base = base.convert("RGBA")
    cx, cy = center
    cos30 = math.cos(math.radians(30))
    sin30 = math.sin(math.radians(30))

    nodes = []
    for gx in (-1, 0, 1):
        for gy in (-1, 0, 1):
            for gz in (-1, 0, 1):
                px = cx + (gx - gz) * cos30 * spacing
                py = cy - gy * spacing + (gx + gz) * sin30 * spacing
                kind = (gx + gy + gz) % 2
                nodes.append({"gx": gx, "gy": gy, "gz": gz, "x": px, "y": py, "kind": kind})

    index = {(n["gx"], n["gy"], n["gz"]): n for n in nodes}

    bond_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bond_layer)
    for n in nodes:
        for step in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
            other = index.get((n["gx"] + step[0], n["gy"] + step[1], n["gz"] + step[2]))
            if not other:
                continue
            color = (126, 176, 186)
            bdraw.line(
                [(n["x"], n["y"]), (other["x"], other["y"])],
                fill=color + (86,),
                width=max(2, int(spacing * 0.018)),
            )
    bond_glow = bond_layer.filter(ImageFilter.GaussianBlur(spacing * 0.035))
    base = Image.alpha_composite(base, bond_glow)
    base = Image.alpha_composite(base, bond_layer)

    # Unit cell wireframe: the conventional cell around the centre atoms, drawn
    # brighter than the bonds so the crystal reads as a lattice, not a molecule.
    cell_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(cell_layer)
    corners = {}
    for sx in (-0.5, 0.5):
        for sy in (-0.5, 0.5):
            for sz in (-0.5, 0.5):
                cx_ = cx + (sx - sz) * cos30 * spacing
                cy_ = cy - sy * spacing + (sx + sz) * sin30 * spacing
                corners[(sx, sy, sz)] = (cx_, cy_)
    edges = []
    for key in corners:
        for axis in range(3):
            other = list(key)
            other[axis] = -other[axis]
            other = tuple(other)
            if other in corners:
                edges.append((corners[key], corners[other]))
    for a, b in edges:
        cd.line([a, b], fill=TEAL_BRIGHT + (105,), width=max(1, int(spacing * 0.009)))

    glow_layer = Image.new("RGB", base.size, (0, 0, 0))
    atom_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    nodes_sorted = sorted(nodes, key=lambda n: (n["gx"] + n["gy"] + n["gz"]))
    for n in nodes_sorted:
        depth = (n["gx"] + n["gy"] + n["gz"] + 3) / 6.0  # 0 far .. 1 near
        r = radii[n["kind"]] * (0.86 + 0.18 * depth)
        color = TEAL if n["kind"] == 0 else AMBER
        sprite = sphere_sprite(r, color)
        pos = (int(n["x"] - sprite.width / 2), int(n["y"] - sprite.height / 2))
        atom_layer.alpha_composite(sprite, pos)
        halo = sphere_sprite(r * 1.16, color).filter(ImageFilter.GaussianBlur(r * 0.34))
        glow_layer.paste(Image.new("RGB", halo.size, color), pos, halo)

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(26))
    base = screen(base.convert("RGB"), glow_layer, 0.55).convert("RGBA")
    cell_glow = cell_layer.filter(ImageFilter.GaussianBlur(spacing * 0.045))
    base = screen(base.convert("RGB"), cell_glow.convert("RGB"), 0.9).convert("RGBA")
    base = Image.alpha_composite(base, atom_layer)
    base = Image.alpha_composite(base, cell_layer).convert("RGB")
    return base


def orbital_rings(size, center, rings):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for (rx, ry, angle, alpha, width) in rings:
        box = [center[0] - rx, center[1] - ry, center[0] + rx, center[1] + ry]
        d.ellipse(box, outline=TEAL_BRIGHT + (alpha,), width=width)
        layer = layer.rotate(angle, center=center, resample=Image.BICUBIC)
    return layer


def main():
    random.seed(7)
    base = vgradient((CW, CH), INK, INK_2, diagonal=0.45)

    # Ambient light pools.
    base = add(base, radial_layer((CW, CH), (int(CW * 0.70), int(CH * 0.44)), int(CW * 0.52), (18, 74, 74), 1.0, 2.1))
    base = add(base, radial_layer((CW, CH), (int(CW * 0.16), int(CH * 0.92)), int(CW * 0.42), (24, 52, 58), 0.9, 2.4))

    # Blueprint grid.
    grid = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = 48 * S
    for x in range(0, CW, step):
        gd.line([(x, 0), (x, CH)], fill=TEAL + (10,), width=1)
    for y in range(0, CH, step):
        gd.line([(0, y), (CW, y)], fill=TEAL + (10,), width=1)
    for x in range(0, CW, step * 4):
        gd.line([(x, 0), (x, CH)], fill=TEAL + (18,), width=1)
    for y in range(0, CH, step * 4):
        gd.line([(0, y), (CW, y)], fill=TEAL + (18,), width=1)
    base = Image.alpha_composite(base.convert("RGBA"), grid).convert("RGB")

    lattice_center = (int(CW * 0.795), int(CH * 0.505))
    rings = orbital_rings(
        (CW, CH),
        (int(CW * 0.24), int(CH * 0.78)),
        [
            (int(CW * 0.19), int(CH * 0.34), -18, 26, 2),
            (int(CW * 0.14), int(CH * 0.22), 34, 18, 2),
            (int(CW * 0.25), int(CH * 0.46), 74, 12, 2),
        ],
    )
    ring_glow = rings.filter(ImageFilter.GaussianBlur(9 * S))
    base = screen(base, ring_glow.convert("RGB"), 0.85)
    base = Image.alpha_composite(base.convert("RGBA"), rings).convert("RGB")

    spacing = int(118 * S)
    base = draw_lattice(base, lattice_center, spacing, {0: 47 * S, 1: 51 * S})

    # Soft horizontal fade toward the right edge so the lattice dissolves instead
    # of ending on a hard crop.
    fade = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fade)
    fade_from = int(CW * 0.80)
    for x in range(fade_from, CW):
        t = (x - fade_from) / max(CW - fade_from, 1)
        fd.line([(x, 0), (x, CH)], fill=INK + (int(150 * t ** 1.6),))
    base = Image.alpha_composite(base.convert("RGBA"), fade).convert("RGB")

    # ---- typography -------------------------------------------------------
    left = int(CW * 0.062)
    text_layer = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    td = ImageDraw.Draw(text_layer)

    f_kicker = font("consola.ttf", 13 * S)
    f_title = font("msyhbd.ttc", 72 * S)
    f_en = font("segoeuib.ttf", 23 * S)
    f_desc = font("msyh.ttc", 14 * S)
    f_chip = font("msyh.ttc", 12 * S)
    f_foot = font("consola.ttf", 11 * S)

    y = int(CH * 0.15)
    text_tracked(td, (left, y), "DEEPSEEK HARNESS PLUGIN", f_kicker, TEAL_DIM + (235,), 5.2 * S)

    y += int(34 * S)
    title = "固体世界"
    td.text((left - 2 * S, y - 6 * S), title, font=f_title, fill=(240, 252, 252, 255))
    y += int(86 * S)

    en_text = "SOLIDS WORLD"
    x = text_tracked(td, (left, y), en_text, f_en, TEAL_BRIGHT + (245,), 9.5 * S)
    td.line([(left, y + 34 * S), (min(x, left + 250 * S), y + 34 * S)], fill=TEAL + (110,), width=max(1, S))

    y += int(54 * S)
    desc = "布拉维格子 · 原子轨道 · 对称操作 · 晶格振动"
    td.text((left, y), desc, font=f_desc, fill=MUTED + (240,))

    # Chips.
    chips = ["53 个图鉴条目", "5 大板块", "CIF 导入", "完全离线"]
    y += int(40 * S)
    cx = left
    for label in chips:
        w = td.textlength(label, font=f_chip)
        pad_x, h = 11 * S, 26 * S
        box = [cx, y, cx + w + pad_x * 2, y + h]
        td.rounded_rectangle(box, radius=h // 2, fill=TEAL + (26,), outline=TEAL + (110,), width=max(1, S))
        td.text((cx + pad_x, y + (h - 12 * S * 1.32) / 2), label, font=f_chip, fill=(208, 240, 238, 250))
        cx += w + pad_x * 2 + 8 * S

    # Footer.
    fy = int(CH * 0.865)
    td.text((left, fy), "github.com/nashihang777/dsh-solids-world", font=f_foot, fill=(126, 158, 168, 240))

    # Text glow, then the crisp text on top.
    glow = text_layer.filter(ImageFilter.GaussianBlur(7 * S))
    base = screen(base, glow.convert("RGB"), 1.0)
    base = Image.alpha_composite(base.convert("RGBA"), text_layer).convert("RGB")

    # Vignette + grain.
    vig = Image.new("RGB", (CW, CH), (0, 0, 0))
    vy, vx = np.mgrid[0:CH, 0:CW].astype(np.float32)
    dx = (vx - CW / 2) / (CW / 2)
    dy = (vy - CH / 2) / (CH / 2)
    d = np.sqrt(dx * dx * 0.85 + dy * dy * 1.05)
    v = np.clip((d - 0.72) / 0.85, 0, 1) ** 1.7
    vig_arr = np.stack([v * 150, v * 150, v * 142], axis=-1).astype(np.uint8)
    base = Image.fromarray(
        np.clip(np.asarray(base, np.int16) - vig_arr.astype(np.int16), 0, 255).astype(np.uint8), "RGB"
    )

    arr = np.asarray(base, dtype=np.float32)
    noise = np.random.normal(0, 3.0, size=arr.shape[:2])[:, :, None]
    arr = np.clip(arr + noise, 0, 255)
    base = Image.fromarray(arr.astype(np.uint8), "RGB")

    final = base.resize((W, H), Image.LANCZOS)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    final.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({os.path.getsize(OUT) / 1024:.0f} KiB, {W}x{H})")


if __name__ == "__main__":
    main()
