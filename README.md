# Full stack WebRTC broadcasting website.

## Demo website: [https://lemonstreaming.com/ ](https://lemonstreaming.com/)

Full stack streaming website. Broadcasters can send streaming video to multiple viewers via WebRTC protocol. Backend server initially designed as a media server so that broadcaster can send stable streaming without consuming too much data, but in the final version, I changed it to P2P connection becuase the back-end was not stable to handle multiple streaming data. The previous verion code is still there, but not in use.

## Main libraries and frameworks used for Front-End

- Next.js
- WebRTC(broweser native code)
- Socket.IO
- Styled Components
- Material UI(React)
- Axios

## Main libraries and frameworks used for Back-End

- Express.js
- Socket.IO
- Sequelize(SQL)
- WRTC
- Passport.js
- Multer
- AWS-SDK
- Sendgrid/mail

### Main features

- One to Many broadcasting via WebRTC protocol(Mesh topology)
- Real time message via websocket
- Serverside rendering(Next.js) for front-end
- SEO
- Email Authentication
- Oauth2.0 Authentication(Google, Facebook, LinkedIn, Kakao)
- Push notification(not for mobile. Native web push notification function is not yet compatible with webview, iOS and Android)
- Around 60 API end points.
- 13 data tables(including juntion tables)
- General social media features(e.g post, edit, delete, comment, reply to comment, like, dislike, lazy scrolling) and all connected via websocket for real-time update and push notification

### Challenging points

- Not enough information on WebRTC. If there is any, the code on the internet was about only one to one connection with poor explanation. Stack overflow or even MDN is not really helpful(in my personal opinion). If you are interested in WebRTC, check these two websites [https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-25#section-4.1.4](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-25#section-4.1.4) and [https://www.w3.org/TR/webrtc/#dom-rtcpeerconnection-addtransceiver ](https://www.w3.org/TR/webrtc/#dom-rtcpeerconnection-addtransceiver/). I personally found these two were the best source of truth.

- Deploying heroku. In normal cases, Heroku is simple and easy platform to deploy an app, but not for Next.js app. Surprisingly, you cannot send cookie from your front-end server if you don't have a custom domain, that means you can not do real server side rendering with authentication. So, I ended up purchasing custom domain and extra plan for SSL, lol. I rather go with AWS if I have to pay the similar amount of money.

### Things to improve

- Design pattern
- Reusability
- CSS
- General refactoring
- Not all async functions are in try catch blocks.
