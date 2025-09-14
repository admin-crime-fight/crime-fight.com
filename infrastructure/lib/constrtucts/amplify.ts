import 'dotenv/config'
import * as cdk from 'aws-cdk-lib'
import { App, GitHubSourceCodeProvider, Platform, RedirectStatus } from "@aws-cdk/aws-amplify-alpha"

export function createAmplifyConstruct(scope: cdk.Stack) {
    const amplifyApp = new App(scope, 'CrimeFightAmplifyConstruct', {
        appName: 'crime-fight.com ui',
        platform: Platform.WEB_COMPUTE,
        sourceCodeProvider: new GitHubSourceCodeProvider({
            owner: process.env.theGithubOwnerOfThisProject!,
            repository: process.env.theGithubRepositoryOfThisProject!,
            oauthToken: cdk.SecretValue.secretsManager(process.env.theGithubTokenOfThisProject!),
        }),
        customRules: [{
            source: '/<*>',
            target: '/index.html',
            status: RedirectStatus.NOT_FOUND_REWRITE
        }],
        // environmentVariables: {
        //     REACT_APP_API_URL: process.env.REACT_APP_API_URL!,
        //     REACT_APP_WS_URL: process.env.REACT_APP_WS_URL!,
        //     REACT_APP_REGION: process.env.REACT_APP_REGION!,
        //     REACT_APP_USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID!,
        //     REACT_APP_USER_POOL_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID!,
        //     REACT_APP_IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID!,
        //     REACT_APP_S3_BUCKET_NAME: process.env.REACT_APP_S3_BUCKET_NAME!,
        // }
    })

    // TODO: add more branches like dev, staging, prod etc
    amplifyApp.addBranch('qa', {
        branchName: 'qa',
        stage: 'DEVELOPMENT',
    })

    return amplifyApp
}