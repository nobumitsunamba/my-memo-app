(function () {
  var raw = localStorage.getItem('memos_v1');
  if (!raw) {
    console.warn('localStorage に memos_v1 のデータが見つかりませんでした。');
    return;
  }

  var memos;
  try {
    memos = JSON.parse(raw);
  } catch (e) {
    console.error('memos_v1 のパースに失敗しました:', e);
    return;
  }

  if (!Array.isArray(memos) || memos.length === 0) {
    console.warn('移行するメモがありません。');
    return;
  }

  function escape(str) {
    return str.replace(/'/g, "''");
  }

  var values = memos.map(function (memo) {
    var title      = "'" + escape(memo.title || '') + "'";
    var body       = (memo.body && memo.body.trim()) ? "'" + escape(memo.body) + "'" : 'NULL';
    var createdAt  = "'" + new Date(memo.id).toISOString() + "'";
    return '  (' + title + ', ' + body + ', ' + createdAt + ')';
  });

  var sql = 'INSERT INTO memos (title, body, created_at) VALUES\n' +
            values.join(',\n') + ';';

  console.log('--- 生成されたSQL（' + memos.length + '件）---');
  console.log(sql);
  console.log('--- ここまで ---');

  try {
    copy(sql);
    console.info('クリップボードにコピーしました。Supabase の SQL Editor に貼り付けて実行してください。');
  } catch (e) {
    console.info('クリップボードへの自動コピーは失敗しました。上記のSQLを手動でコピーしてください。');
  }
})();
