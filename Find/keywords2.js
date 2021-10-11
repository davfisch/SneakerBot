var request = require('request')

async function kwf(link,words,size){
    var okw = words
    var str = ""
    var nstr = ""
    var pkw = []
    var nkw = []
    
    //put KWs into array (split on ',')
    if(words.includes(',')){
        words = words.split(',')
    }else{
        words = [words]
    }

    //separate positive and negative keywords
    var z = 1
    words.forEach(a => {
        if(a[0] == '+'){
            pkw.push(a.split('+')[1])
        }else if(a[0] == '-'){
            nkw.push(a.split('-')[1])
        }else{
            console.log("ERROR: Please check the format of your keywords")
            z = 0
            return
        }
    })

    if(z!=0){
        console.log("Searching for product...")
    }

    if(pkw.length != 0 && z!=0){
        pkw.forEach(i => {
            str = str + " " + i
        })
        console.log("Keywords:" + str)
    }

    if (nkw.length != 0 && z!=0){
        nkw.forEach(i => {
            nstr = nstr + " " + i
        })
        console.log("Negative keywords:" + nstr)
    }

    console.log("Size: " + size)

    var options = {
        method: "GET",
        url: (link + "/products.json"),
        headers: {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
        }
    }

    if(z!=0){
        await request(options,function(error,response,body){

            //iterate through products
            for(var a in JSON.parse(body)['products']){

                //counter used to check if all keywords match
                var f = 0
                var g = 0
                for(var y=0;y<nkw.length;y++){
                    if((JSON.parse(body)['products'][a]['title'].toLowerCase()).includes(nkw[y].toLowerCase())){
                        g += 1
                    }
                }
                for(var t=0;t<pkw.length;t++){
                    if((JSON.parse(body)['products'][a]['title'].toLowerCase()).includes(pkw[t].toLowerCase())){
                        f += 1
                        //if all keywords are in the product name
                        if(f == pkw.length && g == 0){
                            console.log("Product found! " + JSON.parse(body)['products'][a]['title'])
                            var c = 0
                            //iterate through the product's variants
                            for (var q in JSON.parse(body)['products'][a]['variants']){
                                //if the size provided matches the variant's title(size)
                                if (JSON.parse(body)['products'][a]['variants'][q]['title'].toLowerCase().includes(size.toLowerCase())){
                                    if(size.toLowerCase().includes(".5")){
                                        console.log("Variant: " + JSON.parse(body)['products'][a]['variants'][q]['id'])
                                       return(JSON.parse(body)['products'][a]['variants'][q]['id'])
                                    }else if (size.toLowerCase().includes("5") && (size.toLowerCase().includes(".5"))==false){
                                        if(JSON.parse(body)['products'][a]['variants'][q]['title'].includes(".5")==false){
                                            console.log("Variant: " + JSON.parse(body)['products'][a]['variants'][q]['id'])
                                            return(JSON.parse(body)['products'][a]['variants'][q]['id'])
                                        }
                                    }else{
                                        if ((size.toLowerCase().includes(".5"))==false){
                                            console.log("Variant: " + JSON.parse(body)['products'][a]['variants'][q]['id'])
                                            return(JSON.parse(body)['products'][a]['variants'][q]['id'])
                                        }
                                    }
                                }
                            }
                            return
                        }
                    }else if(a==29){
                        console.log("Product not found")
                    }
                }
            }
        })
    }
}

kwf('https://bdgastore.com','+a','')