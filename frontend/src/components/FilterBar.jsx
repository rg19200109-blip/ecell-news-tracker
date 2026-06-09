const categories = ['All', 'Funding', 'Startups', 'Events', 'Jobs', 'Markets', 'Policy', 'General'];

export default function FilterBar({ filters, onChange, onFetch }) {
  return (
    <section className="panel">
      <h2>Filters</h2>
      <div className="grid">
        <input
          placeholder="Search headlines"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
        <select
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
        >
          {categories.map((category) => (
            <option key={category} value={category === 'All' ? '' : category}>{category}</option>
          ))}
        </select>
        <input
          placeholder="Source (e.g. Inc42)"
          value={filters.source}
          onChange={(event) => onChange({ ...filters, source: event.target.value })}
        />
        <button type="button" onClick={onFetch}>Refresh from sources</button>
      </div>
    </section>
  );
}
