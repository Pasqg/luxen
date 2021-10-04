
export type Issue = { project_id: string, id: number, title: string, description: string, status: string};

export function newIssue(project: string, title: string, description: string): Issue {
    return {project_id: project, title: title, description: description, id: 0, status: "Unknown"};
}