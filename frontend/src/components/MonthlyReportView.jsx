export default function MonthlyReportView({ month, onMonthChange, report }) {
  return (
    <section className="panel">
      <h2>Monthly Report</h2>
      <input type="month" value={month} onChange={(event) => onMonthChange(event.target.value)} />
      <p>Total stories this month: <strong>{report?.totalNews ?? 0}</strong></p>
      <div className="grid report-grid">
        <div>
          <h3>Category Breakdown</h3>
          <ul>
            {(report?.categoryBreakdown || []).map((item) => (
              <li key={item.category}>{item.category}: {item.count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Source Breakdown</h3>
          <ul>
            {(report?.sourceBreakdown || []).map((item) => (
              <li key={item.source}>{item.source}: {item.count}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
