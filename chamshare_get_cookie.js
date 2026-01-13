/**
 * @fileoverview 昌宜云选 Token 抓取
 */

const token = $request.headers['X-App-Token'] || $request.headers['x-app-token'];

if (token) {
    const success = $persistentStore.write(token, "chamshare_token");
    if (success) {
        $notification.post("昌宜云选", "✅ Token 获取成功", "已自动更新并保存");
        console.log("💎 昌宜云选 Token 已保存: " + token);
    }
}

$done({});
