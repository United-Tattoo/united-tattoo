# Kaori - Artist Assets

## TODO: Files Needed

### 1. Portrait Image
- **Location:** `/public/artists/kaori-portrait.jpg` (parent directory)
- **Naming:** `kaori-portrait.jpg` (or update when last name is known: `kaori-lastname-portrait.jpg`)
- **Recommended size:** Similar aspect ratio to other artist portraits
- **Format:** JPG or PNG

### 2. Portfolio Images
- **Location:** Place images in `/Portfolio/` subdirectory
- **Format:** JPG, JPEG, PNG, WEBP, or AVIF
- **Naming:** Any naming convention works (numbered, dated, descriptive)

### 3. Flash Designs (Optional)
- **Location:** Place images in `/Flash/` subdirectory
- **Format:** Same as portfolio
- **Use:** For ready-to-tattoo flash sheet designs

## Information Needed

Update `/src/content/artists/kaori.mdx` with:

1. **Full name** - Add last name to frontmatter `name` field
2. **Specialties** - Replace "TBD" with actual tattoo styles (e.g., "Japanese", "Black and Grey", "Floral")
3. **Bio content** - Replace placeholder sections with:
   - Background/origin story
   - Artistic style description
   - Philosophy or approach
   - Personal quote (optional)
4. **Instagram handle** (optional) - Add `instagram: "@handle"` to frontmatter if available

## Directory Structure

```
Kaori/
├── Portfolio/    (Add portfolio images here)
├── Flash/        (Add flash designs here - optional)
└── README.md     (This file)
```

Portrait should be placed in parent directory:
```
public/artists/
└── kaori-portrait.jpg
```
