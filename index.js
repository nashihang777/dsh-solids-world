/**
 * Host half of the solids-world bundle.
 *
 * The atlas is a Client-side experience: the 53 entries, their 3D builders, the
 * lessons and quizzes, the CIF parser and the note store all run in the page.
 * Nothing needs a Host service, so this half only exists so the bundle can own
 * a profile row and expose its display metadata.
 */
export function apply() {}
