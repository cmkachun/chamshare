/**
 * @fileoverview 昌宜云选 自动签到 (强制通知版)
 */

const token = $persistentStore.read("chamshare_token");

if (!token) {
    $notification.post("昌宜云选", "❌ 签到失败", "未找到 Token，请先在小程序手动签到");
    $done();
} else {
    const myRequest = {
        url: `https://api.crm.chamshare.cn/daySign`,
        method: `POST`,
        headers: {
            'X-App-Token': token,
            'Content-Type': `application/json`,
            'X-App-Platform': `wxapp`,
            'X-App-Version': `2.1.1`,
            'X-App-MarketId': `1`,
            'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50`
        },
        body: JSON.stringify({})
    };

    $httpClient.post(myRequest, (error, response, data) => {
        if (error) {
            $notification.post("昌宜云选", "❌ 网络错误", "请求接口失败，请检查网络");
            $done();
        } else {
            console.log("📝 昌宜云选返回结果: " + data);
            const res = JSON.parse(data);
            
            if (res.code === 0 || res.code === 200) {
                // 成功逻辑
                const point = res.data?.integral || "0";
                const total = res.data?.total_integral || "未知";
                const sequence = res.data?.sequence || "1";
                const detail = `🎁 本次获得：${point} 积分\n💰 账户总额：${total} 积分\n📅 连续签到：${sequence} 天`;
                $notification.post("昌宜云选", "✅ 签到成功", detail);
            } 
            else if (res.code === 1101 || res.msg.indexOf("已签到") !== -1) {
                // 已签到逻辑 - 确保这里执行通知
                $notification.post("昌宜云选", "ℹ️ 今日已签到", "您今天已经签到过了，无需重复操作。");
                console.log("已触发：今日已签到通知");
            } 
            else {
                // 报错逻辑
                $notification.post("昌宜云选", "⚠️ 签到异常", res.msg || "未知错误");
            }

            // 增加一个小延时确保通知发出后再结束脚本
            setTimeout(() => {
                $done();
            }, 500);
        }
    });
}
