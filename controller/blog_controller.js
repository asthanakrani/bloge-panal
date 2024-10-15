const blogmodel = require('../models/blog-model');
const fs = require('fs');
const path = require('path')
const upload = require('../config/multerconfig');
const comment = require('../models/commentModel')
const addBlog = (req , res) => {

    res.render('pages/samples/add-blog');

}
const myBlog = (req , res) => {
    blogmodel.find({userId:req.user.id})
    .then(blogData => {
        console.log("blog",blogData);

        res.render('pages/samples/my-blog',{data:req.user,blogData:blogData});
    })

}
const addBlogData = async (req, res) => {
    console.log("blogg add con");
    console.log("File data: ", req.file);
    console.log("Request body: ", req.body);

    const blogData = {
        title: req.body.title,
        description: req.body.description,
        blog_img: req.file ? req.file.path : null,
        userId : req.user._id,
    };
    try {
        let model = new blogmodel(blogData);
        await model.save();
        res.redirect('/');
    } catch (error) {
        console.error("Error saving blog:", error);
        res.status(400).send('Error: ' + error.message);
    }
};

const viewBlog = (req,res) => {
    console.log("view bloggg");
    blogmodel.find({})
    .then(blogData => {
        console.log("blog",blogData);

        res.render('pages/samples/view-blog',{data:req.user,blogData:blogData});
    })
}

const deleteBlog = async(req,res) => {
    console.log("delet blog...",req.params.id);
    const blogId = req.params.id;

    const deletedBlog = await blogmodel.findByIdAndDelete(blogId);
    console.log("deletedBlog", deletedBlog);

    if (deletedBlog && deletedBlog.blog_img) {
        const imgPath = path.join(__dirname, '../', deletedBlog.blog_img);
        console.log("imgPath", imgPath);

        fs.unlink(imgPath, (err) => {
            if (err) {
                console.error('Error while deleting blog image:', err);
            } else {
                console.log('Blog image deleted successfully');
            }
        });
    }

    res.redirect('/viewBlog');

}
const editBlog = async(req,res)=>{
    console.log("editt bloggg",req.params.id);
    const data = await blogmodel.findOne({_id : req.params.id})
    console.log("data",data);

    res.render('pages/samples/edit-blog',{data})
}
const updateBlog = async(req,res) => {
    try{

        const data = await blogmodel.findOne({_id : req.params.id})
        console.log("data",data,req.file,req.body);

            data.title = req.body.title;
            data.description = req.body.description;
            if (req.file) {
                const oldPost = path.join(__dirname, '../', data.blog_img);
                console.log("old post path >> ",oldPost);
                
                fs.unlink(oldPost, (err) => {
                    if (err) {
                        console.error('Error while deleting old poster:', err);
                    }
                });
                data.blog_img = req.file.path;
            }
            console.log("data",data);
            await data.save();
            // await blogmodel.findByIdAndUpdate({_id : req.params.id})
            res.redirect('/viewBlog');
            // console.log("update bloggg",req.params.id);
            // res.render('pages/samples/edit-blog',{data})
    }catch(err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to update the blog' });
      }
}
const allBlog = async (req, res) => {
    const commnetData = await comment.find({}).populate({path:'blog',populate: {path : 'userId', }}).populate('user');
    const blogData = await blogmodel.find({});
    console.log("commnetData", commnetData);

    console.log("blogData", blogData);
    res.render('pages/samples/all-blog', { data: req.user, blogData: blogData , comment: commnetData });
}
const addComment = async(req,res) => {
    console.log("add commnet");
    console.log("comment : " , req.body);
    
    const data = {
        comment: req.body.comment,
        blog : req.params.id,
        user : req.user._id,
    }
    let model = await new comment(data);
    console.log("data", model);
    await model.save();

    res.redirect('/allBlog');
}
const deletComment =async(req,res)=>{
     const deletComment =await comment.findByIdAndDelete(req.params.id)
     console.log("deleted commit",deletComment);
     res.redirect('/allBlog');
}
module.exports = {addBlog,addBlogData,viewBlog,deleteBlog,editBlog,updateBlog,allBlog,myBlog,addComment,deletComment}