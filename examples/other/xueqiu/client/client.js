(() => {
  const serverUrl = 'http://127.0.0.1:3000/hook';
  const apiKey = 'change_this_to_a_secret_key';
  const userIds = ['8282709675', '1079205489', '6070369404', '6890047388', '6561652594', '5542965969'];
  const interval = 10 * 1000;
  let lastId = null;
  let currentUser = 0;

  async function getLatestPostAndSend() {
    try {
      const userId = userIds[currentUser];
      currentUser += 1;
      if (currentUser > userIds.length - 1) {
        currentUser = 0;
      };
      const url = `https://xueqiu.com/v4/statuses/user_timeline.json?user_id=${userId}&page=1&count=10`;
      const res = await fetch(url, { credentials: 'include' });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('[抓取] 返回非 JSON，可能被拦截/验证码。内容前200:', text.slice(0, 200));
        return;
      };

      if (data.statuses && data.statuses.length > 0) {
        const latest = data.statuses[1];
        const id = latest.id_str || latest.id || latest.created_at;
        lastId = id;

        const payload = {
          userId,
          latest,
          list: data.statuses,
          meta: { fetchedAt: new Date().toISOString() },
        };

        const resp = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          console.error('[上报] 失败', resp.status, await resp.text());
        } else {
          console.log('[上报] 成功：');
        };
      } else {
        console.log('[抓取] 没有发言数据');
      };
    } catch (err) {
      console.error('[错误]', err);
    };
  };

  getLatestPostAndSend();
  const timer = setInterval(getLatestPostAndSend, interval);

  window.stopXueqiuUpload = () => {
    clearInterval(timer);
    console.log('已停止上传');
  };

  console.log('脚本已启动。停止：stopXueqiuUpload()');
})();
