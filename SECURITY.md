# Security Policy

Security is important for Ruang Usaha Kita because the project includes authentication, role-based access, order data, payment status, file delivery, and Supabase integration.

This document explains how to report security issues and which areas need careful review.

## Supported Versions

Ruang Usaha Kita is currently in early-stage development. The latest public release is the only version actively maintained.

| Version        | Supported |
| -------------- | --------- |
| latest release | yes       |
| older releases | no        |

## Reporting a Security Issue

If you find a security issue, please do not open a public issue with sensitive details.

Use one of these options:

1. Open a private report if GitHub private vulnerability reporting is enabled.
2. Contact the maintainer directly.
3. If the issue is not sensitive, open a public issue with limited technical detail.

Please include:

* Affected route or feature
* Steps to reproduce
* Expected behavior
* Actual behavior
* Possible impact
* Screenshot or logs if useful
* Suggested fix if available

## Security-Sensitive Areas

The most important areas to review are:

* Supabase RLS policies
* Authentication and session handling
* Role-based redirects
* UMKM, creator, and admin dashboard access
* Private file upload and delivery
* Payment sandbox status updates
* Order ownership validation
* Admin-only operations
* Service role usage
* Environment variable handling

## Security Rules

Do not:

* Expose `SUPABASE_SERVICE_ROLE_KEY`
* Import admin Supabase client into client components
* Trust user role from client input only
* Disable RLS for production behavior
* Use broad policies without ownership checks
* Allow users to access other users' orders, briefs, files, or payments
* Commit `.env.local` or real credentials

## Expected Response

For valid security reports, the maintainer will review the issue, reproduce it if possible, prepare a fix, and credit the reporter when appropriate.