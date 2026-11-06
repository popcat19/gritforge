export type Note = { start: number; length: number; pitch: number };
export type Pattern = { length: number; notes: Note[] };

export function addNote(p: Pattern, n: Note): Pattern {
	if (n.start < 0 || n.length <= 0 || n.start + n.length > p.length)
		throw new RangeError("note outside pattern");
	return { ...p, notes: [...p.notes, n].sort((a, b) => a.start - b.start || a.pitch - b.pitch) };
}

export function removeNote(p: Pattern, i: number): Pattern {
	return { ...p, notes: p.notes.filter((_, j) => j !== i) };
}
