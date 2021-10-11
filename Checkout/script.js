var request = require('request');

module.exports = main

function main(link,email,variant,firstname,lastname,address,city,state,country,phone,zip,step=3,openChrome=true){
  //for timing how long function takes
  var f = new Date()
  //put phone # into (xxx)xxx-xxx format
  var newphone = "(" + phone[0] + phone[1] + phone[2] + ")" + phone[3] + phone[4] + phone[5] + "-" + phone[6] + phone[7] + phone[8] + phone[9]
  
  //format body correctly
  var body = '{"checkout":{"email": "' + email + '","line_items": [{"variant_id": ' + variant + ',"quantity": 1}],"shipping_address": {"first_name": "' + firstname + '","last_name": "' + lastname + '","address1": "' + address + '","city": "' + city + '","province_code": "' + state + '","country_code": "' + country + '","phone": "' + newphone + '","zip": "' + zip + '"}}}'
    
  //call function to initiate checkout
  createcheckout(link,body,f,step,openChrome)
}
  
async function createcheckout(link,body,time,step,openChrome){
  //find correct authorization header and shopid based on website
  switch (link){
    case "https://bdgastore.com":
    var auth = "Basic ZGJkMzE2ZDVjNzk3ZWI4ZTNjYWVkZTlkZDA4ZjkyZWY="
    var shopid = "499112"
    break
    case "https://wishatl.com":
    var auth = "Basic NzY3OGRmNTE2MTQzY2RjYjRjNzIxNjhlODU1NmI1ODM="
    var shopid = "9618798"
    break
    case "https://yeezysupply.com":
    var auth = "Basic YWZhMTNkOTQyNTgwNzQ5YWEyOTg1YjA4NmNjMGJkY2I="
    var shopid = "17655971"
    break
    case "https://kith.com":
    var auth = "Basic MDg0MzBiOTZjNDdkZDJhYzhlMTdlMzA1ZGIzYjcxZTg="
    var shopid = "942252"
    break
    case "https://boxedwaterisbetter.com":
    var auth = "Basic YjY2YWU3OGNhMTIzMTVkNmU0MzlkODY2ZjlhNWZhNmE="
    var shopid = "2347341"
    break
  }
    
  //create session/cookie-jar
  var cj = request.jar()
  
  //inputs for request
  options = {
    method: "POST",
    url: (link + "/wallets/checkouts.json"),
    body: body,
    headers: {
      'Content-Type':"application/json",
      "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
      authorization: auth
    },
    jar: cj
  }
  
  //make request to API to create checkout link
  console.log("Generating checkout...")
    
    //print checkout link
    //console.log(JSON.parse(body)['checkout']['web_url'])
  async function checkqueue(){
    await request(options,function(error,response,body){
      if (response.headers['location'] == undefined){
        console.log("ERROR: Please try again in a few minutes")
      }else{
        if (response.headers['location'].includes("checkouts")){
          getshiprates(link,(JSON.parse(body)['checkout']['token']),cj,auth,shopid,time,openChrome)
        }else if (response.headers['location'].includes("/checkout/poll")){
          console.log("Waiting in queue...")
          setTimeout(checkqueue,(response.headers['retry-after']*1000))
        }
      }
    })
  }
  checkqueue()
  //console.log(response.headers['location'])
  // if('checkout' in JSON.parse(body)){
        
  // }else{
  //   console.log("ERROR: Error generating checkout")
  // }
      
  
}
  
async function getshiprates(link,token,jar,auth,id,time,openChrome){
  //inputs for request
  options = {
    method: "GET",
    url: (link + "/wallets/checkouts/" + token + "/shipping_rates.json"),
    headers: {
      "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
      authorization:auth
    },
    jar:jar
  }
    
  //calls itself until shipping rates are ready, then calls function to submit the shipping rate
  var u = 0 //counter for how many requests it takes to get shipping rates
  async function req(){
    await request(options,function(error,response,body){
      if (error) throw new error(Error)
      if (response.statusCode == 202){
        u += 1
        req()
      }else{
        //console.log(JSON.parse(body)['shipping_rates'][0]['id'])
        console.log("Tries taken: " + (u+1))
        //call function to submit shipping info
        //submit the first shipping rate
        submitshipping(link,token,jar,(JSON.parse(body)['shipping_rates'][0]['id']),auth,time,openChrome)
      }
    })
  }
  //console.log(link + "/" + id + "/checkouts/" + token)
  request({method:"GET",url:(link + "/" + id + "/checkouts/" + token),jar:jar,headers:{'Content-Type':"application/json",
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"}})
  console.log("Retrieving shipping rates...")
  req()
}
  
async function submitshipping(link,token,jar,sm,auth,time,openChrome){
  //headers for request
  const head = { 
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
        'Content-Type': 'application/json',
        authorization: auth
  }
  //request inputs
  const options2 = {
    method: "PATCH",
    url: (link + "/wallets/checkouts/" + token + ".json"),
    headers:head,
    jar:jar,
    form: {"checkout":{"shipping_line":{"handle":sm}}}
  }
  
  //send request
  await request(options2,function(error,response,body){
    if ("checkout" in JSON.parse(body)){
      let link = JSON.parse(body)['checkout']['web_url']
      console.log(link)

      if(openChrome){
        var childProc = require('child_process');
        childProc.exec('open -a "Google Chrome" ' + link, {});
      }
      console.log("Time taken: " + ((new Date()) - time) + "ms")
    }else{
      console.log("ERROR: Error submitting shipping")
    }    
  })
}