import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { windowData } from './data';
import { HardHat, FileText, LayoutDashboard, FileSpreadsheet, ShoppingCart, Factory, Boxes, Settings, Loader2, Plus, CheckCircle, Info } from 'lucide-react'; 

function App() {
  const [rowData] = useState(windowData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Toast Notification এর জন্য স্টেট
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // কলাম ডেফিনিশন (কলামের উইথ বাড়ানো হয়েছে এবং ফ্লেক্স সরিয়ে স্ক্রল সচল করা হয়েছে)
  const [columnDefs] = useState([
    { field: 'schedule_id', headerName: 'ID', width: 90, pinned: 'left' },
    { field: 'location', headerName: 'Location', minWidth: 220 }, 
    { field: 'system_type', headerName: 'System Type', minWidth: 260 }, 
    { field: 'manufacturer', headerName: 'Manufacturer', minWidth: 260, tooltipField: 'manufacturer' }, // পুরো লেখা দেখার জন্য টুলটিপ যুক্ত
    { field: 'rough_opening', headerName: 'Opening Size', minWidth: 160 }, 
    { field: 'glazing_spec', headerName: 'Glazing Spec', minWidth: 260 }, 
    { field: 'structural_header', headerName: 'Header', minWidth: 180 }, 
    { field: 'status', headerName: 'Status', minWidth: 200, 
      cellClassRules: {
        'text-green-600 font-bold': p => p.value === 'Submittal Approved',
        'text-yellow-600 font-bold': p => p.value === 'Awaiting GC Approval',
        'text-blue-600 font-bold': p => p.value === 'In Fabrication'
      }
    },
    { field: 'procore_rfi', headerName: 'RFI', minWidth: 120 }
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // টোস্ট মেসেজ দেখানোর ফাংশন
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

 // বাটন ক্লিক এবং টোস্ট ইমপ্লিমেন্টেশন (ইংরেজিতে আপডেট করা হলো)
  const handleSyncClick = () => {
    setIsSyncing(true);
    showToast('Syncing data with Procore...', 'info');
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Procore sync successful! ✅', 'success');
    }, 2500);
  };

  const handleExportClick = () => {
    setIsExporting(true);
    showToast('Exporting schedule to Bluebeam...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      showToast('Bluebeam export successful! 📄', 'success');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row w-full overflow-x-hidden relative">
      
      {/* Toast Notification UI */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all transform translate-y-0 text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
          {toast.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-800 text-white flex flex-col shadow-xl z-20 md:min-h-screen">
        <div className="p-4 md:p-6 text-center md:text-left border-b border-slate-700">
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-blue-400">Fenestration OS</h1>
          <div className="mt-4">
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Current Facility</label>
            <select className="w-full bg-slate-700 text-sm p-2 rounded text-white border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>Main Branch (HQ)</option>
              <option>California Facility</option>
              <option>Texas Facility</option>
            </select>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 rounded-md text-sm font-medium whitespace-nowrap shadow-md">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap">
            <FileSpreadsheet size={18} /> Quoting
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap">
            <ShoppingCart size={18} /> Orders
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap">
            <Factory size={18} /> Production
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap">
            <Boxes size={18} /> Inventory
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap mt-auto">
            <Settings size={18} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col w-full bg-slate-50 overflow-y-auto">
        
        <header className="bg-white shadow-sm px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
          <h2 className="text-lg font-semibold text-gray-700">Window Schedules & Submittals</h2>
          
          <div className="flex gap-3 w-full md:w-auto justify-center">
            <button 
              onClick={handleSyncClick}
              disabled={isSyncing}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md transition-all font-medium shadow-sm text-sm ${isSyncing ? 'bg-orange-200 text-orange-700 cursor-not-allowed opacity-80' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
            >
              {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <HardHat size={16} />}
              {isSyncing ? 'Syncing...' : 'Sync Procore'}
            </button>

            <button 
              onClick={handleExportClick}
              disabled={isExporting}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md transition-all font-medium shadow-sm text-sm ${isExporting ? 'bg-blue-200 text-blue-700 cursor-not-allowed opacity-80' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              {isExporting ? 'Exporting...' : 'Bluebeam Export'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6 flex flex-col w-full">
          
          {/* Quick Add Configurator Panel */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Add to Schedule</h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs text-gray-500 font-medium mb-1 block">System Type</label>
                <select className="w-full bg-slate-50 border border-gray-300 text-sm p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                  <option>Multi-Slide Motorized (Western Window Systems)</option>
                  <option>Thermally Broken Picture (Fleetwood)</option>
                  <option>Heavy Commercial Pivot Door (Marvin Modern)</option>
                </select>
              </div>
              <div className="w-full md:w-32">
                <label className="text-xs text-gray-500 font-medium mb-1 block">Width (in)</label>
                <input type="number" placeholder="e.g. 144" className="w-full bg-slate-50 border border-gray-300 text-sm p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-32">
                <label className="text-xs text-gray-500 font-medium mb-1 block">Height (in)</label>
                <input type="number" placeholder="e.g. 96" className="w-full bg-slate-50 border border-gray-300 text-sm p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-full md:w-24">
                <label className="text-xs text-gray-500 font-medium mb-1 block">Qty</label>
                <input type="number" defaultValue="1" className="w-full bg-slate-50 border border-gray-300 text-sm p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2 shadow-sm">
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full md:hidden">
              Swipe to view 👉
            </span>
            <span className="text-xs text-gray-500 hidden md:inline-block font-medium bg-gray-200 px-3 py-1 rounded-full">
              💡 Tip: Click column headers to sort, or hover over them to filter data.
            </span>
          </div>
          
          {/* AG Grid Container - domLayout="autoHeight" প্রয়োগ করা হয়েছে */}
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="ag-theme-quartz w-full">
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
              />
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default App;