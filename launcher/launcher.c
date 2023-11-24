#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
    // Check if there are enough arguments
    // if (argc < 2)
    // {
    //     printf("Usage: %s [music name]\n", argv[0]);
    //     return 1;
    // }

    // Build the command to run the Node.js script
    char command[256] = "node src/app.js";
    for (int i = 1; i < argc; i++)
    {
        strcat(command, " ");
        strcat(command, argv[i]);
    }

    // Check if the TERM environment variable is set (indicating a terminal)
    char *term = getenv("TERM");
    if (term != NULL && strcmp(term, "dumb") != 0)
    {
        // Execute the Node.js script in the current terminal window
        system(command);
    }
    else
    {
        // Execute the Node.js script in a new terminal window
        char terminalCommand[512];
        sprintf(terminalCommand, "x-terminal-emulator -e \"%s\"", command);
        system(terminalCommand);
    }

    return 0;
}
