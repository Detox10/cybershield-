import React, { useState } from "react";
import { Shield, Upload, FileText, ChevronRight, AlertTriangle, CheckCircle, Search, Mail, ExternalLink, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function EmailSecurityFlow() {
  const [isUploading, setIsUploading] = useState(false);
  const [emlContent, setEmlContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/email/analyze", {
        method: "POST",
        
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setAnalysisResult(data.analysis);
        toast.success("Email analyzed successfully");
      } else {
        toast.error(data.error || "Failed to analyze email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to analyzer");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextAnalyze = async () => {
    if (!emlContent.trim()) {
      toast.error("Please paste email headers or .eml content");
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("content", emlContent);

    try {
      const res = await fetch("/api/email/analyze", {
        method: "POST",
        
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setAnalysisResult(data.analysis);
        toast.success("Email analyzed successfully");
      } else {
        toast.error(data.error || "Failed to analyze email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to analyzer");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-sky-500" />
            Email Security & Forensics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze .eml files and extract forensic intelligence layer.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      {!analysisResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mb-4 text-sky-500">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Upload .eml File</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Drop your email file here to extract metadata, attachments, and URLs.
            </p>
            <label className="relative cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
              <span>{isUploading ? "Analyzing..." : "Browse Files"}</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".eml,.txt,.msg" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col min-h-[300px]">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Paste Raw Headers / Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Paste raw .eml content or email headers directly for immediate analysis.
            </p>
            <textarea
              className="flex-1 w-full bg-slate-50 dark:bg-[#0B0F19]/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              placeholder="Return-Path: <sender@example.com>&#10;Received: from..."
              value={emlContent}
              onChange={(e) => setEmlContent(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleTextAnalyze}
                disabled={isUploading}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isUploading ? "Analyzing..." : "Analyze Content"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
            <button 
              onClick={() => setAnalysisResult(null)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Analyze Another
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subject and Risk */}
            <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Subject</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-white">{analysisResult.subject || "(No Subject)"}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  analysisResult.riskLevel === 'HIGH' ? 'bg-rose-500/10 text-rose-500' :
                  analysisResult.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {analysisResult.riskLevel} RISK
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Sender</div>
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded inline-block truncate max-w-full">{analysisResult.sender || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Recipient</div>
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate max-w-full">{analysisResult.recipient || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Date</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">{new Date(analysisResult.date).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Authentication */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Authentication (Observed)</h3>
              
              <div className="space-y-4 flex-1">
                {['Spf', 'Dkim', 'Dmarc'].map((auth) => {
                  const val = analysisResult[`observed${auth}`];
                  const isPass = val === 'PASS';
                  const isFail = val === 'FAIL';
                  return (
                    <div key={auth} className="flex items-center justify-between">
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{auth.toUpperCase()}</div>
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded ${
                        isPass ? 'bg-emerald-500/10 text-emerald-500' :
                        isFail ? 'bg-rose-500/10 text-rose-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {isPass ? <CheckCircle className="w-3 h-3" /> : isFail ? <AlertTriangle className="w-3 h-3" /> : null}
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center">These values are extracted directly from headers and are not verified live.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URLs */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-sky-500" />
                Extracted URLs ({analysisResult.urls?.length || 0})
              </h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {analysisResult.urls?.length > 0 ? analysisResult.urls.map((urlItem: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111622] border border-slate-200/60 dark:border-slate-800">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-300 truncate">{urlItem.domain}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate mt-1">{urlItem.url}</div>
                    </div>
                    <div className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                      {urlItem.riskLevel}
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-500 text-center py-6">No URLs found in the email body.</div>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-rose-500" />
                Attachments ({analysisResult.attachments?.length || 0})
              </h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {analysisResult.attachments?.length > 0 ? analysisResult.attachments.map((att: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111622] border border-slate-200/60 dark:border-slate-800">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-300 truncate flex items-center gap-2">
                        {att.filename}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate mt-1">SHA-256: {att.sha256}</div>
                    </div>
                    <div className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                      {att.riskLevel}
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-500 text-center py-6">No attachments found in the email.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
