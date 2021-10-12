import { StepFunctions } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StartExecutionInput } from "aws-sdk/clients/stepfunctions";
import determineWebhookAction from "./util/determineWebhookAction";
import logNewWebhookToken from "./util/logNewWebhookToken";

enum WebhookEventType {
  "NEW",
  "EXISTING",
  "INVALID",
}

exports.lambdaHandler = async (
  event: APIGatewayProxyEvent & { taskId?: string; issueId?: string }
): Promise<APIGatewayProxyResult> => {
  console.log(event.body);
  console.log(event.headers);
  if (!process.env.STATE_MACHINE_ARN) {
    console.log("state machine arn not set");
    return { statusCode: 500, body: "internal error" };
  }

  const stepFunctionClient = new StepFunctions({
    region: "us-east-1",
  });

  // catch Asana webhooks
  if (event.headers["User-Agent"] === "Asana") {
    const webhookAction = await determineWebhookAction(event);

    switch (webhookAction) {
      case WebhookEventType.NEW:
        const webhookSecret: string | undefined = await logNewWebhookToken(
          event
        );

        if (webhookSecret) {
          return {
            statusCode: 200,
            headers: { "X-Hook-Secret": webhookSecret },
            body: "",
          };
        } else {
          return {
            statusCode: 500,
            body: "internal error",
          };
        }

      case WebhookEventType.EXISTING:
        const stepFunctionParams: StartExecutionInput = {
          stateMachineArn: process.env.STATE_MACHINE_ARN,
          input: JSON.stringify({ event, action: "HANDLE_WEBHOOK_EVENT" }),
          name: "HandleWebhookEventFlow" + String(Date.now()),
        };

        await stepFunctionClient.startExecution(stepFunctionParams).promise();

        return {
          statusCode: 204,
          body: "",
        };

      case WebhookEventType.INVALID:
        return {
          statusCode: 400,
          body: "Headers were not recognized or were invalid ",
        };
    }
  }

  return {
    statusCode: 418,
    body: "why are you calling me?",
  };
};
