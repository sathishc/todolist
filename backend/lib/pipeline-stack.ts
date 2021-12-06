import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cpactions from "@aws-cdk/aws-codepipeline-actions"

export class TodolistPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
     // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
          pipelineName: 'WorkshopPipeline',
          synth: new pipelines.CodeBuildStep('SynthStep', {
                  input: pipelines.CodePipelineSource.gitHub('sathishc/todolist','development'),
                  installCommands: [
                    'npm install -g typescript',
                    'npm install -g ts-node',
                    'npm install -g aws-cdk',
                    'npm ci',
                    'cd functions',
                    'cd addTodo',
                    'npm install',
                    'cd ..',
                    'cd ..',
                  ],
                  commands: [
                    'cd backend',
                    'npm ci',
                    'npx cdk synth'
                  ],
                  primaryOutputDirectory:'backend/cdk.out'
              }
          )
      });
    
  }
}