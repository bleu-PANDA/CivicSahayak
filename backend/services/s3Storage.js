/**
 * S3 / LocalStack Storage Service
 * Handles document archiving to AWS S3 / LocalStack (port 4566).
 * Transparently falls back to local disk storage when LocalStack is not active.
 */

import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://localhost:4566';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.S3_BUCKET || 'civicos-documents';

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: AWS_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
});

let isS3Available = false;

export async function initS3Storage() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    
    // Quick probe to S3 endpoint
    const headRes = await fetch(`${S3_ENDPOINT}/`, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);

    if (headRes) {
      try {
        await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        isS3Available = true;
        console.log(`[S3 Storage] Connected to LocalStack/S3 bucket '${BUCKET_NAME}' at ${S3_ENDPOINT}`);
      } catch (bucketErr) {
        // Create bucket if does not exist
        await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        isS3Available = true;
        console.log(`[S3 Storage] Created and connected to bucket '${BUCKET_NAME}' at ${S3_ENDPOINT}`);
      }
    }
  } catch (err) {
    isS3Available = false;
    console.log(`[S3 Storage] LocalStack S3 at ${S3_ENDPOINT} unreachable (${err.message}). Active with local disk archive fallback.`);
  }
}

/**
 * Upload document buffer to S3 / LocalStack or local disk fallback
 */
export async function uploadDocument(buffer, originalFileName, mimeType = 'application/octet-stream', userId = 'citizen-123') {
  const timestamp = Date.now();
  const safeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const s3Key = `${userId}/${timestamp}-${safeName}`;

  if (isS3Available && buffer) {
    try {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: mimeType,
        Metadata: {
          'uploaded-by': userId,
          'original-name': safeName,
          'uploaded-at': new Date().toISOString()
        }
      }));

      return {
        storageType: 'S3_LOCALSTACK',
        bucket: BUCKET_NAME,
        key: s3Key,
        url: `${S3_ENDPOINT}/${BUCKET_NAME}/${s3Key}`,
        isLocalFallback: false
      };
    } catch (err) {
      console.warn('[S3 Storage] Upload to LocalStack failed, switching to local disk fallback:', err.message);
    }
  }

  // Local filesystem fallback
  const localUploadDir = path.resolve(__dirname, '../uploads');
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }

  const localFilePath = path.join(localUploadDir, `${timestamp}-${safeName}`);
  if (buffer) {
    fs.writeFileSync(localFilePath, buffer);
  }

  return {
    storageType: 'LOCAL_DISK_ARCHIVE',
    filePath: localFilePath,
    key: `local://${safeName}`,
    url: `/uploads/${timestamp}-${safeName}`,
    isLocalFallback: true
  };
}

export function getS3Status() {
  return {
    isS3Available,
    endpoint: S3_ENDPOINT,
    bucket: BUCKET_NAME
  };
}
