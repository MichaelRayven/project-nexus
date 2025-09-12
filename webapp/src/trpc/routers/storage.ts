import { createTRPCRouter, collaboratorProcedure } from "../init";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "process";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";

export const storageRouter = createTRPCRouter({
  getUploadUrl: collaboratorProcedure
    .input(z.object({ name: z.string(), type: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      const key = `${crypto.randomUUID()}.${input.name.split(".").pop()}`;
      const command = new PutObjectCommand({
        Bucket: env.NEXT_PUBLIC_S3_FILE_BUCKET_NAME,
        Key: key,
        ContentType: input.type,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return { url, key };
    }),
});
