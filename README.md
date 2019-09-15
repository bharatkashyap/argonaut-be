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
`from` address of buyer\
`algos` amount\
`mnem` mnemonic of buyer\
`meta` name of API and whatever else\

```
{
	"from": "3ZTFRHYZDB37LQUKXQUVEXH5BPKABIRTINCVRUXGFK36ICDZ2P2P4EFRJQ",
	"mnem": "glimpse firm unable truly banana health trial capital tip response proof space average engine ancient fuel ozone innocent strong nut true bulk main abstract leave",
	"algos": 12500000
 }
 ```

# /transactions
```GET```

### Params
`account` address of requester\
`type` type of requester: 'buyer' or 'seller'


```
{ "account":"YGRUUUXS23G6DOIO5UZ3RYKDDYRVC7BJTSDYGMU5PORTHL2K7E2246BHLI"
    "type":"seller"
}
```
