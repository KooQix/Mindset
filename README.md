# Description

    Youtube is an amazing source of information, however, watching requires a lot of attention.
    To be able to simply listen to the channels I love, I created a podcasts Web App using ExpressJS and Angular.
    When adding a new channel to my list, it scraps and downloads the videos from the given channel.
    Then, the web app enables to select a duration. The app selects random podcasts from the list of downloaded for a total duration of duration.
    Then, it starts playing each selected podcast.

    Personal use, so not perfect but works fine for me.
    Feel free to add features

## Preparation

### Back-end

    cd back-end

#### Create downloads folder:

    mkdir downloads

#### Create database (inside mysql)

    source /path/to/project/back-end/db/genDB.sql;

#### Configure environment variables

    rename .env-example to .env and change variables as needed

#### Install dependencies

    sudo pip3 install youtube-dl

    npm install

### Front-end

    cd front-end

#### Create the environment variables

    rename src/environments/environment-example.prod.ts to src/environments/environment.prod.ts
    rename src/environments/environment-example.ts to src/environments/environment.ts
    Configure as needed

#### Install dependencies

    npm install

## Start

### Back-end
	
    node back-end/main.js

### Front-end

    cd front-end
    ng serve
