import type { Guide } from './types'

export const GUIDES_BRAVAIS_EN: Record<string, Guide> = {
  'cubic-p': {
    lesson: [
      {
        title: 'Why "simple"',
        body: 'Lattice points appear only at the 8 corners, not one more — the "P" stands for Primitive. Each corner is shared by 8 neighboring cells, and 8×1/8 adds up to exactly 1 lattice point.',
        anchor: 'corner',
      },
      {
        title: 'The loosest packing',
        body: 'The nearest neighbors lie along the edges, at distance a. Each point has only 6 close neighbors (up, down, front, back, left, right) — the lowest coordination in three dimensions, which is why nature almost never packs metals this way.',
        anchor: 'aAxis',
      },
      {
        title: 'The cubic qualification',
        body: 'Three equal, mutually perpendicular axes: rotate 90° about any of them and the lattice returns to itself. This "complete equality" is so demanding that among the elements only α-polonium can satisfy it.',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: 'How many lattice points does one simple-cubic cell contain?',
        options: ['1', '2', '4'],
        answer: 0,
        explain: 'Each of the 8 corners is shared by 8 cells: 8×1/8 = 1.',
      },
      {
        question: 'What is the coordination number (nearest-neighbor count) of simple cubic?',
        options: ['4', '6', '8'],
        answer: 1,
        explain: 'One along each of the positive and negative directions of the three axes — 6 in total.',
      },
    ],
  },
  'cubic-i': {
    lesson: [
      {
        title: 'What centering means',
        body: 'Adding "extra" points inside the conventional cell is called centering. Body-centered cubic puts one more point at the very center beyond the 8 corners — the point density doubles while the cell shape stays the same.',
        anchor: 'bodyCenter',
      },
      {
        title: 'The nearest neighbors move',
        body: 'With the extra point, the body-diagonal distance (√3a/2 ≈ 0.866a) becomes shorter than the edge. Nearest neighbors switch from 6 along edges to 8 along body diagonals — centering changes "who is next to whom".',
        anchor: 'corner',
      },
      {
        title: 'Why metals prefer it',
        body: 'Eight neighbor directions let atoms pack efficiently even at high temperature: iron above 912℃, chromium and tungsten at all temperatures choose bcc. The fourfold symmetry about c remains, so the cubic identity survives.',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: 'How many nearest neighbors does body-centered cubic have?',
        options: ['6', '8', '12'],
        answer: 1,
        explain: 'From any point, the 8 body-diagonal directions each hold one equidistant neighbor (√3a/2).',
      },
      {
        question: 'How many lattice points per bcc cell?',
        options: ['1', '2', '4'],
        answer: 1,
        explain: 'Corners 8×1/8 = 1, plus the body center — 2 in total.',
      },
    ],
  },
  'cubic-f': {
    lesson: [
      {
        title: 'Where the face centers go',
        body: 'One point at the center of each of the six faces. Each face center is split between the two cells above and below: 6×1/2 = 3, plus the 1 from the corners — 4 lattice points per cell.',
        anchor: 'faceCenter',
      },
      {
        title: 'Why it is the densest',
        body: 'Half a face diagonal (a/√2 ≈ 0.707a) is shorter than the edge, and along the face diagonals each point counts 12 equidistant neighbors — the highest coordination achievable in three dimensions, the signature of close packing.',
        anchor: 'corner',
      },
      {
        title: 'The ledger and the primitive cell',
        body: '4 points per cell means the conventional cell is "overfilled": the true primitive cell is a slanted little rhombohedron of just 1/4 its volume. The conventional cell is the big package kept for the sake of cubic symmetry.',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: 'What is the coordination number of face-centered cubic?',
        options: ['8', '12', '14'],
        answer: 1,
        explain: '12 nearest neighbors along the face diagonals — the highest coordination of any 3D lattice.',
      },
      {
        question: 'How many lattice points per fcc cell?',
        options: ['2', '3', '4'],
        answer: 2,
        explain: '8×1/8 + 6×1/2 = 4.',
      },
    ],
  },
  'tetragonal-p': {
    lesson: [
      {
        title: 'From cubic to tetragonal',
        body: 'Grab one axis of the cube and pull, leaving the others alone: the base stays square while the box grows taller. The a=b identity survives and c becomes independent — that is tetragonal.',
        anchor: 'cAxis',
      },
      {
        title: 'Only one fourfold axis left',
        body: 'After the stretch, of the three originally equivalent fourfold axes only the one along c remains. The whole symmetry budget of "tetragonal" rides on this single axis.',
        anchor: 'aAxis',
      },
      {
        title: 'Rare but reasonable',
        body: 'Simple tetragonal structures are rare in nature and mainly serve as a teaching model; but once you understand it, the body-centered version (the home of white tin) comes for free.',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: 'What is the axial relation of the tetragonal system?',
        options: ['a=b=c', 'a=b≠c', 'a≠b≠c'],
        answer: 1,
        explain: 'The base is still square (a=b); c is independent and different.',
      },
      {
        question: 'Stretching a simple cubic along one axis gives you?',
        options: ['Still cubic', 'Simple tetragonal', 'Simple orthorhombic'],
        answer: 1,
        explain: 'a=b≠c with all angles 90° is exactly tetragonal P; only breaking a=b as well would demote it to orthorhombic.',
      },
    ],
  },
  'tetragonal-i': {
    lesson: [
      {
        title: 'A tetragonal box plus a body center',
        body: 'Add one point to the very center of simple tetragonal: it inherits the "square base" and gains a center point. 2 lattice points per cell, half the primitive volume.',
        anchor: 'bodyCenter',
      },
      {
        title: 'c/a is a switch',
        body: 'The distance from body center to corner is set by c/a. When c/a=√2 it equals a exactly, and the whole lattice can be rewritten as face-centered cubic — fcc and bct are just one axial ratio apart.',
        anchor: 'cAxis',
      },
      {
        title: 'The story of martensite',
        body: 'When steel is quenched, carbon squeezes into the gaps of bcc iron and props up the c axis, turning the lattice body-centered tetragonal — the secret of the hardness surge hides in this stretched axis.',
        anchor: 'aAxis',
      },
    ],
    quiz: [
      {
        question: 'Where are the lattice points of body-centered tetragonal?',
        options: ['Corners only', 'Corners + body center', 'Corners + face centers'],
        answer: 1,
        explain: 'I centering: 8 corners + 1 body center, 2 points per cell.',
      },
      {
        question: 'The critical c/a at which bct becomes equivalent to fcc is?',
        options: ['1', '√2', '2'],
        answer: 1,
        explain: 'At c/a=√2 the body-center-to-corner distance equals a, and the lattice can be rewritten as fcc.',
      },
    ],
  },
  'ortho-p': {
    lesson: [
      {
        title: 'Three axes go their own ways',
        body: 'Once the tetragonal a=b is broken too, the three axes all differ in length. The box is still "right" (all right angles), but the three directions are no longer interchangeable.',
        anchor: 'aAxis',
      },
      {
        title: 'Symmetry down to folding',
        body: 'Only a 180° rotation about each axis restores the lattice — like folding the box in half three times. The 90° fourfold axis of tetragonal has already vanished in orthorhombic.',
        anchor: 'bAxis',
      },
      {
        title: 'A populous family',
        body: 'The rectangular box is plain but versatile: aragonite, cementite (Fe₃C) and a great many organic crystals live here. Though "orthorhombic" keeps a low profile, it has plenty of residents.',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: 'What is the axial relation of the orthorhombic system?',
        options: ['a=b≠c', 'a=b=c', 'a≠b≠c'],
        answer: 2,
        explain: 'All three axes differ, but all three angles are 90°.',
      },
      {
        question: 'How many lattice points per simple orthorhombic cell?',
        options: ['1', '2', '4'],
        answer: 0,
        explain: 'Corners only: 8×1/8 = 1.',
      },
    ],
  },
  'ortho-c': {
    lesson: [
      {
        title: 'Where the base centers go',
        body: 'One point at the center of each face perpendicular to c: one on top, one on the bottom, each split between two cells. Together with the 1 from the corners, 2 points per cell.',
        anchor: 'baseCenter',
      },
      {
        title: 'C names that pair of faces',
        body: 'In crystallography, C centering refers specifically to centering of the ab faces perpendicular to c. α-uranium, α-gallium and black phosphorus all use it — centering halves their primitive volume.',
        anchor: 'cAxis',
      },
      {
        title: 'Kinship with P',
        body: 'With a more slanted set of basis vectors, base-centered orthorhombic can be rewritten as a P lattice of half the volume. It is listed as a separate member only because it reads more naturally in the standard setting.',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: 'On which faces are the "base centers" of base-centered orthorhombic?',
        options: ['Faces perpendicular to a', 'Faces perpendicular to c', 'All six faces'],
        answer: 1,
        explain: 'C centering refers specifically to the centers of the ab faces perpendicular to c.',
      },
      {
        question: 'How many lattice points per base-centered orthorhombic cell?',
        options: ['1', '2', '4'],
        answer: 1,
        explain: '8×1/8 + 2×1/2 = 2.',
      },
    ],
  },
  'ortho-i': {
    lesson: [
      {
        title: 'The heart of the shoebox',
        body: 'Centering does not care about the box: any "rectangular box" can take one more point at its center. That is why body-centered orthorhombic exists — 2 points per cell, half the primitive volume.',
        anchor: 'bodyCenter',
      },
      {
        title: 'Symmetry goes downhill',
        body: 'In cubic I the body center is equidistant from all 8 corners; in orthorhombic I, a≠b≠c splits those 8 lines into two groups of unequal length. Lower symmetry means fewer "special" relations.',
        anchor: 'corner',
      },
      {
        title: 'Completing the table',
        body: 'The orthorhombic system admits all four centerings P/C/I/F — the I one is rare in nature (silicon has an Imma phase under pressure), but the "crystal system × centering" multiplication table cannot do without it.',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: 'How many lattice points per body-centered orthorhombic cell?',
        options: ['1', '2', '4'],
        answer: 1,
        explain: 'Corners 8×1/8 = 1, plus the body center — 2 in total.',
      },
      {
        question: 'In body-centered orthorhombic, the distances from body center to the 8 corners are?',
        options: ['All equal', 'Split into two groups', 'All different'],
        answer: 1,
        explain: 'a≠b≠c divides the 8 body diagonals into two equal-length groups of 4 each.',
      },
    ],
  },
  'ortho-f': {
    lesson: [
      {
        title: 'All six faces',
        body: 'Fill all six face centers: 4 points per cell, the same ledger as face-centered cubic. What differs is the box itself — three mutually unequal axes.',
        anchor: 'faceCenter',
      },
      {
        title: 'Face diagonals no longer equivalent',
        body: 'In cubic F all 12 face diagonals are equal; in orthorhombic F the three kinds of faces differ, and nearest neighbors lie only along the shortest face diagonal.',
        anchor: 'aAxis',
      },
      {
        title: 'The home of α-sulfur',
        body: 'Orthorhombic sulfur (α-S) is a face-centered orthorhombic example: S₈ rings arranged on an F lattice. Lower than cubic in symmetry, yet the geometry of centering is exactly the same.',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: 'How many lattice points per face-centered orthorhombic cell?',
        options: ['2', '3', '4'],
        answer: 2,
        explain: '8×1/8 + 6×1/2 = 4.',
      },
      {
        question: 'The essential difference between face-centered orthorhombic and face-centered cubic is?',
        options: ['Different point-placement rules', 'The three axes are no longer equal', 'Different points per cell'],
        answer: 1,
        explain: 'Same ledger (4 points per cell); the difference is a≠b≠c in the orthorhombic system.',
      },
    ],
  },
  'monoclinic-p': {
    lesson: [
      {
        title: 'A pushed-over box',
        body: 'Give the orthorhombic box a gentle sideways push: the angle β between a and c is no longer right (110° here). "Monoclinic" = inclined in a single direction.',
        anchor: 'cAxis',
      },
      {
        title: 'b is the pillar',
        body: 'Only the b axis remains perpendicular to the other two. A 180° rotation about b is the main symmetry left to the monoclinic lattice — hence the "unique axis" convention.',
        anchor: 'bAxis',
      },
      {
        title: 'The norm for organic crystals',
        body: 'Molecules are large and irregular; the slightest skew in stacking drops them into monoclinic. Naphthalene, sucrose and a great many organic crystals are monoclinic P residents.',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: 'In the standard setting, which angle of the monoclinic system may differ from 90°?',
        options: ['α', 'β', 'γ'],
        answer: 1,
        explain: 'The convention sets α=γ=90° and allows only β (the angle between a and c) to stray.',
      },
      {
        question: 'The unique axis (2-fold axis) of the monoclinic system is?',
        options: ['a', 'b', 'c'],
        answer: 1,
        explain: 'The b axis is perpendicular to both a and c; the 2-fold rotation runs along b.',
      },
    ],
  },
  'monoclinic-c': {
    lesson: [
      {
        title: 'A skewed box can be centered too',
        body: 'Add one point at the center of the top and bottom faces of the monoclinic box. The box is skewed, yet each base center is still split between two cells — centering rules do not care about shape.',
        anchor: 'baseCenter',
      },
      {
        title: 'The home of gypsum',
        body: 'The space group of gypsum (CaSO₄·2H₂O) is C2/c: the C center is part of its skeleton. Skewed box + base centers is the standard lodging for many hydrated salts.',
        anchor: 'corner',
      },
      {
        title: 'Conversion to P',
        body: 'With a new set of basis vectors, base-centered monoclinic can be rewritten as a monoclinic P of half the volume. The C setting is kept so structures like gypsum read better in standard coordinates.',
        anchor: 'bAxis',
      },
    ],
    quiz: [
      {
        question: 'How many lattice points per base-centered monoclinic cell?',
        options: ['1', '2', '3'],
        answer: 1,
        explain: '8×1/8 + 2×1/2 = 2.',
      },
      {
        question: 'Which Bravais lattice does gypsum (CaSO₄·2H₂O) belong to?',
        options: ['Simple monoclinic P', 'Base-centered monoclinic C', 'Face-centered orthorhombic F'],
        answer: 1,
        explain: 'Gypsum has space group C2/c, built on a C-centered monoclinic lattice.',
      },
    ],
  },
  'triclinic-p': {
    lesson: [
      {
        title: 'The floor of symmetry',
        body: 'All three angles are non-right (75°/95°/85° here) and the three axes are unequal. Apart from translation itself, the lattice offers no rotational symmetry at all.',
        anchor: 'corner',
      },
      {
        title: 'Why no centering',
        body: 'Add any interior point to a triclinic lattice and a new set of basis vectors can rewrite it as a smaller P lattice. That is why triclinic occupies only one P slot among the 14 Bravais lattices.',
        anchor: 'aAxis',
      },
      {
        title: 'Kyanite lives here',
        body: 'Kyanite (Al₂SiO₅) and copper sulfate pentahydrate are both triclinic P. The low symmetry makes every interfacial angle different; identifying them takes optics, not outward shape.',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: 'How many angles of the triclinic system are typically non-right?',
        options: ['1', '2', '3'],
        answer: 2,
        explain: 'α, β and γ generally all deviate from 90°.',
      },
      {
        question: 'Why does triclinic have only P, and no C/I/F?',
        options: ['Symmetry forbids centering', 'Any centering can be rewritten as P', 'Triclinic crystals do not exist'],
        answer: 1,
        explain: 'Triclinic has no symmetry constraints, so any interior point can be absorbed by new basis vectors — centering produces no new lattice.',
      },
    ],
  },
  'rhombohedral-r': {
    lesson: [
      {
        title: 'A pinched cube',
        body: 'Pinch a cube uniformly along its body diagonal: the three axes stay equal, but all the angles become the same non-90° value (75° here).',
        anchor: 'aAxis',
      },
      {
        title: 'The two faces of R',
        body: 'The rhombohedral cell itself is primitive — the 8 corners hold exactly 1 lattice point; but once described in hexagonal coordinates the points scatter to (⅔,⅓,⅓) and two other positions, hence the name "R centering".',
        anchor: 'corner',
      },
      {
        title: 'Calcite and bismuth',
        body: 'Calcite (CaCO₃), bismuth, arsenic and antimony are all trigonal R. The threefold rotation along the body diagonal is the highest symmetry this family keeps.',
        anchor: 'cAxis',
      },
    ],
    quiz: [
      {
        question: 'What is the relation among the three axes of a rhombohedral lattice?',
        options: ['Equal and all right angles', 'Equal but angles ≠90°', 'Unequal'],
        answer: 1,
        explain: 'a=b=c, but the angle between any two axes is the same non-90° value.',
      },
      {
        question: 'In hexagonal coordinates, how many lattice points does the hexagonal cell of an R lattice contain?',
        options: ['1', '2', '3'],
        answer: 2,
        explain: 'The hexagonal setting gives 3 points for R centering; the rhombohedral description is itself a 1-point primitive cell.',
      },
    ],
  },
  'hexagonal-p': {
    lesson: [
      {
        title: 'The 120° base',
        body: 'The base of the hexagonal lattice is not a square but a γ=120° rhombus — such rhombi tile into a honeycomb-like dense net. The orange wireframe is the embedded primitive cell.',
        anchor: 'cAxis',
      },
      {
        title: 'Prism and primitive cell',
        body: 'The hexagonal prism is a three-times-bigger "convenience cell": one prism holds exactly 3 rhombic primitive cells. Count the corner and center points and you can count those 3.',
        anchor: 'hexPoint',
      },
      {
        title: 'The home of graphite and magnesium',
        body: 'Place atoms on the hexagonal lattice points and add a partner at (⅓,⅔,½), and you get the hcp structure of magnesium; graphite plays its layered tricks on the same skeleton.',
        anchor: 'corner',
      },
    ],
    quiz: [
      {
        question: 'What is the base angle γ of the hexagonal system?',
        options: ['90°', '120°', '60°'],
        answer: 1,
        explain: 'A rhombic base with a=b and γ=120° tiles into a triangular net.',
      },
      {
        question: 'How many primitive cells fit in one hexagonal prism?',
        options: ['1', '2', '3'],
        answer: 2,
        explain: 'The prism is 3 times the volume of the γ=120° rhombic primitive cell and holds 3 lattice points.',
      },
    ],
  },
}
