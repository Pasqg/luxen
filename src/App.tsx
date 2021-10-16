import React, {ReactElement} from "react";
import "./App.css";
import {createTheme} from "@mui/material/styles";
import {AppBar, Box, Button, Divider, IconButton, Snackbar, ThemeProvider, Toolbar} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {fetchIssues} from "./server-api";
import {IssueCreationDialog, IssueList, IssuePanel} from "./issue-ui";
import {Runnable} from "./utils";
import {closeableAlert} from "./ui-utils";
import {Issue} from "./datamodel";

const newTheme = createTheme({
    status: {
        danger: "#e53e3e",
    },
    palette: {
        primary: {
            main: "#0971f1",
            darker: "#053e85",
        },
        neutral: {
            main: "#64748b",
            contrastText: "#fff",
        },
        secondary: {
            main: "#ffffff",
            contrastText: "#053e85",
        },
        success: {
            main: "#7adb5b",
            light: "#7adb5b",
            dark: "#437932",
            contrastText: "#1c3415",
        },
        warning: {
            main: "#ffda6a",
            light: "#ffda6a",
            dark: "#a78d4a",
            contrastText: "#ffffff",
        },
    },
    typography: {
        button: {
            textTransform: "none",
        },
    },
});

declare module "@mui/material/styles" {
    interface Theme {
        status: {
            danger: React.CSSProperties["color"];
        };
    }

    interface Palette {
        neutral: Palette["primary"];
    }

    interface PaletteOptions {
        neutral: PaletteOptions["primary"];
    }

    interface PaletteColor {
        darker?: string;
    }

    interface SimplePaletteColorOptions {
        darker?: string;
    }

    interface ThemeOptions {
        status: {
            danger: React.CSSProperties["color"];
        };
    }
}

// Update the Button's color prop options
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

class TopBarButton extends React.Component<{ caption: string, onClick: Runnable }> {
    render(): JSX.Element {
        return <Button variant="text" color="inherit" component="div" sx={{mr: 2}}
                       onClick={this.props.onClick}>{this.props.caption}
        </Button>;
    }
}

class MainPage extends React.Component<{}, {
    currentView: JSX.Element | null,
    currentDialog: JSX.Element | null,
    currentAlert: ReactElement<any, any> | undefined,
    snackBarOpen: boolean,
}> {
    constructor(aProps: {}) {
        super(aProps);
        this.state = {
            currentView: null,
            currentDialog: null,
            currentAlert: undefined,
            snackBarOpen: false,
        };
    }

    private setCurrentView(view: JSX.Element) {
        this.setState({currentView: view});
    }

    private setCurrentDialog(view: JSX.Element | null) {
        this.setState({currentDialog: view});
    }

    private setCurrentAlert(alert: JSX.Element | undefined) {
        this.setState({currentAlert: alert, snackBarOpen: alert !== undefined});
    }

    private issueList(issues: Array<Issue>, selectedIssue: Issue | null): void {
        //todo: has to become IssueView
        this.setCurrentView(<Box sx={{display: "flex", justifyContent: "space-between"}}>
            <IssueList issues={issues} onIssueClick={issue => this.issueList(issues, issue)}/>
            <Divider orientation="vertical" flexItem/>
            {selectedIssue
                ? <IssuePanel issue={selectedIssue} onChange={updatedIssue => {
                    const updatedIssues: Array<Issue> = issues.map(issue =>
                        issue.project_id === updatedIssue.project_id && issue.id === updatedIssue.id
                            ? updatedIssue
                            : issue);
                    this.issueList(updatedIssues, updatedIssue);
                }}/>
                : <Box sx={{flexGrow: 5}}/>}
        </Box>);
    }

    render(): JSX.Element {
        return <ThemeProvider theme={newTheme}>
            <AppBar position="static" color="secondary">
                <Toolbar variant="dense" sx={{display: "flex", justifyContent: "space-between"}}>
                    <Box>
                        <TopBarButton caption="Projects" onClick={() => {
                        }}/>
                        <TopBarButton caption="All issues" onClick={() => {
                            fetchIssues(issues => this.issueList(issues, null), 10, false);
                        }}/>
                        <TopBarButton caption="Open issues" onClick={() => {
                            fetchIssues(issues => this.issueList(issues, null), 10, true);
                        }}/>
                        <Button variant="contained" color="primary"
                                component="div" disableElevation sx={{mr: 2}}
                                onClick={() => {
                                    this.setCurrentDialog(<IssueCreationDialog
                                        onClose={() => this.setCurrentDialog(null)}
                                        onSuccess={() => this.setCurrentAlert(closeableAlert("Issue created",
                                            "success",
                                            () => this.setCurrentAlert(undefined)))}
                                        onFailure={() => this.setCurrentAlert(closeableAlert("Issue creation failed",
                                            "error",
                                            () => this.setCurrentAlert(undefined)))}/>);
                                }}>
                            Create
                        </Button>
                    </Box>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ml: -2}}>
                        <SettingsIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            {this.state.currentView}
            {this.state.currentDialog}
            <Snackbar open={this.state.snackBarOpen}
                      autoHideDuration={6000}
                      anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                      onClose={() => this.setCurrentAlert(undefined)}>
                {this.state.currentAlert}
            </Snackbar>
        </ThemeProvider>;
    }
}

function App() {
    return (<MainPage/>);
}

export default App;
