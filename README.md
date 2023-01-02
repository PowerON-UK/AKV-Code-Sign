# AKV-Code-Sign
Azure Key Vault Code Signing DevOps Pipeline Extension

## Typical Usage
```yaml
- task: PowerONPlatforms.akvcodesign.akvcodesign.AKV-Code-Sign@0
  displayName: 'Sign MyApp.exe'
  inputs:
    azureSubscription: 'MySubscription (817C7175-BD04-4ACD-9426-AD7FFB3D846A)'
    keyVaultURL: 'https://myvault.vault.azure.net/'
    certificateName: 'CodeSigning2022'
    filePath: 'MyProject\bin\$(configuration)\MyApp.exe'
```
## Permissions
To enable the service connector to access the Certificate, ensure that the Key Vault has an Access Control Policy enabling the service connector with the following rights:
| Area    | Permissions |
| -------- | ------- |
| Key  | Verify, Sign, Get, List    |
| Secret | Get, List     |
| Certificate    | Get, List    |

The Key Vault must be accessable to the build agent server. In the case of Azure DevOps hosted agents this requires the Azure Key Vault to allow public access from all networks.

## Syntax

```yaml
steps:
- task: PowerONPlatforms.akvcodesign.akvcodesign.AKV-Code-Sign@0
  inputs:
    azureSubscription: # string. Required. Azure Resource Manager connection.
    keyVaultURL: # string. Required. URL to the Azure Key Vault hosting the Certificate.
    certificateName: # string. Required. Name of the certificate in the Azure Key Vault
    #timestampURL: # 'http://timestamp.digicert.com' | 'http://aatl-timestamp.globalsign.com/tsa/aohfewat2389535fnasgnlg5m23' | 'http://timestamp.entrust.net/TSS/RFC3161sha2TS' | 'http://kstamp.keynectis.com/KSign/' | 'http://tsa.quovadisglobal.com/TSS/HttpTspServer' | 'http://tss.accv.es:8318/tsa' | 'http://time.certum.pl' | 'http://psis.catcert.cat/psis/catcert/tsp' | 'http://sha256timestamp.ws.symantec.com/sha256/timestamp' | 'http://rfc3161timestamp.globalsign.com/advanced' | 'http://timestamp.globalsign.com/tsa/r6advanced1' | 'http://timestamp.apple.com/ts01'. A URL to an RFC3161 compliant timestamping service. Default: 'http://timestamp.digicert.com'
    #timeStampHashLevel: # 'sha1' | 'sha256' | 'sha384' | 'sha512'. The name of the digest algorithm used for timestamping. Default: sha256
    #fileHashLevel: # 'sha1' | 'sha256' | 'sha384' | 'sha512'. The name of the digest algorithm used for hashing the file being signed. Default: sha256
    filePath: # string. Required. Path of the file(s) to sign. Should be fully qualified path or relative to the default working directory.
    #continueOnError: # boolean. If this is true, this task will fail if any errors are written to the error pipeline, or if any data is written to the Standard Error stream. Default: false
    #skipSigned: # boolean. If this is true, if a file is already signed it will be skipped, rather than replacing the existing signature. Default: false
    #description: # string. A description of the signed content.
    #descriptionURL: # string. A URL with more information of the signed content.
```

### Full Example

```yaml
steps:
- task: PowerONPlatforms.akvcodesign.akvcodesign.AKV-Code-Sign@0
  displayName: 'Sign '
  inputs:
    azureSubscription: 'MySubscription (817C7175-BD04-4ACD-9426-AD7FFB3D846A)'
    keyVaultURL: 'https://myvault.vault.azure.net/'
    certificateName: 'CodeSigning2022'
    timestampURL: 'http://aatl-timestamp.globalsign.com/tsa/aohfewat2389535fnasgnlg5m23'
    timeStampHashLevel: sha384
    fileHashLevel: sha384
    filePath: 'MyProject\bin\$(configuration)\MyApp.exe'
    continueOnError: true
    skipSigned: true
    description: 'Signed EXE'
    descriptionURL: 'https:\\help.signedexe.com'
```

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
