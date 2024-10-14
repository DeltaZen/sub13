# SUB13

A psychedelic lane-racer where you need to pick up speed boosts but avoid hitting the 13th speed level. Inspired by antigrav race games.

## Contributing

### Installing Dependencies

After cloning this repo, install dependecies:

```
pnpm i
```

### Checking code format

```
pnpm check
```

### Testing the app in the browser

To test your work in your browser (with hot reloading!) while developing:

```
pnpm start
# Alternatively to test in a more advanced WebXDC emulator:
pnpm emulator
```

### Building

To package the WebXDC file:

```
pnpm build
```

To package the WebXDC with developer tools inside to debug in Delta Chat, set the `NODE_ENV`
environment variable to "debug":

```
NODE_ENV=debug pnpm build
```

The resulting optimized `.xdc` file is saved in `dist-xdc/` folder.

### Releasing

To automatically build and create a new GitHub release with the `.xdc` file:

```
git tag -a v1.0.1
git push origin v1.0.1
```

## Credits

This is a port to Webxdc of [js13k24sub13](https://github.com/Feenposhleen/js13k24sub13) originally written by [Feenposhleen](https://github.com/Feenposhleen) for [js13k 2024](https://js13kgames.com/) game jam
