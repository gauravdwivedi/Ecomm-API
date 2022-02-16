const {Menu, Video} = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const {Menu: {SCHEMA:{FIELDS: MENU_FIELDS}}} = require("../../../core/sql/model/child");
const async = require("async");

const getAll = {};

/**
* fetching menus 
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
getAll.fetch = (req, res, next) => {
  const MenuObj = new Menu(req._siteId);
  const VideoObj = new Video(req._siteId);

  let menuIDs = [], subMenuIDs = [], videoIDs = [], allVideos = [];
  let menuData = new Map(), subMenuData = new Map(), videoData = new Map();

  async.series({

    GET_MENU_IDS: cb => {
      MenuObj.getAllMenuId((error, result)=>{
        if(result && result.length){
          menuIDs = result.map(r=>r.id);
          result.forEach(menu=>{
            menuData.set(menu.id, menu.slug);
          })
          cb();
        }
        else cb();
      })
    },
    
    GET_ALL_SUB_MENU_IDS: cb => {
      if(menuIDs && menuIDs.length){
        MenuObj.getAllSubMenuId(menuIDs, (error, result)=>{
          if(result && result.length){
            subMenuIDs = result.map(r=>r.id);
            result.forEach(menu=>{
              subMenuData.set(menu.id, {
                categorySlug: menu.slug,
                parentCategorySlug: menuData.get(menu.parentId)
              });
            })
            cb();
          }
          else cb();
        })
      }
      else cb();
    },

    GET_ALL_VIDEO_IDS: cb => {
      if(menuIDs && menuIDs.length){
        VideoObj.sitemapVideoIDs(subMenuIDs, (error, result)=>{
          if(result && result.length){
            videoIDs = result.map(r=>r.videoId);
            result.forEach(video=>{
              videoData.set(video.videoId, {
                ...subMenuData.get(video.menuId)
              });
            })
            cb();
          }
          else cb();
        })
      }
      else cb();
    },

    GET_ALL_VIDEOS: cb => {
      if(videoIDs && videoIDs.length){
        VideoObj.sitemapVideoList(videoIDs, (error, result)=>{
          result.forEach(video=>{
            allVideos.push({
              ...video,
              ...videoData.get(video.videoId)
            })
          })
          cb();
        })
      }
      else cb();
    }
  }, () => {
    res.status(200).send(base.success({result: allVideos}));
    next();
  })
}

module.exports = getAll;