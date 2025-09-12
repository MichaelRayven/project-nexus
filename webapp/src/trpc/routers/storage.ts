import { createTRPCRouter, collaboratorProcedure } from "../init";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "process";
import { s3Client } from "@/lib/s3";

export const storageRouter = createTRPCRouter({
  uploadFile: collaboratorProcedure
    .input(z.object({ file: z.instanceof(File) }))
    .mutation(async (opts) => {
      const { input } = opts;

      s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_FILE_BUCKET_NAME,
          Key: input.file.name,
          Body: input.file,
        })
      );

      return input.file.name;
    }),
});
