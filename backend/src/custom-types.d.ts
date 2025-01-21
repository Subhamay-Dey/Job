interface File {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    path: string;
  }

declare namespace Express {
    export interface Request {
        file?: File
    }
}