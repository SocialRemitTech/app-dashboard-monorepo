eas login
cd apps/mobile
eas build:configure
y # cloud-builds the iOS .ipa
eas build --platform android --profile production # cloud-builds the Android .aab
eas submit --platform ios --profile production # uploads to TestFlight
eas submit --platform android --profile production

The important thing first: creating that service account requires your Google Play Developer account to be fully set up and past the initial app creation — and crucially, Google requires your very first upload to a new app to be done manually through the Play Console website. eas submit (which needs this JSON) only works for subsequent uploads. So for a brand-new app, the JSON isn't even usable yet.

Given that, here's the clean path:

Step 1 — build the Android app (no JSON needed):

cd apps/mobile
eas build --platform android --profile production

This produces the .aab file. When it's done, download it from the build page.

Step 2 — first upload is manual (Google's requirement):

Go to play.google.com/console → create the app (name: Social Remit) → Internal testing → Create new release → upload the .aab you just built.
This first manual upload is mandatory for a new app; there's no way around it.

Step 3 — the service account JSON (only for future automated uploads): once the app exists in Play Console, you create the credential so eas submit can push future builds automatically:

In Play Console → Setup → API access → link/create a Google Cloud project.
In Google Cloud Console → IAM & Admin → Service Accounts → create one → create a JSON key → download it.
Back in Play Console → API access → grant that service account access (Release permissions).
Save the downloaded JSON as apps/mobile/google-play-service-account.json — the exact path in your eas.json.
Add it to .gitignore — it's a secret, never commit it.

eas build --profile production --platform all

cd /Users/mac/Documents/social-remit-monorepo
sed -i '' '/^expo-env.d.ts$/d' apps/mobile/.gitignore
git add -f apps/mobile/expo-env.d.ts apps/mobile/.gitignore
git commit -m "chore: track expo-env.d.ts for expo-router types"
git push

cd apps/mobile
eas build --platform android --profile production
