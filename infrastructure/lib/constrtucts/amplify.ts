import 'dotenv/config'
import * as cdk from 'aws-cdk-lib'
import { App, GitHubSourceCodeProvider, Platform, RedirectStatus } from "@aws-cdk/aws-amplify-alpha"
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild'

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
        // Optional: Configure build settings
        buildSpec: BuildSpec.fromObjectToYaml({
            // TODO: automate the version bumping
            version: '1.0',
            frontend: {
                phases: {
                    preBuild: {
                        commands: ['pwd','ls','cd frontend','pwd','ls','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','echo "Installing dependencies..."','npm ci'],
                    },
                    build: {
                        commands: ['npm run build'],
                    },
                },
                artifacts: {
                    baseDirectory: '.next/', // Or 'dist', 'out', etc., depending on your build output
                    files: ['**/*'],
                },
            },
        }),
    })

    // TODO: add more branches like dev, staging, prod etc
    amplifyApp.addBranch('main', {
        branchName: 'main',
        stage: 'PRODUCTION',
    })

    return amplifyApp
}