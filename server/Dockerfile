FROM ubuntu:18.04
WORKDIR /usr/src/app
EXPOSE 80

RUN apt-get update -qq \
  && apt-get install -y -qq software-properties-common \
  && add-apt-repository -y ppa:stebbins/handbrake-releases \
  && apt-get update -qq \
  && apt-get install -y -qq curl handbrake-cli \
  && curl -o- -s https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && nvm install --lts > /dev/null

COPY package*json ./

RUN export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && npm install --production && mv node_modules ../

COPY . .

CMD export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && NODE_ENV=production npm start
