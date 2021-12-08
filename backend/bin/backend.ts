#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BackendStack } from '../lib/backend-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { TodolistPipelineStack } from '../lib/pipeline-stack';


const app = new cdk.App();
const todoBackend = new BackendStack(app, 'BackendStack');
new FrontendStack(app, 'FrontendStack', {
  apiName:todoBackend.apiName,
  apiEndpoint:todoBackend.apiEndpoint,
  userPoolId:todoBackend.userPoolId,
  identityPoolId:todoBackend.identityPoolId,
  webClientId:todoBackend.webClientId,
  region:todoBackend.region,
})

// new TodolistPipelineStack(app, "TodolistPipelineStack")
