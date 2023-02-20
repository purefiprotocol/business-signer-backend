# Business-signer-backend

Example integration purefi protocol.

## Scripts

```bash
# Application start
yarn start
```

## Endpoints

```bash
POST /check/rule
body: {
    "message": "{\"sender\":\"0xe789b10284bd5942342636356ba7ce8862612edc\",\"ruleId\":\"431040\",\"receiver\":\"0x624a4AA4f0D19eDe4DdD5077dEBF98E96Bd6971f\",\"token\":\"0xc2132d05d31c914a87c6611c10748aeb04b58e8f\",\"amount\":\"0x0a\",\"chainId\":80001}",
    "signature": "0x606288122e5026198b31383c35ce131d38300158708923af50c9820054b9aade51dd88b36c124aa554a89ea9e0556a6ad45d7e6c11cfd501ee100cc35d8857fc1b"
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
