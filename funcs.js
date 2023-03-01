function sleep(m){return new Promise(res=>setTimeout(res,m))}

import {exec,spawn} from 'child_process'

let regen = `(echo authenticate '""'; echo signal newnym; echo quit) | nc localhost 9051`
async function regenIp() {
    exec(regen)
}

////////////////////////////////////////////////
import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:9080');


////////////////////////////////////////////////

let id = 811779604
let lastRes = [811797026,811797015,811797013]
export function getHourly(n) {
    return lastRes.slice(-n);
}
export async function getProjects(n) {
    let ret = []
    let ready = false;

setInterval(regenIp,1000 * 20)

// let id = 800000320
let streak = 0
let MAX_STREAK = 100
let hop_streak = 0;
let HOP_STREAK = 10
let HOP_AMM = 50000 * 10;
while(true) {

    if(ret.length >= n) { lastRes = ret; return ret }
    
  (async()=>{  try{
        let json= await (await fetch('https://api.scratch.mit.edu/projects/' + id + '/', { agent: proxyAgent})).json(); 
        // console.log(json)
        if(json.id) {streak=0; if(ready){ret.push(json.id);} hop_streak++;}
        else {streak++;}
    }catch(e){streak++; console.log(e)}})()


    await sleep(30)
    if(streak>MAX_STREAK) {console.log('streak met');ready=true; streak=0; id-=HOP_AMM / 2; hop_streak =0;}
    if(hop_streak>HOP_STREAK) {console.log('HOP!'); hop_streak=0; id +=HOP_AMM;}
    id++;
}

}


// console.log(await getProjects(10))
// console.log(await getProjects(10))


export function idsToCloudVar(ids, diglen) {
    let ret = "1"
    ids.forEach(id=>{
        ret += new String(id).padStart(diglen,'0')
    })
    return ret;
}