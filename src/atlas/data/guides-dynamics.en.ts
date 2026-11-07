import type { Guide } from './types'

export const GUIDES_DYNAMICS_EN: Record<string, Guide> = {
  'wave-1d-mono': {
    lesson: [
      {
        title: 'What a lattice wave is',
        body: 'Identical atoms coupled by springs: any disturbance propagates along the chain as a wave — the lattice wave is a normal mode of lattice vibration, with the whole chain oscillating at one frequency.',
        anchor: 'chainStart',
      },
      {
        title: 'Drag the wavelength slider',
        body: 'Drag the wavelength from 12a down to 3a: the envelope grows denser and the phase difference 2πa/λ between neighbouring atoms widens. The shortest possible wavelength is 2a — anything shorter is equivalent to a longer wave.',
        anchor: 'curve',
      },
      {
        title: 'Travelling wave and phase lag',
        body: 'Watch the tail atom: its step always lags behind the head, and the lag accumulates with distance. Two counter-propagating travelling waves superpose into the standing wave of a finite chain.',
        anchor: 'lastAtom',
      },
      {
        title: 'The long-wave limit',
        body: 'Drag the wavelength back to its maximum: the chain heaves almost in unison and its discreteness vanishes — the dispersion ω=√(4K/M)|sin(ka/2)| becomes linear ω≈vk for ka≪1, exactly a continuous elastic wave.',
        anchor: 'chainEnd',
      },
    ],
    quiz: [
      {
        question: 'When the wavelength is exactly 2a, what is the phase difference between neighbouring atoms?',
        options: ['π (antiphase)', 'π/2', '2π (in phase)'],
        answer: 0,
        explain: 'Phase difference = 2πa/λ = 2πa/2a = π: neighbours exactly in antiphase, corresponding to the zone boundary k=π/a.',
      },
      {
        question: 'In the long-wave limit (λ≫a), a lattice wave approaches?',
        options: ['Independent vibration of a single atom', 'An elastic wave in a continuum', 'A motionless standing wave of zero frequency'],
        answer: 1,
        explain: 'For λ≫a the discrete lattice behaves as a continuum; the dispersion becomes linear ω≈vk, an ordinary sound wave.',
      },
    ],
  },
  'wave-1d-di': {
    lesson: [
      {
        title: 'Two species, two branches',
        body: 'M and m alternate along the chain, and each wavevector yields two solutions. Toggle the branch button to the acoustic branch, then to the optical — one row of atoms, two very different dances.',
        anchor: 'pair',
      },
      {
        title: 'Switch branches and watch the phase',
        body: 'In the acoustic branch neighbouring big and small atoms swing in phase — at long wavelength the whole chain drifts like a rigid body with ω→0; in the optical branch they pull against each other, even at k=0.',
        anchor: 'smallAtom',
      },
      {
        title: 'Who moves more',
        body: 'At k=0 the optical branch keeps the center of mass fixed: u_M = −(m/M)u_m. This demo takes M=2m — watch the big atom: its amplitude is exactly half of the small one.',
        anchor: 'bigAtom',
      },
      {
        title: 'The frequency gap',
        body: 'Switch back and forth and compare frequencies: the top of the acoustic branch never reaches the bottom of the optical branch. Waves in this gap cannot propagate along the chain — Bragg reflection turns them back.',
        anchor: 'chainStart',
      },
    ],
    quiz: [
      {
        question: 'In the optical branch at k=0, how do the two kinds of atom move?',
        options: ['In phase with equal amplitudes', 'In antiphase with a fixed center of mass', 'Only the small atom vibrates'],
        answer: 1,
        explain: 'The k=0 optical mode: M and m vibrate in antiphase, with u_M=−(m/M)u_m keeping the center of mass still.',
      },
      {
        question: 'The frequency of the acoustic branch in the long-wave limit (k→0) approaches?',
        options: ['Zero', '√(2K/m)', 'Infinity'],
        answer: 0,
        explain: 'The long-wave acoustic branch has ω→0: the whole chain translates in phase, like a sound wave in a continuum.',
      },
    ],
  },
  'wave-3d-mode': {
    lesson: [
      {
        title: 'One frequency for all',
        body: 'A single normal mode: every atom vibrates at one common frequency, with displacements distributed as e^(i(k·r−ωt)). The timing offset between the center and a corner is decided entirely by k·r.',
        anchor: 'latticeCenter',
      },
      {
        title: 'Switch the k direction',
        body: 'Switch among [100], [110] and [111]: the orientation and spacing of the ripples change at once. The same |k| gives different frequencies along different directions — 3D dispersion is anisotropic.',
        anchor: 'latticeCorner',
      },
      {
        title: 'Transverse polarization',
        body: 'Atoms oscillate perpendicular to k (transverse wave). Watch the phase mismatch between the far atom and the benchmark corner: the shorter the wavelength, the clearer the mismatch.',
        anchor: 'latticeFar',
      },
      {
        title: 'From modes to phonons',
        body: 'A crystal of N atoms has 3N normal modes in total. Quantized, the energy quantum of each mode is a phonon — heat capacity, thermal conduction and resistivity all start from this inventory.',
      },
    ],
    quiz: [
      {
        question: 'Within one normal mode, the vibration frequencies of the atoms are?',
        options: ['All different', 'Exactly the same', 'Randomly distributed'],
        answer: 1,
        explain: 'A normal mode is by definition single-frequency: u ∝ e^(i(k·r−ωt)); position only changes the phase.',
      },
      {
        question: 'This entry shows a transverse wave: the atoms displace?',
        options: ['Parallel to k', 'Perpendicular to k', 'In random directions'],
        answer: 1,
        explain: 'Transverse polarization: displacement ⊥ propagation direction k (a longitudinal wave would be parallel).',
      },
    ],
  },
  'thermal-expansion': {
    lesson: [
      {
        title: 'A symmetric potential never expands',
        body: 'If the well were a strict parabola (left-right symmetric), heating would only widen the swing while the mean spacing stayed untouched — the expansion coefficient of a harmonic crystal is zero.',
        anchor: 'potentialWell',
      },
      {
        title: 'Drag the temperature slider',
        body: 'Drag the temperature slowly from 0 to 1: the energy level rises, the amplitude grows, and the left and right turning points move farther apart — but not symmetrically.',
        anchor: 'energyLevel',
      },
      {
        title: 'Asymmetric turning points',
        body: 'The real potential has a steep left wall and a gentle right wall: with the same energy the atom swings farther to the right. Its time-averaged position shifts rightward — thermal expansion happens.',
        anchor: 'rightAtom',
      },
      {
        title: 'Expansion relative to what',
        body: 'The left atom is pinned as the reference: the outward drift of the right atom, divided by the initial spacing and by the temperature rise, is the linear expansion coefficient — set by the cubic anharmonic term of the potential.',
        anchor: 'fixedAtom',
      },
    ],
    quiz: [
      {
        question: 'Under the harmonic approximation (symmetric parabolic potential), does heating change the mean atomic spacing?',
        options: ['It increases', 'It does not change', 'It decreases'],
        answer: 1,
        explain: 'In a symmetric potential the mean position stays at the well bottom: a harmonic crystal does not expand; expansion comes from anharmonicity.',
      },
      {
        question: 'The microscopic cause of thermal expansion is?',
        options: ['Atoms themselves grow in volume', 'Larger amplitude combined with an asymmetric well', 'Heating creates new atoms'],
        answer: 1,
        explain: 'In an asymmetric potential, the larger the amplitude, the more the mean position leans toward the gentle wall — expansion is an anharmonic effect.',
      },
    ],
  },
  'harmonic-vs-anharmonic': {
    lesson: [
      {
        title: 'Side by side',
        body: 'The left oscillator lives in a parabolic potential, the right one in the real LJ potential. Set the energy slider to its lowest notch first: the two keep almost the same step — the harmonic approximation suffices.',
        anchor: 'leftOscillator',
      },
      {
        title: 'Drag the energy slider',
        body: 'Raise the energy slowly: the left oscillator keeps its beat while the right one swings ever more slowly — at large amplitude the real potential flattens and the period stretches (softening).',
        anchor: 'rightOscillator',
      },
      {
        title: 'Isochronism',
        body: 'The parabolic potential F=−kx yields the single frequency √(k/m), independent of amplitude — this is isochronism. The small-angle pendulum clock is "isochronous" by exactly the same reasoning.',
        anchor: 'parabolaWell',
      },
      {
        title: 'The boundary of the approximation',
        body: 'The parabola is only the leading term of the Taylor expansion about the well bottom; once the amplitude grows, the cubic and quartic terms take over. The validity boundary of the harmonic approximation is written where the two potential curves part.',
        anchor: 'ljWell',
      },
    ],
    quiz: [
      {
        question: 'For an oscillator in a parabolic potential, the period versus amplitude is?',
        options: ['Larger amplitude, longer period', 'Independent (isochronism)', 'Larger amplitude, shorter period'],
        answer: 1,
        explain: 'The harmonic frequency ω=√(k/m) depends only on stiffness and mass, never on amplitude.',
      },
      {
        question: 'In the real atomic potential, the period of a large-amplitude oscillation will?',
        options: ['Grow longer (softening)', 'Stay the same', 'Grow shorter'],
        answer: 0,
        explain: 'Far from the well bottom the potential is gentler than a parabola and the restoring force weakens — the oscillator slows and the period softens longer.',
      },
    ],
  },
}
