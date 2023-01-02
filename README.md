# AKV-Code-Sign
Azure Key Vault Code Signing DevOps Pipeline Extension

## Typical Usage
```
- task: PowerONPlatforms.akvcodesign.akvcodesign.AKV-Code-Sign@0
  displayName: 'Sign MyApp.exe'
  inputs:
    azureSubscription: 'MySubscription (817C7175-BD04-4ACD-9426-AD7FFB3D846A)'
    keyVaultURL: 'https://myvault.vault.azure.net/'
    certificateName: CodeSigning2022
    filePath: 'MyProject\bin\$(configuration)\MyApp.exe'
```
## Permissions
To enable the service connector to access the Certificate, ensure that the Key Vault has an Access Control Policy enabling the service connector with the following rights:
| Area    | Permissions |
| -------- | ------- |
| Key  | Verify, Sign, Get, List    |
| Secret | Get, List     |
| Certificate    | Get, List    |

## Shoutout
A massive shoutout to [Kevin Jones](https://github.com/vcsjones) for writing the [AzureSignTool](https://github.com/vcsjones/AzureSignTool), without this tool this extension would not be possible 

# Development

## Required Setup
- Visual Studio Code (Not a hard requirement but all development on this extension at PowerON is done with VS Code)
- Latest version of Node (VS Pipeline only runs in Node 10 however Mocha needs at least Node 14 to operate)
- Latest version of Typescript `npm install -g typescript`
- Latest version of the Azure Devops CLI Tools `npm install -g tfx-cli`
- Run npm install from the project directory

## Building the Extension
- update `task/task.json` version number
- update `vss-extension.json` version number 
- run `npm install task\` on the project directory
- run `tsc` on the project directory to compile the Typescript into Javascript
- run `tfx extension create --manifest-globs vss-extension.json` to compile the extension

### Azure Devops API Reference 
- Typescript API https://github.com/microsoft/azure-pipelines-task-lib/blob/master/node/docs/azure-pipelines-task-lib.md
- vss-extension.json https://learn.microsoft.com/en-us/azure/devops/extend/develop/manifest?view=azure-devops
- task.json https://github.com/Microsoft/azure-pipelines-task-lib/blob/master/tasks.schema.json

## Extension Behavior
- taskSetup - Install the tool AzureSignTool to the local machine using the dotnet CLI (https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-tool-install)
- taskRun - Takes pipeline input and converts into a commandline to run the AzureSignTool against the required binaries
