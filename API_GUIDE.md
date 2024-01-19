# API Guide

## User Creation and Deletion

### POST `/api/users`
Creates a new user. Passwords are stored in the database as hashes (via bcrypt).

>[!NOTE]
>When a new user is created, the provided email must be confirmed before the user is able to log in (see below).

#### Parameters:
- `username`
  - type: string 
  - required: true
  - unique: true
- `firstName`
  - type: string 
  - required: true
  - unique: false
- `lastName`
  - type: string 
  - required: true
  - unique: false
- `email`
  - type: string 
  - required: true
  - unique: true
  - validation: isEmail  
- `password`
  - type: string 
  - required: true
  - unique: false

#### Returns:
- `id`
  -  type: UUID v4
-  `username`
-  `firstName`
-  `lastName`
-  `email`

### POST `/confirm/:key`

Path used for links sent to new users to confirm the provided email address.

When a new user is created, a unique key is stored in the database, and a link containing this key is sent to provided email. Before activating an account with this link, it cannot be used to log in.

The user has 30 minutes to follow the link and confirm the provided email. If the email is not confirmed within 30 minutes, the link expires and the user data is removed from the database.

#### Parameters:
- None

#### Returns:
- `Status 200` (no body)

