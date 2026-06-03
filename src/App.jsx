 import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { windowData } from './data';
import { HardHat, FileText } from 'lucide-react'; 

function App() {
  const [rowData] = useState(windowData);

  const [columnDefs] = useState([
    { field: 'schedule_id', headerName: 'ID', width: 90, pinned: 'left' },
    { field: 'location', headerName: 'Location', minWidth: 150, flex: 1 },
    { field: 'system_type', headerName: 'System Type', minWidth: 150, flex: 1 },
    { field: 'manufacturer', headerName: 'Manufacturer', minWidth: 150, flex: 1 },
    { field: 'rough_opening', headerName: 'Opening Size', width: 130 },
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full overflow-x-hidden">
      {/* Responsive Header Section */}
      <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">Fenestration OS</h1>
        
        <div className="flex flex-wrap justify-center w-full md:w-auto gap-3">
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors font-medium shadow-sm text-sm md:text-base">
            <HardHat size={18} />
            Sync Procore
          </button>
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium shadow-sm text-sm md:text-base">
            <FileText size={18} />
            Bluebeam Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-2 md:p-6 w-full max-w-full">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border border-gray-200 w-full flex flex-col overflow-hidden">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-700">Window Schedules & Submittals</h2>
            {/* Mobile UX Hint */}
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full md:hidden">
              Swipe to view 👉
            </span>
          </div>
          
          {/* AG Grid Table */}
          <div className="w-full overflow-hidden">
            <div className="ag-theme-quartz w-full" style={{ height: '500px' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                rowSelection="multiple"
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;