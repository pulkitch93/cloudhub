import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Download, Share2, CheckCircle2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  userName: string;
  courseProvider: string;
  skillLevel: string;
  certificateNumber: string;
}

interface CertificateGeneratorProps {
  certificates: Certificate[];
  onGenerateNew?: () => void;
}

const CertificateGenerator = ({ certificates, onGenerateNew }: CertificateGeneratorProps) => {
  const { toast } = useToast();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const generateCertificatePDF = (certificate: Certificate) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Certificate border
    doc.setDrawColor(220, 38, 38); // Lenovo red
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    
    // Inner border
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);

    // Header decoration
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 297, 25, 'F');

    // Title
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text('Certificate of Completion', 148.5, 17, { align: 'center' });

    // Logo placeholder (XClarity One)
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38);
    doc.text('XClarity One', 148.5, 45, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Learning Hub', 148.5, 52, { align: 'center' });

    // Presentation text
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });

    // User name
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(certificate.userName, 148.5, 85, { align: 'center' });

    // Course completion text
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text('has successfully completed', 148.5, 97, { align: 'center' });

    // Course name
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.setFont(undefined, 'bold');
    doc.text(certificate.courseName, 148.5, 110, { align: 'center' });

    // Provider and level
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text(`Provider: ${certificate.courseProvider} | Level: ${certificate.skillLevel}`, 148.5, 120, { align: 'center' });

    // Completion date
    doc.setFontSize(11);
    doc.text(`Completed on ${certificate.completionDate}`, 148.5, 130, { align: 'center' });

    // Certificate number
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificate No: ${certificate.certificateNumber}`, 148.5, 140, { align: 'center' });

    // Signature line
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.line(50, 165, 110, 165);
    doc.line(187, 165, 247, 165);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Director, Learning Hub', 80, 172, { align: 'center' });
    doc.text('Chief Technology Officer', 217, 172, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This certificate is awarded in recognition of professional development and skill mastery.', 148.5, 185, { align: 'center' });
    doc.text('Verify at: xclarity.lenovo.com/verify', 148.5, 190, { align: 'center' });

    return doc;
  };

  const handleDownload = (certificate: Certificate) => {
    const doc = generateCertificatePDF(certificate);
    doc.save(`${certificate.courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
    
    toast({
      title: "Certificate Downloaded",
      description: `Your certificate for ${certificate.courseName} has been downloaded.`,
    });
  };

  const handlePreview = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsPreviewOpen(true);
  };

  const handleShare = (certificate: Certificate) => {
    toast({
      title: "Share Certificate",
      description: "Certificate link copied to clipboard!",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Your Achievements</h3>
              <p className="text-sm text-muted-foreground">
                {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-600 border-yellow-600/50">
              <Star className="h-3 w-3 mr-1" />
              Level 8 Expert
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((certificate) => (
          <Card 
            key={certificate.id} 
            className="p-4 bg-card border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <Badge variant="outline" className="text-green-500 border-green-500/50 mb-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
              {certificate.courseName}
            </h4>

            <div className="space-y-1 mb-3 text-xs text-muted-foreground">
              <p>Provider: {certificate.courseProvider}</p>
              <p>Level: {certificate.skillLevel}</p>
              <p>Completed: {certificate.completionDate}</p>
              <p className="font-mono text-[10px]">Cert #: {certificate.certificateNumber}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handlePreview(certificate)}
                className="text-xs"
              >
                Preview
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload(certificate)}
                className="text-xs"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleShare(certificate)}
                className="text-xs"
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Certificate Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              {/* Certificate Preview */}
              <div className="aspect-[1.414/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-8 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full" 
                       style={{ 
                         backgroundImage: 'radial-gradient(circle, #DC2626 1px, transparent 1px)',
                         backgroundSize: '20px 20px'
                       }} 
                  />
                </div>

                {/* Certificate Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 -mx-8 mb-4">
                    <h2 className="text-3xl font-bold text-white">Certificate of Completion</h2>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-red-600">XClarity One</h3>
                    <p className="text-sm text-gray-600">Learning Hub</p>
                  </div>

                  <p className="text-gray-700">This is to certify that</p>

                  <h1 className="text-4xl font-bold text-gray-900">{selectedCertificate.userName}</h1>

                  <p className="text-gray-700">has successfully completed</p>

                  <h2 className="text-2xl font-bold text-red-600">{selectedCertificate.courseName}</h2>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Provider: {selectedCertificate.courseProvider} | Level: {selectedCertificate.skillLevel}</p>
                    <p>Completed on {selectedCertificate.completionDate}</p>
                    <p className="text-xs text-gray-400 mt-2">Certificate No: {selectedCertificate.certificateNumber}</p>
                  </div>

                  <div className="flex justify-around w-full mt-8 pt-8">
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-32 mb-1"></div>
                      <p className="text-xs text-gray-600">Director, Learning Hub</p>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-32 mb-1"></div>
                      <p className="text-xs text-gray-600">Chief Technology Officer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => selectedCertificate && handleDownload(selectedCertificate)}
                  className="flex-1 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => selectedCertificate && handleShare(selectedCertificate)}
                  className="flex-1 gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificateGenerator;
