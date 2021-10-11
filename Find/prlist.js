var request = require('request')

module.exports = productlist

function productlist(link){
    var options = {
        method: "GET",
        url: (link + "/products.json"),
        headers: {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
        }
    }

    request(options,function(error,response,body){
        var products = []
        for (var a in JSON.parse(body)['products']){
            products.push(JSON.parse(body)['products'][a]['title'])
        }
        console.log(products)
        return(products)
    })
}

// async function kw(link,words,size){
//     var okw = words
//     var str = ""
//     var nstr = ""
//     var pkw = []
//     var nkw = []
    
//     if(words.includes(',')){
//         words = words.split(',')
//     }else{
//         words = [words]
//     }

//     words.forEach(a => {
//         if(a[0] == '+'){
//             pkw.push(a.split('+')[1])
//         }else if(a[0] == '-'){
//             nkw.push(a.split('-')[1])
//         }else{
//             console.log("ERROR: Please check the format of your keywords")
//             return
//         }
//     })

//     console.log("Searching for product...")

//     if(pkw.length != 0){
//         pkw.forEach(i => {
//             str = str + " " + i
//         })
//         console.log("Keywords:" + str)
//     }

//     if (nkw.length != 0){
//         nkw.forEach(i => {
//             nstr = nstr + " " + i
//         })
//         console.log("Negative keywords:" + nstr)
//     }

//     var options = {
//         method: "GET",
//         url: (link + "/products.json"),
//         headers: {
//             "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
//         }
//     }

//     await request(options,function(error,response,body){
//         for(var a in JSON.parse(body)['products']){
//             var f = 0
//             for(var t=0;t<pkw.length;t++){
//                 if((JSON.parse(body)['products'][a]['title'].toLowerCase()).includes(pkw[t].toLowerCase())){
//                     f += 1
//                     if(f == pkw.length){
//                         console.log("Product found! " + JSON.parse(body)['products'][a]['title'])
//                         return
//                     }
//                 }else if(a==29){
//                     console.log("Product not found")
//                 }
//             }
//         }
//     })
// }

// productlist("https://bdgastore.com")
//kw('https://bdgastore.com','+cell','s')