# スイミー（Swimmy）

## Install

```
$ git clone git@github.com:swimmy/swimmy.git
$ cd swimmy
$ yarn
```

## Develop

Run react-scripts dev server:

```
$ yarn workspace hosting start
```

## Develop using Firebase Emulators

Compile TypeScript codes in functions:

```
$ yarn workspace functions dev
```

Run react-scripts dev server:

```
$ yarn workspace hosting dev
```

Run Firebase emulators:

```
$ yarn start
```

Stub Cloud Firestore collections:

```
$ yarn workspace stub start
```

## Test React app (E2E)

Open cypress:

```
$ yarn workspace hosting test
```

## Test Security rules

```
$ yarn workspace firestore test
```

## Deploy

Build TypeScript source codes:

```
$ yarn workspace functions build
$ yarn workspace hosting build
```

Run firebase deploy command:

```
$ yarn firebase deploy
```
