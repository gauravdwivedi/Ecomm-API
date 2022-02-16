const { Comment } = require("../../../core/sql/controller/child");
const {UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const { base } = require("./../../../wrapper")
const async = require("async");
const list = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
list.validateBody = (req, res, next) => {
  let { page, limit } = req.query;
  if(!limit) limit = 10;

  page = page ? Number(page) : 1;

  req.query.page = page;
  req.query.offset =(page-1)*Number(limit);
  req.query.limit = Number(limit);
  
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
list.fetchSQL = async (req, res, next) => {
  let { offset, limit, videoId } = req.query;
  const userId = req._userId;
  const CommentObj = new Comment(req._siteId);

  let total = 0, comments = [], commentIDs, userProfiles = [], likedComments = new Map(), dislikedComments = new Map();
  
  async.series({

    COMMENTS_COUNT: cb => {
      CommentObj.count(videoId, (error, result)=>{
        total = result;
        cb();
      })
    },

    COMMENTS_LIST: cb => {
      if(total){
        CommentObj.list(videoId, offset, limit, (error, result)=>{
          comments = result;
          commentIDs = [...new Set(result.map(_obj => _obj.commentId))];
          cb();
        })
      }
      else cb();
    },

    LIKES_USER_IDS: cb => {
      if(total){
        CommentObj.likesUserIDs(commentIDs, 1, (error, result)=>{
          likedComments = result;
          cb();
        })
      }
      else cb();
    },

    DISLIKES_USER_IDS: cb => {
      if(total){
        CommentObj.likesUserIDs(commentIDs, 2, (error, result)=>{
          dislikedComments = result;
          cb();
        })
      }
      else cb();
    },

    USER_PROFILES: cb => {
      if(total){
        const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
        let userIds = [...new Set(comments.map(_obj => _obj.user_id))];
        iUserBasicInfoRedis.getAllUsersProfile(userIds).then(result=>{
          userProfiles = result;
          cb();
        })
      }
      else cb();
    }
  }, () => {
    res.status(200).send(base.success({result: _wrapper(userId, req.query, total, comments, userProfiles, likedComments, dislikedComments)}));
        next();
  })
}

const _wrapper = (userId, params, total, list, userProfiles, likedComments, dislikedComments) =>{
  if(list && list.length){
    let commentList = [];
    list.map(comment=>{
      const redisUser = userProfiles.get(comment.user_id);
      const noUser = {user_id: comment.user_id, first_name:'EMK', last_name:'User'}
      const userProfile = redisUser && redisUser.user_id ? redisUser : noUser
      const likes = likedComments ? likedComments.get(comment.commentId): []
      const dislikes = dislikedComments ? dislikedComments.get(comment.commentId): []

      let tuple = {
        id: comment.commentId,
        comment: comment.comment,
        commentedOn: comment.create_time,
        user:userProfile,
        likes: likes.length,
        dislikes: dislikes.length,
        liked: userId && likes.indexOf(userId) > -1 ? true : false,
        disliked: userId && dislikes.indexOf(userId) > -1 ? true : false,
      }
      commentList.push(tuple);
    })  
    list = commentList;
  }

  const resp = {
    meta:{
      total: total || 0,
      pages: total ? Math.ceil(total/params.limit) : 0,
      currentPage: params.page
    },
    list
  }
  return resp;
}


module.exports = list;