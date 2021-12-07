import * as cdk from '@aws-cdk/core';
import { BackendStack } from './backend-stack'
import { FrontendStack } from './frontend-stack';

export class TodolistPipelineStage extends cdk.Stage {
    public readonly apiName: string
    public readonly apiEndpoint: string
    public readonly userPoolId: string
    public readonly identityPoolId: string
    public readonly webClientId: string
    public readonly region: string

    constructor(scope: cdk.Construct, id: string, props?: cdk.Stage) {
        super(scope, id, props);


        const todoBackend = new BackendStack(this, 'TodolistService');
        const todoFrontend = new FrontendStack(this, 'TodolistApp');

        this.apiName = todoBackend.apiName;
        this.apiEndpoint = todoBackend.apiEndpoint;
        this.userPoolId = todoBackend.userPoolId;
        this.identityPoolId = todoBackend.identityPoolId;
        this.webClientId = todoBackend.webClientId;
        this.region = todoBackend.region;
    }
}