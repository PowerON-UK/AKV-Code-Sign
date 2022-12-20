import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try {
        console.log('Shutting down the task');
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