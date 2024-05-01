/* eslint-disable prettier/prettier */
import firebaseAdmin from 'firebase-admin'
import pkg from 'firebase-admin';
const { credential } = pkg;


const adminKey : any = {
    "type": "service_account",
    "project_id": "konnect-ukraine",
    "private_key_id": "e030443d5d0e2388a2d9a229242fc6bb9a5e5f55",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhUCi/9kTEeB+O\nQ2v93btzP1iWi2HihtG9+wW1RkCKMwjRERRwpVSd+5PiySB21L/JFR25zaRPCrwM\nqEGAJAB13PBfCZxKMxBzKhGR9t6fmz5p3vLxCy+2HRVcB28ReK90xk8LfbDjgv8D\nlxDC+JWW5cqbVNi+vzaPE+QHzljN4Z6kUy7l5b+0GYJW4BzDU7BXXqBl5dD3Mep1\nygXb6tDDlyUNJmwDU0VG65yZd8K+RkPnk8dJhbXyWQhHcrQTOLKKql2ELIUJNs8N\n0c7tnqlLLYSS+8HQHSS5enYnM8xYccLcpfUydQyaXH+EuOLhC9lzGnEwTVG5JeBy\ng45uHEJxAgMBAAECggEAAUzUnLL07PX30frVSIbl2iw55yMmbUeziyHug6rERuff\ne6avvwH9OIInSs439+eSCbzWSehZXolkfLrgfIxN97V5f5rkbNCESPMrscjCZRpg\nuadV2zU3e8Ne3a6Uof2tHtfhbzgKSW3L6enjvgma117maeS18XfUqUOx86eUVJp0\nvb3gKFlfARGxxSReba3Kvc1PgV1bvL7cS+myVWsVFuMRgMlKkLKiG8oAhZ+NUudI\n8M70+3IozbJnMtWtRnLfR1qWlYAPltSL9Mn7HPTCu/SdfA/IdFfag8cnNtVzljIc\nfmSWrTC4yaaumsHAEk3+lvcMRVU4JmyEvIp2l/rDSQKBgQD/5OOyukCGv896UAr5\nzCUZEGqQqyXS3VAkU+RPFFrzmfe/BKyOxg41L9mo2OrpXHXSA4M0eWZenop2Hxcd\n8cljURsqiAc+itQrEu3mXgbh7j84YzHMcucxtbR1NcDbC0XeZykIpvsZR4J4lXN6\nDXapfgQJoCtle/9w/8HmwybzjQKBgQDhaAekLx+fx0AZSWsIiD0WJEfodef5+BS+\nDLDbmHU7ZGkXYS7SwQcj4xiC16EUpTXBJMhk9XwG+vyPvXvkkmK+p+Em9zIwkQW0\nVov4n+zVNPrcmIj118F/R7F5j9siR9jzWVa9/CUCE7CsQ8M2eCZaEYoA3C7owdTB\nF+jwl2x/dQKBgQDMR482eNVWPP2GqSt56uyaq65GuzpAsYhu18HlF1zcJ0fN6A9R\nEu74qrBZyIEPtk4gT8mINHnygyIJ1hwAPasFbBQBygHufamOkVf1lY5tAmLZwuZY\nTkoeNu5Ou5CvzLoEJ9psG9FMhvezB6vd/a2C9SSIAqNiKrDrJmFGtPf9aQKBgB6l\nFBTgSz5fynkloCWi0BtIh3Y1QXqcncVQ2GKikZ2ngxoonkMM9zmL0HNJeZ7i7zH5\nHD2NmnUgfmHUcxmaRU6CaHvxs6MitFHWSmVc6Mf70fdXzZcO5EG3r4tFYZeBiR9c\nkAx4UVe88ZIaDFpFb4FjTQ3c4YvHfnNaGtNK4vdZAoGARgil0NSbDkKwbcCHFv3N\nudCJkAcaBzXWgQiwivVpmQfIzoyt1dJ+S88KUr2ZiznmgI7Ld5qtzUEzpS4ehffm\nGSFppKHpqxfbQYpmTSQxcAQCa9zzstEc4c3CbcTEwtG8xraPzOVCpqJTEqhlaGFX\neNl2vLhBt0Z7BYIs4vsznYU=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-4hlcs@konnect-ukraine.iam.gserviceaccount.com",
    "client_id": "100821840296415319100",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4hlcs%40konnect-ukraine.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}


const admin = firebaseAdmin.initializeApp({
    credential: credential.cert(adminKey)
})
  

export default admin