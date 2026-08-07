def srgb(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(h):
    h = h.lstrip('#')
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126*srgb(r) + 0.7152*srgb(g) + 0.0722*srgb(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)

# Non-text pairs only. Threshold is 3.0 under WCAG 2.2 SC 1.4.11.
PAIRS = {
 'control': [
   ('light border on card',  '#e0e0e6', '#ffffff'),
   ('light border on page',  '#e0e0e6', '#f7f7f8'),
   ('light surface-alt/card','#f1f1f4', '#ffffff'),
   ('dark border on card',   '#33333e', '#1c1c24'),
   ('dark border on page',   '#33333e', '#14141a'),
   ('dark surface-alt/card', '#23232c', '#1c1c24'),
 ],
 'treatment': [
   ('light border on card',   '#d6dae0', '#ffffff'),
   ('light border on page',   '#d6dae0', '#f6f7f9'),
   ('light border-strong/card','#aab1bc', '#ffffff'),
   ('light focus ring on card','#0b4bd6', '#ffffff'),
   ('light focus ring on page','#0b4bd6', '#f6f7f9'),
   ('dark border on card',    '#3a3f47', '#1e2126'),
   ('dark border on page',    '#3a3f47', '#14161a'),
   ('dark border-strong/card','#565c66', '#1e2126'),
   ('dark focus ring on card','#8fb4ff', '#1e2126'),
   ('dark focus ring on page','#8fb4ff', '#14161a'),
 ],
}

for arm, pairs in PAIRS.items():
    print('=== %s : non-text contrast, 3.0 required by 1.4.11 ===' % arm)
    fails = 0
    for name, fg, bg in pairs:
        r = ratio(fg, bg)
        ok = r >= 3.0
        if not ok:
            fails += 1
        print('  %-27s %-9s on %-9s %6s  %s' % (name, fg, bg, r, 'pass' if ok else 'FAIL'))
    print('  --> %d of %d non-text pairs fail\n' % (fails, len(pairs)))
