const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../models');
const {
  isLoggedIn
} = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => { // /api/user/
  const user = Object.assign({}, req.user.toJSON()); //빈객체에 집어 넣는다.  //sequelize에서 user를 가져오면 user 객체가 이상한 객체라서 json으로 바꿔야 함
  delete user.password; //password는 뺄것
  return res.json(user);
});
router.post('/', async (req, res, next) => { // POST /api/user 회원가입
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send('Someone already using the ID'); //sned 는 문자열이나 버퍼
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => { // 남의 정보 가져오는 것 ex) /api/user/123
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10)
      }, 

      include: [{
        model: db.Post,
        as: 'Posts',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followers',
        attributes: ['id'],
      }],
      attributes: ['id', 'nickname', 'profilePhoto'],
    });
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


router.post('/logout', (req, res) => { // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send('LOGOUT Success');
});

router.post('/login', (req, res, next) => { // POST /api/user/login
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => { //serialize starts
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: {
            id: user.id
          },
          include: [{
            model: db.Post,
            as: 'Posts',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followings',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followers',
            attributes: ['id'],
          }],
          attributes: ['id', 'nickname', 'userId', 'profilePhoto'],
        });
        console.log(fullUser);
        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});

router.get('/:id/followings', isLoggedIn, async (req, res, next) => { // /api/user/:id/followings
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0
      },
    });
    const followers = await user.getFollowings({ //user는 내 정보
      attributes: ['id', 'nickname', 'profilePhoto'],
      limit: parseInt(req.query.limit, 10), //limit, offset 이런것들은 기본 시퀄라이져 속성이다. 
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => { // /api/user/:id/followers 실제 주소는 이렇게 됨. 
  try {
    const user = await db.User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0
      }, //내 아이디 params.id 
    }); // req.params.id가 문자열 '0'
    const followers = await user.getFollowers({ //getFollowers에 옵션을 줄수 있다. 
      attributes: ['id', 'nickname', 'profilePhoto'],
      limit: parseInt(req.query.limit, 10), //req.param.id 등등은 전부 문자열이다. 
      offset: parseInt(req.query.offset, 10),
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e); //error 를 프론트로 넘겨 버린다
  }
});

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
  //req.params.id 가 /:id 이다. 
  try {
    const me = await db.User.findOne({ //req.user.id는 내 아이디고, //req.params.id는 상대방 아이디. 
      where: {
        id: req.user.id
      },
    });
    await me.removeFollower(req.params.id); // 팔로워를 끊어 준다. 
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({ //req.user.id 해도 되나, 가끔가다 일반 객체가 나올 때가 있어서 안전하게, 일단 나 먼저 찾고 그다음 관계요청 디비
      where: {
        id: req.user.id
      },
    });
    await me.addFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: {
        id: req.user.id
      },
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0, //혹은 0 면은 걍 정보를 보내 버린다. 
        RetweetId: null, //내가 쓴 글을 null로 해서 리트윗 정보가 들어갈 수가 없다. 
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname', 'profilePhoto'],
      }, {
        model: db.Image,
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id', 'profilePhoto'],
      }],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => { //부분 수정, isLoggedIn 항상 체크
  try {
    await db.User.update({ //부분 수정
      nickname: req.body.nickname, // req.body 로 온다는 것은 폼을 통해서 온다는 뜻 
    }, {
      where: {
        id: req.user.id
      },
    });
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;