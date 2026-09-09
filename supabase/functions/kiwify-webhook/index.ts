import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = Record<string, any>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function eventType(payload: Payload) {
  return String(payload.webhook_event_type ?? payload.event ?? payload.type ?? "").toLowerCase();
}

function extractEmail(payload: Payload) {
  return String(payload.Customer?.email ?? payload.customer?.email ?? payload.email ?? "").trim().toLowerCase();
}

function extractSubscription(payload: Payload) {
  const subscription = payload.Subscription ?? payload.subscription ?? {};
  return {
    id: String(subscription.subscription_id ?? subscription.id ?? payload.subscription_id ?? "").trim() || null,
    planId: String(subscription.plan?.id ?? subscription.plan_id ?? "").trim() || null,
    status: String(subscription.status ?? "").trim().toLowerCase() || null,
    startDate: subscription.start_date ?? null,
    nextPayment: subscription.next_payment ?? null,
  };
}

function isAllowedWebhook(payload: Payload, request: Request) {
  const expected = Deno.env.get("KIWIFY_WEBHOOK_TOKEN")?.trim();
  if (!expected) return false;

  const urlToken = new URL(request.url).searchParams.get("token")?.trim();
  const headerToken = request.headers.get("x-kiwify-token")?.trim()
    ?? request.headers.get("x-webhook-token")?.trim();
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const bodyToken = typeof payload.token === "string" ? payload.token.trim() : null;

  return [urlToken, headerToken, auth, bodyToken].some((candidate) => candidate === expected);
}

async function findAuthUserByEmail(admin: ReturnType<typeof createClient>, email: string) {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const user = data.users.find((item) => item.email?.trim().toLowerCase() === email);
    if (user) return user;
    if (data.users.length < 1000) break;
  }
  return null;
}

async function updateEntitlement(admin: ReturnType<typeof createClient>, userId: string, enabled: boolean, expiresAt: string | null, subscriptionId: string | null, metadata: Payload) {
  const key = "coram_deo";
  const { data: existing, error: findError } = await admin
    .from("user_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("entitlement_key", key)
    .limit(1)
    .maybeSingle();
  if (findError) throw findError;

  const row = {
    user_id: userId,
    entitlement_key: key,
    source: "kiwify",
    subscription_id: subscriptionId,
    enabled,
    type: "subscription",
    expires_at: expiresAt,
    metadata,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await admin.from("user_entitlements").update(row).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await admin.from("user_entitlements").insert(row);
    if (error) throw error;
  }
}

async function updateSubscription(admin: ReturnType<typeof createClient>, userId: string, payload: Payload, status: string, cancelAtPeriodEnd: boolean, periodEnd: string | null) {
  const sub = extractSubscription(payload);
  const providerSubscriptionId = sub.id;

  const { data: existing, error: findError } = await admin
    .from("user_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("provider", "kiwify")
    .limit(1)
    .maybeSingle();
  if (findError) throw findError;

  const row = {
    user_id: userId,
    plan_id: sub.planId,
    status,
    provider: "kiwify",
    provider_customer_id: payload.Customer?.email ?? null,
    provider_subscription_id: providerSubscriptionId,
    current_period_start: sub.startDate,
    current_period_end: periodEnd,
    canceled_at: cancelAtPeriodEnd ? new Date().toISOString() : null,
    cancel_at_period_end: cancelAtPeriodEnd,
    metadata: {
      order_id: payload.order_id ?? null,
      order_status: payload.order_status ?? null,
      webhook_event_type: eventType(payload),
      product: payload.Product ?? null,
      subscription: payload.Subscription ?? null,
    },
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await admin.from("user_subscriptions").update(row).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await admin.from("user_subscriptions").insert({ ...row, created_at: new Date().toISOString() });
    if (error) throw error;
  }

  return { subscriptionId: providerSubscriptionId, nextPayment: sub.nextPayment };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const payload = await request.json().catch(() => null) as Payload | null;
  if (!payload) return json({ error: "Invalid JSON" }, 400);
  if (!isAllowedWebhook(payload, request)) return json({ error: "Unauthorized webhook" }, 401);

  const email = extractEmail(payload);
  const event = eventType(payload);
  if (!email || !event) return json({ error: "Missing customer email or event type" }, 400);

  const configuredProductId = Deno.env.get("KIWIFY_PRODUCT_ID")?.trim();
  const productId = String(payload.Product?.product_id ?? "").trim();
  if (configuredProductId && productId && configuredProductId !== productId) return json({ ok: true, ignored: "different_product" });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const user = await findAuthUserByEmail(admin, email);
  if (!user) return json({ error: "Coram Deo account not found for customer email" }, 404);

  const sub = extractSubscription(payload);
  const now = new Date();
  const eventDate = now.toISOString();

  const approved = event === "order_approved" || event === "compra_aprovada" || (event === "" && payload.order_status === "paid");
  const renewed = event === "subscription_renewed";
  const canceled = event === "subscription_canceled";
  const late = event === "subscription_late";
  const revoked = event === "compra_reembolsada" || event === "order_refunded" || event === "chargeback";

  if (revoked) {
    const result = await updateSubscription(admin, user.id, payload, "canceled", false, eventDate);
    await updateEntitlement(admin, user.id, false, eventDate, result.subscriptionId, { event, order_id: payload.order_id ?? null });
    return json({ ok: true, action: "revoked" });
  }

  if (canceled) {
    const periodEnd = sub.nextPayment ?? null;
    const result = await updateSubscription(admin, user.id, payload, "canceled", true, periodEnd);
    await updateEntitlement(admin, user.id, true, periodEnd, result.subscriptionId, { event, order_id: payload.order_id ?? null });
    return json({ ok: true, action: "cancel_at_period_end" });
  }

  if (late) {
    const graceUntil = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const result = await updateSubscription(admin, user.id, payload, "past_due", false, graceUntil);
    await updateEntitlement(admin, user.id, true, graceUntil, result.subscriptionId, { event, order_id: payload.order_id ?? null });
    return json({ ok: true, action: "grace_period" });
  }

  if (approved || renewed) {
    const periodEnd = sub.nextPayment ?? null;
    const result = await updateSubscription(admin, user.id, payload, "active", false, periodEnd);
    await updateEntitlement(admin, user.id, true, periodEnd, result.subscriptionId, { event, order_id: payload.order_id ?? null });
    return json({ ok: true, action: "activated" });
  }

  return json({ ok: true, ignored: event });
});
