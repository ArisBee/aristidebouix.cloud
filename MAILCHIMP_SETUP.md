# Mailchimp Newsletter Popup Setup Guide

This guide will help you integrate a beautiful, responsive newsletter signup popup with Mailchimp into your Hugo website.

## Features

✅ **Smart Display Logic**: Shows after 30 seconds, on scroll (70%), or exit intent  
✅ **User-Friendly**: Remembers user preferences, won't spam visitors  
✅ **Responsive Design**: Works perfectly on mobile and desktop  
✅ **Accessibility**: Full keyboard navigation and screen reader support  
✅ **Analytics Tracking**: Integrates with Google Analytics  
✅ **Dark Mode Support**: Automatically adapts to user preferences  
✅ **Smooth Animations**: Modern CSS animations and transitions  

## Quick Setup

### 1. Get Your Mailchimp Form URL

1. **Log into Mailchimp** and go to your account
2. **Navigate to Audience** → **Signup forms** → **Embedded forms**
3. **Select your audience** and choose "Embedded form"
4. **Copy the form action URL** from the `<form>` tag. It looks like:
   ```
   https://yourdomain.us1.list-manage.com/subscribe/post?u=XXXXXX&amp;id=YYYYYY
   ```

### 2. Configure Your Hugo Site

Open your `config.toml` file and update the Mailchimp section:

```toml
[params.mailchimp]
    enabled = true  # Enable the popup
    action_url = "https://yourdomain.us1.list-manage.com/subscribe/post?u=XXXXXX&amp;id=YYYYYY"
    popup_title = "Stay in the Loop!"
    popup_description = "Get the latest insights on technology, cybersecurity, and business growth delivered to your inbox."
    disclaimer = "No spam, unsubscribe anytime."
    honeypot_name = "b_mailchimp_honeypot"
```

### 3. Customize the Popup (Optional)

You can customize various aspects by editing the configuration:

```toml
[params.mailchimp]
    enabled = true
    action_url = "YOUR_MAILCHIMP_URL"
    popup_title = "Your Custom Title"
    popup_description = "Your custom description text"
    disclaimer = "Your privacy disclaimer"
    
    # Add additional hidden fields if needed
    [[params.mailchimp.additional_fields]]
        name = "SOURCE"
        value = "website_popup"
```

### 4. Adjust Display Settings

Modify the JavaScript configuration in `layouts/partials/header.html`:

```javascript
window.mailchimpConfig = {
    showDelay: 45000,           // Show after 45 seconds (instead of 30)
    exitIntentEnabled: true,    // Show when user tries to leave
    scrollPercentage: 80,       // Show after scrolling 80% (instead of 70%)
    cookieExpiry: 60,          // Remember choice for 60 days (instead of 30)
    maxDisplays: 2             // Show maximum 2 times (instead of 3)
};
```

## Advanced Configuration

### Custom Styling

The popup uses CSS custom properties that you can override:

```css
/* Add to your custom CSS */
:root {
    --popup-primary-color: #your-brand-color;
    --popup-background: #ffffff;
    --popup-text-color: #333333;
}
```

### Analytics Integration

The popup automatically tracks events if you have Google Analytics:

- `popup_shown` - When popup is displayed
- `popup_closed` - When popup is closed
- `popup_dismissed` - When user clicks "No thanks"
- `newsletter_signup` - When user subscribes

### Manual Control

You can manually control the popup via JavaScript:

```javascript
// Show popup manually
window.mailchimpPopup.show();

// Hide popup
window.mailchimpPopup.hide();

// Reset user preferences (for testing)
window.mailchimpPopup.reset();
```

## Testing

### 1. Local Testing

1. Set `enabled = true` in your config
2. Run `hugo server`
3. Visit your site and wait 30 seconds or scroll down 70%
4. The popup should appear

### 2. Reset Testing Data

To test the popup multiple times, run this in your browser console:

```javascript
window.mailchimpPopup.reset();
```

### 3. Check Form Submission

1. Enter a test email
2. Check your Mailchimp audience for the new subscriber
3. Verify the success message appears

## Troubleshooting

### Popup Doesn't Appear

1. **Check configuration**: Ensure `enabled = true` in config.toml
2. **Check console**: Look for JavaScript errors in browser dev tools
3. **Clear storage**: Run `mailchimpPopup.reset()` in console
4. **Check triggers**: Wait 30+ seconds or scroll to 70%+

### Form Submission Issues

1. **Verify URL**: Ensure the Mailchimp action URL is correct
2. **Check network**: Look at network tab in dev tools for failed requests
3. **Test manually**: Try submitting the form directly in Mailchimp

### Styling Issues

1. **CSS conflicts**: Check if your theme CSS is overriding popup styles
2. **Mobile view**: Test on different screen sizes
3. **Dark mode**: Check both light and dark mode appearances

## Customization Examples

### Different Languages

For multilingual sites, you can set different text per language:

```toml
[Languages.en.params.mailchimp]
    popup_title = "Stay in the Loop!"
    popup_description = "Get the latest insights delivered to your inbox."

[Languages.nl.params.mailchimp]
    popup_title = "Blijf op de hoogte!"
    popup_description = "Ontvang de laatste inzichten in je inbox."
```

### Seasonal Campaigns

Change the content based on campaigns:

```toml
[params.mailchimp]
    popup_title = "Black Friday Special! 🎉"
    popup_description = "Get exclusive deals and early access to our biggest sale of the year."
```

### Professional Services

For B2B or professional sites:

```toml
[params.mailchimp]
    popup_title = "Industry Insights Weekly"
    popup_description = "Join 5,000+ professionals getting weekly insights on cybersecurity trends and best practices."
    disclaimer = "Professional insights only. Unsubscribe anytime."
```

## Performance Notes

- **CSS**: 8KB minified, loads only when enabled
- **JavaScript**: 12KB minified, includes all functionality
- **No external dependencies**: Everything is self-contained
- **Lazy loading**: Only loads when popup is actually needed

## Security Features

- **Honeypot protection**: Prevents basic spam bots
- **No-CORS submission**: Uses Mailchimp's standard form handling
- **Input validation**: Client-side email validation
- **XSS protection**: All user inputs are properly escaped

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your Mailchimp URL is correct
3. Test with `mailchimpPopup.reset()` to clear stored preferences
4. Check if your theme has conflicting CSS or JavaScript

The popup is designed to be unobtrusive and respect user preferences while maximizing conversion opportunities.