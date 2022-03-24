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

# Documentation (to be updated)

## Authentication

### `pixNode.authenticate.login()`

Login to a Pixiv account.

The `res` object in callback.

```javascript
{
    access_token: '_Wl0###################WbZy5LdUr-o8NZkzbi6o',
    refresh_token: 'P#########################################8',
                                    // Keep this secret! Refresh token doesn't appear to change when session is refreshed or created
    expire_time: 1648021956,        //UNIX timestamp indicating when the access token will expire
    user: userInfomation {
        uid: '26861696',            //User ID
        name: 'potatopotat0',       //Nickname
        account: 'potatopotat0',    //Acount name
        mail: '971327682@qq.com',   //Email address for the user
        is_premium: true,           // true for premium user
                                    // false for normal user
        x_restrict: 0,              // 0 for no adult content
                                    // 1 for R-18 allowed
                                    // 2 for R-18G allowed
        language: 'English'
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




