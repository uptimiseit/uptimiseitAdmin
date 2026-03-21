import { NextResponse } from "next/server";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: Request) {
  try {
    // 1. Grab file details from the frontend request
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file") || `image-${Date.now()}.jpg`;
    const fileType = searchParams.get("type") || "image/jpeg";

    // 2. STS (Assume Role)
    const sts = new STSClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.BASE_ACCESS_KEY!,
        secretAccessKey: process.env.BASE_SECRET_KEY!,
      },
    });

    const roleRes = await sts.send(new AssumeRoleCommand({
      RoleArn: process.env.ROLE_ARN!,
      RoleSessionName: "UptimiseUploadSession",
      DurationSeconds: 900,
    }));

    const creds = roleRes.Credentials;

    // 3. S3 Client with Temporary Credentials
    const s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: creds!.AccessKeyId!,
        secretAccessKey: creds!.SecretAccessKey!,
        sessionToken: creds!.SessionToken!,
      },
    });

    // 4. Clean the filename and create the exact S3 Key
    const cleanFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
    const key = `uploads/${Date.now()}-${cleanFileName}`;

    // 5. Generate the Presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    // 6. Construct the final CloudFront URL (matching the S3 key path)
    const cdnUrl = `https://d4czp4e8di12g.cloudfront.net/${key}`;

    // Return BOTH the upload ticket and the final CDN link
    return NextResponse.json({ signedUrl, cdnUrl });

  } catch (error) {
    console.error("AWS Upload Error:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}