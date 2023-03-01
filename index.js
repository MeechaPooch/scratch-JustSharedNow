///// SET YOUR USERNAME, PASSWORD, AND PROJECT ID HERE /////////
import {info} from './secrets.js'

import fetch from "node-fetch"
import { getHourly, getProjects, idsToCloudVar } from "./funcs.js";
//////////////////////////////////////////////////////////////


import Scratch from "scratch-api"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function commafy(numStr) {
    numStr = new String(numStr)
    for(let i=numStr.length-3; i>0; i-=3) {
        numStr = numStr.slice(0,i) + ',' + numStr.slice(i,numStr.length)
    }
    return numStr
}

let featuredProjects = getHourly(3)
let started = false;
setInterval(async ()=>{featuredProjects=getHourly(3)},1000 * 60 * 60)

async function start() {Scratch.UserSession.create(info.username, info.password, async (err, user) => {
    let token;
    if (err) {
         console.log(err)
    } else {

        // get session token!
        let sessionJson = await (await fetch("https://scratch.mit.edu/session/", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en, en;q=0.8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": `scratchlanguage=en; scratchsessionsid=${user.sessionId}; scratchcsrftoken=X8VBEl8rfW8qE5QcAanYOXXPXmlC00uH; permissions=%7B%22admin%22%3Afalse%2C%22scratcher%22%3Atrue%2C%22new_scratcher%22%3Afalse%2C%22social%22%3Atrue%2C%22educator%22%3Afalse%2C%22educator_invitee%22%3Afalse%2C%22student%22%3Afalse%2C%22mute_status%22%3A%7B%7D%7D`
            },
            "referrer": "https://scratch.mit.edu/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        })).json();
        token = sessionJson.user.token;
        // console.log(token)
        user.cloudSession(info.projectId, async (err, sess) => {
            let lastTime = 0
            while (true) {
                try{

                    let projects = await getProjects(10)
                    if(!started) {featuredProjects=getHourly(3); started=true}

                    // let projects = [1,2,3]
                    let cloudVar = idsToCloudVar(projects,info.digs)
                    let projectLinksString = projects.map(p=>"https://scratch.mit.edu/projects/"+p).join('\n')
                    console.log(JSON.stringify(JSON.stringify(projectLinksString)))

                    let featuredLinksString = featuredProjects.map(p=>"https://scratch.mit.edu/projects/"+p).join('\n')


                // if(projectStats.loves === lastProjectStats.loves && projectStats.favorites === lastProjectStats.favorites && projectStats.remixes === lastProjectStats.remixes && projectStats.views === lastProjectStats.views) {continue;}
                // else {lastProjectStats = projectStats}
                 // console.log(projectStats)

                 await sleep(Math.max(((60 * 1000)-(Date.now()-lastTime)),0))


                fetch(`https://api.scratch.mit.edu/projects/${info.projectId}`, {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "en, en;q=0.8",
                        "content-type": "application/json",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "x-token": token
                    },
                    "referrer": "https://scratch.mit.edu/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    // "body": `{\"instructions\":${JSON.stringify("https://scratch.mit.edu/projects/21 \n https://scratch.mit.edu/projects/21 \n https://scratch.mit.edu/projects/21")}}`,
                    // "body": `{\"instructions\":${JSON.stringify(projectLinksString)}}`,
                    "body": `{\"instructions\":${JSON.stringify(`Go surprise these scratchers and comment on these:\n${featuredLinksString}\n(^^^ These regen every hour)\n(⌄⌄⌄ Shared just now ⌄⌄⌄)\n${projectLinksString}`)}}`,
                    "method": "PUT",
                    "mode": "cors"
                }).then(async res => {console.log(await res.json()) });


                sess.set("☁ projects", cloudVar);
                // sess.set("☁ faves", projectStats.favorites);
                // sess.set("☁ remixes", projectStats.remixes);
                // sess.set("☁ views", projectStats.views);
                // sess.set("☁ newScratcherTestVal", 1);
                console.log('done')
                lastTime = Date.now()
            } catch(err) {
                console.log(err)
                start();
		        break;
                // return;
            }
            }
        })
    }
});
}

start();