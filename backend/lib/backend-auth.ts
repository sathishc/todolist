import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';

export interface TodoListAuthProps {}

export class TodoListAuth extends cdk.Construct {
    public readonly userPool: cognito.UserPool;
    public readonly authRole: iam.Role;
    public readonly unAuthRole: iam.Role;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);
        
        const servicePrincipal = new iam.WebIdentityPrincipal("cognito-identity.amazonaws.com");    
        this.authRole = new iam.Role(this, `${id}-AuthRole`, {
            assumedBy:servicePrincipal
        });
        this.unAuthRole = new iam.Role(this,`${id}-UnAuthRole`,{
            assumedBy:servicePrincipal
        });

        this.userPool = new cognito.UserPool(this,`${id}-UserPool`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY, // FOR TESTING ONLY - Default option should be to RETAIN
            selfSignUpEnabled:true,
            signInAliases: {
                username: true,
                email: true
            },
            standardAttributes: {
                email: { required: true}
            }
        });
        
        const todoWebClient= this.userPool.addClient(`${id}-WebClient`, {generateSecret:false});
        // const todoAppClient= userPool.addClient("TodoListAppClient",{generateSecret:true});

        const identityPool = new cognito.CfnIdentityPool(this, `${id}-IdentityPool`, {
            allowUnauthenticatedIdentities:true,
            cognitoIdentityProviders:[{
                providerName:this.userPool.userPoolProviderName,
                clientId:todoWebClient.userPoolClientId
            }],
        });

        const roleAttachment = new cognito.CfnIdentityPoolRoleAttachment(this, "roleAttachment", {
            identityPoolId:identityPool.ref,
            roles:{
              "unauthenticated":this.unAuthRole.roleArn,
              "authenticated": this.authRole.roleArn
            }
          });
        

        new cdk.CfnOutput(scope, 'user_pool', {
            value: this.userPool.userPoolId
        });
        new cdk.CfnOutput(scope, 'identity_pool', {
            value: identityPool.ref
        });
        new cdk.CfnOutput(scope, 'aws_cognito_region', {
            value: cdk.Stack.of(this).region
        });
        new cdk.CfnOutput(scope, 'web_client_id', {
            value: todoWebClient.userPoolClientId
        });
    }
}