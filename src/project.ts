// Purpose: project file schema. Serializable, flexible, extensible. No host I/O.

export type ProjectVoice = {
	moduleId: string;
	params: Record<string, number>;
};

export type ProjectNote = {
	start: number;
	length: number;
	pitch: number;
	offset?: number;
	rate?: number;
	reverse?: boolean;
	velocity?: number;
	attackMs?: number;
	releaseMs?: number;
};

export type ProjectPattern = {
	length: number;
	notes: ProjectNote[];
};

export type ProjectTrack = {
	voice: ProjectVoice;
	pattern: ProjectPattern;
};

export type Project = {
	format: "gritforge-project";
	version: 1;
	tempo: number;
	tracks: ProjectTrack[];
};

export function emptyProject(tempo = 120): Project {
	return { format: "gritforge-project", version: 1, tempo, tracks: [] };
}

export function addTrack(p: Project, t: ProjectTrack): Project {
	return { ...p, tracks: [...p.tracks, t] };
}
