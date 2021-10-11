var request = require('request');
var main = require('../Checkout/script')

async function elink(pl,size){
    var y = pl.split('products')[1]
    y = ("\\" + y)

    var options = {
        method: "GET",
        url: pl,
        headers: {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
        }
    }

    await request(options,function(error,respone,body){
        var d = JSON.parse("[{" + body.split(y)[1].split("[{")[1].split("}]")[0] + "}]")
        for (var i in d){
            if (d[i]['public_title'].toLowerCase()==(size.toLowerCase())){
                console.log(d[i]['id'])
                var link = pl.split(".com")[0] + ".com"
                main(link,"john.smith@example.com",(d[i]['id']),"John","Smith","78 George Ave","Waynesboro","PA","US","1234567890","17268")
                break
            }
        }
    })
}

elink("https://kith.com/collections/kith-fall-2019/products/kith-mercer-vi-cement","s")