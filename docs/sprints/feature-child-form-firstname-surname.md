# Feature: Child Form First Name, Surname and Confirm Password

## Changes

The parent dashboard child creation form now matches the backend schema.

Fields:

- first name
- surname
- email
- password
- confirm password
- current year
- target

## Manual checks

- Password mismatch shows error.
- Matching passwords sends request to `/api/children`.
- Created child appears in parent dashboard.
