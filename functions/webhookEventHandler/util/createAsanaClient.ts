import axios, { AxiosInstance } from "axios";
import { SecretsManager } from "aws-sdk";

export = async (): Promise<AxiosInstance | undefined> => {
  const secrets = new SecretsManager({
    region: "us-east-1",
    apiVersion: "2017-10-17",
  });
  const secretReference = process.env.API_SECRETS;

  if (!secretReference) return;

  const { SecretString } = await secrets
    .getSecretValue({ SecretId: secretReference })
    .promise();

  if (!SecretString) return;

  const { asanaApiKey } = JSON.parse(SecretString);

  if (!asanaApiKey) return;

  const instance = axios.create({
    baseURL: "https://app.asana.com/api/1.0/",
    headers: { Authorization: `Bearer ${asanaApiKey}` },
  });

  return instance;
};
