import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';

export interface TodoListAuthProps {
    
}

export class TodoListAuth extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props?: TodoListAuthProps) {
        super(scope, id);
        
        const servicePrincipal = new iam.WebIdentityPrincipal("cognito-identity.amazonaws.com");    
        const authRole = new iam.Role(this, `${id}-AuthRole`, {
            assumedBy:servicePrincipal
        });
        const unauthRole = new iam.Role(this,`${id}-UnAuthRole`,{
            assumedBy:servicePrincipal
        });

        /*
        authRole.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [map.attrArn, placesIndex.attrArn],
            actions: ['geo:*']
        }));
        unauthRole.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [map.attrArn, placesIndex.attrArn],
            actions: ['geo:*']
        }));
        */

        const userPool = new cognito.UserPool(this,`${id}-UserPool`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY, // FOR TESTING ONLY - Default option should be to RETAIN
            selfSignUpEnabled:true
        });
        
        const todoWebClient= userPool.addClient(`${id}-WebClient`, {generateSecret:false});
        // const todoAppClient= userPool.addClient("TodoListAppClient",{generateSecret:true});

        const identityPool = new cognito.CfnIdentityPool(this, `${id}-IdentityPool`, {
            allowUnauthenticatedIdentities:true,
            cognitoIdentityProviders:[{
                providerName:userPool.userPoolProviderName,
                clientId:todoWebClient.userPoolClientId
            }]
        });

        new cdk.CfnOutput(scope, 'user_pool', {
            value: userPool.userPoolId
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