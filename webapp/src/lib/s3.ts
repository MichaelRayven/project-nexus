import { S3Client } from "@aws-sdk/client-s3";
import { env } from "process";

export const s3Client = new S3Client({
  forcePathStyle: true,
  region: env.S3_REGION!,
  endpoint: env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID!,
    secretAccessKey: env.S3_ACCESS_KEY_SECRET!,
  },
});
