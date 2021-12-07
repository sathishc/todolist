import * as cdk from '@aws-cdk/core';
import { BackendStack } from './backend-stack'

export class TodolistPipelineStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.Stage) {
        super(scope, id, props);

        new BackendStack(this, 'TodolistService');
    }
}
