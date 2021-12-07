import * as codebuild from '@aws-cdk/aws-codebuild';
import * as amplify from '@aws-cdk/aws-amplify';
import * as cdk from '@aws-cdk/core';


export class FrontendStack extends cdk.Stack {
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, 'Todolist-Frontend', {
        sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
          owner: 'sathishc',
          repository: 'todolist-frontend',
          oauthToken: cdk.SecretValue.secretsManager('github-token')
        }),
    }); 
    amplifyApp.addBranch("main",{autoBuild:true})
  }
}
