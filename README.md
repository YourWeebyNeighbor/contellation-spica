# constellation: spica
Self-hosted music service.

**This is very early WIP** and it's barely able to play music from local files right now. If you want to check it out for some reason, here's a quick start guide:


Prerequisites:
* Java 13
* FFmpeg 4
* NodeJS 10
* Chrome 80+




1) Make a directory named **Music** next to the repository root. Yes, it's hardcoded right now.
```
mkdir Music
```
2) Place your music in that folder.

3) Run spica backend using gradle wrapper. It will immediately start the importing process. Once it's finished, REST API will be available at http://localhost:5056.
```
cd backend/
./gradlew run
```
4) Go back to the repository root.
```
cd ..
```    
5) Install frontend dependencies and run the dev server.
```
cd frontend/
npm install
npm start
```
The web app is served at http://localhost:3000. All the imported tracks will be added to the queue and shuffled. Now you should be able to listen to your music.
