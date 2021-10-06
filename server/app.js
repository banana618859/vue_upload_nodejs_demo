/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-12-16 21:06:26
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-10-06 14:29:24
 */

const express = require("express"); //express 框架
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

//监听5000端口
let host = "127.0.0.1";
let port = 5000;
const serverUrl = `${host}:${port}`;
const httpStr = 'http://'
console.log('serverUrl:',serverUrl);

// 声明一个变量，保存所有数据（其实数据是保存到内存里）
var allGood=[]

// 获取提交参数
const bodyParser = require("body-parser");
// 解析以 application/json 和 application/x-www-form-urlencoded 提交的数据
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var app = express(); //实例express框架
//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  // 中文乱码解决
  res.header("Content-Type", "application/json; charset=utf-8")
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 静态服务器
// app.use(express.static(__dirname + '/public')); // 这一句好像没生效，不知为什么
// app.use(express.static('public'));
// 视频流

const {stat} = require('fs').promises
app.get('/public/*', async function (req, res) {
  if(req.url.includes('mp4')){
    const video = __dirname + "/" + req.url
    let range = req.headers['range']
    if (range) {
      let stats = await stat(video)
      let r = range.match(/=(\d+)-(\d+)?/)
      console.log(range)
      let start = parseInt(r[1], 10)
      let end = r[2] ? parseInt(r[2], 10) : start + 1024 * 1024
      if(end > stats.size -1) end = stats.size - 1
      let header = {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start} - ${end} / ${stats.size}`,
        'Content-Length': end - start + 1,
        'Accept-Ranges': 'bytes'
      }
      res.writeHead(206,header)
      fs.createReadStream(video,{start:start,end:end}).pipe(res)
    } else {
      fs.createReadStream(video).pipe(res)
    }
  }else{
    res.sendFile(__dirname + "/" + req.url);
  }
  console.log("Request for " + req.url + " received.");
})

// app.get('/video', async (req, res) => {
  
// })
// 原文链接：https://blog.csdn.net/qq_43505774/article/details/118971681


//新增商品
app.post('/addGoods', (req, res) => {
  try {
    console.log('------11############--addGoods-data55555:');
    let imgUrl;
    // 数据处理部分
    let form = new formidable.IncomingForm();
    //设置文件上传后保存的路径
    let imgPath = 'public'
    form.uploadDir = path.join(__dirname, imgPath);
    let uploadDir = path.join(__dirname, imgPath);
    //保留原始文件的扩展名
    form.keepExtensions = true;
    form.parse(req, async function (err, fields, files) {
      console.log('err, fields, files:', err, fields, files)
      // 为上传的文件重命名：其中files.file.path可以获取文件的上传路径
      if (files.hasOwnProperty('file')) {
        let oldPath = files.file.path
        let filename = Date.now() + files.file.name
        let newPath = path.join(uploadDir, filename)
        // 更新图片地址 /public/images/goods/
        imgUrl = path.join(serverUrl, imgPath, filename)
        fields.goodImg = httpStr + imgUrl;
        // 将文件保存到服务器的某个目录
        fs.renameSync(oldPath, newPath)
      }

      // 新增商品
      // 此处将数据保存到数据库
      let backRel = fields;
      backRel._id = Date.now();
      // 保存最新数据
      allGood.push(backRel);
      console.log('-update-good123:', backRel);
      let data = {
        error: 0,
        msg: '新增商品成功',
        data: JSON.stringify(backRel)
      }
      res.end(JSON.stringify(data))
    })
  } catch (error) {
    let data = {
      error: 1,
      msg: '新增商品出错！'
    }
    res.end(JSON.stringify(data))
  }

})


// 获取商品列表
app.get('/getGoodsList', (req, res) => {
  (async () => {
    // 正常时，此处应该查找数据库
    // 但因为没有数据库，此处直接返回内存数据
    // 中文乱码解决
    res.header("Content-Type", "application/json; charset=utf-8")
    res.end(JSON.stringify(allGood))
  })()
})

// 获取商品列表
app.post('/getOneGood', jsonParser, (req, res) => {
  
  (async () => {
    try {
      console.log('-one-req.body',req.body)
      let { _id } = req.body
      // 此处查找数据库的数据
      // 中文乱码解决
      res.header("Content-Type", "application/json; charset=utf-8")
      let one;
      if(_id==''){
        one = allGood
      }else{
        for(let i=0;i<allGood.length;i++){
          if(allGood[i]._id == _id){
            one = allGood[i];
            break;
          }
        }
        one = [one]
      }
      
      let data = {
        error: 0,
        msg: '查询商品成功',
        data: JSON.stringify(one)
      }
      res.end(JSON.stringify(data))
    }catch(err){
      console.log('##err:',err);
      let data = {
        error: 0,
        msg: '查询商品出错',
        data: ''
      }
      res.end(JSON.stringify(data))
    }
  })()
})


//更新商品
app.post('/updateGoods', (req, res) => {
  try {
    console.log('------55############--update-data233333333:');
    let imgUrl;
    // 数据处理部分
    let form = new formidable.IncomingForm();
    //设置文件上传后保存的路径
    form.uploadDir = path.join(__dirname, 'public/images/goods');
    //保留原始文件的扩展名
    form.keepExtensions = true;
    form.parse(req, async function (err, fields, files) {
      console.log('err, fields, files:', err, fields, files)
      // 为上传的文件重命名：其中files.file.path可以获取文件的上传路径
      if (files.hasOwnProperty('file')) {
        let oldPath = files.file.path
        let filename = Date.now() + files.file.name
        let newPath = path.join(form.uploadDir, filename)
        // 更新图片地址
        imgUrl = path.join(serverUrl, '/public/images/goods/', filename)
        fields.goodImg = httpStr + imgUrl;
        fs.renameSync(oldPath, newPath)
      }

      // 更新商品
      // 此处更新数据库，更新商品资料
      let backRel = fields
      // 更改原来数据
      for(let i=0;i<allGood.length;i++){
        if(fields._id==allGood[i]._id){
          allGood.splice(i,1,backRel);
          break; // 找到了，退出循环
        }
      }
      let data = {
        error: 0,
        msg: '更新商品成功',
        data: JSON.stringify(backRel)
      }
      res.end(JSON.stringify(data))
    })
  } catch (error) {
    let data = {
      error: 1,
      msg: '更新出错！'
    }
    res.end(JSON.stringify(data))
  }

})

//更新上架状态
app.post('/changeGoodsOnline', jsonParser, async (req, res) => {
  try {
    console.log('------###--changeGoodsOnline-3333:');
    console.log('--req:', req.body)
    let { _id, online } = req.body
    let obj = await dbObj.connect();
    let Goods = dbObj.goods(obj)
    await Goods.updateOne({ _id }, { $set: { online } });
    // console.log('-update-good123:', rel);
    let backRel = await Goods.find({ _id });
    let data = {
      error: 0,
      msg: '更新商品成功',
      data: JSON.stringify(backRel)
    }
    res.end(JSON.stringify(data))

  } catch (error) {
    let data = {
      error: 1,
      msg: '更新出错！'
    }
    res.end(JSON.stringify(data))
  }

})

//删除单个商品
app.post('/delGood', jsonParser, async (req, res) => {
  try {
    console.log('------###--delGood-3333:');
    console.log('--req:', req.body)
    let { _id } = req.body
    // 此处查找数据库，将_id对应的商品删除
    
    console.log('goods_id:', _id);
    let data = {
      error: 0,
      msg: '删除商品成功',
      data: {
        _id
      }
    }
    res.end(JSON.stringify(data))

  } catch (error) {
    let data = {
      error: 1,
      msg: '删除商品出错！'
    }
    res.end(JSON.stringify(data))
  }

})

// 上传图片
app.post('/uploadImg', (req, res) => {
  console.log('--uploadImg-req:', req.body)
  // 数据处理部分
  var form = new formidable.IncomingForm();
  //设置文件上传后保存的路径
  form.uploadDir = path.join(__dirname, 'public/images/goods');
  //保留原始文件的扩展名
  form.keepExtensions = true;

  //fields为表单提交时的字段是个json
  //files为表单提交时所上传的文件信息的集合通过files.file可以获取所上传文件的较多信息。现在是单文件上传 
  form.parse(req, function (err, fields, files) {
    console.log('err, fields, files:', err, fields, files)
    //为上传的文件重命名：其中files.file.path可以获取文件的上传路径
    let oldPath = files.avatar.path
    let newPath = path.join(form.uploadDir, files.avatar.name)
    fs.renameSync(oldPath, newPath)
  })
  //文件上传完成后执行
  form.on("end", function () {
    console.log('--上传成功12--')
    let rel = {
      msg: '上传成功',
      error: 0
    }
    res.end(JSON.stringify(rel))
  })

})

app.get("/", function (req, res) {
  res.end('hello server!')
})




app.listen(port, () => {
  console.log(`Server is running on: ${host}:${port}`);
});
