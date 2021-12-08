import * as codebuild from '@aws-cdk/aws-codebuild';
import * as amplify from '@aws-cdk/aws-amplify';
import * as cdk from '@aws-cdk/core';

interface TodoFrontendProps extends cdk.StackProps {
    apiName:string,
    apiEndpoint:string,
    userPoolId:string,
    identityPoolId:string,
    webClientId:string,
    region:string
}

export class FrontendStack extends cdk.Stack {
  
  constructor(scope: cdk.Construct, id: string, props: TodoFrontendProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'Todolist-Frontend', {
        sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
          owner: 'sathishc',
          repository: 'todolist-frontend',
          oauthToken: cdk.SecretValue.secretsManager('github-token')
        }),
    }); 
    const branch = amplifyApp.addBranch("main",{
        autoBuild:true,
        environmentVariables:{
            "TODOLIST_API_NAME":props.apiName,
            "TODOLIST_API_URL":props.apiEndpoint,
            "USERPOOL_ID":props.userPoolId,
            "IDENTITYPOOL_ID":props.identityPoolId,
            "WEB_CLIENT_ID":props.webClientId,
            "TODO_REGION":props.region
        }
    });
    branch.addEnvironment("STAGE","main");
    
  }
}
