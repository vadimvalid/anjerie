# WEBPACK

To install packages use the command **npm install**

## Commands

### Starting a server for development
```shell
npm run start
```

### Building a project without optimization
```shell
npm run build-dev
```

### Build the project with optimization
```shell
npm run build-prod
```

### Cleaning the dist folder
```shell
npm run clear
```

### Staring js linter
```shell
npm run lint
```

### Automatic error correction in js
```shell
npm run lint:fix
```

## Folders

1. **src** - work directory
2. **dist** - output directory, created after running commands **npm run build-dev** or **npm run build-prod**

## Compiling files

1. In order for the html pieces to be compiled, you need to add them using **{% include "src/html/components/header.html" %}**, it is important that the path begins with the src folder.
2. In order for scss to be compiled, you need to write the path to the file with the scss extension in the html file.
3. In order for js to be compiled, you need to write the path to the file with the js extension in the html file.