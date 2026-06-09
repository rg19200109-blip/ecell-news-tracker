export default function NewsList({ items, loading }) {
  if (loading) {
    return <section className="panel">Loading news…</section>;
  }

  return (
    <section className="panel">
      <h2>Latest News</h2>
      <ul className="news-list">
        {items.map((item) => (
          <li key={item._id || item.url}>
            <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
            <div className="meta">
              <span>{item.source}</span>
              <span>{item.category}</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            {item.summary ? <p>{item.summary}</p> : null}
          </li>
        ))}
        {!items.length ? <li>No stories found.</li> : null}
      </ul>
    </section>
  );
}
