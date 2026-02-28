import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import VoiceOutput from '@/components/VoiceOutput';
import { FileText, Calendar, Download, Mail, Eye, TrendingUp, Activity } from 'lucide-react';

interface ReportData {
  dateRange: { start: string; end: string };
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  healthSummary: string;
  keyInsights: string[];
  recommendations: string[];
}

const generateMockReport = (startDate: string, endDate: string): ReportData => {
  return {
    dateRange: { start: startDate, end: endDate },
    riskScore: 68,
    riskLevel: 'Moderate',
    healthSummary: 'Your overall health score shows moderate risk. HRV patterns indicate elevated stress levels, and sleep quality has been inconsistent over the past 2 weeks. Activity levels are below target but showing improvement.',
    keyInsights: [
      'HRV has decreased by 12% compared to previous period',
      'Sleep hours averaging 6.2 hours per night (below 7hr target)',
      'Daily steps averaging 5,800 (below 9,000 target)',
      'Voice stress levels elevated on 3 out of 7 days',
      'Risk score improved by 5% from last month',
    ],
    recommendations: [
      'Increase sleep duration to 7-8 hours per night',
      'Aim for 9,000+ daily steps with gradual increase',
      'Practice daily stress management techniques',
      'Schedule regular health check-ups',
      'Continue monitoring HRV trends weekly',
    ],
  };
};

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-01-14' });
  const [report, setReport] = useState<ReportData | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setReport(generateMockReport(dateRange.start, dateRange.end));
      setGenerating(false);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    alert('PDF download would be implemented with a library like jsPDF or react-pdf');
  };

  const handleEmailReport = () => {
    alert('Email report would be sent via backend API');
  };

  const riskColor = {
    Low: 'text-risk-low bg-risk-low/10',
    Moderate: 'text-risk-moderate bg-risk-moderate/10',
    High: 'text-risk-high bg-risk-high/10',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-pastel-lavender/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-pastel-mint/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-mint flex items-center justify-center shadow-glow animate-pulse-soft">
              <FileText className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Health Reports</h1>
          </div>
          <p className="text-muted-foreground ml-15">Generate and download comprehensive health reports</p>
        </div>

        <div className="glass-card-hover p-6 mb-8 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-4 relative">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Generate Report</h2>
          </div>
          
          <div className="flex flex-wrap items-end gap-4 relative">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-glow hover:shadow-hover"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {report && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card-hover overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
              
              <div className="p-6 border-b border-border relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-display font-semibold text-foreground">Health Report</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEmailReport}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all hover:scale-105"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:opacity-90 transition-all shadow-glow hover:shadow-hover hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-border relative">
                <h3 className="text-lg font-semibold text-foreground mb-4">Risk Assessment</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-muted/30 shadow-inner-glow">
                    <span className="text-3xl font-bold text-foreground">{report.riskScore}</span>
                  </div>
                  <div>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${riskColor[report.riskLevel]}`}>
                      {report.riskLevel} Risk
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on analysis of {report.dateRange.start} to {report.dateRange.end}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-border relative">
                <h3 className="text-lg font-semibold text-foreground mb-4">Health Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{report.healthSummary}</p>
              </div>

              <div className="p-6 border-b border-border relative">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Key Insights</h3>
                </div>
                <ul className="space-y-3">
                  {report.keyInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 relative">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Recommendations</h3>
                </div>
                <ul className="space-y-3">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-primary">{idx + 1}</span>
                      </div>
                      <span className="text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!report && (
          <div className="glass-card-hover p-12 text-center animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Report Generated</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select a date range and click "Generate Report" to create a comprehensive health report with insights and recommendations.
            </p>
          </div>
        )}
      </main>

      {report && (
        <VoiceOutput
          riskLevel={report.riskLevel}
          healthScore={report.riskScore}
          advice={report.recommendations}
        />
      )}
    </div>
  );
};

export default ReportsPage;
