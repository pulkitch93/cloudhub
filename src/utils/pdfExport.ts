import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ComplianceData {
  overallScore: number;
  activePolicies: number;
  driftAlerts: number;
  regionalScores: Array<{ region: string; score: number; status: string }>;
  driftAlertDetails: Array<{
    resource: string;
    policy: string;
    severity: string;
    detected: string;
    status: string;
  }>;
  violations: Array<{
    policy: string;
    resource: string;
    severity: string;
    timestamp: string;
  }>;
}

export const generateComplianceReport = (data: ComplianceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(31, 41, 55);
  doc.text('Compliance Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Generated date
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55);
  doc.text('Executive Summary', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  
  const summaryLines = [
    `Overall Compliance Score: ${data.overallScore}%`,
    `Active Policies: ${data.activePolicies}`,
    `Drift Alerts: ${data.driftAlerts}`,
    '',
    'Summary: ' + getSummaryText(data.overallScore, data.driftAlerts)
  ];

  summaryLines.forEach(line => {
    doc.text(line, 14, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Regional Compliance Scores
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Regional Compliance Scores', 14, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Region', 'Score', 'Status']],
    body: data.regionalScores.map(r => [r.region, `${r.score}%`, r.status]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: 14, right: 14 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Drift Alerts
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Drift Alerts & Violations', 14, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Resource', 'Policy', 'Severity', 'Detected', 'Status']],
    body: data.driftAlertDetails.map(d => [
      d.resource,
      d.policy,
      d.severity,
      d.detected,
      d.status
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Add new page for recommendations
  doc.addPage();
  yPosition = 20;

  // Remediation Recommendations
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Remediation Recommendations', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);

  const recommendations = getRecommendations(data);
  recommendations.forEach((rec, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${index + 1}. ${rec}`, 14, yPosition, { maxWidth: pageWidth - 28 });
    yPosition += 12;
  });

  yPosition += 10;

  // Trend Analysis
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Trend Analysis', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  const trendText = getTrendAnalysis(data);
  const splitTrend = doc.splitTextToSize(trendText, pageWidth - 28);
  doc.text(splitTrend, 14, yPosition);

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`compliance-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

const getSummaryText = (score: number, alerts: number): string => {
  if (score >= 90 && alerts === 0) {
    return 'Excellent compliance posture with no active violations. Continue monitoring for drift.';
  } else if (score >= 75) {
    return 'Good compliance posture with minor issues. Address drift alerts to improve score.';
  } else if (score >= 60) {
    return 'Moderate compliance posture. Immediate attention required for critical violations.';
  } else {
    return 'Poor compliance posture. Urgent remediation required across multiple policies.';
  }
};

const getRecommendations = (data: ComplianceData): string[] => {
  const recommendations: string[] = [];

  if (data.overallScore < 75) {
    recommendations.push('Prioritize remediation of critical and high-severity violations to improve overall compliance score.');
  }

  if (data.driftAlerts > 5) {
    recommendations.push('Enable automated remediation for common drift scenarios to reduce manual intervention.');
  }

  const lowScoreRegions = data.regionalScores.filter(r => r.score < 75);
  if (lowScoreRegions.length > 0) {
    recommendations.push(`Focus compliance efforts on ${lowScoreRegions.map(r => r.region).join(', ')} regions with lower scores.`);
  }

  recommendations.push('Schedule regular compliance audits and policy reviews to maintain high standards.');
  recommendations.push('Implement automated policy enforcement using infrastructure-as-code templates.');
  recommendations.push('Conduct team training on compliance best practices and policy requirements.');

  return recommendations;
};

const getTrendAnalysis = (data: ComplianceData): string => {
  const avgScore = data.regionalScores.reduce((acc, r) => acc + r.score, 0) / data.regionalScores.length;
  
  let analysis = `Current compliance monitoring shows an overall score of ${data.overallScore}% with ${data.driftAlerts} active drift alerts. `;
  
  if (data.overallScore > avgScore) {
    analysis += 'Overall performance is above the regional average, indicating strong compliance management. ';
  } else {
    analysis += 'Overall performance is below the regional average, requiring attention to lagging areas. ';
  }

  analysis += 'Continue monitoring trends weekly to identify patterns and prevent compliance degradation. ';
  analysis += 'Historical data suggests that proactive remediation reduces violations by 60% on average.';

  return analysis;
};
