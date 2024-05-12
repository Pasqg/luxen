package cmd

import (
    "io/ioutil"
	"fmt"
	"net/http"
    "strings"

	"github.com/spf13/cobra"
)

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

        resp, err := http.Get("http://" + serverUrl + "/project/create/" + projectName)
        if err != nil {
            fmt.Println("Error:", err)
            return
        }
        defer resp.Body.Close()

        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            fmt.Println("Error reading response body:", err)
            return
        }

        fmt.Println("Response Body:", string(body))
	},

}

func init() {
    initCmd.Flags().StringVarP(&serverUrl, "url", "u", "localhost:5003", "luxen server url (host:port) ")
	rootCmd.AddCommand(initCmd)
}
