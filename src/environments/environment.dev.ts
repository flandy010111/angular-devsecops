// ⚠️ VULN: Credentiale hardcodate — Gitleaks va detecta acestea
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",
};

// Private RSA key (fake - doar pentru demo Gitleaks)
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy0AHB7MhgHcTz6sE2I2yPB
aFDrBz9vFqU5BO9eFLBHVFEaGh0JlNzcMYuGziXSIWaFJE0CxkGwIzM0bOk1a5FP
QJn6R3G4JEpBRM0OBA4mqZ9yRbPMzODfwRliGNMIleFIFNGHbLF3dkEMSaWlYMo3
-----END RSA PRIVATE KEY-----`;
