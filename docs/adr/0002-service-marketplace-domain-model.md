# ADR 0002: Service Marketplace Domain Model

## Status

Accepted

## Context

Ruang Usaha Kita connects UMKM with creators, content creators, and marketers for digital promotion work. The marketplace flow resembles e-commerce in structure, but the purchased item is a service package, not a physical product.

Using physical-commerce concepts would make the product confusing and weaken the accuracy of order, checkout, delivery, and revision flows.

## Decision

Model the platform as a digital service marketplace.

Core concepts include UMKM, creator, service package, campaign brief, checkout, payment, order progress, delivery files, revision, invoice, portfolio, and review.

Avoid stock, warehouse, shipping, courier, tracking number, delivery address, packing, shipment, resi, ongkir, gudang, kurir, and alamat pengiriman barang in product language and implementation naming.

## Consequences

The cart and checkout flows are centered on selected service packages, tiers, add-ons, and campaign briefs. Order completion depends on creative delivery and UMKM approval, not physical fulfillment.

This decision affects UI copy, database naming, status labels, documentation, and testing expectations. Contributors should preserve the domain vocabulary when adding or changing features.

