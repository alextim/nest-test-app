/* eslint-disable @typescript-eslint/no-empty-interface */
import { Multer as MulterNamed } from 'multer';

declare global {
    namespace Express {
        interface Multer extends MulterNamed {}
    }
}