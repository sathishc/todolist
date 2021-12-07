import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import { TodolistPipelineStage } from './pipeline-stage';

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
                    'cd backend',
                    'ls -al',
                    'cd functions',
                    'cd addTodo',
                    'npm install',
                    'cd ..',
                    'cd getAllTodo',
                    'npm install',
                    'cd ..',
                    'cd deleteTodo',
                    'npm install',
                    'cd ..',
                    'cd ..',
                  ],
                  commands: [
                    'npm install',
                    'npx cdk synth'
                  ],
                  primaryOutputDirectory:'backend/cdk.out'
              }
          )
      });

      const todoDevStage = new TodolistPipelineStage(this, "Dev");
      pipeline.addStage(todoDevStage)
    
  }
}