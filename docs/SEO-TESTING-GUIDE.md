# SEO & Performance Testing Guide

Quick guide to test all the improvements we just implemented.

## 🏃 Quick Start

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 🔍 What to Test

### 1. Image Optimization

**Hero Section:**
- Load homepage
- Open DevTools → Network tab → Img filter
- Look for `/united-logo-full.jpg`
- **Expected:** Should see WebP or AVIF format
- **Expected:** Should have `?w=...` query params (Next.js optimization)

**Artists Section:**
- Scroll to artists section
- Check Network tab
- **Expected:** Images load as you scroll (lazy loading)
- **Expected:** Optimized formats and sizes

### 2. Metadata

**Homepage:**
- Right-click → View Page Source
- Search for `<meta property="og:`
- **Expected:** Find Open Graph tags for title, description, image
- Search for `<meta name="twitter:`
- **Expected:** Find Twitter Card tags
- Search for `application/ld+json`
- **Expected:** Find JSON-LD structured data

**Test All Pages:**
- [ ] `/` - Homepage
- [ ] `/aftercare` - Aftercare
- [ ] `/book` - Booking
- [ ] `/artists` - Artists
- [ ] `/contact` - Contact
- [ ] `/deposit` - Deposit
- [ ] `/gift-cards` - Gift Cards
- [ ] `/specials` - Specials
- [ ] `/privacy` - Privacy (should have noindex)
- [ ] `/terms` - Terms (should have noindex)

### 3. Social Media Previews

**Facebook Debugger:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `http://localhost:3000` (use ngrok for local testing)
3. Click "Scrape Again"
4. **Expected:** See title, description, and image preview

**Twitter Card Validator:**
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. **Expected:** See card preview with image

### 4. Structured Data

**Google Rich Results Test:**
1. Go to: https://search.google.com/test/rich-results
2. Enter your URL or paste HTML
3. **Expected:** Valid `LocalBusiness` / `TattooParlor` schema
4. **Expected:** Valid `Organization` schema

**Check in DevTools:**
```javascript
// Run in browser console
JSON.parse(
  document.querySelector('script[type="application/ld+json"]').textContent
)
```
**Expected:** See business info, address, opening hours

### 5. Performance

**Lighthouse Audit:**
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Desktop" and "Mobile"
4. Run audit
5. **Expected Scores:**
   - Performance: 90+
   - SEO: 100
   - Accessibility: 90+
   - Best Practices: 90+

**Core Web Vitals:**
- **LCP:** < 2.5s (green)
- **FID:** < 100ms (green)
- **CLS:** < 0.1 (green)

### 6. Font Loading

**Check Preload:**
- View Page Source
- Look for font files
- **Expected:** See font files linked in head

**Check FOUT:**
- Throttle network to "Slow 3G"
- Reload page
- **Expected:** Text should be visible immediately (font-display: swap)

---

## 🛠️ Testing with ngrok (for Social Media Testing)

Since social media crawlers can't access localhost, use ngrok:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **In another terminal:**
   ```bash
   ngrok http 3000
   ```

4. **Use the ngrok URL** in social media debuggers

---

## 📊 Checklist

### Image Optimization
- [ ] Hero image loads in WebP/AVIF format
- [ ] Hero image has priority loading
- [ ] Artists section images lazy load
- [ ] Images have responsive sizes
- [ ] No layout shift when images load

### SEO Metadata
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Open Graph tags present on all pages
- [ ] Twitter Card tags present on all pages
- [ ] Canonical URLs on all pages
- [ ] Privacy & Terms have noindex

### Structured Data
- [ ] LocalBusiness schema present
- [ ] Organization schema present
- [ ] No errors in Rich Results Test
- [ ] Business info is accurate
- [ ] Address is correct
- [ ] Phone number is correct

### Performance
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse SEO = 100
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Fonts preload correctly
- [ ] No console errors

### Social Media
- [ ] Facebook preview works
- [ ] Twitter preview works
- [ ] LinkedIn preview works
- [ ] Image displays correctly
- [ ] Title and description accurate

---

## 🐛 Common Issues

### Images Not Optimizing

**Problem:** Images still loading as JPG/PNG

**Solution:**
1. Check `next.config.mjs` - ensure `unoptimized: false`
2. Restart dev server
3. Clear browser cache (Cmd/Ctrl + Shift + R)

### Social Previews Not Working

**Problem:** Social media crawlers not seeing metadata

**Solution:**
1. Use ngrok for local testing
2. Check that page is server-side rendered (not client-only)
3. Wait 24 hours for cache to clear on social platforms

### Structured Data Errors

**Problem:** Google Rich Results Test shows errors

**Solution:**
1. Check `lib/metadata.ts` for typos
2. Ensure all required fields are present
3. Validate JSON syntax

### Environment Variable

**Problem:** URLs showing localhost in production

**Solution:**
1. Set `NEXT_PUBLIC_SITE_URL` in your deployment environment
2. For local testing with ngrok, set it temporarily:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-ngrok-url.ngrok.io npm run dev
   ```

---

## 📈 Production Testing

After deploying to production:

1. **Run Lighthouse on production URL**
2. **Submit to Google Search Console**
3. **Monitor for 7 days:**
   - Check Search Console for errors
   - Monitor Core Web Vitals
   - Check mobile usability
4. **Test social shares** on real posts
5. **Monitor page load times** in analytics

---

## 🎯 Success Criteria

Your implementation is successful when:

✅ Lighthouse Performance Score > 90
✅ Lighthouse SEO Score = 100
✅ LCP < 2.5 seconds
✅ All images in WebP/AVIF format
✅ Social media previews display correctly
✅ Rich Results Test passes without errors
✅ No console errors
✅ Mobile performance is good

---

## 🆘 Need Help?

If something isn't working:

1. Check the browser console for errors
2. Review the Network tab for failed requests
3. Verify environment variables are set
4. Clear browser cache and try again
5. Check the [Next.js Image Optimization docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Quick Test Command:**
```bash
# Start dev server and open Lighthouse
npm run dev & 
sleep 5 && 
open http://localhost:3000
```

Then open DevTools → Lighthouse → Run Audit

---

**Last Updated:** 2025-10-09

