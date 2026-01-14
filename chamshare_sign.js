/**
 * @fileoverview 昌宜云选 自动签到 (已签到强制通知版)
 */

const token = $persistentStore.read("chamshare_token");

if (!token) {
    $notification.post("昌宜云选", "❌ 签到失败", "未找到 Token，请先打开小程序手动签到一次获取");
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
            $notification.post("昌宜云选", "❌ 网络错误", "请检查网络连接");
        } else {
            console.log("📝 昌宜云选返回结果: " + data);
            try {
                const res = JSON.parse(data);
                
                // 1. 签到成功 (code 0)
                if (res.code === 0 || res.code === 200) {
                    const point = res.data?.integral || "0";
                    const total = res.data?.total_integral || "未知";
                    const sequence = res.data?.sequence || "1";
                    
                    const detail = `🎁 本次获得：${point} 积分\n💰 账户总额：${total} 积分\n📅 连续签到：${sequence} 天`;
                    $notification.post("昌宜云选", "✅ 签到成功", detail);
                } 
                // 2. 已签到 (code 1101) - 强制开启通知
                else if (res.code === 1101 || (res.msg && res.msg.includes("已签到"))) {
                    // 由于已签到时 data 为空，显示友好提示
                    const detail = `ℹ️ 您今天已经签到过了，无需重复操作。\n如有疑问，请进入小程序查看积分明细。`;
                    $notification.post("昌宜云选", "ℹ️ 今日已签到", detail);
                    console.log("昌宜云选：今日已签到，已发出提醒通知");
                } 
                // 3. 其他错误
                else {
                    $notification.post("昌宜云选", "⚠️ 签到异常", res.msg || "未知错误");
                }
            } catch (e) {
                console.log("❌ 解析异常: " + e);
                $notification.post("昌宜云选", "❌ 响应解析失败", "返回数据格式不正确");
            }
        }
        $done();
    });
}
