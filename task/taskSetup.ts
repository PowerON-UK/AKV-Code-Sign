import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import {IExecSyncResult} from 'azure-pipelines-task-lib/toolrunner';

async function run() {
    try {
        console.log('Running Pre Signing Activities');

        var toolPath = tl.which('dotnet');
        var npm:tr.ToolRunner = tl.tool(toolPath).line('tool install --global azuresigntool');
        var execResult: IExecSyncResult = npm.execSync();
        if (execResult.stderr && !execResult.stderr.startsWith("Tool 'azuresigntool' is already installed."))
        {
            throw new Error(execResult.stderr)
        }
    }
    catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
          } else {
            tl.setResult(tl.TaskResult.Failed, 'Unexpected error');
          }
        
    }
}

run();