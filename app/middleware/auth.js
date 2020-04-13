module.exports = (options, app) => {
    return async function (ctx, next) {
        //登录白名单
        let whiteUrls = options.whiteUrls || [];
        // 判断当前请求是否在白名单中
        let isWhiteUrl = whiteUrls.some((whiteUrl) => ctx.url.startsWith(whiteUrl));
        if(isWhiteUrl || ctx.url === '/'){
            // 白名单
            ctx.logger.debug(ctx.url + "is white url");
            await next();
            return;
        }
        //从http header或者url中获取jwt token
        let token=ctx.header["authorization"] || ctx.query.token;
        if(!token){
            ctx.body = {
                code: 401,
                msg: '401 Unauthorized.'
            }
            return ctx.body;
        }
        let payload=await app.jwt.verify(token, options.secret);
        if(!payload){
            ctx.body = {
                code: 10002,
                msg: 'invalid token.'
            }
            return ctx.body;
        }
        ctx.request.uid=payload.id;
        await next();
    }
}