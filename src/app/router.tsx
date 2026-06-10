import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { HomePage } from '@/pages/Home/HomePage'
import { FlowProgressPage } from '@/pages/FlowProgress/FlowProgressPage'
import { TreeNodePage } from '@/pages/TreeNode/TreeNodePage'
import { SubstationPage } from '@/pages/Substation/SubstationPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/flow-progress" element={<FlowProgressPage />} />
          <Route path="/tree-node" element={<TreeNodePage />} />
          <Route path="/substation" element={<SubstationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
