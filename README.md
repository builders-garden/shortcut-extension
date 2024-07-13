# ⚡ Shortcut

**Shortcut** is a browser extension that is capable of detecting **EVM Actions** links and displaying them to the user in a user-friendly way.

## ❓ What is this?

EVM Actions are APIs that return actions - such as signing of messages or transactions - directly to a user. They are hosted at publicly accessible URLs and are therefore accessible by their URL for any client to interact with.

The EVM actions API consists in a simple flow of `GET` and `POST` requests:

- the `GET` request returns a human-readable metadata information to the client about what actions are available at the given URL, and an optional list of related actions;
- the `POST` request returns a signable transaction or message that the client can prompt to the user's wallet to be signed or executed.

An example EVM action link is:

```bash
eal://blinks.builders.garden/mint
```

The `eal://` prefix is a URL scheme that indicates that the URL is an EVM action URL and stands for **EVM Actions Locator**. the rest of the URL is the real URL of the EVM Action API.

## 💼 How does it work?

Interacting with EVM Actions is a simple process:

- the client makes the initial `GET` request to the given URL to fetch the metadata;
- the `GET` endpoint returns the human-readable metadata information;
- the client displays a UI for the user to perform one or more actions specified in the metadata;
- the user selects an available action in the form of a button and the client makes a `POST` request to the specified endpoint;
- the `POST` endpoint returns the signable transaction or message;
- the client sends the signable transaction or message to the user's wallet for signing or execution.

## 📝 EVM action metadata

This is the structure of a typical EVM action metadata:

```json
{
  "title": "title of the EVM Action",
  "description": "description of the EVM Action",
  "icon": "EVM Action image URL",
  "links": [
    {
      "href": "action POST URL",
      "label": "action label",
      "tx": true, // whether this button represents a TX or not
      "parameters": [
        {
          "name": "name of the parameter",
          "label": "placeholder text for the input field", // optional
          "required": false // optional
        }
      ] // action parameters
    }
  ], // list of actions (buttons) that will be displayed to the user
  "label": "EVM Action button label"
}
```

## 🔎 Introducting Shortcut

**Shortcut** is a browser extension that is capable of detecting EVM Actions links and displaying them to the user in a user-friendly way.

It reads for content in the page and detects EVM Actions links. When it finds one, it renders the EVM Action metadata in the following way:

- the `icon` field gets rendered as a 400x400px image;
- it displays the EAL as a clickable `<a>` tag;
- displays both the `title` and `description` of the EVM action;
- if only one `label` is provided, then only 1 button is rendered;
- if no `label` is provided but `links` is, then a button (+ parameters) is rendered for each link in the `links` array.
