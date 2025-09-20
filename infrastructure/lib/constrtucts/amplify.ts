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
        // customRules: [{
        //     source: '/<*>',
        //     target: '/index.html',
        //     status: RedirectStatus.NOT_FOUND_REWRITE
        // }],
        autoBranchDeletion: true,
        // environmentVariables: {
        //     SOMETHING: process.env.SOMETHING!,
        // }

        buildSpec: BuildSpec.fromObjectToYaml({
            // TODO: automate the version bumping
            version: '1.0',
            frontend: {
                phases: {
                    preBuild: {
                        commands: ['ls ls ls ls ls ls ls ls ls ls ls ls','cd frontend', 'npm ci --cache .npm --prefer-offline'],
                        // TODO: implement auto deploy of cdk changes (inspo from: https://github.com/focusOtter/fullstack-nextjs-cdk-starter/blob/main/_backend/lib/hosting/amplify.ts)
                        // 'cd _backend', //the buildspec file gets ran from the root of our project
                        // 'npm ci', //install the cdk deps
                        // 'npm run codegen', //see package.json
                        // 'npm run build:resolvers', //see package.json
                        // 'npx aws-cdk deploy --require-approval never --outputs-file ../output.json', // deploy cdk (see package.json)
                        // 'cd ..', // go back to the root of the project
                        // 'npm ci', // install the frontend deps,
                    },
                    build: {
                        //  TODO: Add any other environment variables you need here 
                        // - echo "NEXT_AWS_S3_ACCESS_KEY_ID=$NEXT_AWS_S3_ACCESS_KEY_ID" >> .env.production
                        // - echo "NEXT_AWS_S3_SECRET_ACCESS_KEY=$NEXT_AWS_S3_SECRET_ACCESS_KEY" >> .env.production
                        commands: ['npm run build'],
                    },
                },
                artifacts: {
                    baseDirectory: './frontend/.next',
                    files: ['./frontend/**/*'],
                },
                cache:{
                    paths: ['./frontend/node_modules/**/*','./frontend/.next/cache/**/*'],
                }
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

    // amplifyApp.addDomain('example.com', {
    //     enableAutoSubdomain: true, // in case subdomains should be auto registered for branches
    //     autoSubdomainCreationPatterns: ['*', 'pr*'], // regex for branches that should auto register subdomains
    // })

    return amplifyApp
}