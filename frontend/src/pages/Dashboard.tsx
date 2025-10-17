import { useQuery } from 'react-query'
import { api } from '../services/api'
import { 
  UserGroupIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    () => api.get('/entries/dashboard/stats').then(res => res.data.stats)
  )

  const { data: companyStats, isLoading: companyLoading } = useQuery(
    'company-stats',
    () => api.get('/companies/stats').then(res => res.data.stats)
  )

  if (statsLoading || companyLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de portaria</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Entradas Hoje</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.todayEntriesByType?.ENTRY || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Saídas Hoje</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.todayEntriesByType?.EXIT || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Visitantes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companyStats?.totalVisitors || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Entradas Mês</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {companyStats?.monthlyEntries || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Entradas/Saídas Recentes</h3>
          </div>
          <div className="card-body">
            {stats?.recentEntries?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentEntries.map((entry: any) => (
                  <div key={entry.id} className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.type === 'ENTRY' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {entry.type === 'ENTRY' ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.visitor?.name || 'Visitante não identificado'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.type === 'ENTRY' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.type === 'ENTRY' ? 'Entrada' : 'Saída'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma entrada/saída recente</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Resumo Semanal</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entradas esta semana</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats?.weeklyEntries || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entradas hoje</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats?.todayEntries || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entradas este mês</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats?.monthlyEntries || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
