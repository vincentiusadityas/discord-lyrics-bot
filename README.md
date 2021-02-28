# Discord Lyrics Bot App with Node.js

This is a simple discord bot app to get song lyrics.

Lyrics will be fetched from genius.com API

## Requirements

- [Node.js](http://nodejs.org/)
- [Discord](https://discordapp.com/) account

## How To


I hosted this bot in AWS EC2 (all using the free tier)

Steps:

1. Create AWS account and launch an EC2 instance

2. SSH to your instance `$ ssh -i "yourkeyfile.pem" ubuntu@<public_IP>`

3. Intall nodejs and npm ([tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)):
    
    - `sudo apt update`
    - `sudo apt install nodejs`
    - `sudo apt install npm`

4. Clone this repo to the root folder

5. cd discord-lyrics-bot/ && npm install


Development:

`npm run dev`

Production:

`npm run start`

Stop production:

`npm run stop`



## Contact

Developed by [Vincentius Aditya Sundjaja](https://vincentiusadityas.dev)
