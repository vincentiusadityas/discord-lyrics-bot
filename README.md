# Discord Lyrics Bot App with Node.js

This is a simple discord bot, initially made to get song lyrics. Now, it is able to play audio from youtube videos.

Lyrics will be fetched from genius.com [API](https://docs.genius.com/)

Youtube audios fetched using [node-ytdl](https://www.npmjs.com/package/ytdl) 


## Requirements

- [Node.js](http://nodejs.org/)
- [Discord](https://discordapp.com/) account
- [ytdl](https://www.npmjs.com/package/ytdl)
- [ytsr](https://www.npmjs.com/package/ytsr)
- [ytpl](https://www.npmjs.com/package/ytpl)

## How To


I hosted this bot in AWS EC2 (all using the free tier)

Steps:

1. Create your discord bot with this permission integer `3172352`

2. Create AWS account and launch an EC2 instance

3. SSH to your instance `$ ssh -i "yourkeyfile.pem" ubuntu@<public_IP>`

4. Intall nodejs and npm ([tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)):
    
    - `sudo apt update`
    - `sudo apt install nodejs`
    - `sudo apt install npm`

5. Update nodejs to at least v14 (needed by discord.jd). You can follow the tutorial [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)

6. Clone this repo to the root folder

7. cd discord-lyrics-bot/ && npm install


Development:

`npm run dev`

Production:

`npm run start`

Stop production:

`npm run stop`


## Check It Out

> Discord [link](https://discord.com/api/oauth2/authorize?client_id=813253561559285780&permissions=3172352&scope=bot).

> Type ?help to

## Contact

Developed by [Vincentius Aditya Sundjaja](https://vincentiusadityas.dev)
