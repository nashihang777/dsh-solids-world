import type { Guide } from './types'

export const GUIDES_EN: Record<string, Guide> = {
  nacl: {
    lesson: [
      {
        title: 'Two interpenetrating lattices',
        body: 'View Na⁺ and Cl⁻ separately: each forms a complete face-centred cubic lattice, and the two interpenetrate after a half-edge translation.',
        anchor: 'na-site',
      },
      {
        title: 'Every octahedral void filled',
        body: 'Seen from the Na⁺ sublattice, Cl⁻ fills all octahedral voids--the count of octahedral voids equals the site count, hence coordination 6.',
        anchor: 'cl-site',
      },
      {
        title: 'The electrostatic ledger',
        body: 'Each Na⁺ has 6 Cl⁻ neighbours at 2.82 Å; unlike-charge attraction outweighs like-charge repulsion and stabilises the lattice.',
        anchor: 'na-cl-bond',
      },
      {
        title: 'Why (001) cleaves',
        body: 'Cleaving along (001) only breaks the electrostatic interaction between a Na⁺ layer and a Cl⁻ layer, which is far easier than cutting through a layer.',
      },
    ],
    quiz: [
      {
        question: 'In the rock salt structure, Cl⁻ occupies which sites relative to the Na⁺ sublattice?',
        options: ['All tetrahedral voids', 'All octahedral voids', 'Half of the octahedral voids'],
        answer: 1,
        explain: 'The number of octahedral voids in fcc equals the number of lattice sites, and all are filled by Cl⁻, giving coordination 6.',
      },
      {
        question: 'How many nearest-neighbour Cl⁻ surround each Na⁺?',
        options: ['4', '6', '8'],
        answer: 1,
        explain: 'Regular octahedral coordination: 6 neighbours.',
      },
    ],
  },
  diamond: {
    lesson: [
      {
        title: 'fcc + two-atom basis',
        body: 'The Bravais lattice is fcc, but each site carries two atoms: one on the site itself, one a quarter along the body diagonal.',
        anchor: 'c-atom',
      },
      {
        title: 'Body-diagonal offset',
        body: 'The second atom is offset by (¼,¼,¼), forming the inner interpenetrating sublattice; atoms of the two sublattices strictly alternate.',
        anchor: 'inner-c',
      },
      {
        title: 'Tetrahedral coordination',
        body: 'Every atom has 4 nearest neighbours forming a regular tetrahedron with 109.47° bond angles--the direction of sp³ hybrids.',
        anchor: 'c-c-bond',
      },
    ],
    quiz: [
      {
        question: 'In the diamond structure, the second basis atom is translated by which vector?',
        options: ['(½,½,0)', '(¼,¼,¼)', '(½,½,½)'],
        answer: 1,
        explain: 'A quarter along the body diagonal; (½,½,0) is the face-centring translation and would stay on the same sublattice.',
      },
      {
        question: 'How many atoms are in the diamond conventional cell?',
        options: ['4', '8', '12'],
        answer: 1,
        explain: '4 from the fcc sites plus 4 second-basis atoms: 8 in total.',
      },
    ],
  },
  cscl: {
    lesson: [
      {
        title: 'Two interpenetrating simple-cubic lattices',
        body: 'Separate the ions: Cs⁺ forms one simple-cubic lattice, Cl⁻ another translated into the body centres.',
        anchor: 'cs-site',
      },
      {
        title: 'Cl⁻ at the body centre',
        body: 'Seen from the Cs⁺ lattice, Cl⁻ sits exactly in the cubic void (body centre); the void count equals the site count.',
        anchor: 'cl-site',
      },
      {
        title: 'Eight neighbours along diagonals',
        body: 'Nearest neighbours lie along the body diagonals; each ion is surrounded by 8 unlike ions forming a cube.',
        anchor: 'cs-cl-bond',
      },
      {
        title: 'It is not BCC',
        body: 'BCC means one kind of lattice point plus a body-centring translation; CsCl is a simple Bravais lattice with a two-atom basis. Test: is the translated ion identical?',
      },
    ],
    quiz: [
      {
        question: 'What is the Bravais lattice of the CsCl structure?',
        options: ['Body-centred cubic BCC', 'Simple cubic', 'Face-centred cubic FCC'],
        answer: 1,
        explain: 'Each ion forms a simple-cubic lattice; BCC describes a single set of identical points and cannot describe the two-ion interpenetration.',
      },
      {
        question: 'How many unlike nearest neighbours does each ion have?',
        options: ['6', '8', '12'],
        answer: 1,
        explain: 'Eight, along the body diagonals.',
      },
    ],
  },
}
