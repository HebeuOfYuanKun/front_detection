import CryptoJS from 'crypto-js';

export default {
    //加密
    encrypt(text) {
        let keyStr = `${process.env.VUE_APP_AES_ENCRYPT_KEY}`;
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let srcs = CryptoJS.enc.Utf8.parse(text);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
    },
    //解密
    decrypt(text) {
        let keyStr = `${process.env.VUE_APP_AES_ENCRYPT_KEY}`;
        let key = CryptoJS.enc.Utf8.parse(keyStr);
        let decrypt = CryptoJS.AES.decrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
}
