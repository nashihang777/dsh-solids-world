import type { Guide } from './types'

export const GUIDES_SYMMETRY_EN: Record<string, Guide> = {
  'sym-rotation': {
    lesson: [
      {
        title: 'Guess first: what angle aligns?',
        body: 'Study the pattern and guess: through what minimal angle about this axis does it coincide with itself? Decide before you click the axis marker to verify.',
        anchor: 'element-0',
      },
      {
        title: 'Verify: click to rotate',
        body: 'Click the axis marker: the model rotates by 360°/n and flashes when the animation ends. The higher the order, the smaller each click\'s turn.',
        anchor: 'element-0',
      },
      {
        title: 'n clicks return to start',
        body: 'Click the same axis n times in a row: the turns add up to a full 360° and the model returns to its starting pose. Track one corner and watch it come full circle.',
        anchor: 'cubeCorner',
      },
    ],
    quiz: [
      {
        question: 'What is the minimal rotation angle of a 4-fold axis?',
        options: ['45°', '90°', '180°'],
        answer: 1,
        explain: '360°/4 = 90°.',
      },
      {
        question: 'Why are 5-fold axes never found in crystals?',
        options: ['Pentagons cannot tile space', 'Rotating by 72° costs too much energy', 'Quantum numbers forbid it'],
        answer: 0,
        explain: 'Periodic translation is incompatible with fivefold rotation: pentagons cannot assemble a space-filling lattice (quasicrystals achieve it only by giving up periodicity).',
      },
    ],
  },
  'sym-mirror': {
    lesson: [
      {
        title: 'Guess first: where is the mirror?',
        body: 'Find the plane along which the pattern would "fold onto itself". Point it out in your mind first, then click the mirror marker to verify.',
        anchor: 'element-0',
      },
      {
        title: 'Click to flip',
        body: 'Click the mirror marker: the model flips through the plane to the other side, ending with an alignment flash. Image and object stay strictly equidistant from the mirror.',
        anchor: 'element-0',
      },
      {
        title: 'Two flips do nothing',
        body: 'Click again: σ²=E, the model returns to its original pose. A mirror, like inversion, is an order-2 operation — two clicks cancel out.',
        anchor: 'cubeCorner',
      },
    ],
    quiz: [
      {
        question: 'How many reflections restore the original?',
        options: ['1', '2', '4'],
        answer: 1,
        explain: 'σ²=E: two consecutive reflections cancel.',
      },
      {
        question: 'Which direction does a flat mirror really reverse?',
        options: ['Up and down', 'Left and right', 'Front and back, perpendicular to the mirror'],
        answer: 2,
        explain: 'A mirror flips only the direction perpendicular to its surface; "left-right reversal" is the observer\'s own illusion.',
      },
    ],
  },
  'sym-inversion': {
    lesson: [
      {
        title: 'Guess first: where is the center?',
        body: 'Find the point through which every corner, pushed straight through, meets the opposite corner at equal distance. Point it out first, then click the center marker to verify.',
        anchor: 'cubeCorner',
      },
      {
        title: 'Click to invert',
        body: 'Click the center marker: every point r→−r, and the animation ends with an alignment flash. The two corners along each body diagonal trade places.',
        anchor: 'element-0',
      },
      {
        title: 'The hidden identity of inversion',
        body: 'Inversion = rotate 180° about an axis + reflect in the perpendicular mirror. In any point group where C2 and its perpendicular mirror both show up, the inversion center is necessarily present.',
        anchor: 'element-0',
      },
    ],
    quiz: [
      {
        question: 'Inversion maps the position vector r to?',
        options: ['2r', '−r', 'r/2'],
        answer: 1,
        explain: 'Every point passes through the center to the opposite side at equal distance: r→−r.',
      },
      {
        question: 'How many inversions restore the original?',
        options: ['2', '3', '6'],
        answer: 0,
        explain: 'i²=E: inversion is an order-2 operation.',
      },
    ],
  },
  'sym-translation-glide': {
    lesson: [
      {
        title: 'Guess first: the footprint rule',
        body: 'Look at the footprint pattern: what is the relation between left and right feet? Guess what operation "one step" equals before clicking the mirror to verify.',
        anchor: 'footprint',
      },
      {
        title: 'Glide = reflection + half step',
        body: 'Click the mirror or the arrow: the "footprint" glide animation plays — reflect first, then slide half a period, left and right feet alternating.',
        anchor: 'mirrorPlane',
      },
      {
        title: 'Two clicks = pure translation',
        body: 'Click once more: the reflections cancel, two half-periods make a full period, and the footprint lands on the next period — g²=translation.',
        anchor: 'halfPeriod',
      },
      {
        title: 'Translation is the engine',
        body: 'Click the arrow twice in a row: two half-periods make one full period, the footprint lands firmly on the next slot — one pure translation. The "infinite copying" of space groups is driven entirely by translation, for which point groups have no place.',
        anchor: 'translationArrow',
      },
    ],
    quiz: [
      {
        question: 'A glide operation equals?',
        options: ['A pure half-period translation', 'Mirror reflection + half-period translation', 'A 180° rotation + translation'],
        answer: 1,
        explain: 'Reflect through the glide plane first, then translate half a period within the plane.',
      },
      {
        question: 'Two consecutive glides equal?',
        options: ['Back to the start', 'One pure translation', 'One mirror reflection'],
        answer: 1,
        explain: 'Two reflections cancel; two half-period translations make one full period: g²=t.',
      },
    ],
  },
  'pointgroup-2m': {
    lesson: [
      {
        title: 'Guess first: how many elements?',
        body: 'No peeking: hidden in this pattern are a rotation axis, a mirror and an inversion center. Count them in your head first, then reveal them one by one.',
        anchor: 'cubeCorner',
      },
      {
        title: 'Clue one: the 2-fold axis',
        body: 'Click the axis marker: the model rotates 180° and flashes into alignment. This is the "2" at the head of the symbol — the monoclinic system\'s only directional privilege.',
        anchor: 'element-0',
      },
      {
        title: 'Clue two: the horizontal mirror',
        body: 'Click the mirror marker: the model flips top-to-bottom and flashes. It is perpendicular to the 2-fold axis — that is exactly what "/m" in the symbol states.',
        anchor: 'element-1',
      },
      {
        title: 'Clue three: inversion for free',
        body: 'Click the inversion center: every point r→−r. The product of C2 with the perpendicular mirror is exactly inversion — the third element arrives uninvited.',
        anchor: 'element-2',
      },
    ],
    quiz: [
      {
        question: 'How many elements does point group 2/m contain?',
        options: ['3', '4', '6'],
        answer: 1,
        explain: 'E, C2, i and σh, one each — group order 4.',
      },
      {
        question: 'What does the slash in "2/m" mean?',
        options: ['The mirror contains the 2-fold axis', 'The mirror is perpendicular to the 2-fold axis', 'Two independent directions'],
        answer: 1,
        explain: 'The slash reads "perpendicular to": the mirror m and the 2-fold axis are mutually perpendicular.',
      },
    ],
  },
  'pointgroup-4mmm': {
    lesson: [
      {
        title: 'Guess first: what order is the principal axis?',
        body: 'Watch the pattern turn about the vertical: it aligns once every 90°. Guess the order first, then click the principal axis to verify — the flash at 90° means 4-fold.',
        anchor: 'element-0',
      },
      {
        title: '2-fold axes in the equator',
        body: 'Click any horizontal 2-fold axis: a 180° rotation flashes into alignment. There are 4 such axes, 45° apart.',
        anchor: 'element-2',
      },
      {
        title: 'Mirrors within mirrors',
        body: 'Click the horizontal mirror first (top-bottom fold), then a vertical mirror (left-right fold): the 1+4 mirrors wrap the principal axis layer by layer.',
        anchor: 'element-5',
      },
      {
        title: 'Wrap-up: the inversion center',
        body: 'Click the inversion marker: every point passes through the center to the opposite side. The 4-fold axis plus all the mirrors assemble the highest tetragonal symmetry 4/mmm, order 16.',
        anchor: 'inversion',
      },
    ],
    quiz: [
      {
        question: 'Through what minimal angle about the 4-fold principal axis does the pattern align?',
        options: ['45°', '90°', '180°'],
        answer: 1,
        explain: '360°/4 = 90°.',
      },
      {
        question: 'How many mirrors does point group 4/mmm have?',
        options: ['4', '5', '9'],
        answer: 1,
        explain: '1 horizontal mirror + 4 vertical mirrors, 5 in total.',
      },
    ],
  },
  'pointgroup-6mmm': {
    lesson: [
      {
        title: 'Guess first: what order is the principal axis?',
        body: 'Turn slowly about the vertical axis: the pattern aligns once every 60°. Guess the order before clicking the principal axis to verify — the flash at 60° means 6-fold.',
        anchor: 'element-0',
      },
      {
        title: 'Six 2-fold axes in the equator',
        body: 'Click any horizontal 2-fold axis: a 180° rotation flashes into alignment. The six axes sit every 30°, like six hands of a clock.',
        anchor: 'element-2',
      },
      {
        title: 'Seven mirrors',
        body: 'Click the horizontal mirror first, then a vertical one: the 1+6 mirrors enclose the pattern in a "hall of mirrors".',
        anchor: 'element-7',
      },
      {
        title: 'Wrap-up: inversion and the tally',
        body: 'Click the inversion center to complete the list: 1 sixfold axis, 6 twofold axes, 7 mirrors, 1 inversion — group order 24, the hexagonal ceiling.',
        anchor: 'inversion',
      },
    ],
    quiz: [
      {
        question: 'Through what minimal angle about the 6-fold principal axis does the pattern align?',
        options: ['30°', '60°', '90°'],
        answer: 1,
        explain: '360°/6 = 60°.',
      },
      {
        question: 'How many 2-fold axes does point group 6/mmm have?',
        options: ['3', '6', '12'],
        answer: 1,
        explain: 'All 6 lie in the plane perpendicular to the principal axis, 30° apart.',
      },
    ],
  },
  'pointgroup-432': {
    lesson: [
      {
        title: 'Guess first: how many axes?',
        body: 'This pattern only rotates, never reflects. Count the axes that can flash: through face centers, through body diagonals, through edge midpoints — how many of each?',
        anchor: 'cubeCorner',
      },
      {
        title: 'The skeleton: 3 fourfold axes',
        body: 'Click any face-center axis: a 90° rotation flashes into alignment. The three axes along x, y and z are mutually perpendicular — the skeleton of cubic symmetry.',
        anchor: 'element-0',
      },
      {
        title: '3-fold axes on the body diagonals',
        body: 'Click a body-diagonal axis: a 120° rotation flashes into alignment. Each of the four body diagonals hides one such axis — it is what gives the cube its "corner symmetry".',
        anchor: 'element-3',
      },
      {
        title: 'Wrap-up: 2-fold axes and chirality',
        body: 'Click an axis through opposite edge midpoints: a 180° rotation aligns. The list contains axes only, not a single mirror — 432 is a chiral point group.',
        anchor: 'element-7',
      },
    ],
    quiz: [
      {
        question: 'How many 3-fold axes does a cube have?',
        options: ['3', '4', '6'],
        answer: 1,
        explain: 'One along each of the four body diagonals — 4 in total.',
      },
      {
        question: 'Why is 432 a chiral point group?',
        options: ['It has too many axes', 'It has neither mirrors nor inversion', 'Its order 24 is even'],
        answer: 1,
        explain: 'Only groups containing no "hand-flipping" operation (mirror, inversion, rotoinversion axis) can be chiral.',
      },
    ],
  },
  'pointgroup-43m': {
    lesson: [
      {
        title: 'Guess first: the tetrahedron\'s symmetry',
        body: 'A regular tetrahedron hides in the pattern. Guess its symmetry elements first: axes of what orders? How many mirrors? Is there a center of symmetry?',
        anchor: 'cubeCorner',
      },
      {
        title: 'The strange -4 axes',
        body: 'Click an edge-direction axis: a bare 90° turn does not match — "rotate 90°, then flip" is what flashes. This is the rotoinversion axis -4, not an ordinary 4-fold axis.',
        anchor: 'element-0',
      },
      {
        title: 'Still 3-fold on the body diagonals',
        body: 'Click a body-diagonal axis: a 120° rotation flashes into alignment. These 4 C3 axes are the skeleton shared with 432.',
        anchor: 'element-5',
      },
      {
        title: 'Wrap-up: mirrors but no center',
        body: 'Click a mirror to fold and flash, yet no inversion center can be found. This missing center is what gives zincblende its polar directions and piezoelectricity.',
        anchor: 'element-10',
      },
    ],
    quiz: [
      {
        question: 'Where is the center of symmetry of point group -43m?',
        options: ['At the cube center', 'Inside the tetrahedron', 'It does not exist'],
        answer: 2,
        explain: 'Td contains no inversion: the object and its "through-the-center image" do not coincide.',
      },
      {
        question: 'What is the point group of zincblende ZnS?',
        options: ['m-3m', '432', '-43m'],
        answer: 2,
        explain: 'Zincblende: space group F-43m, point group -43m; diamond corresponds to m-3m.',
      },
    ],
  },
  'pointgroup-m3m': {
    lesson: [
      {
        title: 'Guess first: how many axes, how many mirrors?',
        body: 'The cubic pattern is the "top configuration" of the point-group world. Guess the totals first, then reveal one by one: 13 axes, 9 mirrors, 1 center.',
        anchor: 'cubeCorner',
      },
      {
        title: 'Three tiers of axes: 4, 3, 2',
        body: 'Click a 4-fold axis (90°), a 3-fold axis (120°) and a 2-fold axis (180°) in turn: each rotation flashes into alignment — 13 axes in total.',
        anchor: 'element-0',
      },
      {
        title: 'Nine mirrors',
        body: 'Click a {100} coordinate-plane mirror first, then a {110} diagonal mirror: the 3+6 folding actions stack layer upon layer.',
        anchor: 'element-13',
      },
      {
        title: 'Wrap-up: one point at the center',
        body: 'Click the inversion center: every point passes through to the opposite side. With all 48 group elements in place, NaCl and Cu live in this palace of symmetry.',
        anchor: 'inversion',
      },
    ],
    quiz: [
      {
        question: 'How many 4-fold axes does a cube have?',
        options: ['3', '4', '6'],
        answer: 0,
        explain: 'One along each of x, y and z — 3 in total.',
      },
      {
        question: 'What is the order of point group m-3m?',
        options: ['24', '48', '96'],
        answer: 1,
        explain: 'The pure-rotation part is 432 (order 24); multiplied by the factor 2 of "with or without inversion", it is 48.',
      },
    ],
  },
  'sg-intro': {
    lesson: [
      {
        title: 'Guess first: how do the two cells differ?',
        body: 'The left and right cells share exactly the same point group, yet their space groups differ. Find the difference first, then click to reveal: the answer hides in the "heart" of the cell.',
        anchor: 'leftCell',
      },
      {
        title: 'Clue: the central motif',
        body: 'Click the central motif: it is not casual decoration but a copy of the vertex motif translated by (½,½,½). This is the I body centering.',
        anchor: 'centeringMotif',
      },
      {
        title: 'Translation weaves the cloth',
        body: 'Click the translation arrow: the whole pattern slides by one period onto itself. The point group governs "a single flower"; translation governs "the entire wallpaper".',
        anchor: 'translationVector',
      },
      {
        title: 'Altogether: 230',
        body: 'Click the right cell to wrap up: 32 point groups, 14 lattices, combined with centering, glides and screws, assemble 230 space groups. A single point group can fan out into several.',
        anchor: 'rightCell',
      },
    ],
    quiz: [
      {
        question: 'What is the fundamental difference between space groups and point groups?',
        options: ['Space groups add translations', 'Space groups always have larger order', 'Space groups apply only to the cubic system'],
        answer: 0,
        explain: 'Translations (including centering, glides and screws) are the exclusive ingredient of space groups.',
      },
      {
        question: 'How many crystallographic space groups are there?',
        options: ['32', '14', '230'],
        answer: 2,
        explain: '32 is the number of point groups and 14 the number of Bravais lattices; 230 is the total count of space groups.',
      },
    ],
  },
}
