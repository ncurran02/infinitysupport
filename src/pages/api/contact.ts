import type { APIRoute } from "astro";
import { sendEmail } from "../../lib/msgraph";
import { getSecret } from "astro:env/server";

export const POST: APIRoute = async ({ request }) => {
    const response = await request.json();
    const { name, email, phone, message } = response;

    const token = response.body['cf-turnstile-response'];
    const remote_ip = request.headers.get('cf-connecting-ip');

    const SECRET_KEY = getSecret("TURNSTILE_SECRET");

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            secret: SECRET_KEY,
            response: token,
            remoteip: remote_ip,
        })
    });

    const cf_response = await result.json();
    if (!cf_response.success) {
        return new Response(JSON.stringify({
            message: "Human Verification has failed"
        }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    if (!name || !email || !phone || !message) {
        return new Response(JSON.stringify({
            message: "Missing required fields"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    try {
        await sendEmail(name, email, phone, message);
    } catch (error) {
        return new Response(JSON.stringify({
            message: `Unable to send an email...\n${error}`
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    return new Response(JSON.stringify({
        message: "Email has been sent"
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        }
    });
};

export const OPTIONS: APIRoute = async ({ request }) => {
    const origin = request.headers.get("Origin");
    if (!origin?.startsWith("https://infinitysupport.heathcote.com.au")) {
        return new Response(null, { status: 403 });
    }

    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*"
        }
    });
}

export async function GET(): Promise<Response> {
    return new Response(null, {
      status: 302,
      headers: {
        Location: 'https://infinitysupport.heathcotetech.com.au/'
      }
    });
  }