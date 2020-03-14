const express = require('express');
const db = require('../models');

const router = express.Router();
// 게시글 페이지네이션 할때 offset은 잘 안쓴다. 성능상의 문제도 있기 때문에 라스트 아이디를 씀. 
router.get('/:tag', async (req, res, next) => {
  try {
    let where = {}; // 마찬가지로 분기처리를 위한 where. LastId가 있으면
    if (parseInt(req.query.lastId, 10)) {  //query !
      where = { 
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        }, // 참고로 [db.Sequelize.Op.lt]: value 이부분이 하나의 {} 안에 들어간 부분 주목. 
      };
    }
    const posts = await db.Post.findAll({
      where,   //이부분은 타이포인가? 아니다 where: where. 그리고 where는 위에서 정의 되었었다. 
      include: [{
        model: db.Hashtag,
        where: { name: decodeURIComponent(req.params.tag) }, //tag를 한글도 되게 하기 위해. 
        // where 조건이 hashtag 안에 들어가야 한다. hashtag를 찬는 거니까. 
      }, {
        model: db.User,
        attributes: ['id', 'nickname', 'profilePhoto'],
      }, {
        model: db.Image,
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: db.Post,
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname', 'profilePhoto'],
        }, {
          model: db.Image,
        }],
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
