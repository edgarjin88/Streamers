const express = require('express');
const db = require('../models')
const { isLoggedIn } = require('./middleware');

const router = express.Router();


router.post('/room/:id', isLoggedIn, async (req, res, next) => { 
//나중에 저 id 부분에다가는 postId를 넣어줄거니까 저 아이디 쓰도록 하자. 이거를 PostId 쪽에 넣어두자. 
//title은 할지 안할지 본인이 결정
  try{
    const newRoom = await db.Room.create({
      PostId: req.params.id,
      title, 
      numberOfUsers: 0  // 사람들어올 때마다 넣고 빼고 하자.  결과는 serversent event로. 
    });

  }catch(e){
    console.log(e)
    next(e)
  }
})


//getting a room with comment
router.get('/room/:id',isLoggedIn, async (req, res, next) => { 
  try {
    const getRoom = await db.Room.findOne({
      where: { PostId: req.params.id },
      include: [{
        model: db.Message,
        order:[['createdAt', 'ASC']],
        where:{PostId: req.params.id},
        attributes: ['content', 'createdAt'],
        include:[{
          model:db.User,
          attributes: ['id', 'nickname']
        }]
      }],
    });
    res.json(getRoom);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//adding a message - 이거는 매 순간 저장되고, json 리턴이 되어야 함. comment 참조하자. 
router.post('/room/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/1000000/comment
  try {
    const room = await db.Room.findOne({ where: { PostId: req.params.id } });
    if (!room) {
      return res.status(404).send('Room does not exist.');
    }
    const newMessage = await db.Message.create({
      PostId: req.params.id, //아무튼 저기로 postid를보낼거니까. 
      UserId: req.user.id,
      content: req.body.content,
    });
    await room.addMessage(newMessage.id); //newMessage 아이디를 기준으로 해서 addMessage를 한다. 
    //이것은 그냥 연결을 위한 과정. 보이기 위한건 아래. 
    //이렇게 add된 것들을 화면에 하나씩 쏴 주자. 
    const message = await db.Message.findOne({
      where: {
        id: newMessage.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(message);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});


///delete room
router.delete('/room/:id', isLoggedIn, async (req, res, next) => {
  try {
    const delRoom = await db.Room.findOne({ where: { id: req.params.id } });
    if (!delRoom) {
      return res.status(404).send('Room does not exist.');
    }
    await db.Room.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


module.exports = router;

//parsint 10 이거로 아이디 바꿔라. 혹시 아이디 넘버에서 문제 생기면. 
 //req.param.id 등등은 전부 문자열이다. 나중에 parsInt로 바꿔줘야 한다. 
 // 특히  0을 쓸때는 이것을 바꿔줘야 false 값이 된다. 문자열 0은 true 값이고. 
 // 다른 부분에서는 굳이 안해줘도 되긴 하다. 