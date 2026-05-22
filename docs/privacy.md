# How we handle your data

## Your DNA never leaves your device

When you upload a 23andMe or AncestryDNA file to Chronic Wellness, that file is read entirely by the JavaScript running in your browser. It's parsed on your laptop or phone, and the genotype data stays there. Your DNA is never transmitted to our servers, to Google, or to any other third party. This isn't just a policy — there is no endpoint anywhere in our code that accepts DNA files. We don't have a copy because we never receive one.

## Why this architecture

Holding your raw DNA on our servers would create real liability — for you, and for us. A breach, a subpoena, a misconfigured backup, a future acquisition that changes the rules: all real risks the moment we have the file. We don't want that exposure, and you shouldn't either. So we built it so the file never reaches us. There's nothing to leak because there's nothing to hold.

## What does leave your browser

Your DNA is the exception, not the rule. A handful of other things do leave your browser:

- **If you submit feedback**, your email address and your message are sent to us via Resend (an email API) so we can read and reply.
- **If you click a "Shop" button**, the affiliate network (Rakuten LinkShare) records the click and any resulting purchase so we can earn a commission. They don't see your DNA or your recommendations — only that someone clicked through from us.
- **The same Shop click is also logged to our own server** at `/api/track`. The log line contains the supplement name, the brand, the time, an anonymous random session ID, and — if you arrived from a Google ad — the Google ad-click ID. Your browser's user-agent and referring page are recorded automatically as part of the HTTP request.
- **The same Shop click also pings Google Ads** via `gtag.js` so the conversion can be counted against our ad spend. Google sees that one of their ad clicks resulted in an outbound product click. They do not see your DNA or your recommendations.

## What we track and what we don't

We do run Google Ads conversion tracking via gtag.js. That is the only third-party script we load. We don't run a Facebook Pixel, TikTok Pixel, Mixpanel, Segment, Amplitude, Heap, Hotjar, Plausible, FullStory, or any other analytics SDK. We don't fingerprint your browser.

We set two first-party cookies:

- **`cw_session`** (30 days) — a random ID so we can count unique visitors and group repeat clicks into one session.
- **`cw_gclid`** (90 days) — set only if you arrived from a Google ad, so we can attribute a downstream Shop click back to that ad.

Everything we log contains zero DNA, zero genotypes, no name, no email. As a concrete example: if you clicked the Solgar Vitamin D button on April 5th after arriving from a Google ad, our server log would contain that event, your anonymous session ID, and the ad-click ID — and nothing else identifying.

## Right to be forgotten

If you've sent us feedback and want it deleted, reply to the email thread and ask. We'll delete the message and confirm. To clear the `cw_session` and `cw_gclid` cookies, clear cookies for this site in your browser — the next visit will start a fresh anonymous session.

## Contact

The fastest way to reach us is the feedback form on this page. We read everything and reply within a few days. A direct email path can be added later.
