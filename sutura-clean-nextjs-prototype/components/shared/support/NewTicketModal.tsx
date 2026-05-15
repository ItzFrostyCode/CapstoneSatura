import { useState } from 'react';
import { X, UploadCloud, FileImage, FileVideo } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { SupportTicketCategory, Priority } from '@/types/erp';

export function NewTicketModal({ 
  isOpen, 
  onClose, 
  mode = 'OWNER',
  targetShopId = 'SYSTEM' // Default to system for customers
}: { 
  isOpen: boolean; 
  onClose: () => void;
  mode?: 'OWNER' | 'CUSTOMER';
  targetShopId?: string;
}) {
  const { createSupportTicket, pushNotification, currentUser } = useERPStore();
  
  const [subject, setSubject] = useState('');
  
  const categories = [
    'Technical Issue', 
    'Billing Concern', 
    'Account Access', 
    'Report a Shop', 
    'Feature Request', 
    'Complaint', 
    'Other'
  ];

  const [category, setCategory] = useState<SupportTicketCategory>(categories[0] as SupportTicketCategory);
  const [priority, setPriority] = useState<Priority>('Normal');
  const [message, setMessage] = useState('');
  
  // File Upload Simulation State
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Strict 200MB limit for prototype
      if (selectedFile.size > 200 * 1024 * 1024) {
        pushNotification('File too large. Maximum size is 200MB.', 'error');
        return;
      }
      
      const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(selectedFile.type)) {
        pushNotification('Unsupported format. Please use PNG, JPG, MP4, or MOV.', 'error');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!subject || !message) {
      pushNotification('Subject and message are required.', 'error');
      return;
    }

    // Simulate Upload if file exists
    if (file) {
      setIsUploading(true);
      
      // Simulate a chunky upload progress
      for (let i = 0; i <= 100; i += 20) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 400));
      }
      
      pushNotification('Media uploaded successfully', 'success');
      setIsUploading(false);
      setUploadProgress(0);
    }

    createSupportTicket({
      shopId: 'SYSTEM', // Strictly System for Customer Support Center
      creatorId: currentUser?.id || 'USR-001',
      subject,
      category,
      priority,
    });

    pushNotification('Ticket submitted successfully', 'success');
    handleClose();
  };

  const handleClose = () => {
    setSubject('');
    setMessage('');
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-[20px] font-black text-slate-900 tracking-tight">System Support Ticket</h2>
            <p className="text-[13px] text-slate-500 font-medium">
              Send a request to Sutura Admin Support.
            </p>
          </div>
          <button onClick={handleClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Subject</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.g., Cannot login to my account"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Description</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide as much detail as possible..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Media Engine */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Attachments</label>
                <span className="text-[11px] font-bold text-slate-400">Max 5MB (JPG, PNG, MP4)</span>
             </div>
             
             {!file ? (
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-colors cursor-pointer group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm mb-2 transition-colors">
                      <UploadCloud size={24} />
                   </div>
                   <div className="text-[13px] font-bold text-slate-600">Click to upload image or video</div>
                   <input type="file" className="hidden" accept="image/png, image/jpeg, video/mp4, video/quicktime" onChange={handleFileChange} />
                </label>
             ) : (
                <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                   <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      {file.type.startsWith('video') ? <FileVideo size={24} /> : <FileImage size={24} />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-black text-slate-900 truncate">{file.name}</div>
                      <div className="text-[12px] text-slate-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                   </div>
                   <button onClick={() => setFile(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                      <X size={18} />
                   </button>
                </div>
             )}

             {/* Progress Bar Simulation */}
             {isUploading && (
               <div className="space-y-1">
                 <div className="flex justify-between text-[11px] font-bold text-slate-500">
                   <span>Uploading media...</span>
                   <span>{uploadProgress}%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
                     style={{ width: `${uploadProgress}%` }}
                   />
                 </div>
               </div>
             )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={handleClose}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Submit Ticket'}
          </button>
        </div>

      </div>
    </div>
  );
}
