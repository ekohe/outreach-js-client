# Outreach Client Library

This library provides a client for interacting with the Outreach API, allowing you to perform various operations such as fetching accounts, creating prospects, updating account names, and more.

## Table of Contents
- Installation
- Usage
  - Initialization
  - #methods
- Methods Reference
  - Accounts
  - Prospects
  - Sequences
  - Users
  - Mailboxes

## Installation

To install this library, run:

```bash
yarn add https://github.com/ekohe/outreach-js-client
```

## Usage

### Initialization

First, import and initialize the `OutreachClient`:

```javascript
import OutreachClient from 'outreach-js-client';

const client = OutreachClient({
  handleBaseURL: (baseURL) => `${baseURL}`
});
```

### Methods

This library provides various methods to interact with the Outreach API. Below are some examples.

#### Get Account By ID

```javascript
client.getAccountById(accountId, token)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Create Account

```javascript
client.createAccount({
  name: 'New Account',
  domain: 'example.com',
  ownerId: 123
}, token)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

## Methods Reference

### Accounts

#### `getAccountById(id, token)`

Fetch an account by its ID.

- **Parameters:**
  - `id` (number): The account ID.
  - `token` (string): The API token.
- **Returns:** Promise with account data.

#### `createAccount(params, token)`

Create a new account.

- **Parameters:**
  - `params` (object): Account details (`name`, `domain`, `ownerId`).
  - `token` (string): The API token.
- **Returns:** Promise with created account data.

#### `updateAccountName(params, token)`

Update the name of an account.

- **Parameters:**
  - `params` (object): Contains `id` (account ID) and `name` (new name).
  - `token` (string): The API token.
- **Returns:** Promise with updated account data.

### Prospects

#### `getProspectById(id, token)`

Fetch a prospect by its ID.

- **Parameters:**
  - `id` (number): The prospect ID.
  - `token` (string): The API token.
- **Returns:** Promise with prospect data.

#### `getProspectByEmail(email, token)`

Fetch a prospect by email.

- **Parameters:**
  - `email` (string): The prospect email.
  - `token` (string): The API token.
- **Returns:** Promise with prospect data.

#### `createProspect(params, token)`

Create a new prospect.

- **Parameters:**
  - `params` (object): Prospect details (`emails`, `firstName`, `middleName`, `lastName`, `title`, `accountId`, `ownerId`).
  - `token` (string): The API token.
- **Returns:** Promise with created prospect data.

#### `updateProspect(params, token)`

Update a prospect.

- **Parameters:**
  - `params` (object): Contains `id` (prospect ID) and other attributes to update.
  - `token` (string): The API token.
- **Returns:** Promise with updated prospect data.

### Sequences

#### `getSequences(params, token)`

Fetch sequences.

- **Parameters:**
  - `params` (object): Query parameters.
  - `token` (string): The API token.
- **Returns:** Promise with sequence data.

#### `getSequenceById(id, token)`

Fetch a sequence by its ID.

- **Parameters:**
  - `id` (number): The sequence ID.
  - `token` (string): The API token.
- **Returns:** Promise with sequence data.

#### `addProspectToSequence(params, token)`

Add a prospect to a sequence.

- **Parameters:**
  - `params` (object): Contains `prospectId`, `sequenceId`, and `mailboxId`.
  - `token` (string): The API token.
- **Returns:** Promise with sequence state data.

### Users

#### `getUserInfo(params, token)`

Fetch user information.

- **Parameters:**
  - `params` (object): Contains `id` (user ID) and optional `searchParams`.
  - `token` (string): The API token.
- **Returns:** Promise with user data.

### Mailboxes

#### `getMailboxes(params, token)`

Fetch mailboxes.

- **Parameters:**
  - `params` (object): Contains `userId`.
  - `token` (string): The API token.
- **Returns:** Promise with mailbox data.

#### `testMailboxSync(params, token)`

Test the synchronization of a mailbox.

- **Parameters:**
  - `params` (object): Contains `mailboxId`.
  - `token` (string): The API token.
- **Returns:** Promise with mailbox data.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
