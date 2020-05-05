"use strict";

// 일단 이 파일에서 쓰이는건 rtc관련 로직만 빼자.경로도 필요 없다.

// 1. 일단 프론트 페이지는 똑같이 만들자.
// 2. 그다음 경로 부분은 api 콜로 바꾸자.
// 3. api콜을 page1 일때는 broadcaster server, client 쪽으로.
// 4. page 2, 3 4 의 경우 view 쪽으로 보내자.

// 다 파악할 필요는 없고, 필요한 부분만 abstract 해서 바꾸도록 하자.
//필요 부분만 빼자
const bodyParser = require("body-parser");
const browserify = require("browserify-middleware");
const express = require("express");
const { readdirSync, statSync } = require("fs");
const { join } = require("path");

const { mount } = require("./lib/server/rest/connectionsapi");
const WebRtcConnectionManager = require("./lib/server/connections/webrtcconnectionmanager");

const app = express();

app.use(bodyParser.json());

const examplesDirectory = join(__dirname, "examples");

//examples 안에 있는 모든 것들을 path 안에 넣는다.

const examples = readdirSync(examplesDirectory).filter((path) =>
  statSync(join(examplesDirectory, path)).isDirectory()
);
//directory 이름만 패스 뽑는다.

console.log("exmamples directory. List?? :", examples);

function setupExample(example) {
  // example에 따라 경로 바뀜 다시 말해 이그잼플의 파일만 파악하면 된다.
  const path = join(examplesDirectory, example);
  const clientPath = join(path, "client.js");
  const serverPath = join(path, "server.js");

  app.use(`/${example}/index.js`, browserify(clientPath));
  app.get(`/${example}/index.html`, (req, res) => {
    res.sendFile(join(__dirname, "html", "index.html"));
  });

  // browserfy로 클라이언트 쪽 코드와, 정적파일 제작

  const options = require(serverPath);

  // 그다음, 이그젬플의 서버에서 exports 한 값을 넣어서 connectionManager를 통해 커녁션을 만든다.
  // 이경우 beforeOffer, afterOffer 같은 녀석들이다.
  const connectionManager = WebRtcConnectionManager.create(options);

  mount(app, connectionManager, `/${example}`);

  // 마운트는 그냥 일종의 라우터다.
  // app.get 이런 애들과 connectionManager의 메서드 들을 사용해서 값을 send(해 준다. )
  return connectionManager;
}

app.get("/", (req, res) => res.redirect(`${examples[0]}/index.html`));

const connectionManagers = examples.reduce((connectionManagers, example) => {
  const connectionManager = setupExample(example);
  // connectionManager 을 view 이름으로 만든 다음,
  //   각각의 connectionManager 라는 리스트를 만들고, 그 안에 각각의 connectionManager를 만든다.
  // 그다음, example, 다시말해 view 이름의 키값을 더하고, 벨류를 connectionManager로 만든다.
  return connectionManagers.set(example, connectionManager);
}, new Map());

const server = app.listen(3000, () => {
  const address = server.address();
  console.log(`http://localhost:${address.port}\n`);

  server.once("close", () => {
    connectionManagers.forEach((connectionManager) =>
      connectionManager.close()
    );
  });
});
