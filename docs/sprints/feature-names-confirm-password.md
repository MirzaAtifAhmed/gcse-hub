# Feature: First Name, Surname and Confirm Password

## Changes

- User documents now store `firstName`, `surname`, and display `name`.
- Registration validates `confirmPassword`.
- Child creation validates `confirmPassword`.

## Manual checks

- Register parent with password mismatch: should show error.
- Register parent with matching passwords: should create account.
- Create child with password mismatch: backend rejects.
- Create child with matching passwords: child is created.
