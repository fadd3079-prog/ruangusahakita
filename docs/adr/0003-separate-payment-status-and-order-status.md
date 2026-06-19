# ADR 0003: Separate Payment Status and Order Status

## Status

Accepted

## Context

Ruang Usaha Kita has payment flow and order production flow, but they represent different business facts. A payment can be pending, paid, failed, expired, or refunded. An order can be waiting for creator confirmation, in progress, submitted, under revision, completed, cancelled, or otherwise managed through the service workflow.

If payment status and order status are merged, the system can accidentally treat a paid order as completed or allow incorrect transitions.

## Decision

Keep payment status and order status separate.

Payment updates should only describe payment state. Order status should describe the progress of the creative service workflow. A paid payment can move an order into the next valid service-work state, but it must not complete the order.

## Consequences

Server-side actions, route handlers, RPC functions, dashboard views, and UI badges must continue to display and update the two status types separately.

Creator users must not complete orders by themselves. Order completion should happen through UMKM approval or a defined admin resolution path.

