import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent, Chip,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Divider,
    List,
    ListItemButton,
    ListItemText, TextField,
    Typography,
} from "@mui/material";
import {Issue, newIssue} from "./datamodel";
import {Runnable} from "./utils";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsColorOverrides} from "@mui/material/Chip/Chip";
import {createIssue} from "./server-api";

export class IssuePanel extends React.Component<Issue> {
    render() {
        return <Card sx={{display: "flex", flexDirection: "column", flexGrow: 6}}>
            <CardContent>
                <Typography color="primary" variant="h4" component="div">Add web server component</Typography>
                <Typography paragraph>Description...</Typography>
            </CardContent>
        </Card>;
    }
}

type IssueListProp = { issues: Array<Issue> };

function statusColor(status: string): OverridableStringUnion<"default" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    ChipPropsColorOverrides> {
    switch (status) {
        case "Done":
            return "success";
        case "Open":
            return "default";
        case "In progress":
            return "warning";
        default:
            return "default";
    }
}

export class IssueList extends React.Component<IssueListProp> {
    private static truncate(str: string, maxSize: number) {
        return str.length > maxSize
            ? str.slice(0, maxSize - 3) + "..."
            : str;
    };

    render(): JSX.Element {
        return <Box sx={{display: "flex"}}>
            <List sx={{flexGrow: 1}}>
                {this.props.issues.map((issue: Issue) => <>
                        <ListItemButton component="div">
                            <ListItemText primary={issue.project_id + "-" + issue.id} secondary={IssueList.truncate(issue.title, 24)}/>
                            <Chip label={issue.status} color={statusColor(issue.status)}/>
                        </ListItemButton>
                        <Divider/>
                    </>,
                )}
            </List>
        </Box>;
    }
}

type DialogProps = { onClose: Runnable, onSuccess: Runnable, onFailure: Runnable };

export class IssueCreationDialog
    extends React.Component<DialogProps, { isOpen: boolean, title: string, project: string, description: string }> {
    constructor(props: DialogProps) {
        super(props);
        this.setState({isOpen: false, title: "", project: "", description: ""});
    }

    render(): JSX.Element {
        return <Dialog open={true} onClose={this.props.onClose}>
            <DialogTitle>Create issue</DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex"}}>
                    <TextField autoFocus margin="dense" id="project" label="Project" type="text" variant="standard"
                               onChange={(value) => this.setState({project: value.target.value})}/>
                    <TextField margin="dense" id="title" label="Title" type="text" variant="standard"
                               onChange={(value) => this.setState({title: value.target.value})}/>
                </Box>
                <Divider/>
                <TextField margin="dense" id="description" label="Description" type="text" fullWidth multiline variant="standard"
                           minRows={3}
                    onChange={(value) => this.setState({description: value.target.value})}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.onClose}>Cancel</Button>
                <Button color="primary" onClick={() => {
                    this.props.onClose();
                    createIssue(newIssue(this.state.project, this.state.title, this.state.description),
                        () => this.props.onSuccess(),
                        () => this.props.onFailure());
                }}>Create</Button>
            </DialogActions>
        </Dialog>;
    }
}