import { b2, authorizeB2 } from '../config/b2Bucket.js'
import fs from "fs"

export const deleteFileFromB2 = async (fileUrl) => {
    await authorizeB2()

    const fileName = decodeURIComponent(fileUrl.split('/').pop())

    const { data: { files } } = await b2.listFileNames({
        bucketId: process.env.B2_BUCKET_ID,
        startFileName: fileName,
        maxFileCount: 1
    })

    const file = files.find(f => f.fileName === fileName)
    if (!file) return

    await b2.deleteFileVersion({
        fileName: file.fileName,
        fileId: file.fileId
    })
}

export const uploadFileToB2 = async (buffer, fileName, mimeType) => {
    await authorizeB2()

    const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID })

    const result = await b2.uploadFile({
        uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName,
        data: buffer,
        mime: mimeType
    })
    return result.data.fileName
}


export const generateDownloadUrl = async (fileName, validSeconds = 3600) => {
    await authorizeB2()

    const { data } = await b2.getDownloadAuthorization({
        bucketId: process.env.B2_BUCKET_ID,
        fileNamePrefix: fileName,
        validDurationInSeconds: validSeconds
    })

    const baseUrl = `${b2.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}`
    return `${baseUrl}?Authorization=${data.authorizationToken}`
}