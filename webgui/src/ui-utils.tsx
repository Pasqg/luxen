import {Alert, AlertColor} from "@mui/material";
import React from "react";
import {Runnable} from "./utils";

export function closeableAlert(message: string, severity: AlertColor, onClose: Runnable) {
    return <Alert variant="filled" severity={severity} onClose={onClose}>{message}</Alert>;
}