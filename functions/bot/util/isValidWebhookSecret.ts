import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { createHmac } from "crypto";
export = async (event: APIGatewayProxyEvent): Promise<boolean> => {
  if (event.headers["X-Hook-Signature"] && event.body) {
    const table = new DynamoDB.DocumentClient({
      region: "us-east-1",
    });

    let key = "customKeyConstruction";

    const referenceTableId = process.env.REF_TABLE;

    if (!referenceTableId || !key) {
      console.log("failed to get secret");
      return false;
    }

    var params = {
      attributesToGet: ["secret"],
      Key: { id: key },
      TableName: referenceTableId,
    };

    let result = await table.get(params).promise();

    console.log("x-hook-secret result", result);

    let secret = result.Item?.secret;
    
    if (!secret) {
      console.log("failed to get secret");
      return false;
    }

    const hmac = createHmac("sha256", secret);
    hmac.update(event.body);
    let computedSignature = hmac.digest("hex");

    return event.headers["X-Hook-Signature"] === computedSignature;
  } else {
    return false;
  }
};
