/**
 * @fileoverview 昌宜云选 自动签到
 */

const token = $persistentStore.read("chamshare_token");

if (!token) {
    $notification.post("昌宜云选", "❌ 签到失败", "未找到 Token，请先打开小程序手动签到一次");
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
            $notification.post("昌宜云选", "❌ 网络错误", error);
        } else {
            console.log("📝 昌宜云选返回结果: " + data);
            try {
                const res = JSON.parse(data);
                // 200 为签到成功
                if (res.code === 200) {
                    const pointInfo = res.data && res.data.point ? `获得积分: ${res.data.point}` : "签到成功";
                    $notification.post("昌宜云选", "✅ 成功", pointInfo);
                } 
                // 400 往往代表已签到
                else if (res.code === 400 || (res.message && res.message.includes("已签到"))) {
                    console.log("昌宜云选：今日已签到，跳过通知");
                } 
                else {
                    $notification.post("昌宜云选", "⚠️ 失败", res.message || "未知错误");
                }
            } catch (e) {
                console.log("❌ 解析异常: " + e);
                $notification.post("昌宜云选", "❌ 响应解析失败", "详情请查看日志");
            }
        }
        $done();
    });
}
