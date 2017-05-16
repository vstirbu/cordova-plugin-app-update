# Application update

Cordova plugin for updating Android applications not deployed via Android Marketplace.

# API

The plugin creates a global object `AppUpdate` that exposes an `update` function:

```javascript
const progress = {
  setPercentage: (percentage) => {},
  increment: () => {}
};

const callback = (err, result) => {
};

AppUpdate.update(baseUrl, progress, callback);
```