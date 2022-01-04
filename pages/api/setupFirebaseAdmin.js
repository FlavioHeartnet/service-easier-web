// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import admin from 'firebase-admin'
import config from './../../config'
export default function handler(req, res) {
  const adminConfig = {
    type: config.type,
    project_id: config.projectId,
    private_key_id: config.private_key_id,
    private_key: config.private_key,
    client_email: config.client_email,
    client_id: config.client_id,
    auth_uri: config.auth_uri,
    token_uri: config.token_uri,
    auth_provider_x509_cert_url: config.auth_provider_x509_cert_url,
    client_x509_cert_url: config.client_x509_cert_url
  }
  try{
    const adminApp = admin.initializeApp({
      credential: admin.credential.cert(adminConfig)
    });
    //console.log(adminApp.auth)
    res.status(200).json(adminApp)
  }catch(e){
    res.status(500).json(e)
  }
  
}
