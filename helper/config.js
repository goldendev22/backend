/*
Project : Cryptotrades
FileName :  config.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which maintain globl variable for the application
*/
const config = {
  app: {
    port: 5002
  },
  db: {
    host: 'localhost',
    port: 27017,
    username: '',
    password: '',
    name: 'nftmarketplace',
    prefix:'linkwell_'
  },
  mail: {
    type:"gmail",
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure:false,
      username:'Creati.funders@gmail.com',
      password:'oexesefgutirhdol'
    }
  },
  site_name:'Cryptotrades',
  site_link:'#',
  site_email: 'Creati.funders@gmail.com',
  secret_key:'jfVRtwN7xBl7LjRucIUdPnrh1UVUhzhZ',
  public_key:'6gluXXunc77uukLJbSmlQ31ckSlLq8Qi',
  eth_http: "https://rinkeby.infura.io/v3/64fa77a39b9a4c31b186fb2148edff70",
 };
 
 
module.exports = config;