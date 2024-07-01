# PixNode

A node.js module providing easy access to the official Pixiv api in node.

## How to use

Install through npm:

```shell
npm i pixnode
```

```typescript
import PixNode from 'pixnode';

const pix = await PixNode.create();
```

You will be prompted to login interactively with a web browser, which you only need to do once as long as you are not reinstalling PixNode. If you do not want to login manually, you need to provide a refresh token.

```typescript
import PixNode from 'pixnode';

const refreshToken = "cR4zY114514thUrS1919D4y810Token"
const pix = await PixNode.create(refreshToken);
```
