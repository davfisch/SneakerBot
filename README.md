# SneakerBot

SneakerBot is a script for Shopify websites that automatically finds the desired product, adds it to cart, and fills all checkout information except for credit card information. SneakerBot helps purchase limited products that often sell out in seconds.

## Usage

```javascript
const main = require("./Checkout/script");
//used when productID is already known; if product ID not known, use kwfinder instead

//adds product to cart, fills in user information, automatically opens Chrome browser with product added
//to cart and all user information filled in

const prlist = require("./Find/prlist");
//returns list of products from any Shopify website

const kwfinder = require("./Find/keywords");
//usage: kwfinder("https://shopify-website-here.com", "+keyword1,+keyword2,-negativekeyword1","size_here")
//finds given product based on keywords given (any product with matching negative keywords is excluded)
//automatically calls main when product is found

kwfinder("https://bdgastore.com", "+wotherspoon,+superturf","10")
//user information (name, address, etc.) hard coded into Find/keywords, can be easily changed
