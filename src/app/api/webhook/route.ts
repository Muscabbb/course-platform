import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { DeleteUser, InsertUser, updateUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { revalidateUserCache } from "@/features/users/db/cache";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  console.log(SIGNING_SECRET);

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      const email = evt.data.email_addresses.find(
        (email) => email.id === evt.data.primary_email_address_id
      )?.email_address as string;
      const name = `${evt.data.first_name} ${evt.data.last_name}`.trim();
      const data = {
        email,
        name,
        imageUrl: evt.data.image_url,
        clerkUserId: evt.data.id,
      };
      if (email == null)
        return new Response("Error: No email found", { status: 400 });
      if (name == "")
        return new Response("Error: No name found", { status: 400 });
      if (evt.type === "user.created") {
        const user = await InsertUser(data);
        revalidateUserCache(user.id);
        await syncClerkUserMetadata(user);
      } else {
        const user = await updateUser(data.clerkUserId, data);
        revalidateUserCache(user.id);
      }

      break;
    case "user.deleted":
      if (evt.data.id != null) {
        await DeleteUser(evt.data.id);
      }
      break;
  }

  return new Response("Webhook received", { status: 200 });
}
