 import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { windowData } from './data';
import { HardHat, FileText, LayoutDashboard, FileSpreadsheet, ShoppingCart, Factory, Boxes, Settings, Loader2, Plus, CheckCircle, Info, CloudSync, CloudOff, X, AlertCircle, RefreshCw } from 'lucide-react'; 

function App() {
  const [rowData] = useState(windowData);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Integration States
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, authenticating, pushing, success, error
  const [lastSynced, setLastSynced] = useState(null);
  const [simulateError, setSimulateError] = useState(false);

  // Row-level sync icons renderer
  const StatusCellRenderer = (params) => {
    const isSynced = params.value === 'Submittal Approved' || params.value === 'In Fabrication'; 
    return (
      <div className="flex items-center gap-2">
        <span title={isSynced ? "Synced to Procore" : "Pending Sync"}>
          {isSynced ? <CloudSync size={16} className="text-green-500" /> : <CloudOff size={16} className="text-gray-400" />}
        </span>
        <span className={
          params.value === 'Submittal Approved' ? 'text-green-600 font-bold' : 
          params.value === 'Awaiting GC Approval' ? 'text-yellow-600 font-bold' : 
          'text-blue-600 font-bold'
        }>
          {params.value}
        </span>
      </div>
    );
  };

  // All 9 Columns Defined Correctly
  const [columnDefs] = useState([
    { field: 'schedule_id', headerName: 'ID', width: 90, pinned: 'left' },
    { field: 'location', headerName: 'Location', minWidth: 220 }, 
    { field: 'system_type', headerName: 'System Type', minWidth: 260 }, 
    { field: 'manufacturer', headerName: 'Manufacturer', minWidth: 260, tooltipField: 'manufacturer' }, 
    { field: 'rough_opening', headerName: 'Opening Size', minWidth: 160 }, 
    { field: 'glazing_spec', headerName: 'Glazing Spec', minWidth: 260 }, 
    { field: 'structural_header', headerName: 'Header', minWidth: 180 }, 
    { field: 'status', headerName: 'Status', minWidth: 240, cellRenderer: StatusCellRenderer },
    { field: 'procore_rfi', headerName: 'RFI', minWidth: 120 }
  ]);

  const defaultColDef = { sortable: true, filter: true, resizable: true };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const handleStartSync = () => {
    setSyncStatus('authenticating');
    setTimeout(() => {
      if (simulateError) {
        setSyncStatus('error');
        return;
      }
      setSyncStatus('pushing');
      setTimeout(() => {
        setSyncStatus('success');
        setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('Procore sync successful! ✅', 'success');
        setTimeout(() => setShowSyncModal(false), 2000);
      }, 2000);
    }, 1500);
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
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
          {toast.message}
        </div>
      )}

      {/* Sync Modal Overlay */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => {setShowSyncModal(false); setSyncStatus('idle');}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><HardHat className="text-orange-600" /> Sync to Procore</h3>
            {syncStatus === 'idle' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Target Project</label>
                  <select className="w-full bg-slate-50 border border-gray-300 text-sm p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Bay Area Complex (Proj-2026)</option>
                    <option>Silicon Valley HQ (Proj-2041)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="errorToggle" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
                  <label htmlFor="errorToggle" className="text-sm text-red-600 font-medium">Test Error State (Unhappy Path)</label>
                </div>
                <button onClick={handleStartSync} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-md font-medium transition-colors">Start Sync</button>
              </div>
            )}
            {syncStatus !== 'idle' && (
              <div className="space-y-6 py-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden relative">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${syncStatus === 'error' ? 'bg-red-500 w-full' : syncStatus === 'success' ? 'bg-green-500 w-full' : syncStatus === 'pushing' ? 'bg-blue-500 w-2/3' : 'bg-blue-400 w-1/3'}`}></div>
                </div>
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  {syncStatus === 'authenticating' && <><Loader2 className="animate-spin text-blue-500 mb-2" size={32} /> <p className="text-sm font-medium text-gray-600">Authenticating with Procore API...</p></>}
                  {syncStatus === 'pushing' && <><Loader2 className="animate-spin text-blue-500 mb-2" size={32} /> <p className="text-sm font-medium text-gray-600">Pushing Submittal Data...</p></>}
                  {syncStatus === 'success' && <><CheckCircle className="text-green-500 mb-2" size={32} /> <p className="text-sm font-bold text-green-600">Data Synced Successfully!</p></>}
                  {syncStatus === 'error' && (
                    <>
                      <AlertCircle className="text-red-500 mb-2" size={32} /> 
                      <p className="text-sm font-bold text-red-600">Connection Timeout!</p>
                      <p className="text-xs text-gray-500 mb-4">Failed to reach Procore servers.</p>
                      <button onClick={handleStartSync} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition font-medium text-sm"><RefreshCw size={16} /> Retry Sync</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
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
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 rounded-md text-sm font-medium whitespace-nowrap shadow-md"><LayoutDashboard size={18} /> Dashboard</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"><FileSpreadsheet size={18} /> Quoting</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"><ShoppingCart size={18} /> Orders</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"><Factory size={18} /> Production</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"><Boxes size={18} /> Inventory</a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 rounded-md text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap mt-auto"><Settings size={18} /> Settings</a>
        </nav>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col w-full bg-slate-50 overflow-y-auto">
        <header className="bg-white shadow-sm px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
          <h2 className="text-lg font-semibold text-gray-700">Window Schedules & Submittals</h2>
          <div className="flex flex-col items-end">
            <div className="flex gap-3 w-full md:w-auto justify-center">
              <button onClick={() => {setShowSyncModal(true); setSyncStatus('idle'); setSimulateError(false);}} className="flex justify-center items-center gap-2 px-4 py-2 rounded-md transition-all font-medium shadow-sm text-sm bg-orange-100 text-orange-700 hover:bg-orange-200"><HardHat size={16} /> Sync Procore</button>
              <button onClick={handleExportClick} disabled={isExporting} className="flex justify-center items-center gap-2 px-4 py-2 rounded-md transition-all font-medium shadow-sm text-sm bg-blue-100 text-blue-700 hover:bg-blue-200">{isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}{isExporting ? 'Exporting...' : 'Bluebeam Export'}</button>
            </div>
            {lastSynced && <span className="text-xs text-gray-500 font-medium mt-1">Last synced: Today at {lastSynced}</span>}
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6 flex flex-col w-full">
          
          {/* Quick Add Configurator Panel */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Add to Schedule</h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs text-gray-500 font-medium mb-1 block">System Type</label>
                <select className="w-full bg-slate-50 border border-gray-300 text-sm p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"><option>Multi-Slide Motorized</option><option>Thermally Broken Picture</option><option>Heavy Commercial Pivot Door</option></select>
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
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2 shadow-sm"><Plus size={16} /> Add</button>
            </div>
          </div>

          {/* Tip Banner Restored */}
          <div className="flex justify-between items-center mb-2 mt-4">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full md:hidden">
              Swipe to view 👉
            </span>
            <span className="text-xs text-gray-500 hidden md:inline-block font-medium bg-gray-200 px-3 py-1 rounded-full">
              💡 Tip: Click column headers to sort, or hover over them to filter data.
            </span>
          </div>

          {/* AG Grid Container */}
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="ag-theme-quartz w-full">
              <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} domLayout="autoHeight" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;