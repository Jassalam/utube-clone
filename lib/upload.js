import fs from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.STORAGE_KEY,
    secretAccessKey: process.env.STORAGE_SECRET,
  },
  endpoint: 'https://' + process.env.STORAGE_ENDPOINT,
})

const upload = (filePath, fileName, id) => {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(filePath)

    const bucketName = process.env.STORAGE_BUCKET_NAME
    const objectKey = `post-${id}${path.extname(fileName)}`

    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: content,
      ACL: 'public-read',
    }

    const command = new PutObjectCommand(params)

    s3.send(command)
      .then((data) => {
        const objectUrl = `https://${bucketName}.${process.env.STORAGE_ENDPOINT}/${objectKey}`
        resolve(objectUrl)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

export default upload