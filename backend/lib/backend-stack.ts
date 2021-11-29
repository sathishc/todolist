import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
// import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';

import { TodoListAuth } from './backend-auth';
import { TodoListFunctions } from './backend-functions';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = 'todoList1'; //AmplifyHelpers.getProjectInfo().projectName;
    const envName = 'dev'; // AmplifyHelpers.getProjectInfo().envName

    // setup a cognito user and identity pool
    const todoListAuth = new TodoListAuth(this, `${projectName}-todoListAuth`);

    // create a dynamodb table for persistence
    const table = new dynamodb.Table(this, `${projectName}-${envName}-TodosTable`, {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: {name: 'cognito-username', type: dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // setup the api gateway and necessary lambda functions
    
    const functions = new TodoListFunctions(this, `${projectName}-todoListFunctions`, {
      table: table,
      projectName:projectName,
      envName:envName,
      userPool:todoListAuth.userPool
    });
  }
}
