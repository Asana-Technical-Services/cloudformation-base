import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import createAsanaClient from "./util/createAsanaClient";
exports.lambdaHandler = async (input: {
  event: APIGatewayProxyEvent;
  action: string;
}) => {
  if (!input?.event?.body) return;

  const body = JSON.parse(input.event.body);

  let allPromises = [];

  // create an auth'd API client for Asana using Axios.
  const asanaClient = await createAsanaClient();

  // handle events:

  if (!body?.data?.events) return;

  for (let asanaEvent of body?.data?.events) {
    // do something async to handle the events!

    allPromises.push(
      setTimeout(() => {
        return true;
      }, 1000)
    );
  }

  // wait for all your async handlers to finish
  await Promise.all(allPromises);

  return;
};
