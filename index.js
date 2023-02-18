const http=require('http');
const fs=require('fs');
const url=require('url');

const slugify=require('slugify');
// reading data
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
//function to replace placeholders form html
const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName); // this is a regex that will make sure global: all the placeholders will get replaced
    output=output.replace(/{%IMAGE%}/g,product.image); 
    output=output.replace(/{%PRICE%}/g,product.price);  
    output=output.replace(/{%FROM%}/g,product.from); 
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients); 
    output=output.replace(/{%QUANTITY%}/g,product.quantity); 
    output=output.replace(/{%DESCRIPTION%}/g,product.description); 
    output=output.replace(/{%ID%}/g,product.id); 
    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic'); 
    return output;
}
const slugs=dataObj.map(ele=>slugify(ele.productName,{lower : true}));
console.log(slugs);
// server
const server = http.createServer((req,res)=>{
    console.log(url.parse(req.url,true))
    const {query,pathname}=url.parse(req.url,true);
    // overview page
    if(pathname==='/' || pathname==='/overview'){
        res.writeHead(200,{'Content-type' : 'text/html'});
        const CardsHtml=dataObj.map(element=> replaceTemplate(tempCard,element)).join('');
        // in an arrow function, if {} are not there, automatically return hota
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',CardsHtml);
        res.end(output);
    }
    // product page
    else if(pathname=='/product'){
        //console.log(query);
        const product=dataObj[query.id];
        res.writeHead(200,{'Content-type' : 'text/html'});
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
        
    }
    // API
    else if(pathname==='/api'){
        res.writeHead(200,{'Content-type' : 'application/json'});
        res.end(data);
    }
// not found
    else {
        //we can also send http status code
        res.writeHead(404,{
            "Content-type":"text/html",
            'this-is-also-a-header' :"yems"
        });
        res.end("<h1>ERROR PAGE NOT FOUND</h1>");
        //res.end("Page NOT FOUND 404");
    }
});
server.listen(8000,"127.0.0.1",()=>{
    console.log("SERVER IS RUNNING ON PORT 8000");
});
