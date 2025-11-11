import {generateMetadataXML, signMetadataXML} from "../utils/generateXML";

export class AuthService {
  static async generateSAMLMetadata(baseURL: string) {
    if (!baseURL) {
      throw new Error("Base URL is required");
    }
    interface MetadataConfig {
      entityID: string;
      acsURL: string;
      logoutURL: string;
      serviceName: string;
    }

    const metadataConfig: MetadataConfig = {
      entityID: `${baseURL}/saml/metadata`,
      acsURL: `${baseURL}/saml/acs`,
      logoutURL: `${baseURL}/saml/logout`,
      serviceName: "CommissionsPortal",
    };

    const unsignedXML = generateMetadataXML(metadataConfig);
    const signedXML = signMetadataXML(unsignedXML);
    return signedXML;
  }
}
