Desktop app to display a folder of images on a map + timeline

Built using Tauri and svelte


# Install

```
npm install
```

# Run

```
npm run tauri dev    
```

# Pre generate

For faster load, a data.json can be pre generated using
```
node ./generate-data.js
```

processFiles need to be modified to us node fs as well as generate-data to target the needed folder