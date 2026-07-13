const express = require('express');
const RSSParser = require('rss-parser');
const path = require('path');

const app = express();
const parser = new RSSParser();

const RSS_FEEDS = [
  { name: '연합뉴스', url: 'https://www.yonhapnewstv.co.kr/browse/feed/' },
  { name: 'KBS', url: 'http://world.kbs.co.kr/rss/rss_news.htm?lang=k' },
  { name: 'MBC', url: 'https://imnews.imbc.com/rss/news/news_00.xml' },
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/feeds', async (req, res) => {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const parsed = await parser.parseURL(feed.url);
        return {
          source: feed.name,
          items: parsed.items.slice(0, 10).map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            summary: item.contentSnippet || item.content || '',
          })),
        };
      })
    );

    const feeds = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    res.json(feeds);
  } catch (err) {
    res.status(500).json({ error: '피드를 불러오는 데 실패했습니다.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
