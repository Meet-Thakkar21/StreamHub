const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videoRouter = require('./routes/videos'); // Ensure this path is correct
const userRouter = require('./routes/user');
const tagsRouter = require('./routes/tags');
const likedVideosRouter = require('./routes/liked_videos');
const WatchLaterRouter = require('./routes/watch_later');
const multer = require('multer');
const uuidv4 = require('uuid').v4; 
const path = require('path'); 
const fs = require('fs');
const  exec  = require('child_process').exec;


const app = express();
const port = process.env.PORT || 5000;

//multer middleware
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"../uploads");
  },
  filename: function(req,file,cb){
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  }
});

//multer configurtion

const upload = multer({storage: storage});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.post("/upload", upload.single('file'),function(req,res){
  console.log("file Uploaded")
  const lessonId = uuidv4();
  const videoPath = req.file.path;
  const outputPath = `../uploads/courses/${lessonId}`;
  const hlsPath = `${outputPath}/index.m3u8`
  console.log("hlsPath" , hlsPath);

  if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive : true});
  }

  //ffmpeg command
  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

  exec(ffmpegCommand , (error,stdout,stderr) => {
    if(error){
      console.log(`exec error : ${error}`);
    }
    console.log(`stdout : ${stdout}`);
    console.log(`stderr : ${stderr}`);
    const videoUrl = `http://localhost:5000/uploads/courses/${lessonId}/index.m3u8`;

    res.json({
      message: "Video converted to HLS",
      videoUrl : videoUrl,
      lessonid: lessonId,
    })
  })
})


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/AtProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Use routes
app.use('/api/videos', videoRouter);
app.use('/api/user', userRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/liked-videos', likedVideosRouter);
app.use('/api/watch_later', WatchLaterRouter);



app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
