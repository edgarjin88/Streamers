const express = require('express');
const db = require('../models');

const router = express.Router();


//savePost(req);
//parseAndSaveHashtag(req);
//saveImages(req);
// replace below controler with above functions

//router.post('/', isLoggedIn, upload.none(), savePost, parseAndSaveHashtag, saveImages, returnFullPost)
//exports.savePost =(req, res, next)=>{ 
//   controller logic 

//   next()
// }

// between two functions, variable cannot be Shared. To solve this, 
// add it into "req" Object. req.dataFromPreviousFunction


router.get('/', async (req, res, next) => { // GET /api/posts
  try {
    let where = {}; //where 조건이 두가지로 나뉘어 지게 된다 라스트 아이디의 유무에 따라서. 
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // lastId 보다 작다면. 
        }, 
      };
    }
    const posts = await db.Post.findAll({
      where,// 만약에 0이명 그냥 가져오는 걸로.  분기처리 필요 없이 그냥 무조건의 where를 사용해 버린다. 
      include: [{
        model: db.User,
        attributes: ['id', 'nickname', 'profilePhoto'],
      }, {
        model: db.Image,
      }, {
        model: db.User,  // 라이크 한 사람들을 부를 모델, 그다음 조인트 테이블, 표기 되는건 as  Likers
        through: 'Like',
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: db.Post,
        as: 'Retweet',  //전체 포스트를불러오기 위해 findAll을 할 때도 retweet 등을 인클루드 해 줘야만 한다. 
        include: [{
          model: db.User,
          attributes: ['id', 'nickname', 'profilePhoto'],
        }, {
          model: db.Image,
        }],
      }],
      order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
