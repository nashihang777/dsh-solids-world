import type { Guide } from './types'

export const GUIDES_ATOMIC_EN: Record<string, Guide> = {
  'orbital-1s': {
    lesson: [
      {
        title: 'Shape from quantum numbers',
        body: 'n=1, l=0: no angular structure; the wave function depends only on r. Among the three numbers, l=0 alone guarantees spherical symmetry.',
        anchor: 'nucleus',
      },
      {
        title: 'What an isosurface is',
        body: 'The display shows the surface where |ψ| equals a chosen value. The threshold is a convention, not physics: drag it and the sphere shrinks or swells.',
        anchor: 'bohrRadius',
      },
      {
        title: 'The most probable radius',
        body: 'The radial probability P(r) peaks at r=a₀. Note the distinction: density is maximal at the nucleus, while the probability of finding the electron peaks at a₀.',
      },
    ],
    quiz: [
      {
        question: 'How many nodes does the 1s orbital have?',
        options: ['0', '1', '2'],
        answer: 0,
        explain: 'Node count = n−l−1 = 0. The ground state has no nodes; the wave function has one sign everywhere.',
      },
      {
        question: 'Where is the electron most likely to be found?',
        options: ['At the nucleus (r=0)', 'At the Bohr radius a₀', 'At infinity'],
        answer: 1,
        explain: 'Density peaks at the nucleus, but multiplied by shell volume, P(r)=4πr²|ψ|² peaks at a₀.',
      },
    ],
  },
  'orbital-2s': {
    lesson: [
      {
        title: 'One more radial node',
        body: 'n=2 with l=0: still no angular structure, but R(r) now crosses zero once. Nodes = n−l−1 = 1, located at r=2a₀.',
        anchor: 'nodeShell',
      },
      {
        title: 'Two shells, opposite phases',
        body: 'The golden nodal sphere splits space in two: inner sphere one phase (amber), outer shell the opposite (cyan). Lower the opacity to see the inner layer.',
        anchor: 'nucleus',
      },
      {
        title: 'Two probability peaks',
        body: 'The 2s radial probability has a small inner peak and a large outer one near 5.2 a₀. Larger n means the electron lives farther out on average.',
        anchor: 'outerPeak',
      },
    ],
    quiz: [
      {
        question: 'What shape is the 2s node?',
        options: ['A plane', 'A sphere', 'A cone'],
        answer: 1,
        explain: 'With l=0 there are no angular nodes; the radial node is a concentric sphere (r=2a₀).',
      },
      {
        question: 'Which is lower in energy, 2s or 2p (in a free hydrogen atom)?',
        options: ['2s lower', '2p lower', 'Equal'],
        answer: 2,
        explain: 'Hydrogen levels depend only on n: 2s and 2p are degenerate. Only multi-electron atoms split them via penetration.',
      },
    ],
  },
  'orbital-2p': {
    lesson: [
      {
        title: 'Origin of the dumbbell',
        body: 'l=1 brings one angular node: ψ vanishes on a whole plane. Each side of the plane forms a lobe — a dumbbell by construction.',
        anchor: 'nodeCenter',
      },
      {
        title: 'Lobes with opposite phases',
        body: 'The amber lobe has ψ>0, the cyan lobe ψ<0. The sign does not affect probability, but it decides how orbitals interfere — the origin of bond directionality.',
        anchor: 'lobeTop',
      },
      {
        title: 'Three perpendicular siblings',
        body: 'Switch to "all three": pz along z, px and py along x and y, three dumbbells stacked orthogonally. Same energy (degenerate), different orientation.',
        anchor: 'lobeBottom',
      },
    ],
    quiz: [
      {
        question: 'Are the node planes of the three p orbitals mutually perpendicular?',
        options: ['Yes, pairwise perpendicular', 'No, parallel', 'No fixed relation'],
        answer: 0,
        explain: 'pz, px, py have node planes z=0, x=0, y=0 — pairwise perpendicular.',
      },
      {
        question: 'The node plane of pz is?',
        options: ['The z=0 plane', 'The x=0 plane', 'A sphere at 2a₀'],
        answer: 0,
        explain: 'pz ∝ z: it vanishes wherever z=0 — the "cut" between the two lobes.',
      },
    ],
  },
  'orbital-3d-xy': {
    lesson: [
      {
        title: 'Four cuts, four lobes',
        body: 'Two perpendicular planar nodes (x=0 and y=0) quarter space into four lobes. The lobes point along 45° diagonals, not along the axes.',
        anchor: 'nodePlaneX',
      },
      {
        title: 'Alternating phases',
        body: 'Going around the z axis the phase flips four times: diagonals match, neighbors oppose. The subscript xy says it: dxy ∝ x·y.',
        anchor: 'lobeQuadrant',
      },
      {
        title: 'A fivefold family',
        body: 'The d family has five orbitals (dxy, dyz, dxz, dx²−y², dz²), degenerate in a free atom. Crystal fields split them by orientation (eg/t₂g).',
      },
    ],
    quiz: [
      {
        question: 'How many node planes does dxy have?',
        options: ['1', '2', '3'],
        answer: 1,
        explain: 'l−|m|=0 conical nodes plus |m|=2 planar nodes — two perpendicular planes.',
      },
      {
        question: 'The phase pattern of the four dxy lobes is?',
        options: ['All the same', 'Adjacent opposite, diagonal same', 'Random'],
        answer: 1,
        explain: 'The sign alternates four times around the axis: +−+−.',
      },
    ],
  },
  'orbital-3d-z2': {
    lesson: [
      {
        title: 'The odd one out',
        body: 'dz² is the maverick of the d family: two lobes along z plus an equatorial ring. The other four d orbitals are four-lobed; only this one is not.',
        anchor: 'lobeTop',
      },
      {
        title: 'Where the ring comes from',
        body: 'The harmonic (3cos²θ−1): −1 at the equator (θ=90°), +2 at the poles. Between the two signs sit two conical nodes.',
        anchor: 'ringBand',
      },
      {
        title: 'Ring opposes lobes',
        body: 'The equatorial band is opposite in phase to the polar lobes (cyan vs amber). It is not "a ring glued to lobes" — one indivisible solution.',
        anchor: 'lobeTop',
      },
    ],
    quiz: [
      {
        question: 'The nodes of dz² are?',
        options: ['Two planes', 'Two cones', 'One sphere'],
        answer: 1,
        explain: 'cos²θ=1/3 gives two cones about the z axis (θ≈54.7°, 125.3°).',
      },
      {
        question: 'The phase relation between the dz² ring and lobes?',
        options: ['The same', 'Opposite', 'Partly the same'],
        answer: 1,
        explain: '(3cos²θ−1) is negative at the equator and positive at the poles: ring opposite to lobes.',
      },
    ],
  },
  'electron-cloud-1s': {
    lesson: [
      {
        title: 'Fog is probability',
        body: 'Each dot is one virtual sample of |ψ|². Thicker fog means higher probability density there — the most literal translation of "electron cloud".',
        anchor: 'nucleus',
      },
      {
        title: 'Bohr\'s orbit vs the quantum fog',
        body: 'The golden sphere marks r=a₀. Bohr imagined the electron riding on the shell; quantum mechanics only promises "most likely found nearby".',
        anchor: 'bohrShell',
      },
      {
        title: 'No boundary',
        body: 'The fog only thins outward; it never truly ends. Defining the "atomic radius" as the 90% sphere gives r≈2.66 a₀.',
        anchor: 'cloudEdge',
      },
    ],
    quiz: [
      {
        question: 'What does the fog density represent?',
        options: ['Electron speed', 'Probability density of finding the electron', 'Electron charge'],
        answer: 1,
        explain: 'Dot density ∝ |ψ|², the probability density of a position measurement.',
      },
      {
        question: 'Where is the 1s cloud thickest?',
        options: ['At the nucleus', 'Near the Bohr radius', 'Uniformly spread'],
        answer: 1,
        explain: 'Density peaks at the nucleus, but multiplied by volume the visually thickest band sits near a₀.',
      },
    ],
  },
  'radial-distribution': {
    lesson: [
      {
        title: 'Why multiply by r²',
        body: 'A thin shell\'s volume is 4πr²·dr: larger radius, more room per shell. P(r)=4πr²|ψ|² therefore shifts the peak outward.',
        anchor: 'origin',
      },
      {
        title: 'The 1s single peak',
        body: 'The gold curve rises from zero, peaks at a₀, and decays exponentially. Drag the slider: the highlighted shell slides along the curve with live r and P(r) readouts.',
        anchor: 'peak1s',
      },
      {
        title: 'The 2s double peak and shells',
        body: 'The cyan curve rises twice, dipped by the node in between. What chemists call "shells" are exactly these probability peaks.',
        anchor: 'peak2s',
      },
    ],
    quiz: [
      {
        question: 'Where does the 1s P(r) peak?',
        options: ['r=0', 'r=a₀', 'r=2a₀'],
        answer: 1,
        explain: 'The extremum of r²e^(−2r) is at r=1 (the Bohr radius).',
      },
      {
        question: 'How do P(r) and |ψ|² differ?',
        options: ['No difference', 'P(r) includes the 4πr² volume factor', 'P(r) is twice |ψ|²'],
        answer: 1,
        explain: 'Shell volume grows as r², pushing the peak from the nucleus out to a₀.',
      },
    ],
  },
  'bohr-model': {
    lesson: [
      {
        title: 'Discrete orbits',
        body: 'Bohr postulated angular momentum quantized in units of nℏ: orbit radii rₙ=0.529n² Å. Electrons run stably on these circles without radiating.',
        anchor: 'level-1',
      },
      {
        title: 'The level formula',
        body: 'Eₙ=−13.6/n² eV. Larger n means higher energy (closer to zero); as n→∞ the electron escapes — ionization.',
        anchor: 'level-3',
      },
      {
        title: 'Click a ring to transition',
        body: 'Click any ring: the electron arcs to that level — inward jumps emit a photon (golden ray), outward jumps absorb one. The toast shows ΔE.',
        anchor: 'photonPath',
      },
      {
        title: 'A semiclassical legacy',
        body: 'Quantum mechanics replaced the "orbits", but the level formula and transition idea survived intact — Bohr built the bridge to it.',
      },
    ],
    quiz: [
      {
        question: 'The energy of the n=2 orbit is?',
        options: ['−13.6 eV', '−6.8 eV', '−3.4 eV'],
        answer: 2,
        explain: 'E₂=−13.6/4=−3.4 eV.',
      },
      {
        question: 'The photon energy for a 2→1 jump is?',
        options: ['3.4 eV', '10.2 eV', '13.6 eV'],
        answer: 1,
        explain: 'ΔE=|E₁−E₂|=13.6×(1−1/4)=10.2 eV — Lyman α.',
      },
    ],
  },
  'shell-structure': {
    lesson: [
      {
        title: 'Filling layer by layer',
        body: 'Multi-electron atoms fill by principal quantum number: K (n=1) holds at most 2, L (n=2) at most 8. Pauli\'s principle fixes each shell\'s capacity at 2n².',
        anchor: 'shell-k',
      },
      {
        title: 'Sodium\'s three layers',
        body: 'K with 2 and L with 8 fill up first, wrapping the nucleus like an onion. Together these 10 form the "core".',
        anchor: 'shell-l',
      },
      {
        title: 'The lonely valence electron',
        body: 'The 11th electron lands in M — farthest out, loosest bound. Steal it and sodium becomes Na⁺: all of sodium\'s chemistry is this one electron\'s story.',
        anchor: 'valenceElectron',
      },
    ],
    quiz: [
      {
        question: 'How many valence electrons does sodium have?',
        options: ['1', '2', '8'],
        answer: 0,
        explain: 'Na configuration 1s²2s²2p⁶3s¹: the outermost (M) shell has just one 3s electron.',
      },
      {
        question: 'The theoretical capacity of the M shell (n=3) is?',
        options: ['8', '18', '32'],
        answer: 1,
        explain: 'Capacity 2n²=2×9=18 (3s²3p⁶3d¹⁰).',
      },
    ],
  },
  'hydrogen-levels': {
    lesson: [
      {
        title: 'A crowding ladder',
        body: 'Eₙ=−13.6/n²: from −13.6 eV at the ground state the steps narrow as 1/n², merging into a continuum (ionization) as n→∞.',
        anchor: 'level-1',
      },
      {
        title: 'Arrows are spectral lines',
        body: 'Each arrow\'s length is proportional to its photon energy. Arrows ending at n=1 are ultraviolet (Lyman); those ending at n=2 are visible (Balmer).',
        anchor: 'balmer-alpha',
      },
      {
        title: 'The red of Hα',
        body: 'The 3→2 transition at 1.89 eV, wavelength 656.3 nm — the reddest line of hydrogen, the red glow of hydrogen in neon signs.',
        anchor: 'level-2',
      },
    ],
    quiz: [
      {
        question: 'Balmer-series transitions all end on which level?',
        options: ['n=1', 'n=2', 'n=3'],
        answer: 1,
        explain: 'Transitions ending at n=2 fall in the visible range — the Balmer series.',
      },
      {
        question: 'The wavelength of Hα (3→2) is about?',
        options: ['121.6 nm', '486.1 nm', '656.3 nm'],
        answer: 2,
        explain: '1.89 eV corresponds to 656.3 nm red; 486.1 nm is Hβ (4→2).',
      },
    ],
  },
  'fine-splitting': {
    lesson: [
      {
        title: 'Spin is a tiny magnet',
        body: 'The electron carries a spin magnetic moment. Orbiting the nucleus, it sees the nucleus circling — a magnetic field. Aligned or anti-aligned, its energy differs.',
        anchor: 'level2pThree',
      },
      {
        title: 'One level becomes two',
        body: '2p splits into ₂p₁/₂ (lower) and ₂p₃/₂ (upper), corresponding to j=l±½. The splitting scales as α² — parts in a hundred thousand.',
        anchor: 'level2pHalf',
      },
      {
        title: 'Twin yellow lines',
        body: 'Sodium\'s valence electron falls from the split levels to the ground state, emitting two yellow lines at 589.0 and 589.6 nm (the D doublet). The gap here is enlarged a thousandfold.',
        anchor: 'dLinePair',
      },
    ],
    quiz: [
      {
        question: 'The cause of the sodium D doublet is?',
        options: ['Two isotopes', 'Spin-orbit splitting of levels', 'Doppler broadening'],
        answer: 1,
        explain: 'Coupling of spin to the orbital field splits 3p into two levels, doubling the line.',
      },
      {
        question: 'How does spin-orbit splitting scale with atomic number Z?',
        options: ['Grows as Z⁴', 'Independent of Z', 'Decreases with Z'],
        answer: 0,
        explain: 'Splitting ∝ Z⁴: fine structure is far more prominent in heavy atoms.',
      },
    ],
  },
}
