/**
 * Created by entorick on 17/4/13.
 */
var LongPulling = {
    // 默认协议
    protocol: "longpulling",

    // 默认url
    url: "a.b.com",

    // 默认超时世家你
    timeout: 30,

    // 标识，start事件开启，stop事件结束
    runningflag: false,

    // 判定是否还在发送中
    isSending: false,

    // 初始化
    init: function(protocol, url, timeout){
        var me = this;
        if (protocol != null){
            me.protocol = protocol;
        }
        if (url != null){
            me.url = url;
        }

        if (timeout != null){
            me.timeout = timeout;
        }
        return me;
    },

    // 开始请求
    start: function(app, action, token, callback){

        var me = this;

        if (!me.isSending){
            me.isSending = false;
        }

        me.runningflag = true;
        var loop = setInterval(function() {
            // 长轮询
            if (me.runningflag && !me.isSending){
                me.isSending = true;
                $.ajax({
                    type: "POST",
                    url: "http://" + me.url + "/" + app + "_" + action,
                    data: {
                        'timeout': me.timeout,
                        'token': token
                    },
                    timeout: me.timeout * 1000,
                    success: function (data, textStatus) {
                        callback(data);
                        me.isSending = false;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (textStatus == "timeout") { // 请求超时
                            callback("{\"status\":\"fail\",\"data\":\"timeout\"}");
                            me.isSending = false;
                        } else { // 其他错误，如网络错误等
                            callback("{\"status\":\"fail\",\"data\":\"net_wrong\"}");
                            clearInterval(loop); // 停止循环
                            me.stop(); // 网络错误，停止
                        }
                    }
                });
            }
        }, 20);
    },

    // 结束连接
    stop: function(){
        var me = this;
        me.runningflag = false;
    }
};