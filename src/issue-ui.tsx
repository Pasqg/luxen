import React from "react";
import {
    Box,
    Button,
    Chip,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItemButton,
    ListItemText, TextField,
    Typography,
} from "@mui/material";
import {Issue, issueWithStatus, newIssue} from "./datamodel";
import {Runnable} from "./utils";
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsColorOverrides} from "@mui/material/Chip/Chip";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {createIssue, setIssueStatus} from "./server-api";

type IssuePanelProp = { issue: Issue, onChange: (issue: Issue) => void }

//TextField default value is not used when calculating dom difference, so when we click another issue
//it looks like the text field hasn't changed (even though default value changed). For this reason
//we need to modify anothger property as well. In this case "key"
//Apparently this could cause leaking memory? Better to keep an eye on it
export class IssuePanel extends React.Component<IssuePanelProp> {

    private setIssueStatus(status: string): void {
        let updatedIssue: Issue = issueWithStatus(this.props.issue, status);
        setIssueStatus(updatedIssue,
            () => {
                this.setState({issueStatus: status});
                this.forceUpdate();
            },
            () => alert("Failed to update issue"));
        this.props.onChange(updatedIssue);
    }

    render() {
        return <Box sx={{flexGrow: 5, margin: 2}}>
            <Chip label={this.props.issue.status} color={statusColor(this.props.issue.status)} sx={{margin: 2, marginTop: 0}}/>
            <Typography variant="h4" color="primary" sx={{display: "inline"}}>
                {this.props.issue.project_id + "-" + this.props.issue.id}
            </Typography>
            <ArrowRightIcon color="disabled"/>
            <Typography variant="h4" color="primary" sx={{display: "inline"}}>{this.props.issue.title}</Typography>
            <TextField key={this.props.issue.id} label="Description" fullWidth defaultValue={this.props.issue.description}
                       multiline minRows={6} maxRows={10}
                       sx={{display: "block", margin: 2, width: "50vw"}}/>
            {this.props.issue.status === "Open"
                ? <Button variant="contained" color="primary" sx={{margin: 2}}
                          onClick={() => this.setIssueStatus("In progress")}>Start progress</Button>
                : this.props.issue.status === "In progress"
                    ? <Button variant="contained" color="primary" sx={{margin: 2}}
                              onClick={() => this.setIssueStatus("Done")}>Close issue</Button>
                    : null}
            {this.props.issue.status !== "Open"
                ? <Button variant="contained" color="primary" sx={{margin: 2}}
                          onClick={() => this.setIssueStatus("Open")}>Re-open</Button>
                : null}
        </Box>;
    }
}

type IssueListProp = { issues: Array<Issue>, onIssueClick: (issue: Issue) => void };

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
                        <ListItemButton component="div" onClick={() => this.props.onIssueClick(issue)}>
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
                    createIssue(newIssue(this.state.project, this.state.title, this.state.description),
                        this.props.onSuccess,
                        this.props.onFailure);
                    this.props.onClose();
                }}>Create</Button>
            </DialogActions>
        </Dialog>;
    }
}