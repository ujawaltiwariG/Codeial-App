const Post = require("../models/post");
const Comment = require("../models/comment");

// by async and await
module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if(req.xhr){
      return res.status(200).json({
         data: {
            post: post
         },
         massage: "Post created!"
      });
    }
     
    req.flash('success','Post published');
    return res.redirect("back");
  } catch (err) {
    req.flash('error',err);
    return res.redirect("back");
  }
};

// without async and await
// module.exports.create = function (req, res) {
//   Post.create(
//     {
//       content: req.body.content,
//       user: req.user._id,
//     },
//     function (err, post) {
//       if (err) {
//         console.log("error in creating a post");
//         return;
//       }

//       return res.redirect("back");
//     }
//   );
// };

// by async and await
module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({ post: req.params.id });
       req.flash('success','Post and associated comments deleted!');
       return res.redirect("back");
      } else {
      req.flash('error', 'You cannot delete this past');
      return res.redirect("back");
    }
  } catch (err) {
    req.flash('error',err);  }
};

// without async and await
// module.exports.destroy = function (req, res) {
//   Post.findById(req.params.id, function (err, post) {
//     // .id means converting the object id into string
//     if (post.user == req.user.id) {
//       post.remove();

//       Comment.deleteMany({ post: req.params.id }, function (err) {
//         return res.redirect("back");
//       });
//     } else {
//       return res.redirect("back");
//     }
//   });
// };
