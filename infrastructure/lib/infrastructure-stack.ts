import 'dotenv/config'
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createAmplifyConstruct } from './constrtucts/amplify';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { env: { region: process.env.region , account: process.env.CDK_DEFAULT_ACCOUNT}, ...props })

    createAmplifyConstruct(this)
  }
}
