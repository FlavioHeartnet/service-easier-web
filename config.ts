type envConfig = {
    apiKey:string
    authDomain:string
    projectId:string
    storageBucket:string
    messagingSenderId:string
    appId:string
    measurementId:string
    type: string
    private_key_id: string
    private_key: string
    client_email: string
    client_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_x509_cert_url: string
}

const config: envConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    type: process.env.NEXT_PUBLIC_TYPE,
    private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
    private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    auth_uri: process.env.NEXT_PUBLIC_AUTH_URI,
    token_uri: process.env.NEXT_PUBLIC_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.NEXT_PUBLIC_CLIENT_X509_CERT_URL
}

export default config
