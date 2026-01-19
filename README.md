<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1mVajecxZndsUAqmwwTwwfqCWdECDMt6U

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   `npm run preview`

## Remote Access & PWA Testing

To test the PWA on a mobile device (required for "Add to Home Screen"), you need a secure public URL. We recommend **Cloudflare Tunnel** or **Serveo**.

### Option A: Cloudflare Tunnel (Recommended)
1.  Run the tunnel:
    ```bash
    npx trycloudflared --url http://localhost:5173
    ```
2.  Open the provided `.trycloudflare.com` URL on your phone.

### Option B: Serveo (No install required)
1.  Run the tunnel:
    ```bash
    ssh -R 80:localhost:5173 serveo.net
    ```
2.  Open the provided URL on your phone.

*Note: Ngrok Free Tier is **not recommended** for PWA testing because its warning page blocks the manifest file.*
