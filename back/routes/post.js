const express = require('express');
const multer = require('multer'); // 여기서 multer 설정. Body paser가 가져올 수 있는게 아니기 때문에 multer를 써야 ㅎ다. 

const path = require('path');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3');


const router = express.Router();
const imageLink = process.env.NODE_ENV === "production" ? 'location' : 'filename'

AWS.config.update({
  region: 'ap-southeast-2',  //지역 시드니
  accessKeyId:process.env.S3_ACCESS_KEY_ID,  // 이 두개를 해야 노드에서 s3에 접근이 가능하다. 
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
})


// const upload = multer({ //동영상, 파일등도 올릴 수 있다. 
//   storage: multer.diskStorage({
//     destination(req, file, done) {  //지금은 diskStorage. 하지만 나중에는 경로랑 다 바꾼다. 
//       done(null, 'uploads');  //passport의 done 같은 것. 이름은 달라도 된다.  처음은 error, 두번째는 성공했을 때
//       //uploads 스트링은 여기에 저장한다는 이야기
//     },
let multerStorage = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { //이 부분 나중에 location으로 ?
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // 제로초.png, ext===.png, basename===제로초
      done(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

let multerServer= multer({ //동영상, 파일등도 올릴 수 있다. 
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'sumontee',
    key(req, file, cb){
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`); 
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //filesize 제한 너무 크면 해커가 공격에 이용. 파일 갯수 제한을 할 수도 있다. 
});


const upload = process.env.NODE_ENV === "production" ? multerServer: multerStorage 
//development로는 에러가 난다. 

// const upload = multer({ //동영상, 파일등도 올릴 수 있다. 
//   storage: multerS3({
//     s3: new AWS.S3(),
//     bucket: 'sumontee',
//     key(req, file, cb){
//       cb(null, `original/${+new Date()}${path.basename(file.originalname)}`); 
//     }
//   }),
//   limits: { fileSize: 20 * 1024 * 1024 }, //filesize 제한 너무 크면 해커가 공격에 이용. 파일 갯수 제한을 할 수도 있다. 
// });

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
  //이미지가 없는 텍스트만 있으면, upload .none()을 쓰고, 그다음 멀터가 req.body로 정보를 보낸다 
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content, 
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }
    if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => {
          return db.Image.create({ src: image }); //원하는 디비작업 하고, 나중에 동시에 처리. 
        }));
        await newPost.addImages(images); //이미지가 여러개이면 addImages
      } else { // 이미지를 하나만 올리면 image: 주소1. 하나만 올리면 array가 아니다. 그래서 위에서 배열 구분을 해 줌.
        const image = await db.Image.create({ src: req.body.image }); // db.Image에 이미지 주소 저장, 다시말해 그냥 이름이다. images 폴더 안에

        //콘솔로그 해보자. src에 어떤 주소가 들어가는지? 
        await newPost.addImage(image); //image id를 연결
      }
    }
    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
      }, {
        model: db.Image,
      }],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


router.post('/images', upload.array('image'), (req, res) => { 
  res.json(req.files.map(v => v[imageLink])); //이미지 업로드에 대하 결과가 v에 들어간다. 
  //기존의 filename에서 location으로 바꿔졌다.  그안에 s3 경로가 들어 있음. 
  //마지막에 업로드된 이미지 파일 이름만 json으로 리턴해 준다. 
});

///////
router.post('/profile', upload.single('image'),async (req, res) => { //image는 formdata의 image
  //req.body.image, req.body.content
  //위에서 만든  upload 객체 안에다가  폼데이터에서 날린 스트링 값 'image'를 이용하여 배열에 추가할 수 있다. 
  //image 부분이 파일 마다 다르면 upload.fields를 쓸 수 있다. none도 사용 가능한데, 이미지나 파일이 하나도 안 올려진 경우. 
  console.log('req.files', req.file);
  //그리고 그 결과는 single 이면 req.file, 혹은 req.files에 저장. 
  res.json(req.file[imageLink]); //이미지 업로드에 대하 결과가 v에 들어간다. 
  // res.json(req.file.filename); //이미지 업로드에 대하 결과가 v에 들어간다. 
  //기존의 filename에서 location으로 바꿔졌다.  그안에 s3 경로가 들어 있음. 
  //마지막에 업로드된 이미지 파일 이름만 json으로 리턴해 준다. 
  //여기서 request를 다시 리턴하는 이유는 뭐지? multer에서의 값이 되야 할텐ㅔ?
  try{
    console.log('profilePhoto address', req.file[imageLink] );
    await db.User.update({
      profilePhoto: req.file[imageLink]
    
    }, {
      where:{id: req.user.id}
    }); 
    res.send(req.file[imageLink]) // 이 부분은 me 에다가 담자. 
  }catch(e){
    console.error(e);
    next(e); 
  }
});

router.patch('/:id', isLoggedIn, async(req, res, next)=>{
  try{
    console.log('patch fired', req.body.content);
    console.log('patch fired whole body', req.body);
    console.log('id', req.params.id);
    const post = await db.Post.findOne({
      where:{id: req.params.id}
    })
    
    if(!post) {
      return res.status(404).send('Post does not exist.');
    }

    await post.update({content: req.body.content})
    res.send(post)
  }catch(e){
    console.error(e);
    next(e)
  }

})
//////
router.get('/:id', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{   //항상 포스트 만든다음, 거기에 관련된 user, db.image 등이 딸려오는관계 설정에 주의하자. 꼭 명심
        model: db.User,
        attributes: ['id', 'nickname', 'profilePhoto'],
      }, {
        model: db.Image,
      }],
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('Post does not exist.');
    }
    await db.Post.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  // :id/comments에 주목하자. 각  post.id/coments 같은 것들이다. 
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('Post does not exist.');
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname', 'profilePhoto'],
      }],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/1000000/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('Post does not exist.');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname', 'profilePhoto'],
      }],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    // 명심하라. 포스트에 딸린 어떤 액션을 할 때는 항상 post를 먼저 찾아야 한다. 
    if (!post) {
      return res.status(404).send('Post does not exist.');
    }
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if (!post) {
      return res.status(404).send('Post does not exist.');
    }
    await post.removeLiker(req.user.id); //removeLiker sequel 문법
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }],
    });
    if (!post) {
      return res.status(404).send('Post does not exist.');
    }
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('You cannot retwit your post.');
    }
    const retweetTargetId = post.RetweetId || post.id; // retweet한것을 다시 retween 하게. post안의 retweetid를 다시 불러온다

    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,   //use.id는 내 정보이다. 다시말해, 내 아이디와 리트윗 아이디가 있는지 체크. 있으면 중복이니까. 
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('You already retwitted.');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId, //이 아이디가 있으면 개시글은 retweet한 개시글이다. 
      content: 'retweet',
    });
    const retweetWithPrevPost = await db.Post.findOne({ //  리트윗한 글은 남의 글도 인클루드 해야함. 
      where: { id: retweet.id },
      include: [{
        model: db.User, //작성자 정보 
        attributes: ['id', 'nickname', 'profilePhoto'], //attributes에서 비번은 항상 빼라
      }, {
        model: db.Post, // 그다음 retweet한 글 정보
        as: 'Retweet',
        include: [{  
          model: db.User, //그다음 리트윗의 작성자 정보
          attributes: ['id', 'nickname', 'profilePhoto'], //inlude 안에 include 할수 있으나 디비에 무리간다. 
        }, {
          model: db.Image,
        }],
      }],
    });
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
