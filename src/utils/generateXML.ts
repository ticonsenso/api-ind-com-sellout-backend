import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {SignedXml} from "xml-crypto";
import xmlbuilder from "xmlbuilder";
import {MetadataConfig} from "../interfaces/matadata.config";

dotenv.config();

const BASE_URL = "https://cmi.consensocorp.com/app-con-comisiones";

// Cargar certificado y clave privada
const certPath = path.join(__dirname, "../../cert/prod-sellout/cert.pem");
const keyPath = path.join(__dirname, "../../cert/prod-sellout/key.pem");
const cert = fs
  .readFileSync(certPath, "utf-8")
  .replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, "");
const key = fs.readFileSync(keyPath, "utf-8");

/**
 * Genera el XML de metadatos SAML para el portal de comisiones
 * @param config Configuración de metadatos
 * @returns XML generado como string
 */
export const generateMetadataXML = (config: MetadataConfig): string => {
  const {
    entityID,
    acsURL,
    logoutURL,
    serviceName = "CommissionsPortal",
    validUntil,
  } = config;
  const uniqueId = `_${Math.random().toString(36).substr(2, 9)}`;

  const xml = xmlbuilder
    .create("EntityDescriptor", { encoding: "UTF-8" })
    .att("xmlns", "urn:oasis:names:tc:SAML:2.0:metadata")
    .att("xmlns:ds", "http://www.w3.org/2000/09/xmldsig#")
    .att("xmlns:fed", "http://docs.oasis-open.org/wsfed/federation/200706")
    .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    .att("entityID", entityID)
    .att("ID", uniqueId)
    .att(
      "validUntil",
      validUntil ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    ) // Validez por defecto: 1 año

    // SPSSODescriptor (Proveedor de Servicios SSO)
    .ele("SPSSODescriptor", {
      WantAssertionsSigned: "true",
      protocolSupportEnumeration: "urn:oasis:names:tc:SAML:2.0:protocol",
    })
    .ele("KeyDescriptor", { use: "signing" })
    .ele("ds:KeyInfo")
    .ele("ds:X509Data")
    .ele("ds:X509Certificate")
    .txt(cert)
    .up()
    .up()
    .up()
    .up()
    .ele("KeyDescriptor", { use: "encryption" })
    .ele("ds:KeyInfo")
    .ele("ds:X509Data")
    .ele("ds:X509Certificate")
    .txt(cert)
    .up()
    .up()
    .up()
    .up()
    .ele("SingleLogoutService", {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
      Location: logoutURL,
    })
    .up()
    .ele("SingleLogoutService", {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: logoutURL,
    })
    .up()
    .ele("NameIDFormat")
    .txt("urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress")
    .up()
    .ele("NameIDFormat")
    .txt("urn:oasis:names:tc:SAML:2.0:nameid-format:persistent")
    .up()
    .ele("AssertionConsumerService", {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: acsURL,
      index: "0",
      isDefault: "true",
    })
    .up()
    .ele("AssertionConsumerService", {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact",
      Location: acsURL,
      index: "1",
    })
    .up()

    // RoleDescriptor opcional para compatibilidad con federación (similar a AD FS)
    .ele("RoleDescriptor", {
      "xsi:type": "fed:ApplicationServiceType",
      protocolSupportEnumeration:
        "http://docs.oasis-open.org/ws-sx/ws-trust/200512 http://schemas.xmlsoap.org/ws/2005/02/trust http://docs.oasis-open.org/wsfed/federation/200706",
      ServiceDisplayName: serviceName,
    })
    .ele("fed:ClaimTypesRequested")
    .ele("auth:ClaimType", {
      Uri: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      Optional: "true",
      "xmlns:auth": "http://docs.oasis-open.org/wsfed/authorization/200706",
    })
    .ele("auth:DisplayName")
    .txt("E-Mail Address")
    .up()
    .ele("auth:Description")
    .txt("The e-mail address of the user")
    .up()
    .up()
    // Añadimos claims específicos para el cálculo de comisiones
    .ele("auth:ClaimType", {
      Uri: "http://schemas.consensocorp.com/identity/claims/employeeId",
      Optional: "false",
      "xmlns:auth": "http://docs.oasis-open.org/wsfed/authorization/200706",
    })
    .ele("auth:DisplayName")
    .txt("ID de Empleado")
    .up()
    .ele("auth:Description")
    .txt("Identificador único del empleado para cálculo de comisiones")
    .up()
    .up()
    .ele("auth:ClaimType", {
      Uri: "http://schemas.consensocorp.com/identity/claims/role",
      Optional: "false",
      "xmlns:auth": "http://docs.oasis-open.org/wsfed/authorization/200706",
    })
    .ele("auth:DisplayName")
    .txt("Rol del Usuario")
    .up()
    .ele("auth:Description")
    .txt("Rol del usuario en el sistema de comisiones")
    .up()
    .up()
    .ele("auth:ClaimType", {
      Uri: "http://schemas.consensocorp.com/identity/claims/department",
      Optional: "true",
      "xmlns:auth": "http://docs.oasis-open.org/wsfed/authorization/200706",
    })
    .ele("auth:DisplayName")
    .txt("Departamento")
    .up()
    .ele("auth:Description")
    .txt("Departamento al que pertenece el usuario para cálculo de comisiones")
    .up()
    .up()
    // Añadimos claims para cédula y nombres completos
    .ele("auth:ClaimType", {
      Uri: "http://schemas.consensocorp.com/identity/claims/cedula",
      Optional: "false",
      "xmlns:auth": "http://docs.oasis-open.org/wsfed/authorization/200706",
    })
    .ele("auth:DisplayName")
    .txt("Cédula de Identidad")
    .up()
    .ele("auth:Description")
    .txt("Número de cédula de identidad del usuario")
    .up()
    .up()
    .ele("auth:ClaimType", {
      Uri: "http://schemas.consensocorp.com/identity/claims/fullName",
      Optional: "false",
      "xmlns:auth": "http://docs.oasis-open.org/wsfed/authorization/200706",
    })
    .ele("auth:DisplayName")
    .txt("Nombres Completos")
    .up()
    .ele("auth:Description")
    .txt("Nombres y apellidos completos del usuario")
    .up()
    .up()
    .up()
    .up()

    // Información de Contacto
    .ele("ContactPerson", { contactType: "support" })
    .ele("Company")
    .txt("Consenso Corp")
    .up()
    .ele("EmailAddress")
    .txt("support@consensocorp.com")
    .up()
    .up()
    .ele("ContactPerson", { contactType: "technical" })
    .ele("Company")
    .txt("Consenso Corp")
    .up()
    .ele("EmailAddress")
    .txt("tech@consensocorp.com")
    .up()
    .up()
    .end({ pretty: true });

  return xml.toString();
};

/**
 * Firma el XML de metadatos SAML
 * @param xml XML a firmar
 * @returns XML firmado
 */
export const signMetadataXML = (xml: string): string => {
  try {
    const sig = new SignedXml({
      privateKey: key,
      signatureAlgorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
      canonicalizationAlgorithm: "http://www.w3.org/2001/10/xml-exc-c14n#",
    });

    sig.addReference({
      xpath: "//*[local-name(.)='EntityDescriptor']",
      transforms: [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/2001/10/xml-exc-c14n#",
      ],
      digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
    });

    sig.getKeyInfoContent = () =>
      `<ds:X509Data><ds:X509Certificate>${cert}</ds:X509Certificate></ds:X509Data>`;
    sig.computeSignature(xml, {
      location: { reference: "", action: "prepend" },
    });

    return sig.getSignedXml();
  } catch (error) {
    console.error("Error al firmar XML:", error);
    throw new Error("Error al firmar el XML de metadatos");
  }
};
