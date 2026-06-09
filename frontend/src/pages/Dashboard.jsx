import { useCallback, useEffect, useMemo, useState } from 'react';
import AnalyticsCards from '../components/AnalyticsCards';
import FilterBar from '../components/FilterBar';
import MonthlyReportView from '../components/MonthlyReportView';
import NewsList from '../components/NewsList';
import { fetchAnalytics, fetchMonthlyReport, fetchNews, subscribe, triggerNewsFetch } from '../services/api';

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export default function Dashboard() {
  const [filters, setFilters] = useState({ search: '', category: '', source: '' });
  const [news, setNews] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [month, setMonth] = useState(getCurrentMonth());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriber, setSubscriber] = useState('rg19200109@gmail.com');
  const [status, setStatus] = useState('');

  const newsParams = useMemo(() => ({ ...filters, limit: 50 }), [filters]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const [newsResponse, analyticsResponse] = await Promise.all([
        fetchNews(newsParams),
        fetchAnalytics()
      ]);
      setNews(newsResponse.items || []);
      setAnalytics(analyticsResponse || {});
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }, [newsParams]);

  const loadReport = useCallback(async (selectedMonth) => {
    try {
      const reportResponse = await fetchMonthlyReport(selectedMonth);
      setReport(reportResponse);
    } catch (error) {
      setStatus(error.message);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    loadReport(month);
  }, [month, loadReport]);

  const handleSubscribe = async () => {
    try {
      await subscribe(subscriber);
      setStatus(`Subscribed ${subscriber} for monthly digests.`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleFetch = async () => {
    try {
      await triggerNewsFetch();
      await loadNews();
      await loadReport(month);
      setStatus('Manual fetch completed.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>E-Cell Monthly News Tracker</h1>
        <p>Startup and entrepreneurship updates for IIM Bangalore students.</p>
      </header>

      <AnalyticsCards analytics={analytics} />

      <FilterBar filters={filters} onChange={setFilters} onFetch={handleFetch} />

      <section className="panel subscription">
        <h2>Monthly Digest Subscription</h2>
        <div className="grid">
          <input value={subscriber} onChange={(event) => setSubscriber(event.target.value)} />
          <button type="button" onClick={handleSubscribe}>Subscribe</button>
        </div>
      </section>

      <MonthlyReportView month={month} onMonthChange={setMonth} report={report} />
      <NewsList items={news} loading={loading} />

      {status ? <p className="status">{status}</p> : null}
    </main>
  );
}
