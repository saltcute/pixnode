import crypto from 'crypto';
import base64url from 'base64url';

/**
* Generate a safe base64 string token that is URL-safe
* @param size Determines how many bytes of data is to be generated
* @returns URL-safe base64 string
*/
export default (size: number): string => {
    return base64url(crypto.randomBytes(size));
}