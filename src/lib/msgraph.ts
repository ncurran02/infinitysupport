import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { getSecret } from "astro:env/server";

const MICROSOFT_GRAPH_CLIENT_ID = getSecret("MICROSOFT_GRAPH_CLIENT_ID");
const MICROSOFT_GRAPH_TENANT_ID = getSecret("MICROSOFT_GRAPH_TENANT_ID");
const MICROSOFT_GRAPH_CLIENT_SECRET = getSecret("MICROSOFT_GRAPH_CLIENT_SECRET");

if (!MICROSOFT_GRAPH_CLIENT_ID || !MICROSOFT_GRAPH_TENANT_ID || !MICROSOFT_GRAPH_CLIENT_SECRET) {
    throw new Error("Missing Microsoft Graph credentials");
}

const credentials = new ClientSecretCredential(
    MICROSOFT_GRAPH_TENANT_ID,
    MICROSOFT_GRAPH_CLIENT_ID,
    MICROSOFT_GRAPH_CLIENT_SECRET
);

async function getClient() {
    const token = await credentials.getToken("https://graph.microsoft.com/.default");
    const client = Client.init({
        authProvider: (done) => {
            done(null, token?.token ?? "")
        }
    });
    
    return client;
}

export async function sendEmail(name: string, email_address: string, phone: string, message: string) {
    const client = await getClient();

    const email = {
        message: {
            subject: `Contact Form Submission from ${name}`,
            body: {
                contentType: "Text",
                content: `Name: ${name}\nEmail: ${email_address}\nPhone: ${phone}\nMessage: ${message}`
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: "nathan@heathcotetech.com.au"
                    }
                }
            ]
        },
        saveToSentItems: false
    };

    await client.api('/users/nathan@heathcotetech.com.au/sendMail').post(email);
}