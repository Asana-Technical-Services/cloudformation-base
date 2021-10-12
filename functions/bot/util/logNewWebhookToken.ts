import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

export = async (event: APIGatewayProxyEvent): Promise<string | undefined> => {
  if (event.headers["X-Hook-Secret"]) {
    const table = new DynamoDB.DocumentClient();

    let webhookTaskId = event.queryStringParameters?.taskId;
    let webhookIssueId = event.queryStringParameters?.issueId;
    let compoundKey: string = "customKeyConstruction";

    const referenceTableId = process.env.REF_TABLE;

    if (!referenceTableId || !compoundKey) {
      console.log("failed to log secret");
      return event.headers["X-Hook-Secret"];
    }
    let Item: { [index: string]: string } = {};
    Item["id"] = compoundKey;
    Item["secret"] = event.headers["X-Hook-Secret"];

    let params = {
      Item,
      TableName: referenceTableId,
    };
    let result = await table.put(params).promise();
    console.log("log secret result", result);

    return event.headers["X-Hook-Secret"];
  } else {
    return;
  }
};
