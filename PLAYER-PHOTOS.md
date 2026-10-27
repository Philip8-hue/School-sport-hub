# Player photo uploads

Players sign in, open My account → Player → My profile, choose a JPG, PNG or WebP file, check the preview and select Save photo. No image link is needed. Only an account with an admin-approved link to that player can upload, replace or remove the photo. Coaches, fans, pending applicants and revoked owners cannot change it. The approved owner can have multiple linked profiles and uploads separately for each one.

Photos are public on player profile cards and directory previews. The dashboard also shows the current photo. Existing admin-provided photo links continue to work; uploading replaces the player's current photo. Admin editing remains available.

Input limit: 3 MB and 16 megapixels. JPEG, PNG and non-animated WebP only. The server decodes, rotates, preserves the complete photo and its aspect ratio, strips metadata (including GPS) and encodes WebP. It scales down to fit within 1024×1024, lowering quality/resolution as needed to stay under 48 KB. Only the thumbnail is cropped by CSS; the full viewer uses contain sizing. Unsupported or damaged files leave the existing photo unchanged. Upload request filenames are not stored. Photos uploaded before this change were permanently cropped and must be uploaded again to recover the missing edges.

There is one stored photo per player in the new PlayerPhoto table; replacements overwrite it and removal deletes it. At the maximum, 100 photos contain about 4.7 MiB of image data, plus database overhead; actual sizes are usually lower. Photos are served through a separate public image endpoint, rather than embedded in every player API response. This uses the configured database and works across Vercel instances without local disk storage or new environment variables. The table has a foreign key that deletes the photo if its player is deleted. Supabase browser roles cannot access the photo table directly.

The additive `20261027100000_player_photos` migration was applied to the original SQLite and configured Supabase databases, verifying all pre-existing rows unchanged. No real player photo was altered during implementation. Before deploying to a different database, run the existing Supabase migration deployment command; never reset or re-import data.

The publish checkout includes Sharp, its lockfile, generated Prisma clients, migration and UI changes. Push and deploy through the existing workflow. No extra photo service or API key is required. The request-body parser was also updated to its compatible security-patched version; npm reported zero known vulnerabilities after the update.

Verification: `npm run test:memberships` includes approved/unapproved/other-player/revoked permissions, invalid and oversized files, public WebP delivery, metadata stripping, output limits, replacement without accumulation and removal. Test accounts and images are isolated in a disposable database.
