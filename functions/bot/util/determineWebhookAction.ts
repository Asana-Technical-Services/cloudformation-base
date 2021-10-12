import { APIGatewayProxyEvent } from "aws-lambda";
import isValidWebhookSecret from "./isValidWebhookSecret";

enum WebhookEventType {
  "NEW",
  "EXISTING",
  "INVALID",
}

export = async (event: APIGatewayProxyEvent): Promise<WebhookEventType> => {
  if (event.headers["X-Hook-Secret"]) {
    return WebhookEventType.NEW;
  } else if ((await isValidWebhookSecret(event)) && event.body) {
    return WebhookEventType.EXISTING;
  }
  return WebhookEventType.INVALID;
};
