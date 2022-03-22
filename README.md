A node.js module providing easy access to the official Pixiv api

## How to use

Install through npm

```shell
npm i pixnode
```

Require the module in your code

```typescript
const { pixNode } = require('pixnode');
```

# Documentation

## Authentication

### `pixNode.authenticate.login()`

Login to a Pixiv account.

The `res` object in callback.

```javascript
{
    access_token: '_Wl0###################WbZy5LdUr-o8NZkzbi6o',
    refresh_token: 'P#########################################8',
    // Keep this secret! Refresh token doesn't appear to change
    expire_time: 1647916586,
    user: {
        profile_image_urls: {
            px_16x16: 'https://i.pximg.net/####',
            px_50x50: 'https://i.pximg.net/####',
            px_170x170: 'https://i.pximg.net/####'
        },
        id: '26####96',
        name: 'po########t0',
        account: 'po########t0',
        mail_address: '97#######@qq.com',
        is_premium: true,
        // true for premium user
        // false for normal user
        x_restrict: 0,
        // 0 for no adult content
        // 1 for R-18 allowed
        // 2 for R-18G allowed
        is_mail_authorized: true,
        require_policy_agreement: false
    }
}
```

### `pixNode.authenticate.refresh()`

Use a refresh token to obtain a new login session.

The `res` object in callback is the same as that in the `login()` method


## Fetch

### `pixNode.fetch.illustrationRanking()`

Get illutration ranking with various restrictions.

### `pixNode.fetch.searchForIllustration()`

Search for illustrations or by matching given keyword with tags or titles.




