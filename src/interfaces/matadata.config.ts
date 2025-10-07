export interface MetadataConfig {
  entityID: string;
  acsURL: string;
  logoutURL: string;
  serviceName?: string;
  validUntil?: string; // ISO date string
}
