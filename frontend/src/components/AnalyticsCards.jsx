export default function AnalyticsCards({ analytics }) {
  return (
    <section className="panel cards">
      <article>
        <h3>Total News</h3>
        <p>{analytics.totalNews ?? 0}</p>
      </article>
      <article>
        <h3>Top Category</h3>
        <p>{analytics.categoryBreakdown?.[0]?.category || 'N/A'}</p>
      </article>
      <article>
        <h3>Top Source</h3>
        <p>{analytics.sourceBreakdown?.[0]?.source || 'N/A'}</p>
      </article>
    </section>
  );
}
