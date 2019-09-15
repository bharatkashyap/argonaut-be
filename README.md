## Argonaut

===

# /user
```GET``` 

### Params
```account``` parameter containing address of user to be queried

# /upload
 ```POST```

 ### Params
 ```id``` parameter containing address of user to be queried

# /transact
```POST```

### Params
`from` address of buyer
`to` address of seller
`algos` amount
`mnem` mnemonic of buyer
`name` name of buyer
`meta` name of API and whatever else

# /transactions
```GET```

### Params
`account` address of requester\
`type` type of requester: 'buyer' or 'seller'\
