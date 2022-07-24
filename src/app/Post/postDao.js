const util = require('util')

async function getCarousel(connection) {
    console.log("getCarousel에서 죽음?");
    //배너 사진 가져오기 3개 가져오기 랜덤으로 배열에 담음
    const getCarouselQuery = `
    select imgUrl, title as carouseTitle, content, link
    from Carousel
    where page='MAIN_PAGE'
    order by rand() limit 6;    
    `;

    const carouselRow = await connection.query(getCarouselQuery);
    console.log("getCarousel끝나기 직전");
    return carouselRow[0]
}
async function getInsitePostTags(connection) {
    //postTags 가져오기

    const getPostTagsQuery = `
        select tagId,name 
        from postTags
        where tagId<19
        order by rand() limit 9;
    `;
    const PostTagsRow = await connection.query(getPostTagsQuery);
    return PostTagsRow[0];

}

async function getInsitePostInterestedTags(connection, userId) {
    //interestedTags 가져오기

    const getInsitePostInterestedTagsQuery = `
        select UPTM.postTagId as tagId, postTags.name as name
        from postTags
                 inner join UserPostTagMapping UPTM on postTags.tagId = UPTM.postTagId
        where userId =?;
    `;
    const PostInterestedTagsRow = await connection.query(getInsitePostInterestedTagsQuery,userId);

    const postTagsRow = PostInterestedTagsRow[0]

    const num = 9-(PostInterestedTagsRow[0].length)

    const getInsitePostTagsQuery = `
        select tagId, name
        from postTags
        where tagId<19 and tagId not in (

            select  UPTM.postTagId
            from postTags
            inner join UserPostTagMapping UPTM on postTags.tagId = UPTM.postTagId
            where userId =1

            )
        order by rand() limit ?;
    `;
    const PostNotInterestedTagsRow = await connection.query(getInsitePostTagsQuery,num);

    for (var i=0; i<PostNotInterestedTagsRow[0].length ;i++) {
        postTagsRow.push(PostNotInterestedTagsRow[0][i])
    }

   return postTagsRow

}

async function getInsitePosts(connection, tagId) {

    //태그 가져오기 9개. 거기서 첫번째 태그 포스트 9개 넣기.

    console.log("tagId:",tagId);
    const getInsitePostsQuery = `
    select postThumbnailUrl, postName, postContent, writer, pf.platformImgUrl
    from insitePosts
    inner join platforms as pf on insitePosts.platformId = pf.platformId
    where tagId=?
    limit 4;
    `;

    

    const  getInsitePostsRow = await connection.query(getInsitePostsQuery,tagId);
    return getInsitePostsRow[0];
}



async function getArticlePosts(connection) {
    const num =5
    // article 불러오기
    const getArticlePostsQuery=`
    select postId, postThumbnailUrl, title
    from articlePosts
    order by rand() limit ?;
    `;
    const [articlePostsRow] = await connection.query(getArticlePostsQuery,num);

    var resultRow = [];
    for (var i=0; i<5; i++) {
        var articlePostId = articlePostsRow[i].postId;
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, articlePostId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        articlePostsRow[i].postTags = articleTagsRow[0];
        resultRow.push(articlePostsRow[i]);
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow

}

async function getVodPosts(connection) {
    //vod 불러오기

    const getVodPostsQuery = `
    select postId, talkerName, LEFT(title,35) as title, LEFT(subtitle,23) as subtitle, thumnailImgUrl
    from vodPosts
    order by rand() limit 5;
    `;

    const vodPostsRow = await connection.query(getVodPostsQuery);

    return vodPostsRow[0];
}

async function getPostsByTagId(connection,tagId) {

    const getPostsByTagIdQuery = `
    select postUrl, postThumbnailUrl, postName, postContent, writer, platformImgUrl
    from insitePosts
    inner join platforms as p on p.platformId=insitePosts.platformId
    where tagId=?
    `;

    const getPostsByTagIdRow = await connection.query(getPostsByTagIdQuery,tagId);

    return getPostsByTagIdRow[0];
}

async function getArticlePostsByDate (connection) {
    const getArticlePostsByDateQuery = `
        select postId,
               postThumbnailUrl,
               postImgUrl,
               title,
               concat(
                       (date_format(startDate, '%Y.%m.%d ')),
                       case DAYOFWEEK(startDate)
                           when '1' then '(일)'
                           when '2' then '(월)'
                           when '3' then '(화)'
                           when '4' then '(수)'
                           when '5' then '(목)'
                           when '6' then '(금)'
                           when '7' then '(토)'
                           end
                   ,' ~ '
                   ,(date_format(dueDate, '%Y.%m.%d ')),
                       case DAYOFWEEK(dueDate)
                           when '1' then '(일)'
                           when '2' then '(월)'
                           when '3' then '(화)'
                           when '4' then '(수)'
                           when '5' then '(목)'
                           when '6' then '(금)'
                           when '7' then '(토)'
                           end
                   ) as startAndDueDate


        from articlePosts
        where startDate is not null
    `;

    const getPostsByTagIdRow = await connection.query(getArticlePostsByDateQuery);
    console.log(getPostsByTagIdRow[0])
    const num = getPostsByTagIdRow[0].length
    var resultRow = [];
    for (var i=0; i<num; i++) {
        var articlePostId = getPostsByTagIdRow[0][i].postId;
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, articlePostId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        getPostsByTagIdRow[0][i].postTags =getPostsByTagIdRow[0];
        resultRow.push(getPostsByTagIdRow[0][i]);

    }

    return resultRow
}


module.exports = {
    getCarousel,
    getInsitePostTags,
    getInsitePosts,
    getArticlePosts,
    getVodPosts,
    getInsitePostInterestedTags,
    getPostsByTagId,
    getArticlePostsByDate
};
