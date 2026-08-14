# Evidence crops

Five crops from the two design files, each one showing a specific measured finding
from [DESIGN-FILE-AUDIT.md](../DESIGN-FILE-AUDIT.md).

| File | Arm | Shows |
| --- | --- | --- |
| `control-nav-bar.png` | Control | Four nav links at 17px and a 41px `Reserve Boule` button, against the 44px standard in 2.5.8 |
| `control-philosophy.png` | Control | `Hour 0` through `Hour 36` at 11px bold, the accent's worst contrast case at 3.59:1 |
| `control-membership-band.png` | Control | `THE LEAVENED MEMBERSHIP` at 14px bold on dark, 3.61:1 |
| `treatment-nav-bar.png` | Treatment | Five nav links at 17px and a 48px `Order Online` button, which passes 2.5.8 |
| `treatment-newsletter-band.png` | Treatment | `The Bread Chronicle` at 13px bold on dark, the treatment's single contrast failure at 2.71:1 |

The two nav bars are the clearest pair to compare. Same criterion, same page
position, 41px against 48px, and both arms still fail on the links rather than the
buttons.

## Why these are crops and not full pages

The full page exports are not published here. Both design files place photography
the Figma agent supplied, twelve image fills in the control and eleven in the
treatment, and the node trees record those only as opaque `imageRef` hashes with
no source, no URL, and no attribution. There is no way to establish what license
that imagery carries, so republishing it in a CC BY 4.0 repository is not
something this project can do.

No finding in the design audit depends on the photography. Every one is about type
color, type size, or control height.

## How they were cut

[`../harness/crop-evidence.py`](../harness/crop-evidence.py), from the committed
node trees plus a full page export.

```bash
cd ../harness
python3 crop-evidence.py control
python3 crop-evidence.py treatment
```

The script will not write a crop whose rectangle overlaps any node carrying an
`IMAGE` fill. It compares the crop rectangle against the bounding box of every
image fill in the tree and refuses the crop if they intersect, so the exclusion is
geometric rather than a matter of anyone checking the output by eye.

It also resolves each region against the top-level sections of the page frame by
exact name, rather than the first node whose name happens to contain the word.
Matching loosely produced a plausible looking image of the wrong region on the
first run.

Reproducing these requires a full page export, which is not committed for the
reason above. Export each page at 1440 wide from the file and the script will
rescale to whatever width you give it. The committed crops came from 1080 wide
exports, an exact 0.75 scale.

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
