package cmd

import (
	"encoding/json"
    "io/ioutil"
	"fmt"
	"net/http"
	"os"
    "strings"

	"github.com/spf13/cobra"
)

func fileExists(String luxenFile) bool {
    _, err := os.Stat(luxenFile);
    return err == nil;
}

var serverUrl string

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Creates a new luxen project for the current folder.",
	Long: `Creates a new luxen project for the current folder.
	       It requires a project id.`,
	Run: func(cmd *cobra.Command, args []string) {
	    if len(args) == 0 {
            fmt.Println("Missing project name argument. Example usage: luxen init MYPROJECT")
            return
	    }
	    if len(args) > 1 {
            fmt.Println("Found multiple project name arguments: " + strings.Join(args[:], ", "))
            return
	    }
	    projectName := args[0]

        response, err := http.Get("http://" + serverUrl + "/project/create/" + projectName)
        if err != nil {
            fmt.Println("Error:", err)
            return
        }
        defer response.Body.Close()

        body, err := ioutil.ReadAll(response.Body)
        if err != nil {
            fmt.Println("Error reading response body:", err)
            return
        }

    	var result map[string]interface{}
    	err = json.Unmarshal(body, &result)
    	if err != nil {
            fmt.Println("Error deserialising json response:", err)
            return
    	}

        status := result["status"]
    	if status != "OK" {
            fmt.Println("Could not initialise project: ", status)
            return
    	}

    	luxenFile := ".luxen"
        if fileExists(luxenFile) {
            fmt.Println("Current folder is already initialised.")
            return
        }

    	file, err := os.Create(luxenFile)
        if err != nil {
            fmt.Println("Error:", err)
            return
        }
        defer file.Close()

        fileContent := "luxen-url " + serverUrl + "\nluxen-project " + projectName
        _, err = file.WriteString(fileContent)
        if err != nil {
            fmt.Println("Error writing to file: ", err)
            return
        }
        fmt.Println("Project " + projectName + " initialised.")
	},

}

func init() {
    initCmd.Flags().StringVarP(&serverUrl, "url", "u", "localhost:5003", "luxen server url (host:port) ")
	rootCmd.AddCommand(initCmd)
}
