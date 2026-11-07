import type { Guide } from './types'

export const GUIDES_CRYSTAL2_EN: Record<string, Guide> = {
  zincblende: {
    lesson: [
      {
        title: "Diamond's stand-in",
        body: 'Zn forms an fcc sublattice and the S sublattice is shifted along the body diagonal to (¼,¼,¼) — replace the two carbon sublattices of diamond with Zn and S, and you get zincblende.',
        anchor: 'zn-site',
      },
      {
        title: 'Tetrahedral 4:4 coordination',
        body: 'Each Zn bonds to 4 S in a tetrahedron (2.34 Å), and each S is likewise surrounded by 4 Zn: the two sublattices are strictly equivalent.',
        anchor: 'zn-s-bond',
      },
      {
        title: 'The face-center atom\'s neighbors',
        body: 'A face-center atom belongs to the same sublattice as the corners, but all 4 of its nearest neighbors lie in the other sublattice — recount from any atom, tetrahedral coordination holds everywhere.',
        anchor: 'face-atom',
      },
      {
        title: 'Home of the semiconductors',
        body: 'GaAs, InSb, CdTe and cubic SiC all copy this geometry: two atom species each carry an fcc sublattice, and the tetrahedral bonds naturally give sp³-type directional bonding.',
        anchor: 's-site',
      },
    ],
    quiz: [
      {
        question: 'In the zincblende structure, the S sublattice is shifted relative to the Zn sublattice by?',
        options: ['(¼,¼,¼)', '(½,½,½)', '(½,½,0)'],
        answer: 0,
        explain: 'One quarter along the body diagonal — exactly the direction of the tetrahedral bond; (½,½,0) is a face-center translation and (½,½,½) yields a different structure type.',
      },
      {
        question: 'How many atoms does the zincblende conventional cell contain?',
        options: ['4', '8', '12'],
        answer: 1,
        explain: 'The fcc lattice points contribute 4 Zn, and the shifted basis contributes another 4 S — 8 in total.',
      },
    ],
  },
  wurtzite: {
    lesson: [
      {
        title: 'The hexagonal diamond',
        body: 'Two hexagonal sublattices shifted along the c axis: one of Zn, one of S, with the internal parameter u = 0.375 fixing the height of the shift; every atom is still 4-coordinated in a tetrahedron.',
        anchor: 'zn-site',
      },
      {
        title: 'Differs from zincblende only by stacking',
        body: 'The tetrahedral framework is identical (Zn–S 2.34 Å); only the layer sequence differs: cubic …ABCABC… becomes hexagonal …ABAB….',
        anchor: 'zn-s-bond',
      },
      {
        title: 'The polar c axis',
        body: 'Along the c axis, Zn layers and S layers alternate, so the centers of positive and negative charge no longer coincide — the piezoelectric polarization of GaN and the charge at heterointerfaces both stem from this polar axis.',
        anchor: 'c-axis',
      },
      {
        title: 'A small, compact cell',
        body: 'The hexagonal cell holds only 4 atoms (2 Zn + 2 S), while the zincblende conventional cell holds 8 — cell size is the bookkeeping of the stacking sequence.',
        anchor: 's-site',
      },
    ],
    quiz: [
      {
        question: 'What is the essential difference between wurtzite and zincblende?',
        options: ['Different coordination numbers', 'Different stacking sequence of tetrahedral layers', 'Different bond types'],
        answer: 1,
        explain: 'Both are 4:4 tetrahedrally coordinated with the same 2.34 Å bond; only the layer sequence differs: ABAB (hexagonal) vs ABCABC (cubic).',
      },
      {
        question: 'How many atoms are in the wurtzite ZnS hexagonal cell?',
        options: ['2', '4', '8'],
        answer: 1,
        explain: '2 Zn + 2 S = 4; the number 8 belongs to the zincblende conventional cell.',
      },
    ],
  },
  graphite: {
    lesson: [
      {
        title: 'In-plane: honeycomb and sp²',
        body: 'Each layer is a hexagonal honeycomb: carbon is 3-coordinated with in-plane C–C of 1.42 Å. Each carbon keeps 1 π electron roaming between layers — they carry the in-plane conductivity.',
        anchor: 'in-plane-bond',
      },
      {
        title: 'Between layers: AB stacking',
        body: 'Layer B is shifted horizontally relative to layer A: half its atoms sit directly above atoms of the layer below, the other half above hexagon centers. c = 6.71 Å holds two layers, 4 atoms per cell.',
        anchor: 'layer-b',
      },
      {
        title: 'Strong bonds vs weak bonds',
        body: 'In-plane 1.42 Å covalent bonds versus interlayer 3.35 Å van der Waals: layers slide easily (lubrication) while electrons struggle to jump perpendicular to the layers — the geometric root of the anisotropy.',
        anchor: 'interlayer',
      },
      {
        title: 'Hollow sites at ring centers',
        body: 'The hexagon centers are the highest-symmetry interlayer vacancies: intercalated guests such as lithium and potassium prefer them, prying the layers apart and doubling the spacing while the honeycomb itself stays intact.',
        anchor: 'hollow-site',
      },
    ],
    quiz: [
      {
        question: 'The in-plane C–C bond length and interlayer spacing of graphite are about?',
        options: ['1.42 Å and 3.35 Å', '1.54 Å and 2.46 Å', '3.35 Å and 6.71 Å'],
        answer: 0,
        explain: 'In-plane sp² bond 1.42 Å (shorter than diamond\'s 1.545 Å); interlayer van der Waals 3.35 Å.',
      },
      {
        question: 'What is the stacking sequence along the c axis of (Bernal) graphite?',
        options: ['ABCABC', 'ABAB', 'Completely random'],
        answer: 1,
        explain: 'Bernal graphite stacks ABAB; ABCABC is rhombohedral graphite, and random stacking is disordered carbon.',
      },
    ],
  },
  'cu-fcc': {
    lesson: [
      {
        title: 'The bookkeeping of close packing',
        body: 'Face-centered cubic is one of the two densest packings (packing fraction 74%): 8 corners each count 1/8 and 6 face centers each count 1, a net 4 atoms per cell.',
        anchor: 'corner-atom',
      },
      {
        title: '12 nearest neighbors',
        body: 'Every atom is surrounded by 12 nearest neighbors: 6 in the same layer + 3 above + 3 below, at 2.55 Å (= a/√2). Metallic bonds have no directionality — they only want maximum density.',
        anchor: 'nn-pair',
      },
      {
        title: 'ABC stacking and the close-packed plane',
        body: 'Looking along the (111) normal, close-packed layers cycle A, B, C: the third layer does not return above the first — the dividing line between fcc and hcp.',
        anchor: 'close-packed-plane',
      },
      {
        title: 'The weight of the face centers',
        body: 'The corner atoms are more of a bookkeeping device; the face-center atoms really hold up the packing: remove them and you fall back to simple cubic, with the coordination number dropping from 12 to 6.',
        anchor: 'face-atom',
      },
    ],
    quiz: [
      {
        question: 'How many nearest neighbors does each atom in fcc copper have?',
        options: ['8', '10', '12'],
        answer: 2,
        explain: 'The hallmark of close packing: 12 neighbors = 6 in the same layer + 3 above + 3 below.',
      },
      {
        question: 'What is the stacking sequence of fcc close-packed planes?',
        options: ['ABAB', 'ABCABC', 'AABB'],
        answer: 1,
        explain: 'The third layer shifts to the C site, the fourth returns to A; ABAB corresponds to hcp (e.g. magnesium).',
      },
    ],
  },
  'fe-bcc': {
    lesson: [
      {
        title: 'Counting atoms first',
        body: '8 corners each count 1/8 + 1 body center = 2 atoms per cell. Note the difference from CsCl: corner and body-center atoms are the same species here, and the lattice is unchanged by a (½,½,½) translation.',
        anchor: 'corner-atom',
      },
      {
        title: 'Coordination 8 + 6',
        body: 'The 8 nearest neighbors all lie along body diagonals (2.48 Å = √3·a/2); along the cube edges there are 6 next-nearest neighbors at exactly a = 2.87 Å, only 15% farther — bcc\'s "8-coordination" comes with a guard of 6.',
        anchor: 'nn-pair',
      },
      {
        title: 'The diagonals are the skeleton',
        body: 'Along each body diagonal, corner–center–corner atoms sit at equal spacing; fix your attention on the 4 diagonal directions and the 8 nearest neighbors of any atom are all counted.',
        anchor: 'diagonal',
      },
      {
        title: 'A looser packing',
        body: 'Packing fraction 68% < 74%: bcc is less dense than fcc/hcp, but its open channels favor diffusion — the magnetic-moment coupling of ferromagnetic α-Fe also lives in this geometry.',
        anchor: 'body-atom',
      },
    ],
    quiz: [
      {
        question: 'How many nearest neighbors does each atom in α-Fe have?',
        options: ['6', '8', '12'],
        answer: 1,
        explain: '8 nearest neighbors along the body diagonals; plus 6 slightly farther next-nearest neighbors along the cube edges (written as 8+6).',
      },
      {
        question: 'The packing fractions of bcc and fcc are approximately?',
        options: ['68% and 74%', '74% and 68%', 'Both 74%'],
        answer: 0,
        explain: 'bcc 68%; fcc and hcp reach the close-packing limit of 74%.',
      },
    ],
  },
  'mg-hcp': {
    lesson: [
      {
        title: 'A two-layer cycle',
        body: 'After close-packed layer A, the second layer of atoms sits in the hollows of layer A; the third layer returns directly above A — the ABAB cycle, which is hexagonal close packing.',
        anchor: 'a-site',
      },
      {
        title: 'Two kinds of hollows, one chosen',
        body: 'The hollows of layer A come in two sets, B sites and C sites: hcp always uses the same one, fcc alternates between them. The only difference is "where the third layer goes" — both give coordination 12 and packing fraction 74%.',
        anchor: 'hollow-site',
      },
      {
        title: 'The golden ratio on the c axis',
        body: 'Two close-packed layers stack into c = 5.21 Å, with c/a = 1.624 almost exactly on the ideal hard-sphere value √(8/3) ≈ 1.633 — which is why magnesium is regarded as the most standard hcp metal.',
        anchor: 'c-axis',
      },
      {
        title: 'Counting the 12 nearest neighbors',
        body: '6 in the same layer + 3 above + 3 below; in ideal hcp all 12 distances equal a = 3.21 Å.',
        anchor: 'nn-pair',
      },
    ],
    quiz: [
      {
        question: 'What is the stacking sequence of close-packed layers in hcp magnesium?',
        options: ['ABCABC', 'ABAB', 'AABB'],
        answer: 1,
        explain: 'In hexagonal close packing the third layer returns directly above the first; ABCABC belongs to fcc (e.g. copper).',
      },
      {
        question: 'The c/a ratio of ideal hcp is about?',
        options: ['1.33', '1.63', '1.86'],
        answer: 1,
        explain: 'The hard-sphere model gives √(8/3) ≈ 1.633; the measured value for magnesium, 1.624, is very close.',
      },
    ],
  },
  perovskite: {
    lesson: [
      {
        title: 'Three seats, one cell',
        body: 'A simple cubic lattice with a five-atom basis: Sr at the corners, Ti at the body center, O at the face centers. The three atom species each occupy one set of high-symmetry seats, locking one another dead center.',
        anchor: 'sr-site',
      },
      {
        title: 'The face-center O is the joint',
        body: '3 O atoms sit at the face centers, linking the corners of neighboring octahedra along the cube edges — O is exactly the "corner" that the octahedra share.',
        anchor: 'o-site',
      },
      {
        title: 'The TiO₆ octahedral framework',
        body: 'Each Ti is surrounded by the 6 face-center O atoms in a TiO₆ octahedron, and the octahedra link corner-to-corner into a 3D framework. Everything functional happens at the Ti site: a small distortion changes the properties dramatically (the ferroelectricity of BaTiO₃ arises this way).',
        anchor: 'octahedron',
      },
      {
        title: 'Bond lengths locked by the lattice',
        body: 'Ti–O 1.95 Å is exactly the body-center-to-face-center a/2: in cubic perovskite a bond cannot stretch on its own — any distortion must move the whole framework.',
        anchor: 'ti-o-bond',
      },
    ],
    quiz: [
      {
        question: 'In cubic perovskite SrTiO₃, the Ti–O bond length is about?',
        options: ['a/4', 'a/2', 'a'],
        answer: 1,
        explain: 'Ti at the body center, O at the face centers: bond length = a/2 = 3.905 Å / 2 ≈ 1.95 Å.',
      },
      {
        question: 'How are the TiO₆ octahedra connected in perovskite?',
        options: ['Only corner-sharing', 'Edge-sharing along c', 'Face-sharing'],
        answer: 0,
        explain: 'The octahedra share corners through the face-center O atoms, forming a 3D framework; edge-sharing chains along c belong to rutile.',
      },
    ],
  },
  rutile: {
    lesson: [
      {
        title: 'Start with the Ti lattice',
        body: 'Ti forms a body-centered tetragonal lattice: one set at the corners + one at the body center (relative shift (½,½,½)); the O atoms then stitch the two Ti sublattices together.',
        anchor: 'body-ti',
      },
      {
        title: 'Octahedra strung into chains',
        body: 'Each Ti has 6 O (TiO₆); along the c axis each octahedron shares one edge with its neighbors above and below, stringing into straight chains — the chain direction is the "stiffest" direction of rutile.',
        anchor: 'octahedra-chain',
      },
      {
        title: 'Two sets of bond lengths',
        body: 'Ti–O is not one length: four bonds of 1.94 Å + two of 1.98 Å. A slight twist of the octahedra about the c axis splits the 6 bonds into two groups.',
        anchor: 'ti-o-bond',
      },
      {
        title: 'O is a three-way hinge',
        body: 'Each O is coordinated to only 3 Ti (1 in its own chain + 2 in neighboring chains), locking the geometry of several octahedral chains together — Ti 6-coordination and O 3-coordination balance the books.',
        anchor: 'o-site',
      },
    ],
    quiz: [
      {
        question: 'How are the TiO₆ octahedra connected along the c axis in rutile?',
        options: ['Corner-sharing', 'Edge-sharing', 'Face-sharing'],
        answer: 1,
        explain: 'Edge-sharing chains along the c axis, and only corner-sharing between chains — different from the all-corner-sharing perovskite framework.',
      },
      {
        question: 'How many atoms does the rutile TiO₂ conventional cell contain?',
        options: ['4', '6', '8'],
        answer: 1,
        explain: '2 Ti + 4 O = 6.',
      },
    ],
  },
  fluorite: {
    lesson: [
      {
        title: 'An fcc foundation',
        body: 'Ca²⁺ forms a face-centered cubic lattice (corners + face centers, 4 per cell) — the same geometry as Cl in NaCl and Zn in zincblende; the difference lies entirely in what fills the holes.',
        anchor: 'ca-site',
      },
      {
        title: 'All tetrahedral holes filled',
        body: 'The number of tetrahedral holes in fcc is twice the number of atoms: 4 Ca provide 8 holes, and F⁻ occupies exactly all of them (Ca 8-coordinated, F 4-coordinated).',
        anchor: 'f-tetrahedral',
      },
      {
        title: 'The 8-coordinated little cube',
        body: 'Each Ca sits exactly at the center of a small cube of 8 F atoms (Ca–F 2.37 Å); conversely, each F is surrounded by 4 Ca in a tetrahedron.',
        anchor: 'ca-f-bond',
      },
      {
        title: 'A spectrum of hole filling',
        body: 'On the same fcc sublattice: all octahedral holes filled gives NaCl, half the tetrahedral holes filled gives zincblende, and all tetrahedral holes filled gives fluorite — the prototypes differ only by "how much is filled".',
        anchor: 'fcc-sublattice',
      },
    ],
    quiz: [
      {
        question: 'What is the coordination number of Ca in the fluorite structure?',
        options: ['4', '6', '8'],
        answer: 2,
        explain: 'Ca is enclosed by 8 F in a small cube; conversely each F is surrounded by 4 Ca in a tetrahedron (8 : 4).',
      },
      {
        question: 'How does the antifluorite structure (e.g. Na₂O) differ from fluorite?',
        options: ['Cation and anion positions are swapped', 'Only half the tetrahedral holes are filled', 'Different Bravais lattice'],
        answer: 0,
        explain: 'The anion takes the fcc lattice points and the cations fill all tetrahedral holes — the coordination relation swaps to 4 : 8.',
      },
    ],
  },
}
