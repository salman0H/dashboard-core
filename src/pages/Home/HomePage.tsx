// File: src/pages/HomePage.tsx
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'

interface DashboardStats {
  totalNodes: number
  totalEdges: number
}

interface SubstationSummary {
  id: string
  name: string
  location: string
  componentCount: number
}

export function HomePage() {
  const { t } = useTranslation(['dashboard', 'common'])
  const navigate = useNavigate()
  const { dir } = useAppContext()
  const [stats, setStats] = useState<DashboardStats>({ totalNodes: 0, totalEdges: 0 })
  const [substations, setSubstations] = useState<SubstationSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodesRes, edgesRes, diagramRes] = await Promise.all([
          fetch('/api/flow/nodes'),
          fetch('/api/flow/edges'),
          fetch('/api/substation/diagram')
        ])
        const nodes = await nodesRes.json()
        const edges = await edgesRes.json()
        const diagram = await diagramRes.json()
        setStats({
          totalNodes: nodes.length,
          totalEdges: edges.length
        })
        const substationList = diagram.substations.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          location: sub.tooltipInfo?.Location || '—',
          componentCount: diagram.components.filter((c: any) => c.substationId === sub.id).length
        }))
        setSubstations(substationList)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir={dir}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Nodes & Edges Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ti ti-chart-dots text-blue-600 text-xl" />
            </div>
            <h2 className="font-semibold text-slate-800">{t('dashboard:flowTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalNodes}</div>
              <div className="text-xs text-slate-500 mt-1">{t('dashboard:totalNodesLabel')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalEdges}</div>
              <div className="text-xs text-slate-500 mt-1">{t('dashboard:totalEdgesLabel')}</div>
            </div>
          </div>
        </div>

        {/* Operator Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <i className="ti ti-user-circle text-emerald-600 text-xl" />
            </div>
            <h2 className="font-semibold text-slate-800">{t('dashboard:operatorSummary')}</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('common:name')}:</span>
              <span className="font-medium text-slate-800">{t('common:userName')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('common:role')}:</span>
              <span className="font-medium text-slate-800">{t('common:userRole')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('common:lastLogin')}:</span>
              <span className="font-medium text-slate-800">2025-05-31 10:30</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t('common:activeSessions')}:</span>
              <span className="font-medium text-slate-800">1</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <i className="ti ti-clock text-amber-600 text-xl" />
            </div>
            <h2 className="font-semibold text-slate-800">{t('dashboard:quickActions')}</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/flow-progress')}
              className="w-full text-right px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              ✏️ {t('dashboard:editFlowchart')}
            </button>
            <button
              onClick={() => navigate('/tree-node')}
              className="w-full text-right px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              📁 {t('dashboard:manageTree')}
            </button>
            <button
              onClick={() => navigate('/substation')}
              className="w-full text-right px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              ⚡ {t('dashboard:viewDiagram')}
            </button>
          </div>
        </div>
      </div>

      {/* Substations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ti ti-topology-ring text-blue-500 text-lg" />
            <h2 className="font-semibold text-slate-800">{t('dashboard:substations')}</h2>
          </div>
          <span className="text-xs text-slate-400">{substations.length} {t('dashboard:substationCount')}</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-400">{t('common:loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className={`px-5 py-3 font-semibold text-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('dashboard:substationName')}
                  </th>
                  <th className={`px-5 py-3 font-semibold text-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('dashboard:location')}
                  </th>
                  <th className={`px-5 py-3 font-semibold text-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('dashboard:componentCount')}
                  </th>
                  <th className={`px-5 py-3 font-semibold text-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('dashboard:actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {substations.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className={`px-5 py-3 font-medium text-slate-800 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {sub.name}
                    </td>
                    <td className={`px-5 py-3 text-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {sub.location}
                    </td>
                    <td className={`px-5 py-3 text-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {sub.componentCount}
                    </td>
                    <td className={`px-5 py-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <button
                        onClick={() => navigate('/substation')}
                        className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        {t('dashboard:viewDiagram')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}