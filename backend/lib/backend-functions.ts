import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cognito from '@aws-cdk/aws-cognito';
import * as path from 'path'

export interface TodoListFunctionsProps {
    table: dynamodb.Table  
    projectName: string,
    envName: string,
    userPool: cognito.UserPool
}

export class TodoListFunctions extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: TodoListFunctionsProps) {
        super(scope, id);

        const table = props.table;
        const projectName = props.projectName;
        const envName = props.envName
        
        const getTodosHandler = new lambda.Function(scope,`${projectName}-getTodos`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'app.getAllToDoItem',
            code: lambda.Code.fromAsset(path.join(__dirname, '../functions/getAllTodo')),
            environment:{
              "TABLE_NAME":table.tableName
            }
          })
          const addTodoHandler = new lambda.Function(scope,`${projectName}-addTodo`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'app.addToDoItem',
            code: lambda.Code.fromAsset(path.join(__dirname, '../functions/addTodo')),
            environment:{
              "TABLE_NAME":table.tableName
            }
          })

          const deleteTodoHandler = new lambda.Function(scope,`${projectName}-deleteTodo`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'app.deleteToDoItem',
            code: lambda.Code.fromAsset(path.join(__dirname, '../functions/deleteTodo')),
            environment:{
              "TABLE_NAME":table.tableName
            }
          })
      
          table.grantReadWriteData(getTodosHandler);
          table.grantReadWriteData(addTodoHandler);
          table.grantReadWriteData(deleteTodoHandler);
      
          // The code that defines your stack goes here
          const api = new apigateway.RestApi(scope, `${projectName}-todoApi`, {
            defaultCorsPreflightOptions: {
              allowOrigins: apigateway.Cors.ALL_ORIGINS,
              allowMethods: apigateway.Cors.ALL_METHODS // this is also the default
            }
          })

          const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'todosAuthorizer', {
            cognitoUserPools: [props.userPool]
          });

          const todos = api.root.addResource("todos")
          todos.addMethod("GET",new apigateway.LambdaIntegration(getTodosHandler), {
            authorizer: authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
          });

          todos.addMethod("POST",new apigateway.LambdaIntegration(addTodoHandler), {
            authorizer: authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
          });
          
          
          const todo = todos.addResource('{id}');
          todo.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTodoHandler), {
            authorizer: authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
          });

          
          new cdk.CfnOutput(scope, 'api_name', {
            value: api.restApiName
          });
          
          new cdk.CfnOutput(scope, 'api_endpoint', {
            value: api.url
          });
    }
}