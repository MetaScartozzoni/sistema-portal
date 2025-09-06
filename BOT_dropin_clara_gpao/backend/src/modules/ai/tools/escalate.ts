export async function escalateHuman(input: { conversationId: string; reason?: string }) {
  // TODO: criar ticket no seu sistema (Zendesk/Freshdesk/etc).
  return { ok: true, ticket: { id: "T-" + input.conversationId, reason: input.reason || null } };
}
