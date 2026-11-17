# CloudForge Lite — free Firebase cloud implementation

This is the easiest zero-billing version of CloudForge. It demonstrates a real cloud application without
requiring Cloud Run, EC2 or a billing account:

```text
Cloud Shell → Firebase Hosting → Firestore → Anonymous Auth → Security Rules
```

## What it demonstrates

- Cloud-hosted static application
- SaaS/PaaS-style managed hosting
- DBaaS through Firestore
- Browser-to-cloud API calls through the Firebase SDK
- Authentication and authorization
- Security rules and input validation
- Real-time database listener
- Cloud deployment and public HTTPS URL

## Deployment outline

1. Create a Firebase project on the Spark plan.
2. Create a Web app and copy its Firebase SDK configuration.
3. Enable Firestore Database.
4. Enable Anonymous sign-in.
5. Copy `public/firebase-config.example.js` to `public/firebase-config.js` and paste the config.
6. In Cloud Shell, run `firebase init hosting firestore`.
7. Deploy with `firebase deploy`.

Firebase Hosting and Firestore usage must stay within their no-cost quotas. Do not link a billing account for
this version. If a command asks to upgrade to Blaze, stop and send the error instead of accepting it.

## Application behaviour

- Add a product through the form.
- Firestore stores it in the `products` collection.
- The real-time listener updates the catalog without a page refresh.
- Double-click a product card to delete it.
- Firestore Rules require an authenticated anonymous user and validate name, price and stock.

## Important limitation

This version is intentionally the free/easy variant. It does not demonstrate Docker, Cloud Run or Terraform.
Those belong to the advanced paid-cloud variant in the separate CloudForge-MVP project.
