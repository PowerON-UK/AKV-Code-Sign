import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

async function run() {
    try {
        const azureConnectionName = tl.getInputRequired('azureConnection');

        const AuthClientID = tl.getEndpointAuthorizationParameterRequired(azureConnectionName, 'serviceprincipalid')
        const AuthTenantID = tl.getEndpointAuthorizationParameterRequired(azureConnectionName, 'tenantid')
        const AuthClientSecret = tl.getEndpointAuthorizationParameterRequired(azureConnectionName, 'serviceprincipalkey')

        const KeyVaultURL = tl.getInputRequired('keyVaultURL');
        const CertificateName = tl.getInputRequired('certificateName');
        const TimeStampURL = tl.getInputRequired('timeStampURL');
        const TimeStampHashLevel = tl.getInputRequired('timeStampHashLevel');
        const FileHashLevel = tl.getInputRequired('fileHashLevel');

        const FilePath = tl.getPathInputRequired('filePath');

        const ContinueOnError = tl.getBoolInput('continueOnError');
        const SkipSigned = tl.getBoolInput('skipSigned');

        var Description = tl.getInput('description', false)
        if (Description === undefined)
        {
            Description = "" //If not already set create as empty string
        }

        var DescriptionURL = tl.getInput('descriptionURL', false)
        if (DescriptionURL === undefined)
        {
            DescriptionURL = "" //If not already set create as empty string
        }

        var fileList = tl.findMatch("" ,FilePath); //Use default seach location

        if (fileList.length < 1)
        {
            tl.setResult(tl.TaskResult.SucceededWithIssues, "Unable to locate any files to sign");
        }

        signFiles(
            KeyVaultURL,
            AuthClientID,
            AuthClientSecret,
            AuthTenantID,
            CertificateName,
            TimeStampURL,
            TimeStampHashLevel,
            FileHashLevel, 
            fileList,
            ContinueOnError, 
            SkipSigned,
            Description,
            DescriptionURL
        )
    }
    catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
          } else {
            tl.setResult(tl.TaskResult.Failed, 'Unexpected error');
          }
        
    }
}

//Descriptions taken from AzureSignTool Documentation
//KeyVaultURL: A fully qualified URL of the key vault with the certificate that will be used for signing. An example value might be https://my-vault.vault.azure.net.
//AuthClientID: This is the client ID used to authenticate to Azure, which will be used to generate an access token.
//AuthClientSecret: This is the client secret used to authenticate to Azure, which will be used to generate an access token.
//AuthTenantID: This is the tenant id used to authenticate to Azure, which will be used to generate an access token. 
//CertificateName: The name of the certificate used to perform the signing operation.
//TimeStampURL: A URL to an RFC3161 compliant timestamping service. This parameter serves the same purpose as the /tr option in the Windows SDK signtool.
//TimeStampHashLevel: The name of the digest algorithm used for timestamping. Possible values: sha1, sha256, sha384, sha512
//FileHashLevel: The name of the digest algorithm used for hashing the file being signed. Possible values: sha1, sha256, sha384, sha512
//ContinueOnError: If multiple files to sign are specified, this flag will cause the signing process to move on to the next file when signing fails.
//SkipSigned: If a file is already signed it will be skipped, rather than replacing the existing signature.
//Description: Optional - A description of the signed content. This parameter serves the same purpose as the /d option in the Windows SDK signtool. If this parameter is not supplied, the signature will not contain a description.
//DescriptionURL: Optional - A URL with more information of the signed content. This parameter serves the same purpose as the /du option in the Windows SDK signtool. If this parameter is not supplied, the signature will not contain a URL description.

async function signFiles(
    KeyVaultURL : string,
    AuthClientID: string,
    AuthClientSecret : string,
    AuthTenantID : string,
    CertificateName : string,
    TimeStampURL : string,
    TimeStampHashLevel : string,
    FileHashLevel : string,
    FileList: string[],
    ContinueOnError : boolean,
    SkipSigned : boolean,
    Description : string,
    DescriptionURL : string
    )
{

    var toolPath = tl.which('azuresigntool');
    var azuresigntool:tr.ToolRunner = tl.tool(toolPath)
        .arg('sign')    
        .arg('--azure-key-vault-url ' + KeyVaultURL)
        .arg('--azure-key-vault-client-id ' + AuthClientID)
        .arg('--azure-key-vault-client-secret ' + AuthClientSecret)
        .arg('--azure-key-vault-tenant-id ' + AuthTenantID)
        .arg('--azure-key-vault-certificate ' + CertificateName)
        .arg('--timestamp-rfc3161 ' + TimeStampURL)
        .arg('--timestamp-digest ' + TimeStampHashLevel)
        .arg('--file-digest ' + FileHashLevel)
        .arg(FileList)
        .arg('--verbose')
        .argIf(!isEmptyString(Description),'--description ' + Description)
        .argIf(!isEmptyString(DescriptionURL),'--description-url ' + DescriptionURL)
        .argIf(ContinueOnError,'--continue-on-error')
        .argIf(SkipSigned,'--skip-signed');

    azuresigntool.exec();
}

//Taken from https://www.becomebetterprogrammer.com/check-for-empty-string-javascript-typescript/
const isEmptyString = (data: string): boolean => typeof data === "string" && data.trim().length == 0;

run();