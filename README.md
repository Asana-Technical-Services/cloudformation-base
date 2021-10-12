# cloudformation-base

A base template for creating an asana app with AWS cloud formation

## Project Overview

This is a project base template for setting Asana Webhooks and actioning on them.

It is also meant to be a demonstration with reusable parts as to how to do common webhook functionality, such as storing webhook signature validation keys, and validating incoming webhook events.

This Project uses 5 different AWS resource types:

- Lambda functions to respond to webhook events
- Secrets Manager to store the Asana API key
- Simple Table (DynamoDB) to store webhook signature validation keys
- State Machine for a framework allowing one Lambda to trigger another
- API Gateway to surface the Lambda functions to the internet.

The configuration of all of these together is what the `template.yaml` file does for us. it defines which resources we need, what to call them, and provides the right resource IDs and permissions between the components.

These elements work together as such:

1 - An Asana event happens, and Asana makes a call to your app URL
2 - API Gateway handles this call and triggers the "bot" Lambda function
3 - The `bot` Lambda function fetches a stored key from the Simple Table to validate the webhook event
4 - The `bot` function triggers a State Machine, indicating the next function to run, while allowing the bot to finish and return a success message to the API caller in a timely fashion.
5 - The State Machine triggers the `webhookEventHandler` Lambda function.
6 - The `webhookEventHandler` fetches the Asana API key from the Secrets Manager instance to be able to make calls to Asana, and handle the webhook events.

Explore the various configurations, and read the AWS documentation linked for each resource in the `template.yaml` file for more information.

The `webhookEventHandler` is where you can add additional customization to take action based on the incoming events.

## Project Structure

The project directories are structured as follows:

```bash
├── LICENSE
├── README.md
├── createWebhook.js - node function to create your first webhook
├── functions
│   ├── bot - Lambda function that responds to API calls
│   │   ├── app.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── util
│   └── webhookEventHandler - Lambda function that actions on webhook events
│       ├── app.ts
│       ├── package-lock.json
│       ├── package.json
│       ├── tsconfig.json
│       └── util
├── samconfig.toml - AWS sam config
├── statemachine
│   └── bot.asl.json - state machine config
└── template.yaml
```

## Using this project

Two quick pre-requisites:
1 - This project assumes the use of an API key - either from a Service Account or a Personal Access Token. Begin by following the directions [here](https://developers.asana.com/docs/personal-access-token)
2 - This project uses AWS SAM, so you need an AWS account and the SAM CLI tool. Head to the [AWS SAM docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) to install it.

Once you have your personal access token and have SAM, it's already time to deploy your app!

run these commands:

```
sam build

sam deploy --guided

```

Once your app has been deployed, visit your AWS account and view the [Secrets Manager](https://console.aws.amazon.com/secretsmanager/home) resource you created, named like `APISecrets-...`. Retrieve the secret value and edit it.

Lastly, you'll need to set up your first webhook. Follow the directions in `createWebhook.js` to create your first webhook.

## Frameworks and Libraries used:

- Axios for API calls
- Typescript
- AWS SAM
