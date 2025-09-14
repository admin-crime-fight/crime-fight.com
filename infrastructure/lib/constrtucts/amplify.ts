import 'dotenv/config'
import * as cdk from 'aws-cdk-lib'
import { App, GitHubSourceCodeProvider, Platform, RedirectStatus } from "@aws-cdk/aws-amplify-alpha"
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild'

export function createAmplifyConstruct(scope: cdk.Stack) {
    const amplifyApp = new App(scope, 'CrimeFightAmplifyConstruct', {
        appName: process.env.PROD_URL!,
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
        //     SOMETHING: process.env.SOMETHING!,
        // }

        // Optional: Configure build settings
        buildSpec: BuildSpec.fromObjectToYaml({
            // TODO: automate the version bumping
            version: '1.0',
            frontend: {
                phases: {
                    preBuild: {
                        commands: ['cd frontend','npm ci'],
                    },
                    build: {
                        commands: ['npm run build'],
                    },
                },
                artifacts: {
                    baseDirectory: '.next', // Or 'dist', 'out', etc., depending on your build output
                    files: ['**/*'],
                },
            },
        }),
    })

    amplifyApp.addBranch('main', {
        branchName: 'main',
        stage: 'PRODUCTION',
        autoBuild: true,
        environmentVariables:{
            BASE_URL: process.env.PROD_URL!,
        }
    })

    amplifyApp.addBranch('qa', {
        branchName: 'qa',
        stage: 'DEVELOPMENT',
        autoBuild: true,
        environmentVariables:{
            BASE_URL: process.env.QA_URL!,
        }
    })

    return amplifyApp
}