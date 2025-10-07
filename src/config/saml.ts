import * as fs from "fs";
import path from "path";
import { IdentityProvider, ServiceProvider } from "saml2-js";

const certPath = path.join(__dirname, "../../cert/prod/cert.pem");
const keyPath = path.join(__dirname, "../../cert/prod/key.pem");
const idpCertPath = path.join(__dirname, "../../cert/prod/idp_cert.pem");

const cert = fs.readFileSync(certPath, "utf-8");
const key = fs.readFileSync(keyPath, "utf-8");
const idpCert = fs.readFileSync(idpCertPath, "utf-8");

const BASE_URL = "https://compensaciones.consensocorp.com/app-con-comisiones";
//const BASE_URL = "https://const.mentetec.com";
// Extraer información del archivo de metadatos XML
let idpConfig = {
  sso_login_url: "https://sso.consensocorp.com/adfs/ls/",
  sso_logout_url: "https://sso.consensocorp.com/adfs/ls/",
  certificates: [idpCert],
};

export const sp = new ServiceProvider({
  entity_id: `${BASE_URL}/saml/metadata`,
  private_key: key, // Clave privada para descifrar la afirmación
  certificate: cert,
  assert_endpoint: `${BASE_URL}/saml/acs`,
  sign_get_request: true,
  allow_unencrypted_assertion: true, // Cambia a true para evitar el error de firma
});

export const idp = new IdentityProvider(idpConfig);