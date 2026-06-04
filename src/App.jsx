import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { windowData } from './data';
import { HardHat, FileText, LayoutDashboard, FileSpreadsheet, ShoppingCart, Factory, Boxes, Settings, Loader2 } from 'lucide-react'; 

function App() {
  const [rowData] = useState(windowData);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

 const [columnDefs] = useState([
    { field: 'schedule_id', headerName: 'ID', width: 90, pinned: 'left' },
    { field: 'location', headerName: 'Location', minWidth: 200, flex: 1 }, 
    { field: 'system_type', headerName: 'System Type', minWidth: 220, flex: 1 }, 
    { field: 'manufacturer', headerName: 'Manufacturer', minWidth: 220, flex: 1 },
    { field: 'rough_opening', headerName: 'Opening Size', minWidth: 150 }, 
    { field: 'glazing_spec', headerName: 'Glazing Spec', minWidth: 200, flex: 1.5 },
    { field: 'structural_header', headerName: 'Header', minWidth: 150, flex: 1 },
    { field: 'status', headerName: 'Status', width: 180, 
      cellClassRules: {
        'text-green-600 font-bold': p => p.value === 'Submittal Approved',
        'text-yellow-600 font-bold': p => p.value === 'Awaiting GC Approval',
        'text-blue-600 font-bold': p => p.value === 'In Fabrication'
      }
    },
    { field: 'procore_rfi', headerName: 'RFI', width: 100 }
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleExportClick = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row w-full overflow-x-hidden">
      
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
      <div className="flex-1 flex flex-col md:h-screen w-full bg-slate-50">
        
        <header className="bg-white shadow-sm px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
          <h2 className="text-lg font-semibold text-gray-700">Window Schedules & Submittals</h2>
          
          <div className="flex gap-3 w-full md:w-auto justify-center">
            <button 
              onClick={handleSyncClick}
              disabled={isSyncing}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium shadow-sm text-sm ${isSyncing ? 'bg-orange-200 text-orange-700 cursor-not-allowed' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
            >
              {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <HardHat size={16} />}
              {isSyncing ? 'Syncing...' : 'Sync Procore'}
            </button>

            <button 
              onClick={handleExportClick}
              disabled={isExporting}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium shadow-sm text-sm ${isExporting ? 'bg-blue-200 text-blue-700 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              {isExporting ? 'Exporting...' : 'Bluebeam Export'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6 flex flex-col w-full overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full md:hidden">
              Swipe to view 👉
            </span>
            <span className="text-xs text-gray-500 hidden md:inline-block font-medium bg-gray-200 px-3 py-1 rounded-full">
              💡 Tip: Click column headers to sort, or hover over them to filter data.
            </span>
          </div>
          
          {/* MAGIC FIX: Strict Height of 500px is back! */}
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="ag-theme-quartz w-full" style={{ height: '500px' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default App;