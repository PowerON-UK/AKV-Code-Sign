import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '../task', 'taskSetup.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    'which':{
        'dotnet': 'dotnet'
    },
    'execSync': {
        'dotnet tool': {
            'code': 0,
            'stdout': 'You can invoke the tool using the following command: azuresigntool\nTool \'azuresigntool\' (version \'4.0.1\') was successfully installed.'
        },
    }
};
tmr.setAnswers(a);

tmr.run();