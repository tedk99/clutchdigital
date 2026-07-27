# Clutch Digital

Company website for Clutch Digital consultancy.

Live at: https://clutchdigital.co.uk
# Clutch Digital

Static GitHub Pages site for `clutchdigital.co.uk`.

## LAN link forwarder

`/fwd/` turns raw home-network URLs into clickable WhatsApp links for:

- `legion` → `192.168.68.52`
- `macbook` → `192.168.68.50`
- `macmini` → `192.168.68.67`

Example:

```text
https://clutchdigital.co.uk/fwd/legion/?port=18080&path=car-accident-repair&v=3
```

The public page redirects the browser to the LAN URL. The recipient must be
connected to the Deco home Wi-Fi.

Run the link tests with:

```bash
node --test test/*.test.mjs
```
