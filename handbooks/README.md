# Free handbook PDFs (email attachments)

Place **exactly these four files** in this folder before deploying:

| File on disk (required name) | Original download name |
|------------------------------|------------------------|
| `EAT_Nutrition_Guide.pdf` | EAT_Nutrition_Guide.pdf |
| `FUEL_Supplement_Guide.pdf` | FUEL_Supplement_Guide.pdf |
| `Muscle_Handbook_Milos_Ilic.pdf` | Muscle handbook by Milos Ilic.pdf |
| `Busy_Strong_7Day_CoachMilos.pdf` | Busy_Strong_7Day_CoachMilos..pdf |

## Steps

1. Copy the four PDFs from your computer into this `handbooks/` folder.
2. Rename them to match the **File on disk** column (no spaces in filenames).
3. Commit and push — Vercel will include them in the deployment for `/api/handbook-lead`.

If a file is missing, the API returns an error and the user will not receive that attachment.

**Note:** Large PDFs increase deploy size. If total size is an issue, consider Supabase Storage + signed links in a future iteration.
