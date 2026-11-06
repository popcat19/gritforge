export type Note = {
	start: number;
	length: number;
	pitch: number;
	offset?: number;
	rate?: number;
	reverse?: boolean;
	velocity?: number;
};
export type Pattern = { length: number; notes: Note[] };

export function addNote(p: Pattern, n: Note): Pattern {
	if (n.start < 0 || n.length <= 0 || n.start + n.length > p.length)
		throw new RangeError("note outside pattern");
	if (n.offset !== undefined && (n.offset < 0 || n.offset >= 1)) throw new RangeError("offset outside 0..1");
	if (n.rate !== undefined && n.rate <= 0) throw new RangeError("rate must be positive");
	if (n.velocity !== undefined && (n.velocity < 0 || n.velocity > 1)) throw new RangeError("velocity outside 0..1");
	return { ...p, notes: [...p.notes, n].sort((a, b) => a.start - b.start || a.pitch - b.pitch) };
}

export function removeNote(p: Pattern, i: number): Pattern {
	return { ...p, notes: p.notes.filter((_, j) => j !== i) };
}
