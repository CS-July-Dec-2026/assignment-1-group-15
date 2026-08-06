// public/crypto.js

// Utility to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Utility to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * 1. Hash the password using SHA-256
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return hashBuffer;
}

/**
 * 2. Import the hash as an AES-GCM CryptoKey
 */
async function importAESKey(hashBuffer) {
    return await window.crypto.subtle.importKey(
        'raw',
        hashBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * 3. Encrypt the message using AES-GCM
 */
async function encryptMessage(plaintext, password) {
    const hashBuffer = await hashPassword(password);
    const key = await importAESKey(hashBuffer);

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(plaintext);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedMessage
    );

    return {
        ciphertext: arrayBufferToBase64(ciphertextBuffer),
        iv: arrayBufferToBase64(iv)
    };
}

/**
 * 4. Decrypt the message using AES-GCM
 */
async function decryptMessage(ciphertextBase64, ivBase64, password) {
    const hashBuffer = await hashPassword(password);
    const key = await importAESKey(hashBuffer);

    const ciphertextBuffer = base64ToArrayBuffer(ciphertextBase64);
    const ivBuffer = base64ToArrayBuffer(ivBase64);

    try {
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) },
            key,
            ciphertextBuffer
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (e) {
        throw new Error("Invalid password / Decryption failed");
    }
}
