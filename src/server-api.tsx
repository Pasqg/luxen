import {Issue} from "./datamodel";
import {Runnable} from "./utils";

const port: string = "5003";
const host: string = "localhost";
const protocol: string = "http";

export async function fetchIssues(onSuccess: (issues: Array<Issue>) => void, limit: number, open: boolean): Promise<void> {
    const endpoint: string = open ? "open-issues" : "all-issues";
    await fetch(protocol + "://" + host + ":" + port + "/" + endpoint + "/" + limit, {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json; charset=UTF-8",
        },
        body: null,
    }).then(function (res) {
        return res.json();
    }).then(function (data) {
        onSuccess(data);
    }).catch((error) => {
        console.log(error);
    });
}

export async function createIssue(issue: Issue, onSuccess: Runnable, onFailure: Runnable): Promise<void> {
    await fetch(protocol + "://" + host + ":" + port
        + "/issue/create/" + issue.project_id + "/" + encodeURIComponent(issue.title) + "/" + encodeURIComponent(issue.description), {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json; charset=UTF-8",
        },
        body: null,
    }).then(function (res) {
        return res.json();
    }).then(function () {
        onSuccess();
    }).catch((error) => {
        console.log(error);
        onFailure();
    });
}